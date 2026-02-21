<template>
  <div>
    <v-alert v-if="serviceError" type="error" variant="tonal" class="mb-3">
      {{ serviceError }}
    </v-alert>

    <v-alert v-if="error" type="error" variant="tonal" class="mb-3">
      {{ error }}
    </v-alert>

    <v-alert v-if="showEmpty" type="info" variant="tonal">
      {{ emptyText }}
    </v-alert>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  serviceError?: string | null
  error?: string | null
  showEmpty: boolean
  emptyText?: string
}>()
</script>
