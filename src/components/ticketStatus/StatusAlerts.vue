<script setup lang="ts">
import circleXIcon from '@/assets/circle-x.svg'

defineProps<{
  canCancel: boolean
  loading: boolean
  pushSupported: boolean
  pushPermission: NotificationPermission | 'unsupported'
  pushEnabled: boolean
  pushLoading: boolean
  pushError: string | null
}>()

defineEmits<{
  (e: 'cancel'): void
  (e: 'enable-push'): void
  (e: 'disable-push'): void
}>()
</script>

<template>
  <div class="d-flex flex-column ga-1">
    <v-divider class="my-4" />

    <v-alert v-if="!pushSupported" type="info" variant="tonal" density="comfortable" class="mb-3">
      Este navegador no soporta notificaciones push.
    </v-alert>

    <v-alert
      v-else-if="pushPermission === 'denied'"
      type="warning"
      variant="tonal"
      density="comfortable"
      class="mb-3"
    >
      Has bloqueado las notificaciones en el navegador.
    </v-alert>

    <v-alert
      v-else-if="pushEnabled"
      type="success"
      variant="tonal"
      density="comfortable"
      class="mb-3"
    >
      Notificaciones activadas.
    </v-alert>

    <v-alert
      v-if="pushError"
      type="error"
      variant="flat"
      :icon="false"
      density="comfortable"
      class="mb-3 app-error-alert"
    >
      <template #prepend>
        <img :src="circleXIcon" alt="Error" class="app-error-alert__icon" />
      </template>

      {{ pushError }}
    </v-alert>

    <div class="d-flex flex-column ga-2">
      <v-btn
        v-if="pushSupported && !pushEnabled && pushPermission !== 'denied'"
        color="success"
        variant="flat"
        :loading="pushLoading"
        :disabled="loading || pushLoading"
        @click="$emit('enable-push')"
        block
        class="app-button text-white font-weight-bold"
      >
        Activar notificaciones
      </v-btn>

      <v-btn
      v-if="pushSupported && pushEnabled"
        color="cancel"
        variant="flat"
        :loading="pushLoading"
        :disabled="loading || pushLoading"
        @click="$emit('disable-push')"
        block
        class="app-button text-white font-weight-bold"
      >
        Desactivar notificaciones
      </v-btn>

      <v-btn
        v-if="canCancel"
        color="cancel"
        variant="flat"
        :disabled="loading || pushLoading"
        @click="$emit('cancel')"
        block
        class="app-button text-white font-weight-bold"
      >
        Cancelar turno
      </v-btn>
    </div>
  </div>
</template>

<style scoped lang="scss">
.app-error-alert {
  border-radius: 19px;
  background-color: var(--color-error) !important;
  color: var(--color-ultra-dark-wood) !important;
  font-weight: 700;
}

.app-error-alert__icon {
  width: 32px;
  height: 32px;
  display: block;
}

.app-button {
  border-radius: 19px;
  height: 60px !important;
}
</style>
