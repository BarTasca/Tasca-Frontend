import { defineStore } from 'pinia'
import {
  createTicket,
  createTicketToken,
  persistTicketToken,
  getTicketStatus,
  getServiceState,
  cancelTicketByClient,
} from '@/services/tickets'
import type { CreateTicketDto, TicketStatusDto } from '@/types/tickets'
import { ensureAuth, registerTicketEventHandlers, joinTicketGroup } from '@/services/signalR'
import { ensureTicketTokenFor } from '@/services/tickets'
import { ApiError } from '@/lib/http'
import { getQueueAhead } from '@/services/tickets'
import type { QueueAheadDto } from '@/types/queue'
import {
  ensurePublicConnected,
  onAheadUpdated,
  offAheadUpdated,
  stopPublicSignalR,
} from '@/services/publicQueueSignalR'

interface State {
  loading: boolean
  error: string | null
  status: TicketStatusDto | null

  isServiceOpen: boolean | null
  serviceClosed: boolean

  queueAhead: QueueAheadDto | null
}

export const useTicketSessionStore = defineStore('ticketSession', {
  state: (): State => ({
    loading: false,
    error: null,
    status: null,

    isServiceOpen: null,
    serviceClosed: false,

    queueAhead: null,
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

        this.error = e?.message ?? 'No se pudo crear el ticket'
        throw e
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
