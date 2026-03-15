<template>
  <div>
    <v-progress-circular
      v-if="qrValidating"
      indeterminate
      class="mb-4"
    />

    <v-alert
      v-if="isServiceOpen === true && !qrValidating && qrError"
      type="error"
      variant="tonal"
      density="comfortable"
      class="mb-4"
    >
      {{ qrError }}
    </v-alert>

    <v-alert
      v-if="isServiceOpen === false"
      type="warning"
      variant="tonal"
      density="comfortable"
      class="mb-4"
    >
      El servicio está cerrado en este momento.
    </v-alert>

    <v-alert
      v-if="submitError && isServiceOpen !== false"
      type="error"
      variant="tonal"
      density="comfortable"
      class="mb-4"
    >
      {{ submitError }}
    </v-alert>

    <v-alert
      v-if="isServiceOpen === true && queueAhead"
      type="info"
      variant="tonal"
      density="comfortable"
      class="mb-4"
    >
      <template v-if="queueAhead.ahead === 0">
        Eres el siguiente
      </template>
      <template v-else>
        Tienes {{ queueAhead.ahead }} por delante
      </template>
    </v-alert>
  </div>
</template>

<script setup lang="ts">
import type { QueueAheadDto } from '@/types/queue'

defineProps<{
  isServiceOpen: boolean | null
  qrValidating: boolean
  qrError: string | null
  submitError: string | null
  queueAhead: QueueAheadDto | null
}>()
</script>
