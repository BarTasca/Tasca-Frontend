<template>
  <v-alert
    v-if="error"
    type="error"
    variant="tonal"
    density="comfortable"
    class="mb-4"
  >
    {{ error }}
  </v-alert>
</template>

<script setup lang="ts">
defineProps<{ error?: string | null }>()
</script>
