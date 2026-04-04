<template>
  <v-container class="pa-0 mt-6 d-flex flex-column flex-grow-1">
    <v-row justify="center" class="ma-0 flex-grow-1">
      <v-col :cols="12" :md="width" class="pa-0 d-flex">
        <slot />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    width?: number
  }>(),
  {
    width: 6,
  },
)
</script>
