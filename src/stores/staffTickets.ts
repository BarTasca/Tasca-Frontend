import { defineStore } from 'pinia';
import {
  listStaffTickets,
  serveTicket,
  skipTicket,
  cancelTicket,
  notifyTicket,
} from '@/services/staff';
import type { TicketStaffListDto } from '@/types/staff';
import { ensureAuth, registerTicketEventHandlers, joinStaffGroup, registerStaffEventHandlers } from '@/services/signalR';

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


let refreshTimer: number | null = null;
function scheduleRefresh(store: ReturnType<typeof useStaffTicketsStore>) {
  if (refreshTimer) window.clearTimeout(refreshTimer);
  refreshTimer = window.setTimeout(() => {
    store.fetchAll().catch(() => {});
  }, 150);
}

export async function initStaffTicketsSignalR(store = useStaffTicketsStore()): Promise<() => void> {
  await ensureAuth('staff');
  await joinStaffGroup();

  const unsubscribe = registerStaffEventHandlers(async (payload: any, eventName: string) => {
    console.log('[SignalR staff] ${eventName} event =>', payload);
    scheduleRefresh(store);
    try { await store.fetchAll(); } catch {}
  });
  return unsubscribe;
}


