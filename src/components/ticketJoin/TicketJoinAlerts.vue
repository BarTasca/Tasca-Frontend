<template>
  <div>
    <v-progress-circular v-if="qrValidating" indeterminate class="mb-4" />

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
  color="#e67e22"
  variant="flat"
  style="border-radius: 19px;"
  class="mb-4 text-white font-weight-bold d-flex align-center justify-center"
>
  <template #prepend>
<svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-squirrel-icon lucide-squirrel"><path d="M15.236 22a3 3 0 0 0-2.2-5"/><path d="M16 20a3 3 0 0 1 3-3h1a2 2 0 0 0 2-2v-2a4 4 0 0 0-4-4V4"/><path d="M18 13h.01"/><path d="M18 6a4 4 0 0 0-4 4 7 7 0 0 0-7 7c0-5 4-5 4-10.5a4.5 4.5 0 1 0-9 0 2.5 2.5 0 0 0 5 0C7 10 3 11 3 17c0 2.8 2.2 5 5 5h10"/></svg>
  </template>

  <template v-if="queueAhead.ahead === 0">
    Eres el siguiente
  </template>
  <template v-else>
    {{ queueAhead.ahead }} mesas por delante
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
