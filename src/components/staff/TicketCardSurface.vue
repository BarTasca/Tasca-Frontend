<template>
  <v-card
    class="ticket-surface mx-0 my-2"
    rounded="xl"
    elevation="2"
    :style="surfaceStyle"
    @click="onClick"
  >
    <v-card-item>
      <div class="d-flex align-center justify-space-between">
        <div class="d-flex align-center ga-3">
          <v-chip color="primary" variant="flat" size="small"> #{{ displayPos }} </v-chip>
          <div class="text-subtitle-2 font-weight-medium">{{ customerName }}</div>
        </div>

        <div class="d-flex align-center ga-2">
          <v-progress-circular v-if="busy" indeterminate size="16" width="2" />
          <v-chip size="small" variant="tonal">{{ peopleCount }} pers.</v-chip>
        </div>
      </div>

      <div class="text-caption text-medium-emphasis mt-1">
        <strong>Estado:</strong> {{ status }}
      </div>
    </v-card-item>

    <v-card-actions class="justify-end">
      <v-btn
        size="small"
        color="secondary"
        variant="tonal"
        @click.stop="emit('notify')"
        prepend-icon="mdi-bell-outline"
        :disabled="busy"
        :loading="busy"
      >
        Avisar
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  displayPos: number
  customerName: string
  peopleCount: number
  status: string

  busy?: boolean

  dragX: number
  dragging: boolean
}>()

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
