<template>
  <v-container class="py-4">
    <AppCard title="Panel de staff" subtitle="Gestión de la cola en tiempo real" :maxWidth="960">
      <template #headerActions>
        <v-switch
          v-model="pendingIsOpen"
          color="white"
          inset
          hide-details
          @click="onToggleAttempt"
        />
      </template>

      <StaffAlerts
        :service-error="serviceStore.error"
        :error="error"
        :show-empty="!loading && !tickets.length"
        empty-text="No hay tickets en cola."
      />

      <div v-if="tickets.length">
        <TicketCard
          v-for="(t, i) in tickets"
          :key="t.id"
          :ticket="t"
          :current-position="i + 1"
          :busy="ticketsStore.isBusy(t.id)"
          @serve="onServe"
          @cancel="onCancel"
          @notify="onNotify"
        />
      </div>
    </AppCard>

    <ServiceConfirmDialog
      v-model="confirmDialog"
      :pending-is-open="pendingIsOpen"
      @confirm="onConfirmOk"
      @cancel="onConfirmCancel"
    />
  </v-container>
</template>

<script setup lang="ts">
import { onMounted, computed, onBeforeUnmount, ref, watch } from 'vue'
import { useStaffTicketsStore } from '@/stores/staffTickets'
import { useServiceStateStore } from '@/stores/serviceStore'
import { initStaffTicketsSignalR } from '@/stores/staffTickets'
import TicketCard from '@/components/staff/TicketCard.vue'

import StaffAlerts from '@/components/staff/StaffAlerts.vue'
import ServiceConfirmDialog from '@/components/staff/ServiceConfirmDialog.vue'
import AppCard from '@/components/ui/AppCard.vue'

const ticketsStore = useStaffTicketsStore()
const serviceStore = useServiceStateStore()

const loading = computed(() => ticketsStore.loading)
const error = computed(() => ticketsStore.error)
const tickets = computed(() => ticketsStore.items)

const pendingIsOpen = ref<boolean>(false)
const confirmDialog = ref(false)
const confirmed = ref(false)

let unsubscribe: null | (() => void) = null

onMounted(async () => {
  if (!ticketsStore.items.length) ticketsStore.fetchAll()
  await serviceStore.fetch()
  pendingIsOpen.value = serviceStore.isOpen ?? false
  unsubscribe = await initStaffTicketsSignalR()
})

onBeforeUnmount(() => {
  if (unsubscribe) unsubscribe()
})

function onToggleAttempt() {
  if (serviceStore.isOpen === null) return
  confirmDialog.value = true
}

/** Si se cierra el diálogo sin confirmar, revertimos el switch */
watch(confirmDialog, (open) => {
  if (open) {
    confirmed.value = false
    return
  }
  if (!confirmed.value && serviceStore.isOpen !== null) {
    pendingIsOpen.value = serviceStore.isOpen
  }
})

async function onConfirmOk() {
  confirmed.value = true
  try {
    await serviceStore.setOpen(pendingIsOpen.value)
  } finally {
    confirmDialog.value = false
    if (serviceStore.isOpen !== null) {
      pendingIsOpen.value = serviceStore.isOpen
    }
  }
}

function onConfirmCancel() {
  confirmDialog.value = false
}

function onServe(id: number) {
  ticketsStore.actServe(id)
}

function onCancel(id: number) {
  ticketsStore.actCancel(id)
}

function onNotify(id: number) {
  ticketsStore.actNotify(id, true)
}
</script>
