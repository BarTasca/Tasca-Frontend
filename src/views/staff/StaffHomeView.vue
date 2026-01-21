<template>
  <v-container class="py-4">
    <v-sheet class="d-flex align-center justify-space-between mb-3 px-2">
      <div>
        <div class="text-h6">Panel de staff</div>
        <div class="text-caption text-medium-emphasis">Gestión de la cola en tiempo real</div>
      </div>

      <v-switch
        v-model="pendingIsOpen"
        color="primary"
        inset
        @click="onToggleAttempt"
      />
    </v-sheet>

    <v-alert v-if="serviceStore.error" type="error" variant="tonal" class="mb-3">
      {{ serviceStore.error }}
    </v-alert>

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

    <v-dialog v-model="confirmDialog" max-width="420">
      <v-card>
        <v-card-title class="text-h6">Confirmar acción</v-card-title>
        <v-card-text>
          ¿Seguro que quieres
          <strong>{{ pendingIsOpen ? 'abrir' : 'cerrar' }}</strong>
          el servicio?
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn variant="text" @click="onConfirmCancel">Cancelar</v-btn>
          <v-btn color="primary" variant="flat" @click="onConfirmOk">Confirmar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup lang="ts">
import { onMounted, computed, onBeforeUnmount, ref, watch } from 'vue'
import { useStaffTicketsStore } from '@/stores/staffTickets'
import { useServiceStateStore } from '@/stores/serviceStore'
import { initStaffTicketsSignalR } from '@/stores/staffTickets'
import TicketCard from '@/components/staff/TicketCard.vue'

const ticketsStore = useStaffTicketsStore()
const serviceStore = useServiceStateStore()

const loading = computed(() => ticketsStore.loading)
const error = computed(() => ticketsStore.error)
const tickets = computed(() => ticketsStore.items)

const pendingIsOpen = ref<boolean>(false)
const previousIsOpen = ref<boolean>(false)
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
  previousIsOpen.value = serviceStore.isOpen
  confirmDialog.value = true
}

/**
 * 🔒 Si el diálogo se cierra SIN confirmar
 * (cancelar, click fuera, ESC)
 * revertimos el switch
 */
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
