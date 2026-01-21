import { defineStore } from 'pinia'
import { getServiceState, setServiceOpen } from '@/services/serviceState'

interface State {
  loading: boolean
  error: string | null
  isOpen: boolean | null
  updatedAt: string | null
}

export const useServiceStateStore = defineStore('serviceState', {
  state: (): State => ({
    loading: false,
    error: null,
    isOpen: null,
    updatedAt: null,
  }),
  actions: {
    async fetch(): Promise<void> {
      this.loading = true
      this.error = null
      try {
        const s = await getServiceState()
        this.isOpen = s.isOpen
        this.updatedAt = s.updatedAt
      } catch (e: any) {
        this.error = e?.message ?? 'No se pudo cargar el estado del servicio'
      } finally {
        this.loading = false
      }
    },

    async setOpen(isOpen: boolean): Promise<void> {
      this.loading = true
      this.error = null
      try {
        const res = await setServiceOpen(isOpen)
        this.isOpen = res.isOpen
      } catch (e: any) {
        this.error = e?.message ?? 'No se pudo actualizar el estado del servicio'
        throw e
      } finally {
        this.loading = false
      }
    },
  },
})
