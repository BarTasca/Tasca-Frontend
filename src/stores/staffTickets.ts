import { defineStore } from 'pinia'
import {
  listStaffTickets,
  serveTicket,
  skipTicket,
  cancelTicket,
  notifyTicket,
} from '@/services/staff'
import type { TicketStaffListDto } from '@/types/staff'
import { ensureAuth, joinStaffGroup, registerStaffEventHandlers } from '@/services/signalR'
import { useUiStore } from '@/stores/ui'

interface State {
  items: TicketStaffListDto[]
  loading: boolean
  error: string | null
  busyIds: number[]
}

export const useStaffTicketsStore = defineStore('staffTickets', {
  state: (): State => ({
    items: [],
    loading: false,
    error: null,
    busyIds: [],
  }),
  getters: {
    hasData: (s) => s.items.length > 0,
    isBusy: (s) => (id: number) => s.busyIds.includes(id),
  },
  actions: {
    setBusy(id: number, on: boolean) {
      if (on) {
        if (!this.busyIds.includes(id)) this.busyIds.push(id)
      } else {
        this.busyIds = this.busyIds.filter(x => x !== id)
      }
    },

    async fetchAll(): Promise<void> {
      this.loading = true
      this.error = null
      try {
        this.items = await listStaffTickets()
      } catch (e: any) {
        this.error = e?.message ?? 'Error al cargar tickets'
      } finally {
        this.loading = false
      }
    },

    async actServe(id: number): Promise<void> {
      const ui = useUiStore()
      this.setBusy(id, true)
      try {
        await serveTicket(id)
        ui.showSnack('Ticket servido', 'success')
      } catch (e: any) {
        const msg = e?.message ?? 'Error al servir ticket'
        this.error = msg
        ui.showSnack(msg, 'error')
        throw e
      } finally {
        this.setBusy(id, false)
      }
    },

    async actSkip(id: number): Promise<void> {
      const ui = useUiStore()
      this.setBusy(id, true)
      try {
        await skipTicket(id)
        ui.showSnack('Ticket saltado', 'success')
      } catch (e: any) {
        const msg = e?.message ?? 'Error al saltar ticket'
        this.error = msg
        ui.showSnack(msg, 'error')
        throw e
      } finally {
        this.setBusy(id, false)
      }
    },

    async actCancel(id: number): Promise<void> {
      const ui = useUiStore()
      this.setBusy(id, true)
      try {
        await cancelTicket(id)
        ui.showSnack('Ticket cancelado', 'success')
      } catch (e: any) {
        const msg = e?.message ?? 'Error al cancelar ticket' 
        this.error = msg
        ui.showSnack(msg, 'error')
        throw e
      } finally {
        this.setBusy(id, false)
      }
    },

    async actNotify(id: number, force = true): Promise<void> {
      const ui = useUiStore()
      this.setBusy(id, true)
      try {
        await notifyTicket(id, force)
        ui.showSnack('Aviso enviado', 'success')
      } catch (e: any) {
        const msg = e?.message ?? 'Error al avisar'
        this.error = msg
        ui.showSnack(msg, 'error')
        throw e
      } finally {
        this.setBusy(id, false)
      }
    },
  },
})

let refreshTimer: number | null = null
function scheduleRefresh(store: ReturnType<typeof useStaffTicketsStore>) {
  if (refreshTimer) window.clearTimeout(refreshTimer)
  refreshTimer = window.setTimeout(() => {
    store.fetchAll().catch(() => {})
  }, 150)
}

export async function initStaffTicketsSignalR(store = useStaffTicketsStore()): Promise<() => void> {
  await ensureAuth('staff')
  await joinStaffGroup()

  const unsubscribe = registerStaffEventHandlers(async (payload: any, eventName: string) => {
    console.log(`[SignalR staff] ${eventName} event =>`, payload)
    scheduleRefresh(store)
  })

  return unsubscribe
}
