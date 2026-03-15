<template>
  <div
    class="ticket-swipe-bg position-absolute top-0 left-0 right-0 bottom-0 d-flex align-center justify-end pr-4"
    :class="{ 'ticket-swipe-bg--active': active }"
  >
    <v-icon v-if="active">mdi-trash-can-outline</v-icon>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  active: boolean
}>()
</script>

<style scoped>
.ticket-swipe-bg {
  background: transparent;
  border-radius: 18px;
  transition: background 140ms ease;
}
.ticket-swipe-bg--active {
  background: #ef5350;
}
</style>
