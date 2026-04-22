<template>
  <v-container class="centered-layout pa-0 mt-6">
    <v-row justify="center" class="ma-0">
      <v-col :cols="12" :md="width" class="pa-0 d-flex flex-column">
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

<style scoped>
.centered-layout {
  width: 100%;
}

@media (max-height: 700px) {
  .centered-layout {
    margin-top: 12px !important;
  }
}
</style>