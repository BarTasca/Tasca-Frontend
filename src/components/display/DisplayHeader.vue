<template>
  <img class="display-logo" :src="logoUrl" alt="Bar La Tasca" />
</template>

<script setup lang="ts">
import logoUrl from '@/assets/logo.png'
</script>

<style scoped>
.display-logo {
  width: clamp(96px, 12vw, 150px);
  height: auto;
  display: block;
}
</style>