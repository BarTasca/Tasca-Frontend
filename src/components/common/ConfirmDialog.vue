<template>
  <v-dialog v-model="model" max-width="420">
    <v-card rounded="xl">
      <v-card-item class="bg-primary text-primary-contrast">
        <v-card-title class="text-h6">{{ title }}</v-card-title>
      </v-card-item>

      <v-card-text class="pt-4">
        <slot>{{ message }}</slot>
      </v-card-text>

      <v-card-actions class="justify-end ga-2">
        <v-btn variant="text" @click="cancel">Cancelar</v-btn>
        <v-btn color="primary" @click="confirm">Confirmar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { computed } from 'vue'
const props = defineProps<{ modelValue: boolean; title: string; message?: string }>()
const emit = defineEmits<{
  (e: 'update:modelValue', v: boolean): void
  (e: 'confirm'): void
  (e: 'cancel'): void
}>()

const model = computed({
  get: () => props.modelValue,
  set: v => emit('update:modelValue', v),
})

function confirm() { emit('confirm'); emit('update:modelValue', false) }
function cancel() { emit('cancel'); emit('update:modelValue', false) }
</script>
