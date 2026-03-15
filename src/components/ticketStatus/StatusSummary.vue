<template>
  <div class="d-flex flex-column ga-1">
    <div><strong>Estado:</strong> {{ status.status }}</div>
    <div><strong>Por delante:</strong> {{ status.ahead }}</div>
    <div><strong>Personas en tu grupo:</strong> {{ status.peopleCount }}</div>

    <v-divider class="my-4" />

    <v-alert
      v-if="!pushSupported"
      type="info"
      variant="tonal"
      density="comfortable"
      class="mb-3"
    >
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
      variant="tonal"
      density="comfortable"
      class="mb-3"
    >
      {{ pushError }}
    </v-alert>

    <div class="d-flex flex-column ga-2">
      <v-btn
        v-if="pushSupported && !pushEnabled && pushPermission !== 'denied'"
        color="primary"
        variant="flat"
        :loading="pushLoading"
        :disabled="loading || pushLoading"
        @click="$emit('enable-push')"
        block
      >
        Activar notificaciones
      </v-btn>

      <v-btn
        v-if="pushSupported && pushEnabled"
        color="secondary"
        variant="tonal"
        :loading="pushLoading"
        :disabled="loading || pushLoading"
        @click="$emit('disable-push')"
        block
      >
        Desactivar notificaciones
      </v-btn>

      <v-btn
        v-if="canCancel"
        color="error"
        variant="tonal"
        :disabled="loading || pushLoading"
        @click="$emit('cancel')"
        block
      >
        Cancelar turno
      </v-btn>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { TicketStatusDto } from '@/types/tickets'

defineProps<{
  status: TicketStatusDto
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