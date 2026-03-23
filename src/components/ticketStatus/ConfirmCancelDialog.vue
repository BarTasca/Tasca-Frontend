<script setup lang="ts">
import ConfirmDialog from '@/components/common/ConfirmDialog.vue'

const props = defineProps<{
  modelValue: boolean
  loading: boolean
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', v: boolean): void
  (e: 'confirm'): void
}>()
</script>

<template>
  <ConfirmDialog
    :model-value="modelValue"
    title="Cancelar turno"
    @update:model-value="emit('update:modelValue', $event)"
    @confirm="emit('confirm')"
    @cancel="emit('update:modelValue', false)"
  >
    ¿Seguro que quieres cancelar tu turno?
  </ConfirmDialog>
</template>