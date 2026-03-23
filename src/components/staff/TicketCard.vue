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
}>()

const startX = ref(0)
const dragX = ref(0)
const dragging = ref(false)

const openServe = ref(false)
const openCancel = ref(false)
const openNotify = ref(false)

const THRESH = 80
const CLICK_TOLERANCE = 6

const displayPos = computed(
  () =>
    props.currentPosition ??
    (props.ticket.ahead != null ? props.ticket.ahead + 1 : props.ticket.position),
)

const isBusy = computed(() => !!props.busy)

function onStart(ev: TouchEvent) {
  if (isBusy.value) return
  startX.value = ev.touches[0].clientX
  dragX.value = 0
  dragging.value = true
}

function onMove(ev: TouchEvent) {
  if (isBusy.value) return
  const dx = ev.touches[0].clientX - startX.value
  dragX.value = Math.min(0, dx)
}

function onEnd() {
  if (isBusy.value) return
  dragging.value = false
  if (dragX.value < -THRESH) openCancel.value = true
  dragX.value = 0
}

function onCardClick() {
  if (isBusy.value) return
  if (Math.abs(dragX.value) > CLICK_TOLERANCE || dragging.value) return
  openServe.value = true
}
</script>

<template>
  <div
    class="position-relative"
    :style="{ pointerEvents: isBusy ? 'none' : 'auto', opacity: isBusy ? 0.65 : 1 }"
    @touchstart="onStart"
    @touchmove="onMove"
    @touchend="onEnd"
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
      @click="onCardClick"
      @notify="openNotify = true"
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
</template>
