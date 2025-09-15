<template>
  <v-card rounded="xl" elevation="3" :max-width="maxWidth" class="mx-auto">
    <v-card-item class="bg-primary text-primary-contrast">
      <v-card-title class="text-h6 text-sm-h5">{{ title }}</v-card-title>
      <v-card-subtitle v-if="subtitle" class="text-body-2 text-primary-contrast opacity-90">
        {{ subtitle }}
      </v-card-subtitle>
    </v-card-item>
    <v-divider />
    <v-card-text>
      <slot />
    </v-card-text>
    <slot name="actions" />
  </v-card>
</template>

<script setup lang="ts">
defineProps<{
  title: string
  subtitle?: string
  maxWidth?: string | number
}>()
</script>
