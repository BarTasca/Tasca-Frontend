<template>
  <AppCard
    title="Unirse a la cola"
    subtitle="LAS MESAS SON EXCLUSIVAMENTE PARA COMIDAS Y CENAS"
    :maxWidth="960"
    class="alert-subtitle"
  >
    <slot />

    
  </AppCard>
</template>

<script setup lang="ts">
import AppCard from '@/components/ui/AppCard.vue'
</script>

<style scoped>
.alert-subtitle :deep(.app-card__subtitle){
  font-size: 1.2rem;
  color: red;
}

</style>
