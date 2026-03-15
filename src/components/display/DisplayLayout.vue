<template>
  <v-container class="display-layout">
    <header class="display-header">
      <slot name="header" />
    </header>

    <main class="display-main">
      <v-row class="display-row" justify="center" align="center">
        <v-col cols="12" sm="10" md="8" lg="6" class="display-col">
          .<div class="display-surface">
            <slot />
          </div>
        </v-col>
      </v-row>
    </main>
  </v-container>
</template>

<style scoped>
.display-layout {
  min-height: 100vh;
  padding-top: clamp(28px, 6vh, 64px);
  padding-bottom: clamp(16px, 3vh, 32px);
  padding-left: 0;
  padding-right: 0;
  display: flex;
  flex-direction: column;
}

.display-header {
  display: flex;
  justify-content: center;
  flex: 0 0 auto;
  margin-bottom: clamp(2px, 0.6vh, 6px);
}

.display-main {
  flex: 1 1 auto;
  display: flex;
  min-height: 0;
}

.display-row {
  flex: 1;
  min-height: 0;
  margin-top: -100px;
}

.display-col {
  display: flex;
}

.display-surface {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: clamp(8px, 2vh, 16px);
}
</style>