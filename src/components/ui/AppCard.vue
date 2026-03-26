<template>
  <v-card rounded="xl" elevation="3" :max-width="maxWidth" class="mx-auto">
    <div class="app-card__header bg-primary text-white">
      <div class="app-card__header-inner">
        <div class="app-card__header-row">
          <div class="app-card__header-text">
            <div class="app-card__title">{{ title }}</div>
            <div v-if="subtitle" class="app-card__subtitle">{{ subtitle }}</div>
          </div>

          <div v-if="$slots.headerActions" class="app-card__header-actions">
            <slot name="headerActions" />
          </div>
        </div>
      </div>
    </div>

    <v-divider />

    <v-card-text>
      <slot />
    </v-card-text>

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
.app-card__header {
  border-top-left-radius: 24px;
  border-top-right-radius: 24px;
}
.app-card__header-inner {
  padding: 18px 20px;
}
.app-card__header-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}
.app-card__header-text {
  min-width: 0;
}
.app-card__header-actions {
  flex: 0 0 auto;
  display: flex;
  align-items: center;
}
.app-card__title {
  font-size: 1.25rem;
  font-weight: 700;
  line-height: 1.2;
}
.app-card__subtitle {
  margin-top: 6px;
  font-size: 0.95rem;
  opacity: 0.9;
}
</style>
