<script setup lang="ts">
import { computed } from 'vue'
import { useUiStore } from '@/stores/ui'

const ui = useUiStore()
const snack = computed(() => ui.snackbar)
</script>

<template>
  <header>
    <div>
      <nav></nav>
    </div>
  </header>

  <RouterView />

  <v-snackbar
    v-model="ui.snackbar.show"
    :timeout="snack.timeout"
    :color="snack.color"
    location="bottom"
  >
    {{ snack.text }}
  </v-snackbar>
</template>

<style scoped></style>
