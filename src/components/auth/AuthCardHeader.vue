<template>
  <v-card-item class="bg-primary text-primary-contrast">
    <v-card-title class="text-h6 text-sm-h5">{{ title }}</v-card-title>
    <v-card-subtitle class="text-body-2 text-primary-contrast opacity-90">
      {{ subtitle }}
    </v-card-subtitle>
  </v-card-item>
</template>

<script setup lang="ts">
defineProps<{ title: string; subtitle?: string }>();
</script>
