<template>
  <v-container class="py-4">
    <v-sheet class="d-flex align-center justify-space-between mb-3 px-2">
      <div>
        <div class="text-h6">Panel de staff</div>
        <div class="text-caption text-medium-emphasis">Gestión de la cola en tiempo real</div>
      </div>
    </v-sheet>

    <v-alert v-if="error" type="error" variant="tonal" class="mb-3">{{ error }}</v-alert>

    <v-alert v-if="!loading && !tickets.length" type="info" variant="tonal">
      No hay tickets en cola.
    </v-alert>

    <div v-else>
      <TicketCard
        v-for="(t, i) in tickets"
        :key="t.id"
        :ticket="t"
        :current-position="i + 1"
        @serve="onServe"
        @cancel="onCancel"
        @notify="onNotify"
      />
    </div>
  </v-container>
</template>

<script setup lang="ts">
import { onMounted, computed, onBeforeUnmount } from 'vue'
import { useStaffTicketsStore } from '@/stores/staffTickets'
import { initStaffTicketsSignalR } from '@/stores/staffTickets'
import TicketCard from '@/components/staff/TicketCard.vue'

const store = useStaffTicketsStore()
const loading = computed(() => store.loading)
const error = computed(() => store.error)
const tickets = computed(() => store.items)
let unsubscribe: null | (() => void) = null

onMounted(async () => {
  if (!store.items.length) store.fetchAll()
  unsubscribe = await initStaffTicketsSignalR()
})
onBeforeUnmount(() => { if (unsubscribe) unsubscribe() })

function onServe(id: number) { store.actServe(id) }
function onCancel(id: number) { store.actCancel(id) }
function onNotify(id: number) { store.actNotify(id, true) }
</script>
