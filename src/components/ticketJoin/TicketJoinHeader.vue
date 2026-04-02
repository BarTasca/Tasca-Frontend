<template>
  <AppCard
    title="Unirse a la cola"
    subtitle="Introduce tus datos para crear tu turno."
    :maxWidth="960"
  >
    <slot />

    <footer class="app-mountains" aria-hidden="true">
      <div class="app-mountains__background" />
      <div class="app-mountains__content">
        <router-link class="app-mountains__link" :to="{ name: 'ticket.join.privacy' }">
          Aviso legal y protección de datos
        </router-link>
      </div>
    </footer>
  </AppCard>
</template>

<script setup lang="ts">
import AppCard from '@/components/ui/AppCard.vue'
</script>

<style scoped>
.app-mountains {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 160px;
  overflow: hidden;
}

.app-mountains__background {
  position: absolute;
  inset: 0;
  background-color: var(--color-background);
  background-image: url('@/assets/oroel.svg');
  background-size: cover;
  background-position: center top;
  background-repeat: no-repeat;
  z-index: 1;
}

.app-mountains__content {
  position: relative;
  z-index: 2;
  height: 100%;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding-bottom: 16px;
}

.app-mountains__link {
  color: #ffffff;
  text-decoration: none;
  font-weight: 700;
}
</style>
