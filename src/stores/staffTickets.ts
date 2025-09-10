import { defineStore } from 'pinia';
import {
  listStaffTickets,
  serveTicket,
  skipTicket,
  cancelTicket,
  notifyTicket,
} from '@/services/staff';
import type { TicketStaffListDto } from '@/types/staff';

interface State {
  items: TicketStaffListDto[];
  loading: boolean;
  error: string | null;
}

export const useStaffTicketsStore = defineStore('staffTickets', {
  state: (): State => ({
    items: [],
    loading: false,
    error: null,
  }),
  getters: {
    hasData: (s) => s.items.length > 0,
  },
  actions: {
    async fetchAll(): Promise<void> {
      this.loading = true;
      this.error = null;
      try {
        this.items = await listStaffTickets();
      } catch (e: any) {
        this.error = e?.message ?? 'Error al cargar tickets';
      } finally {
        this.loading = false;
      }
    },

    async actServe(id: number): Promise<void> {
      await serveTicket(id);
      await this.fetchAll();
    },
    async actSkip(id: number): Promise<void> {
      await skipTicket(id);
      await this.fetchAll();
    },
    async actCancel(id: number): Promise<void> {
      await cancelTicket(id);
      await this.fetchAll();
    },
    async actNotify(id: number, force = true): Promise<void> {
      await notifyTicket(id, force);
      await this.fetchAll();
    },
  },
});
