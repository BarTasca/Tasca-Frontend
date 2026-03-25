<template>
  <v-card
    class="ticket-surface mx-0 my-2"
    rounded="xl"
    elevation="2"
    color="wood"
    :style="surfaceStyle"
    @click="onClick"
  >
    <v-card-item>
      <div class="d-flex align-center justify-space-between">
        <div class="d-flex align-center ga-3">
          <v-chip color="dark_Wood" variant="text"> <strong>#{{ displayPos }}</strong> </v-chip>
        </div>

        <div class="d-flex align-center ga-2 flex-sm-column">
          <div class="text-subtitle-2 font-weight-medium">
            <strong>{{ customerName }}</strong>
          </div>
          {{ statusLabel }}
          <v-progress-circular v-if="busy" indeterminate size="16" width="2" />
        </div>

        <div class="text-caption text-medium-emphasis mt-1">
          <v-chip size="small" variant="text"><User />{{ peopleCount }}</v-chip>
        </div>
        <div>
          <v-btn
            color="dark_Wood"
            variant="elevated"
            @click.stop="emit('notify')"
            :disabled="busy"
            :loading="busy"
          >
            <Bell />
          </v-btn>
        </div>
      </div>
    </v-card-item>
  </v-card>
</template>

<script setup lang="ts">
import { computed } from 'vue'

import { Bell, User } from 'lucide-vue-next';


const props = defineProps<{
  displayPos: number
  customerName: string
  peopleCount: number
  status: string

  busy?: boolean

  dragX: number
  dragging: boolean
}>()

const statusLabel = computed(() => {
  switch (props.status){
    case "WAITING":
      return "Esperando"
    case "NOTIFIED":
      return "Notificado"
    case "CANCELLED":
      return "Cancelado"
    case "CONFIRMED":
      return "Confirmado"
    default:
      return props.status
  }
})

const emit = defineEmits<{
  (e: 'click'): void
  (e: 'notify'): void
}>()

const surfaceStyle = computed(() => ({
  transform: `translateX(${props.dragX}px)`,
  transition: props.dragging ? 'none' : 'transform 160ms',
}))

function onClick() {
  emit('click')
}
</script>

<style scoped>
.ticket-surface {
  user-select: none;
}
</style>
