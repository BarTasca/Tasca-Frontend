<template>
  <v-alert
    v-if="error"
    type="error"
    variant="flat"
    :icon="false"
    density="comfortable"
    class="mb-4 auth-error-alert"
  >
    <template #prepend>
      <img :src="circleXIcon" alt="Error" class="auth-error-alert__icon" />
    </template>

    {{ error }}
  </v-alert>
</template>

<script setup lang="ts">
import circleXIcon from '@/assets/circle-x.svg'

defineProps<{ error?: string | null }>()
</script>

<style scoped>
.auth-error-alert {
  border-radius: 19px;
  background-color: var(--color-error) !important;
  color: var(--color-ultra-dark-wood) !important;
  font-weight: 700;
}

.auth-error-alert__icon {
  width: 32px;
  height: 32px;
  display: block;
}
</style>
