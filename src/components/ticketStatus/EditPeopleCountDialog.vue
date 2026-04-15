<script setup lang="ts">
import { User } from 'lucide-vue-next'

import { ref, watch } from 'vue'
import ConfirmDialog from '../common/ConfirmDialog.vue'

const props = defineProps<{
  modelValue: boolean
  loading: boolean
  initialPeopleCount: number
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'confirm', peopleCount: number): void
}>()

const peopleCount = ref(1)

watch(
  () => props.modelValue,
  (open) => {
    if (open) {
      peopleCount.value = props.initialPeopleCount
    }
  },
)

function close() {
  emit('update:modelValue', false)
}

function confirm() {
  if (peopleCount.value < 1 || peopleCount.value > 15) return
  emit('confirm', peopleCount.value)
}
</script>

<template>
  <ConfirmDialog
    :model-value="modelValue"
    title="Editar ticket"
    confirm-text="Aceptar"
    cancel-text="Cancelar"
    :confirm-loading="loading"
    :confirm-disabled="loading || peopleCount < 1 || peopleCount > 15"
    @update:modelValue="emit('update:modelValue', $event)"
    @cancel="close"
    @confirm="confirm"
  >
    <div class="edit-ticket">
      <div class="edit-ticket__label">Personas:</div>

      <div class="edit-ticket__control">
        <v-text-field
          v-model.number="peopleCount"
          type="number"
          variant="solo-filled"
          flat
          hide-details
          class="edit-ticket__value"
        >
        </v-text-field>

        <User class="summary-icon" />
      </div>
    </div>
  </ConfirmDialog>
</template>

<style scoped lang="scss">
.edit-ticket {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  width: 100%;
  min-height: 92px;
  padding: 8px 4px 0;
}

.edit-ticket__label {
  font-size: 1.75rem;
  font-weight: 800;
  color: rgb(var(--v-theme-dark_Wood));
}

.edit-ticket__control {
  display: flex;
  align-items: center;
  gap: 12px;
}

%summary-icon-base {
  width: 2em;
  height: 2em;
  flex-shrink: 0;
  color: rgb(var(--v-theme-dark_Wood));
  stroke-width: 2px;
}

.summary-icon {
  @extend %summary-icon-base;
}

.summary-icon--small {
  @extend %summary-icon-base;
  width: 0.9em;
  height: 0.9em;
  opacity: 0.75;
}

.edit-ticket__value {
  flex: 0 0 auto;
  width: 64px;
}

:deep(.edit-ticket__value .v-input__details) {
  display: none;
}

:deep(.edit-ticket__value .v-field) {
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.65);
  box-shadow: none;
}

:deep(.edit-ticket__value .v-field__overlay) {
  display: none;
}

:deep(.edit-ticket__value .v-field__outline) {
  display: none;
}

:deep(.edit-ticket__value .v-field__input) {
  min-height: 48px;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

:deep(.edit-ticket__value input) {
  width: 100%;
  text-align: center;
  font-size: 2rem;
  font-weight: 800;
  line-height: 1;
  color: rgb(var(--v-theme-dark_Wood));
  padding: 0;
  opacity: 1;
}

:deep(.edit-ticket__value input[type='number']) {
  -moz-appearance: textfield;
  appearance: textfield;
}

:deep(.edit-ticket__value input[type='number']::-webkit-outer-spin-button),
:deep(.edit-ticket__value input[type='number']::-webkit-inner-spin-button) {
  -webkit-appearance: none;
  margin: 0;
}

@media (max-width: 320px) {
  .edit-ticket {
    flex-direction: column;
    align-items: center;
    gap: 16px;
    width: 100%;
    min-height: 92px;
    padding: 8px 4px 0;
  }

  .edit-ticket__value {
    width: 56px;
  }

  :deep(.edit-ticket__value .v-field__input) {
    min-height: 44px;
  }

  :deep(.edit-ticket__value input) {
    font-size: 1.7rem;
  }
}
</style>
