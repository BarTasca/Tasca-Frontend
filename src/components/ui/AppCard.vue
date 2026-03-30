
<template>
  <v-card 
    elevation="3" 
    class="d-flex flex-column" 
    style="height: 100%; width: 100%; border-radius: 19px 19px 0 0 !important; overflow: hidden;"
  >
    <div class="app-card__header text-white">
      <div class="app-card__header-inner">
        <div class="app-card__header-row">
          <div class="app-card__header-text">
            <div class="app-card__title">{{ title }}</div>
            <div v-if="subtitle" class="app-card__subtitle">{{ subtitle }}</div>
          </div>
        </div>
      </div>
    </div>
    
    <v-card-text class="flex-grow-1 pb-10">
      <slot />
    </v-card-text>

    <slot name="actions" />
  </v-card>
</template>

<script setup lang="ts">
defineProps<{
  title?: string
  subtitle?: string
  maxWidth?: string | number
}>()
</script>

<style scoped>
.app-card__header {
  background-color: var(--color-background);
}
.app-card__header-inner {
  padding: 18px 20px;
}
.app-card__header-row {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
}
.app-card__header-text {
  display: flex;
  justify-content: center;
  flex-direction: column;
  min-width: 0;
}
.app-card__title {
  font-size: 1.25rem;
  font-weight: 700;
  line-height: 1.2;
  color: var(--color-ultra-dark-wood);
  text-align: center;
}
.app-card__subtitle {
  margin-top: 6px;
  font-size: 0.95rem;
  opacity: 0.9;
  color: var(--color-dark-wood);
  text-align: center;
}
</style>