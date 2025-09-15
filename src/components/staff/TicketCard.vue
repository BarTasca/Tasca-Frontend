<template>
  <div
    class="position-relative"
    @touchstart="onStart"
    @touchmove="onMove"
    @touchend="onEnd"
    @mousedown.prevent
  >
    <div
      class="position-absolute top-0 left-0 right-0 bottom-0 d-flex align-center justify-end pr-4"
      :style="{ background: dragX < 0 ? '#ef5350' : 'transparent', borderRadius: '18px' }"
    >
      <v-icon v-if="dragX < 0">mdi-trash-can-outline</v-icon>
    </div>

    <v-card
      class="mx-0 my-2"
      rounded="xl"
      elevation="2"
      :style="{ transform: `translateX(${dragX}px)`, transition: dragging ? 'none' : 'transform 160ms' }"
      @click="onCardClick"
    >
      <v-card-item>
        <div class="d-flex align-center justify-space-between">
          <div class="d-flex align-center ga-3">
            <v-chip color="primary" variant="flat" size="small">
              #{{ displayPos }}
            </v-chip>
            <div class="text-subtitle-2 font-weight-medium">{{ ticket.customerFullName }}</div>
          </div>
          <v-chip size="small" variant="tonal">{{ ticket.peopleCount }} pers.</v-chip>
        </div>
        <div class="text-caption text-medium-emphasis mt-1">
          <strong>Estado:</strong> {{ ticket.status }}
        </div>
      </v-card-item>

      <v-card-actions class="justify-end">
        <v-btn
          size="small"
          color="secondary"
          variant="tonal"
          @click.stop="openNotify = true"
          prepend-icon="mdi-bell-outline"
        >
          Avisar
        </v-btn>
      </v-card-actions>
    </v-card>
  </div>

  <ConfirmDialog
    v-model="openServe"
    title="Servir ticket"
    :message="`¿Confirmar atención del ticket de ${ticket.customerFullName}?`"
    @confirm="emit('serve', ticket.id)"
  />

  <ConfirmDialog
    v-model="openCancel"
    title="Cancelar ticket"
    :message="`¿Seguro que quieres cancelar el ticket de ${ticket.customerFullName}?`"
    @confirm="emit('cancel', ticket.id)"
  />

  <ConfirmDialog
    v-model="openNotify"
    title="Enviar aviso"
    :message="`Enviar notificación manual a ${ticket.customerFullName}?`"
    @confirm="emit('notify', ticket.id)"
  />
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import ConfirmDialog from '@/components/common/ConfirmDialog.vue'

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

const displayPos = computed(() =>
  props.currentPosition ??
  (props.ticket.ahead != null ? props.ticket.ahead + 1 : props.ticket.position)
)

function onStart(ev: TouchEvent) {
  startX.value = ev.touches[0].clientX
  dragX.value = 0
  dragging.value = true
}
function onMove(ev: TouchEvent) {
  const dx = ev.touches[0].clientX - startX.value
  dragX.value = Math.min(0, dx)
}
function onEnd() {
  dragging.value = false
  if (dragX.value < -THRESH) {
    openCancel.value = true
  }
  dragX.value = 0
}

function onCardClick() {
  // Evita “click” accidental si hubo arrastre perceptible
  if (Math.abs(dragX.value) > CLICK_TOLERANCE || dragging.value) return
  openServe.value = true
}
</script>

<style scoped>
.position-relative { position: relative; }
.position-absolute { position: absolute; }
.top-0 { top: 0; } .left-0 { left: 0; } .right-0 { right: 0; } .bottom-0 { bottom: 0; }
</style>
