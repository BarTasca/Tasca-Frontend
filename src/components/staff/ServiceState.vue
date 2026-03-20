<script setup lang="ts">
const props = defineProps<{
  pendingIsOpen: boolean
}>()

const emit = defineEmits<{
  (e: 'update:pendingIsOpen', value: boolean): void
  (e: 'toggle-attempt', value: boolean): void
}>()

// function toggleAttempt(next-value: boolean){

// }

function onUpdate(value: boolean | null) {
  if (value == null) return
  emit('update:pendingIsOpen', value)
}
</script>

<template>
  <div class="service-state">
      <div
        class="status-box"
        :style="{
          backgroundColor: pendingIsOpen
            ? 'rgb(var(--v-theme-success))'
            : 'rgb(var(--v-theme-cancel))',
        }"
      >
        {{ pendingIsOpen ? 'Servicio Abierto' : 'Servicio Cerrado' }}
      </div>
      <div class="switch-box">
          <v-switch
          :model-value="pendingIsOpen"
          color="white"
          inset
          hide-details
          @update:model-value="onUpdate"
          @click="emit('toggle-attempt', !pendingIsOpen)"
          />
        </div>
  </div>
</template>

<style scoped lang="scss">
@use '@/styles/tokens.scss' as *;

.service-state {
  position: relative;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  min-height: 56px;
}

.status-box {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);

  min-width: 200px;
  max-width: 620px;
  display: flex;
  align-items: center;
  justify-content: center;

  color: white;
  padding: 10px 16px;
  border-radius: 10px;

  font-size: 1.3rem;
  font-weight: 600;
  text-align: center;
}

.switch-box {
  position: relative;
  min-width: 70px;
  min-height: 60px;
  border-radius: 15px;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: $color-accent;
}

.switch-box :deep(.v-selection-control) {
  min-height: auto;
}

.switch-box :deep(.v-selection-control__wrapper) {
  width: 42px;
  height: 24px;
}

.switch-box :deep(.v-switch__track) {
  opacity: 1;
  background: transparent !important;
  border: 2px solid white;
  border-radius: 999px;
}

.switch-box :deep(.v-switch__thumb) {
  background: transparent !important;
  border: 2px solid white;
  box-shadow: none;
}

.switch-box :deep(.v-selection-control__input) {
  width: 42px;
  height: 24px;
}
</style>
