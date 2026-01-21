import { defineStore } from 'pinia'
import {
  createTicket,
  createTicketToken,
  persistTicketToken,
  getTicketStatus,
  getServiceState,
} from '@/services/tickets'
import type { CreateTicketDto, TicketStatusDto } from '@/types/tickets'
import { ensureAuth, registerTicketEventHandlers, joinTicketGroup } from '@/services/signalR'
import { ensureTicketTokenFor } from '@/services/tickets'
import { ApiError } from '@/lib/http'

interface State {
  loading: boolean
  error: string | null
  status: TicketStatusDto | null

  isServiceOpen: boolean | null
  serviceClosed: boolean
}

export const useTicketSessionStore = defineStore('ticketSession', {
  state: (): State => ({
    loading: false,
    error: null,
    status: null,

    isServiceOpen: null,
    serviceClosed: false,
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
        }

        this.error = e?.message ?? 'No se pudo crear el ticket'
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
