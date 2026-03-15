<template>
  <v-sheet class="d-flex align-center justify-space-between mb-3 px-2">
    <div>
      <div class="text-h6">{{ title }}</div>
      <div class="text-caption text-medium-emphasis">{{ subtitle }}</div>
    </div>

    <v-switch :model-value="modelValue" color="primary" inset @click="onToggleAttempt" />
  </v-sheet>
</template>

<script setup lang="ts">
defineProps<{
  title: string
  subtitle: string
  modelValue: boolean
}>()

const emit = defineEmits<{
  (e: 'toggle-attempt'): void
}>()

function onToggleAttempt() {
  emit('toggle-attempt')
}
</script>
