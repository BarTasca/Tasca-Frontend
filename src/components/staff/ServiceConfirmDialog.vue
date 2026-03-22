<script setup lang="ts">
import ConfirmDialog from '@/components/common/ConfirmDialog.vue'

const props = defineProps<{
  modelValue: boolean
  pendingIsOpen: boolean
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', v: boolean): void
  (e: 'confirm'): void
  (e: 'cancel'): void
}>()
</script>

<template>
  <ConfirmDialog
    :model-value="modelValue"
    title="Se necesita confirmación"
    @update:model-value="emit('update:modelValue', $event)"
    @confirm="emit('confirm')"
    @cancel="emit('cancel')"
  >
    ¿Seguro que quieres
    <span class="font-weight-bold">
      {{ pendingIsOpen ? 'abrir' : 'cerrar' }}
    </span>
    el servicio?
  </ConfirmDialog>
</template>