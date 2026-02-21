<template>
  <div class="display-header">
    <div class="display-title">{{ title }}</div>
    <div v-if="subtitle" class="display-subtitle">{{ subtitle }}</div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string
  subtitle?: string
}>()
</script>

<style scoped>
.display-header {
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.display-title {
  font-size: 28px;
  font-weight: 800;
  line-height: 1.15;
}

.display-subtitle {
  font-size: 14px;
  opacity: 0.9;
}
</style>
