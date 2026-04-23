<template>
  <v-container class="centered-layout pa-0">
    <v-row justify="center" class="centered-layout__row ma-0">
      <v-col :cols="12" :md="width" class="centered-layout__col pa-0 d-flex flex-column">
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
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  padding-top: clamp(12px, 2.5vh, 24px);
}

.centered-layout__row {
  flex: 1;
  min-height: 0;
}

.centered-layout__col {
  min-height: 0;
}

@media (max-height: 700px) {
  .centered-layout {
    padding-top: 8px;
  }
}
</style>