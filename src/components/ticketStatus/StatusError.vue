<template>
  <v-alert
    type="error"
    variant="flat"
    :icon="false"
    density="comfortable"
    class="app-error-alert"
  >
    <template #prepend>
      <img :src="circleXIcon" alt="Error" class="app-error-alert__icon" />
    </template>

    {{ error }}
  </v-alert>
</template>

<script setup lang="ts">
import circleXIcon from '@/assets/circle-x.svg'

defineProps<{ error: string }>()
</script>

<style scoped>
.app-error-alert {
  border-radius: 19px;
  background-color: var(--color-error) !important;
  color: var(--color-ultra-dark-wood) !important;
  font-weight: 700;
}

.app-error-alert__icon {
  width: 32px;
  height: 32px;
  display: block;
}
</style>
