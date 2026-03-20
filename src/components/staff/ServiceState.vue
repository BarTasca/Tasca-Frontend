<template>
  <v-switch
    :model-value="pendingIsOpen"
    color="black"
    inset
    hide-details
    @update:model-value="onUpdate"
    @click="emit('toggle-attempt', !pendingIsOpen)"
  />
</template>

<script setup lang="ts">
const props = defineProps<{
  pendingIsOpen: boolean
}>()

const emit = defineEmits<{
  (e: 'update:pendingIsOpen', value: boolean ): void
  (e: 'toggle-attempt', value: boolean): void
}>()

// function toggleAttempt(next-value: boolean){

// }

function onUpdate(value: boolean | null) {
    if (value == null) return
  emit('update:pendingIsOpen', value)
}
</script>