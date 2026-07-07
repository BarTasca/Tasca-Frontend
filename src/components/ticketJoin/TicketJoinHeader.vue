<template>
  <AppCard
    title="Unirse a la cola"
    :subtitle="`Llamamos de voz,\nno por teléfono`"
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
  font-size: 2rem;
  color: red;
  font-weight: bold;
  white-space: pre-line;
}

.alert-subtitle :deep(.app-card__strong-subtitle){
  font-size: 1.2rem;
  font-weight: bold;
  color: red;
}

</style>
