<script setup lang="ts">
import { RouterLink } from 'vue-router';

</script>

<template>
  <h1>HomeView</h1>
  <section>
    <RouterLink :to="{name: 'login'}">Login</RouterLink>
  </section>
</template>
