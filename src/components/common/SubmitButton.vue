<template>
  <v-btn
    type="submit"
    color="success"
    :loading="loading"
    :disabled="loading"
    :size="size"
    :block="block"
    flat
    class="app-button text-white font-weight-bold"
  >
    {{ loading ? loadingText : text }}
  </v-btn>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  text: string
  loading: boolean
  loadingText?: string
  size?: 'x-small' | 'small' | 'default' | 'large' | 'x-large'
  block?: boolean
}>(), {
  loadingText: 'Cargando…',
  size: 'large',
  block: true,
})
</script>

<style scoped>
.app-button {
  border-radius: 19px;
  height: 60px;
}
</style>