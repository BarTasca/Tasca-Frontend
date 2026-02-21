<template>
  <v-dialog :model-value="modelValue" max-width="420" @update:model-value="onModelUpdate">
    <v-card>
      <v-card-title class="text-h6">Confirmar acción</v-card-title>
      <v-card-text>
        ¿Seguro que quieres
        <strong>{{ pendingIsOpen ? 'abrir' : 'cerrar' }}</strong>
        el servicio?
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn variant="text" @click="emit('cancel')">Cancelar</v-btn>
        <v-btn color="primary" variant="flat" @click="emit('confirm')">Confirmar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
const props = defineProps<{
  modelValue: boolean
  pendingIsOpen: boolean
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', v: boolean): void
  (e: 'confirm'): void
  (e: 'cancel'): void
}>()

function onModelUpdate(v: boolean) {
  emit('update:modelValue', v)
}
</script>
