<template>
  <v-container class="display-layout">
    <v-row justify="center">
      <v-col cols="12" sm="10" md="8" lg="6">
        <div class="display-surface">
          <slot />
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
.display-layout {
  padding-top: 32px;
  padding-bottom: 32px;
}

.display-surface {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
</style>
