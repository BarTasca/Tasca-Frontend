<script setup lang="ts">
import { useRoute } from 'vue-router'
</script>

<template>
  <div class="app-layout">
    <header class="app-header">
      <div class="header-content">
        <img src="@/assets/logo.png" alt="Logo" class="logo" />
      </div>
    </header>

    <main class="app-container">
      <RouterView />
    </main>
  </div>
</template>

<style scoped>
.app-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.app-header {
  padding: 16px;
  display: flex;
  justify-content: center;
  background-color: red;
}

.header-content {
  max-width: 960px;
  width: 100%;
  display: flex;
  align-items: center;
}

.logo {
  height: 48px;
  object-fit: contain;
}

.app-container {
  max-width: 960px;
  width: 100%;
  margin: 0 auto;
  padding: 16px;
  flex: 1;
}
</style>
