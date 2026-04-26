<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    modelValue: boolean
    title: string
    message?: string
    confirmText?: string
    cancelText?: string
    confirmLoading?: boolean
    confirmDisabled?: boolean
    hideCancel?: boolean
  }>(),
  {
    confirmText: 'Confirmar',
    cancelText: 'Cancelar',
    confirmLoading: false,
    confirmDisabled: false,
    hideCancel: false,
  },
)

const emit = defineEmits<{
  (e: 'update:modelValue', v: boolean): void
  (e: 'confirm'): void
  (e: 'cancel'): void
}>()

const model = computed({
  get: () => props.modelValue,
  set: (v: boolean) => emit('update:modelValue', v),
})

function onCancel() {
  emit('cancel')
  emit('update:modelValue', false)
}
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

      <v-card-actions
        class="px-8 pb-4"
        :class="hideCancel ? 'justify-center' : 'justify-space-between'"
      >
        <v-btn v-if="!hideCancel" color="cancel" variant="flat" rounded="xl" @click="onCancel">
          {{ cancelText }}
        </v-btn>

        <v-btn
          color="success"
          variant="flat"
          rounded="xl"
          :loading="confirmLoading"
          :disabled="confirmDisabled"
          @click="emit('confirm')"
        >
          {{ confirmText }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
