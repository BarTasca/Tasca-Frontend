<script setup lang="ts">
import AppCard from '@/components/ui/AppCard.vue'
import { useUiStore } from '@/stores/ui'

const ui = useUiStore()

function snack(kind: 'success' | 'error' | 'info' | 'warning') {
  ui.showSnack(`Snackbar (${kind})`, kind, 2500)
}
</script>

<template>
  <div class="sg">
    <h1 class="sg__title">Style Guide (DEV)</h1>
    <p class="sg__subtitle">Pantalla interna para probar UI/tokens sin tocar la app.</p>

    <div class="sg__grid">
      <AppCard title="Card" subtitle="Ejemplo con tokens">
        <div class="sg__stack">
          <v-btn color="primary">Primary</v-btn>
          <v-btn color="secondary" variant="tonal">Secondary tonal</v-btn>
          <v-btn variant="outlined">Outlined</v-btn>
        </div>
      </AppCard>

      <AppCard title="Alerts" subtitle="Estados">
        <div class="sg__stack">
          <v-alert type="info" variant="tonal">Info</v-alert>
          <v-alert type="success" variant="tonal">Success</v-alert>
          <v-alert type="warning" variant="tonal">Warning</v-alert>
          <v-alert type="error" variant="tonal">Error</v-alert>
        </div>
      </AppCard>

      <AppCard title="Form" subtitle="Inputs básicos">
        <div class="sg__stack">
          <v-text-field label="Text field" prepend-inner-icon="mdi-account-outline" />
          <v-select :items="['One', 'Two', 'Three']" label="Select" />
          <v-text-field label="Number" type="number" />
        </div>
      </AppCard>

      <AppCard title="Snackbars" subtitle="Disparar desde UI store">
        <div class="sg__stack sg__row">
          <v-btn @click="snack('info')">Info</v-btn>
          <v-btn @click="snack('success')">Success</v-btn>
          <v-btn @click="snack('warning')">Warning</v-btn>
          <v-btn @click="snack('error')">Error</v-btn>
        </div>
      </AppCard>
    </div>
  </div>
</template>

<style scoped>
.sg {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
}

.sg__title {
  margin: 0;
  font-size: 1.6rem;
}

.sg__subtitle {
  margin: 0;
  opacity: 0.8;
}

.sg__grid {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: var(--space-lg);
}

.sg__grid > * {
  grid-column: span 12;
}

@media (min-width: 900px) {
  .sg__grid > * {
    grid-column: span 6;
  }
}

.sg__stack {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
}

.sg__row {
  flex-direction: row;
  flex-wrap: wrap;
}
</style>
