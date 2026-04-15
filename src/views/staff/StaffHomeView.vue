<template>
  <CenteredLayout>
    <AppCard :gdpr="false">
      <StaffAlerts
        :service-error="serviceStore.error"
        :error="error"
        :show-empty="!loading && !tickets.length"
        empty-text="No hay tickets en cola."
      />

      <div class="Service state">
        <ServiceState
          :pending-is-open="pendingIsOpen"
          @update:pending-is-open="pendingIsOpen = $event"
          @toggle-attempt="onToggleAttempt"
        />
      </div>

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
          @edit="onEditTicket"
        />
      </div>

      <ServiceConfirmDialog
        v-model="confirmDialog"
        :pending-is-open="pendingIsOpen"
        @confirm="onConfirmOk"
        @cancel="onConfirmCancel"
      />
      <EditPeopleCountDialog
        v-model="editDialog"
        :loading="editingTicket ? ticketsStore.isBusy(editingTicket.id) : false"
        :initial-people-count="editingTicket?.peopleCount ?? 1"
        @confirm="onEditPeopleConfirm"
      />
    </AppCard>
  </CenteredLayout>
</template>

<script setup lang="ts">
import { onMounted, computed, onBeforeUnmount, ref, watch } from 'vue'
import { useStaffTicketsStore } from '@/stores/staffTickets'
import { useServiceStateStore } from '@/stores/serviceStore'
import { initStaffTicketsSignalR } from '@/stores/staffTickets'
import EditPeopleCountDialog from '@/components/ticketStatus/EditPeopleCountDialog.vue'

import TicketCard from '@/components/staff/TicketCard.vue'
import StaffAlerts from '@/components/staff/StaffAlerts.vue'
import ServiceConfirmDialog from '@/components/staff/ServiceConfirmDialog.vue'
import ServiceState from '@/components/staff/ServiceState.vue'
import AppCard from '@/components/ui/AppCard.vue'
import CenteredLayout from '@/layouts/CenteredLayout.vue'

const ticketsStore = useStaffTicketsStore()
const serviceStore = useServiceStateStore()

const loading = computed(() => ticketsStore.loading)
const error = computed(() => ticketsStore.error)
const tickets = computed(() => ticketsStore.items)

const pendingIsOpen = ref<boolean>(false)
const confirmDialog = ref(false)
const confirmed = ref(false)
const editDialog = ref(false)
const editingTicket = ref<{ id: number; peopleCount: number; customerFullName: string } | null>(
  null,
)

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

function onToggleAttempt(nextValue: boolean) {
  if (serviceStore.isOpen === null) return
  pendingIsOpen.value = nextValue
  confirmDialog.value = true
}

watch(confirmDialog, (open) => {
  if (open) {
    confirmed.value = false
    return
  }
  if (!confirmed.value && serviceStore.isOpen !== null) {
    pendingIsOpen.value = serviceStore.isOpen
  }
  if (!open) {
    editingTicket.value = null
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

function onEditTicket(ticket: { id: number; peopleCount: number; customerFullName: string }) {
  editingTicket.value = {
    id: ticket.id,
    peopleCount: ticket.peopleCount,
    customerFullName: ticket.customerFullName,
  }
  editDialog.value = true
}

async function onEditPeopleConfirm(peopleCount: number) {
  if (!editingTicket.value) return

  try {
    await ticketsStore.actUpdatePeopleCount(editingTicket.value.id, peopleCount)
    editDialog.value = false
    editingTicket.value = null
  } catch {}
}
</script>
