<template>
  <section class="p-4 space-y-4">
    <header class="flex items-center justify-between gap-2">
      <h1 class="text-xl font-semibold">Panel de staff</h1>
      <div class="flex items-center gap-2">
        <button class="border rounded px-3 py-1" @click="onRefresh" :disabled="loading">
          {{ loading ? 'Actualizando…' : 'Refrescar' }}
        </button>
      </div>
    </header>

    <p v-if="error" class="text-red-600 text-sm">{{ error }}</p>

    <div v-if="!loading && !tickets.length" class="text-sm text-gray-500">
      No hay tickets en cola.
    </div>

    <div class="overflow-auto">
      <table class="min-w-[720px] w-full border-collapse">
        <thead>
          <tr class="text-left border-b">
            <th class="py-2 pr-3">Pos</th>
            <th class="py-2 pr-3">Cliente</th>
            <th class="py-2 pr-3">Personas</th>
            <th class="py-2 pr-3">Estado</th>
            <th class="py-2 pr-3">Creado</th>
            <th class="py-2 pr-3">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="t in tickets" :key="t.id" class="border-b">
            <td class="py-2 pr-3">{{ t.position }}</td>
            <td class="py-2 pr-3">{{ t.customerFullName }}</td>
            <td class="py-2 pr-3">{{ t.peopleCount }}</td>
            <td class="py-2 pr-3">{{ t.status }}</td>
            <td class="py-2 pr-3">
              <time :datetime="t.createdAt">{{ formatDate(t.createdAt) }}</time>
            </td>
            <td class="py-2 pr-3">
              <div class="flex flex-wrap gap-2">
                <button class="border rounded px-2 py-1" @click="onServe(t.id)" :disabled="loading">Servir</button>
                <button class="border rounded px-2 py-1" @click="onSkip(t.id)" :disabled="loading">Saltar</button>
                <button class="border rounded px-2 py-1" @click="onCancel(t.id)" :disabled="loading">Cancelar</button>
                <button class="border rounded px-2 py-1" @click="onNotify(t.id)" :disabled="loading">Avisar</button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>

<script setup lang="ts">
import { onMounted, computed, onBeforeUnmount } from 'vue';
import { useStaffTicketsStore } from '@/stores/staffTickets';
import { initStaffTicketsSignalR } from '@/stores/staffTickets';

const store = useStaffTicketsStore();
const loading = computed(() => store.loading);
const error = computed(() => store.error);
const tickets = computed(() => store.items);
let unsubscribe: null | (() => void) = null;

onMounted(async () => {
  if (!store.items.length) store.fetchAll();
  unsubscribe = await initStaffTicketsSignalR();
});
onBeforeUnmount(() => {
  if (unsubscribe) unsubscribe();
});

function onRefresh() {
  store.fetchAll();
}
function onServe(id: number) {
  store.actServe(id);
}
function onSkip(id: number) {
  store.actSkip(id);
}
function onCancel(id: number) {
  store.actCancel(id);
}
function onNotify(id: number) {
  store.actNotify(id, true);
}
function formatDate(iso: string): string {
  try {
    const d = new Date(iso);
    const dd = d.toLocaleDateString();
    const tt = d.toLocaleTimeString();
    return `${dd} ${tt}`;
  } catch {
    return iso;
  }
}
</script>
