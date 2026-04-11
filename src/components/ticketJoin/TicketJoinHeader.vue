<template>
  <AppCard
    title="Unirse a la cola"
    subtitle="Las mesas son exclusivamente para comidas y cenas"
    :maxWidth="960"
  >
    <slot />

    
  </AppCard>
</template>

<script setup lang="ts">
import AppCard from '@/components/ui/AppCard.vue'
</script>

<style scoped>
</style>
