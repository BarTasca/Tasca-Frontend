<script setup lang="ts">
import { ref, computed } from 'vue'
import ConfirmDialog from '@/components/common/ConfirmDialog.vue'
import TicketSwipeBackground from '@/components/staff/TicketSwipeBackground.vue'
import TicketCardSurface from '@/components/staff/TicketCardSurface.vue'

export interface StaffTicket {
  id: number
  position: number
  customerFullName: string
  peopleCount: number
  status: string
  createdAt: string
  confirmedAt: string | null
  notifiedAt: string | null
  cancelledAt: string | null
  ahead?: number
}

const props = defineProps<{
  ticket: StaffTicket
  currentPosition?: number
  busy?: boolean
}>()

const emit = defineEmits<{
  (e: 'serve', id: number): void
  (e: 'cancel', id: number): void
  (e: 'notify', id: number): void
  (e: 'edit', ticket: StaffTicket): void
}>()

const startX = ref(0)
const dragX = ref(0)
const dragging = ref(false)

const openServe = ref(false)
const openCancel = ref(false)
const openNotify = ref(false)
const openDetails = ref(false)

let pressTimer: number | null = null
let longPressTriggered = false

const LONG_PRESS_MS = 1000
const MOVE_CANCEL_LONG_PRESS = 10

const THRESH = 80
const CLICK_TOLERANCE = 6

const displayPos = computed(
  () =>
    props.currentPosition ??
    (props.ticket.ahead != null ? props.ticket.ahead + 1 : props.ticket.position),
)

const isBusy = computed(() => !!props.busy)

const ticketDateRows = computed(() => [
  {
    label: 'Creado',
    value: formatTicketDate(props.ticket.createdAt),
  },
  {
    label: 'Sentado',
    value: formatTicketDate(props.ticket.confirmedAt),
  },
  {
    label: 'Notificacion enviada',
    value: formatTicketDate(props.ticket.notifiedAt),
  },
  {
    label: 'Cancelado',
    value: formatTicketDate(props.ticket.cancelledAt),
  },
])

function onStart(ev: TouchEvent) {
  if (isBusy.value) return

  startX.value = ev.touches[0].clientX
  dragX.value = 0
  dragging.value = true
  longPressTriggered = false

  if (pressTimer) {
    clearTimeout(pressTimer)
    pressTimer = null
  }

  pressTimer = window.setTimeout(() => {
    openDetails.value = true
    longPressTriggered = true
    pressTimer = null
  }, LONG_PRESS_MS)
}

function onMove(ev: TouchEvent) {
  if (isBusy.value) return

  const dx = ev.touches[0].clientX - startX.value
  dragX.value = Math.min(0, dx)

  if (Math.abs(dx) > MOVE_CANCEL_LONG_PRESS && pressTimer) {
    clearTimeout(pressTimer)
    pressTimer = null
  }
}

function onEnd() {
  if (isBusy.value) return

  if (pressTimer) {
    clearTimeout(pressTimer)
    pressTimer = null
  }

  dragging.value = false

  if (dragX.value < -THRESH) openCancel.value = true
  dragX.value = 0
}

function onCardClick() {
  if (isBusy.value) return

  if (longPressTriggered) {
    longPressTriggered = false
    return
  }

  if (Math.abs(dragX.value) > CLICK_TOLERANCE || dragging.value) return
  openServe.value = true
}

function emitEdit() {
  emit('edit', props.ticket)
}

function formatTicketDate(value?: string | null) {
  if (!value) return '---'

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) return '---'

  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = date.getFullYear()
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')

  return `${hours}:${minutes} - ${day}/${month}/${year}`
}
</script>

<template>
  <div
    class="position-relative"
    :style="{ pointerEvents: isBusy ? 'none' : 'auto', opacity: isBusy ? 0.65 : 1 }"
    @touchstart="onStart"
    @touchmove="onMove"
    @touchend="onEnd"
    @touchcancel="onEnd"
    @mousedown.prevent
  >
    <TicketSwipeBackground :active="dragX < 0" />

    <TicketCardSurface
      :display-pos="displayPos"
      :customer-name="ticket.customerFullName"
      :people-count="ticket.peopleCount"
      :status="ticket.status"
      :busy="isBusy"
      :drag-x="dragX"
      :dragging="dragging"
      :createdAt="ticket.createdAt"
      @click="onCardClick"
      @notify="openNotify = true"
      @edit-people="emitEdit"
    />
  </div>

  <ConfirmDialog
    v-model="openServe"
    title="Servir ticket"
    @confirm="emit('serve', ticket.id)"
    @cancel="openServe = false"
  >
    ¿Confirmar atención del ticket de
    <span class="font-weight-bold">{{ ticket.customerFullName }}</span
    >?
  </ConfirmDialog>

  <ConfirmDialog
    v-model="openCancel"
    title="Cancelar ticket"
    @confirm="emit('cancel', ticket.id)"
    @cancel="openCancel = false"
  >
    ¿Seguro que quieres cancelar el ticket de
    <span class="font-weight-bold">{{ ticket.customerFullName }}</span
    >?
  </ConfirmDialog>

  <ConfirmDialog
    v-model="openNotify"
    title="Enviar aviso"
    @confirm="emit('notify', ticket.id)"
    @cancel="openNotify = false"
  >
    Enviar notificación manual a
    <span class="font-weight-bold">{{ ticket.customerFullName }}</span
    >?
  </ConfirmDialog>

  <v-dialog v-model="openDetails" max-width="420" >
    <v-card class="ticket-details-dialog" rounded="xl" color="wood">
      <v-card-title class="ticket-details-title"> Detalles del ticket </v-card-title>

      <v-card-text>
        <div class="ticket-details-list">
          <div v-for="row in ticketDateRows" :key="row.label" class="ticket-details-row">
            <span class="ticket-details-label">{{ row.label }}</span>
            <span class="ticket-details-value">{{ row.value }}</span>
          </div>
        </div>
      </v-card-text>

      <v-card-actions class="ticket-details-actions">
        <v-spacer />
        <v-btn color="dark_Wood" variant="elevated" @click="openDetails = false"> Cerrar </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style scoped lang="scss">
@use '@/styles/tokens.scss' as *;

.ticket-details-dialog {
  background: $color-background;
}

.ticket-details-title {
  font-family: $font-family-base;
  font-weight: 700;
  color: $color-ultra-dark-wood;
}

.ticket-details-list {
  display: flex;
  flex-direction: column;
  gap: $space-sm;
}

.ticket-details-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: $space-md;
  padding: $space-sm $space-md;
  border-radius: $radius-md;
  background: rgba($color-dark-wood, 0.08);
}

.ticket-details-label {
  font-weight: 700;
  color: $color-dark-wood;
}

.ticket-details-value {
  font-weight: 600;
  color: $color-ultra-dark-wood;
  text-align: right;
}

.ticket-details-actions {
  padding: 0 $space-md $space-md;
}
</style>
