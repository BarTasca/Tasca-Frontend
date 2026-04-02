<template>
  <v-container fluid class="pa-0 mt-6 d-flex justify-center">
    <div style="max-width: 960px; width: 100%; padding: 0 16px 24px;">
      <AppCard title="Protección de datos" subtitle="Información legal" :maxWidth="960">
        <div class="body-1">
          <p>
            Aqui todos los datos de la ley de proteccion de datos y tal
          </p>
          <p>
            Lorem ipsum y todo eso
          </p>
          <h3>lista de derechos del consumidor</h3>
          <ul>
            <li>acceso</li>
            <li>rectificacion</li>
            <li>supresion</li>
            <li>limitacion</li>
            <li>portabilidad</li>
            <li>oposicion</li>
          </ul>
          <p>
            Para ejercer tus derechos, contacta con isabel.
          </p>
        </div>
        <template #actions>
          <div class="d-flex justify-center">
            <router-link class="v-btn v-btn--text" :to="{ name: 'ticket.join' }">
              Volver a unirse a la cola
            </router-link>
          </div>
        </template>
      </AppCard>
    </div>
  </v-container>
</template>

<script setup lang="ts">
import AppCard from '@/components/ui/AppCard.vue'
</script>
