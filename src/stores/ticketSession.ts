import { defineStore } from 'pinia'
import {
  createTicket,
  createTicketToken,
  persistTicketToken,
  getTicketStatus,
  getServiceState,
  cancelTicketByClient,
  ensureTicketTokenFor,
  getQueueAhead,
  updateOwnTicketPeopleCount,
} from '@/services/tickets'
import type { CreateTicketDto, TicketStatusDto } from '@/types/tickets'
import { ensureAuth, registerTicketEventHandlers, joinTicketGroup } from '@/services/signalR'
import { ApiError } from '@/lib/http'
import type { QueueAheadDto } from '@/types/queue'
import {
  ensurePublicConnected,
  onAheadUpdated,
  offAheadUpdated,
  stopPublicSignalR,
} from '@/services/publicQueueSignalR'
import { STORAGE_KEYS } from '@/config'
import {
  getVapidPublicKey,
  registerTicketPushSubscription,
  unregisterTicketPushSubscription,
} from '@/services/push'
import {
  getExistingBrowserPushSubscription,
  getNotificationPermission,
  isPushSupported,
  requestNotificationPermission,
  subscribeBrowserPush,
  unsubscribeBrowserPush,
} from '@/services/pushClient'
import { mapCreateTicketError } from '@/lib/errorMaps/ticketErrors'

interface State {
  loading: boolean
  error: string | null
  status: TicketStatusDto | null

  isServiceOpen: boolean | null
  serviceClosed: boolean

  queueAhead: QueueAheadDto | null

  pushSupported: boolean
  pushPermission: NotificationPermission | 'unsupported'
  pushEnabled: boolean
  pushLoading: boolean
  pushError: string | null
}

