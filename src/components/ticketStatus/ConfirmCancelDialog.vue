<template>
  <v-dialog v-model="model" max-width="420">
    <v-card>
      <v-card-title class="text-h6">Confirmar cancelación</v-card-title>
      <v-card-text>
        ¿Seguro que quieres cancelar tu turno? Si cancelas, perderás tu posición en la cola.
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn variant="text" @click="model = false" :disabled="loading">Volver</v-btn>
        <v-btn color="error" @click="$emit('confirm')" :loading="loading">
          Cancelar turno
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  modelValue: boolean
  loading: boolean
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', v: boolean): void
  (e: 'confirm'): void
}>()

const model = computed({
  get: () => props.modelValue,
  set: (v: boolean) => emit('update:modelValue', v),
})
</script>
