<template>
  <v-container class="py-10">
    <v-row justify="center">
      <v-col cols="12" sm="10" md="8" lg="6">
        <v-card rounded="xl" elevation="3" max-width="640" class="mx-auto">
          <v-card-item class="bg-primary text-primary-contrast">
            <v-card-title >Estado del turno</v-card-title>
            <v-card-subtitle>Seguimiento de tu posición en la cola.</v-card-subtitle>
          </v-card-item>

          <v-divider></v-divider>

          <v-card-text>
            <v-alert
              v-if="error"
              type="error"
              variant="tonal"
              density="comfortable"
              class="mb-3"
            >
              {{ error }}
            </v-alert>

            <div v-if="loading" class="d-flex align-center ga-3">
              <v-progress-circular indeterminate size="20"></v-progress-circular>
              <span class="text-body-2">Cargando…</span>
            </div>

            <div v-if="status && !loading" class="d-flex flex-column ga-1">
              <div><strong>Estado:</strong> {{ status.status }}</div>
              <div><strong>Por delante:</strong> {{ status.ahead }}</div>
              <div><strong>Personas en tu grupo:</strong> {{ status.peopleCount }}</div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { onMounted, watch, computed, onBeforeUnmount } from 'vue'
import { useRoute } from 'vue-router'
import { useTicketSessionStore } from '@/stores/ticketSession'
import { initTicketSessionSignalR } from '@/stores/ticketSession'

const route = useRoute()
const store = useTicketSessionStore()
let unsubscribe: null | (() => void) = null

const publicId = computed(() => String(route.params.publicId ?? ''))
const loading = computed(() => store.loading)
const error = computed(() => store.error)
const status = computed(() => store.status)

onMounted(async () => {
  await load()
  if (publicId.value) {
    unsubscribe = await initTicketSessionSignalR(publicId.value)
  }
})

onBeforeUnmount(() => {
  if (unsubscribe) unsubscribe()
})

async function load() {
  if (!publicId.value) return
  await store.fetchStatus(publicId.value)
}

function refresh() {
  load()
}

function format(iso: string): string {
  try {
    const d = new Date(iso)
    return `${d.toLocaleDateString()} ${d.toLocaleTimeString()}`
  } catch {
    return iso
  }
}

watch(publicId, load)
</script>
