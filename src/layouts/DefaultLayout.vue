<script setup lang="ts">
import { useRoute } from 'vue-router'

const route = useRoute()
</script>

<template>
  <div class="app-layout">
    <header class="app-header">
      <!-- <AppHeader> -->
        <div class="header-content">
          <img src="@/assets/logo.png" alt="Logo" class="logo" />          
        </div>
      <!-- </AppHeader> -->
    </header>

    <main class="app-container">
      <RouterView />
    </main>
  </div>
</template>

<style scoped>
.app-layout {
  min-height: 100vh;
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
}

.app-header {
  border-radius: 0px 0px 19px 19px;
  /* padding: 16px; */
  display: flex;
  justify-content: center;
  background-color: var(--color-background);
}

.header-content {
  max-width: 960px;
  width: 100%;
  display: flex;
  justify-content:center;
  align-items: center;
}

.logo {
  height: 64px;
  object-fit: contain;
}

.app-container {
  display: flex;
  flex-direction: column;
  max-width: 960px;
  width: 100%;
  margin: 0 auto;
  /* padding: 16px; */
  flex: 1;
}
</style>
