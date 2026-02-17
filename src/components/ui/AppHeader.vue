<script setup lang="ts">
defineProps<{
  showTitle?: boolean
  title?: string
}>()
</script>

<template>
  <header class="app-header">
    <div class="app-header__inner">
      <img src="@/assets/logo.png" alt="Logo" class="app-header__logo" />
      <div v-if="showTitle" class="app-header__title">
        {{ title ?? '' }}
      </div>
      <div class="app-header__spacer" />
      <slot />
    </div>
  </header>
</template>

<style scoped>
.app-header {
  padding: var(--space-md);
  display: flex;
  justify-content: center;
}

.app-header__inner {
  max-width: 960px;
  width: 100%;
  display: flex;
  align-items: center;
  gap: var(--space-md);
}

.app-header__logo {
  height: 48px;
  object-fit: contain;
}

.app-header__title {
  font-weight: 700;
  font-size: 1.1rem;
}

.app-header__spacer {
  flex: 1;
}
</style>
