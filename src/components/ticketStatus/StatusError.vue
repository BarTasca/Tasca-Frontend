<template>
  <v-alert type="error" variant="tonal" density="comfortable">
    {{ error }}
  </v-alert>
</template>

<script setup lang="ts">
defineProps<{ error: string }>()
</script>