export const useTicketSessionStore = defineStore('ticketSession', {
  state: (): State => ({
    loading: false,
    error: null,
    status: null,

    isServiceOpen: null,
    serviceClosed: false,

    queueAhead: null,

    pushSupported: false,
    pushPermission: 'default',
    pushEnabled: false,
    pushLoading: false,
    pushError: null,
  }),
  actions: {
    async loadServiceState(): Promise<void> {
      try {
        const state = await getServiceState()
        this.isServiceOpen = state.isOpen
        this.serviceClosed = !state.isOpen
      } catch (e: any) {
        this.isServiceOpen = false
        this.serviceClosed = true
        this.error = 'No se pudo comprobar el estado del servicio'
      }
    },

    async createAndInit(payload: CreateTicketDto): Promise<{ publicId: string } | null> {
      this.loading = true
      this.error = null

      await this.loadServiceState()
      if (this.isServiceOpen === false) {
        this.serviceClosed = true
        this.error = 'El servicio está cerrado'
        this.loading = false
        return null
      }

      try {
        const created = await createTicket(payload)
        const publicId = created.publicId

        const { token } = await createTicketToken(publicId)
        persistTicketToken(token)

        return { publicId }
      } catch (e: any) {
        if (e instanceof ApiError) {
          const code = (e.body as any)?.code

          if (e.status === 409 && code === 'SERVICE_CLOSED') {
            this.isServiceOpen = false
            this.serviceClosed = true
            this.error = 'El servicio está cerrado'
            return null
          }

          if (e.status === 410 && (code === 'QR_EXPIRED' || code === 'QR_TOKEN_REQUIRED')) {
            this.error = 'El QR ha caducado. Vuelve a escanear el QR de la pantalla.'
            return null
          }
        }

        this.error = mapCreateTicketError(e)
        return null
      } finally {
        this.loading = false
      }
    },
    async cancelByClient(publicId: string): Promise<void> {
      this.loading = true
      this.error = null
      try {
        await cancelTicketByClient(publicId)
        await this.fetchStatus(publicId)
      } catch (e: any) {
        this.error = e?.message ?? 'No se pudo cancelar el turno'
        throw e
      } finally {
        this.loading = false
      }
    },

    async fetchStatus(publicId: string): Promise<void> {
      this.loading = true
      this.error = null
      try {
        this.status = await getTicketStatus(publicId)
      } catch (e: any) {
        this.error = e?.message ?? 'No se pudo cargar el estado del ticket'
        throw e
      } finally {
        this.loading = false
      }
    },

    clear(): void {
      this.status = null
      this.error = null
      this.serviceClosed = false
      this.queueAhead = null

      this.pushSupported = false
      this.pushPermission = 'default'
      this.pushEnabled = false
      this.pushLoading = false
      this.pushError = null
    },

    async loadQueueAhead(): Promise<void> {
      try {
        this.queueAhead = await getQueueAhead()
      } catch {
        this.queueAhead = null
      }
    },

    async initPublicQueueSignalR(): Promise<() => Promise<void>> {
      await ensurePublicConnected()

      const handler = (dto: QueueAheadDto) => {
        this.queueAhead = dto
      }

      onAheadUpdated(handler)

      return async () => {
        offAheadUpdated(handler)
        await stopPublicSignalR()
      }
    },

    refreshPushState(): void {
      const supported = isPushSupported()
      this.pushSupported = supported
      this.pushPermission = supported ? getNotificationPermission() : 'unsupported'
    },

    async syncExistingPushSubscription(): Promise<void> {
      this.refreshPushState()

      if (!this.pushSupported) {
        this.pushEnabled = false
        return
      }

      try {
        const existing = await getExistingBrowserPushSubscription()
        this.pushEnabled = !!existing
      } catch {
        this.pushEnabled = false
      }
    },

    async enablePushForTicket(publicId: string): Promise<boolean> {
      this.pushLoading = true
      this.pushError = null

      try {
        this.refreshPushState()

        if (!this.pushSupported) {
          this.pushError = 'Este navegador no soporta notificaciones push'
          return false
        }

        const permission =
          this.pushPermission === 'granted' ? 'granted' : await requestNotificationPermission()

        this.pushPermission = permission

        if (permission !== 'granted') {
          this.pushEnabled = false
          this.pushError = 'No has concedido permiso para notificaciones'
          return false
        }

        await ensureTicketTokenFor(publicId)

        const ticketToken = localStorage.getItem(STORAGE_KEYS.ticketToken)
        if (!ticketToken) {
          this.pushError = 'No se pudo obtener el token del ticket'
          return false
        }

        const { publicKey } = await getVapidPublicKey()
        const browserSub = await subscribeBrowserPush(publicKey)

        const json = browserSub.toJSON()
        const p256dh = json.keys?.p256dh
        const auth = json.keys?.auth
        const endpoint = json.endpoint

        if (!endpoint || !p256dh || !auth) {
          this.pushError = 'La suscripción del navegador no es válida'
          return false
        }

        await registerTicketPushSubscription(publicId, {
          ticketToken,
          subscription: {
            endpoint,
            keys: {
              p256dh,
              auth,
            },
          },
        })

        this.pushEnabled = true
        return true
      } catch (e: any) {
        console.error('[push] enablePushForTicket failed', e)
        this.pushEnabled = false
        this.pushError = e?.message ?? 'No se pudieron activar las notificaciones'
        return false
      } finally {
        this.pushLoading = false
      }
    },

    async disablePushForTicket(publicId: string): Promise<boolean> {
      this.pushLoading = true
      this.pushError = null

      try {
        this.refreshPushState()

        const existing = await getExistingBrowserPushSubscription()
        if (!existing) {
          this.pushEnabled = false
          return true
        }

        await ensureTicketTokenFor(publicId)

        const ticketToken = localStorage.getItem(STORAGE_KEYS.ticketToken)
        if (!ticketToken) {
          this.pushError = 'No se pudo obtener el token del ticket'
          return false
        }

        await unregisterTicketPushSubscription(publicId, {
          ticketToken,
          endpoint: existing.endpoint,
        })

        await unsubscribeBrowserPush()

        this.pushEnabled = false
        return true
      } catch (e: any) {
        this.pushError = e?.message ?? 'No se pudieron desactivar las notificaciones'
        return false
      } finally {
        this.pushLoading = false
      }
    },

    async updatePeopleCountByClient(publicId: string, peopleCount: number): Promise<boolean> {
      this.loading = true
      this.error = null

      try {
        await updateOwnTicketPeopleCount(publicId, peopleCount)
        return true
      } catch (e: any) {
        this.error = e?.message ?? 'No se pudo actualizar el número de personas'
        return false
      } finally {
        this.loading = false
      }
    },
  },
})

export async function initTicketSessionSignalR(
  publicId: string,
  store = useTicketSessionStore(),
): Promise<() => void> {
  await ensureTicketTokenFor(publicId)
  await ensureAuth('ticket')
  await joinTicketGroup(publicId)

  const unsubscribe = registerTicketEventHandlers(async (payload: any) => {
    const evPublicId: string | undefined = payload?.publicId ?? payload?.PublicId
    console.log('[SignalR ticket] event =>', payload)
    if (evPublicId && evPublicId !== publicId) return
    try {
      await store.fetchStatus(publicId)
    } catch {}
  })

  return unsubscribe
}
