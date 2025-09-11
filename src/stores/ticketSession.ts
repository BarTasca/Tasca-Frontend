import { defineStore } from 'pinia'
import {
  createTicket,
  createTicketToken,
  persistTicketToken,
  getTicketStatus,
} from '@/services/tickets'
import type { CreateTicketDto, TicketStatusDto } from '@/types/tickets'

interface State {
  loading: boolean
  error: string | null
  status: TicketStatusDto | null
}

export const useTicketSessionStore = defineStore('ticketSession', {
  state: (): State => ({
    loading: false,
    error: null,
    status: null,
  }),
  actions: {
    async createAndInit(payload: CreateTicketDto): Promise<{ publicId: string }> {
      this.loading = true
      this.error = null
      try {
        const created = await createTicket(payload)
        const publicId = created.publicId

        const { token } = await createTicketToken(publicId)
        persistTicketToken(token)

        return { publicId }
      } catch (e: any) {
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
    },
  },
})
