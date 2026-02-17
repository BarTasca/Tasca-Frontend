<template>
  <v-card :max-width="maxWidth" class="app-card mx-auto">
    <div class="app-card__header">
      <div class="app-card__title">{{ title }}</div>
      <div v-if="subtitle" class="app-card__subtitle">{{ subtitle }}</div>
    </div>

    <v-divider />

    <div class="app-card__body">
      <slot />
    </div>

    <slot name="actions" />
  </v-card>
</template>

<script setup lang="ts">
defineProps<{
  title: string
  subtitle?: string
  maxWidth?: string | number
}>()
</script>

<style scoped>
.app-card {
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-soft);
}

.app-card__header {
  padding: var(--space-md);
  background: var(--color-primary);
  color: var(--color-primary-contrast);
  border-top-left-radius: var(--radius-lg);
  border-top-right-radius: var(--radius-lg);
}

.app-card__title {
  font-size: 1.15rem;
  font-weight: 700;
  line-height: 1.2;
}

.app-card__subtitle {
  margin-top: var(--space-xs);
  opacity: 0.9;
  font-size: 0.95rem;
}

.app-card__body {
  padding: var(--space-md);
}
</style>
