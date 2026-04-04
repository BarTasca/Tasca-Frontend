<template>
  <AppCard
    title="Unirse a la cola"
    subtitle="Introduce tus datos para crear tu turno."
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
