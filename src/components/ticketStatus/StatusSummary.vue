<template>
  <div class="d-flex flex-column ga-1">
    <div><strong>Estado:</strong> {{ status.status }}</div>
    <div><strong>Por delante:</strong> {{ status.ahead }}</div>
    <div><strong>Personas en tu grupo:</strong> {{ status.peopleCount }}</div>

    <v-divider class="my-4" />

    <div class="d-flex flex-column ga-2">
      <v-btn
        v-if="canCancel"
        color="error"
        variant="tonal"
        :disabled="loading"
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
}>()

defineEmits<{
  (e: 'cancel'): void
}>()
</script>
