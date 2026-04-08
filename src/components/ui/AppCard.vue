<template>
  <v-card
    elevation="3"
    class="d-flex flex-column"
    style="
      height: 100%;
      width: 100%;
      border-radius: 19px 19px 0 0 !important;
      overflow: hidden;
      position: relative;
    "
  >
    <div class="app-card__header text-white">
      <div class="app-card__header-inner">
        <div class="app-card__header-row">
          <div class="app-card__header-text">
            <div class="app-card__title">{{ title }}</div>
            <div v-if="subtitle" class="app-card__subtitle">{{ subtitle }}</div>
          </div>

          <div v-if="$slots.headerActions" class="app-card__header-actions">
            <slot name="headerActions" />
          </div>
        </div>
      </div>
    </div>

    <v-card-text class="flex-grow-1 pb-10">
      <slot />
    </v-card-text>

    <slot name="actions" />

    <footer v-if="gdpr" class="app-mountains" aria-hidden="true">
      <div class="app-mountains__background" />
      <div class="app-mountains__content">
        <router-link class="app-mountains__link" :to="{ name: 'ticket.join.privacy' }">
          Aviso legal y protección de datos
        </router-link>
      </div>
    </footer>
  </v-card>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    title?: string
    subtitle?: string
    maxWidth?: string | number
    gdpr?: boolean
  }>(),
  {
    gdpr: true,
  },
)
</script>

<style scoped>
.app-card__header {
  border-top-left-radius: 24px;
  border-top-right-radius: 24px;
}
.app-card__header-inner {
  padding: 18px 20px;
}
.app-card__header-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}
.app-card__header-text {
  min-width: 0;
}
.app-card__header-actions {
  flex: 0 0 auto;
  display: flex;
  align-items: center;
}
.app-card__title {
  font-size: 1.25rem;
  font-weight: 700;
  line-height: 1.2;
}
.app-card__subtitle {
  margin-top: 6px;
  font-size: 0.95rem;
  opacity: 0.9;
}

.app-mountains {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 160px;
  overflow: hidden;
}

.app-mountains__background {
  position: absolute;
  inset: 0;
  background-color: var(--color-background);
  background-image: url('@/assets/oroel.svg');
  background-size: cover;
  background-position: center top;
  background-repeat: no-repeat;
  z-index: 1;
}

.app-mountains__content {
  position: relative;
  z-index: 2;
  height: 100%;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding-bottom: 16px;
}

.app-mountains__link {
  color: #ffffff;
  text-decoration: none;
  font-weight: 700;
}
</style>
