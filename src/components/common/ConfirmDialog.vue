<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  modelValue: boolean
  title: string
  message?: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', v: boolean): void
  (e: 'confirm'): void
  (e: 'cancel'): void
}>()

const model = computed({
  get: () => props.modelValue,
  set: (v: boolean) => emit('update:modelValue', v),
})
</script>

<template>
  <v-dialog v-model="model" max-width="420">
    <v-card color="wood" rounded="xl" class="pt-8">
      <v-card-title class="text-h5 text-center font-weight-bold">
        {{ title }}
      </v-card-title>

      <v-card-text class="text-center">
        <slot>{{ message }}</slot>
      </v-card-text>

      <v-card-actions class="justify-space-between px-8 pb-4">
        <v-btn color="cancel" variant="flat" rounded="xl" @click="emit('cancel')"> Cancelar </v-btn>

        <v-btn color="success" variant="flat" rounded="xl" @click="emit('confirm')">
          Confirmar
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
