<template>
  <v-container class="py-10">
    <v-row justify="center">
      <v-col cols="12" sm="10" md="8" lg="6">
        <v-card rounded="xl" elevation="3" max-width="640" class="mx-auto">
          <v-card-item class="bg-primary text-primary-contrast">
            <v-card-title>Estado del turno</v-card-title>
            <v-card-subtitle>Seguimiento de tu posición en la cola.</v-card-subtitle>
          </v-card-item>

          <v-divider />

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
              <v-progress-circular indeterminate size="20" />
              <span class="text-body-2">Cargando…</span>
            </div>

            <div v-if="status && !loading" class="d-flex flex-column ga-1">
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
                  @click="confirmDialog = true"
                  block
                >
                  Cancelar turno
                </v-btn>
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-dialog v-model="confirmDialog" max-width="420">
      <v-card>
        <v-card-title class="text-h6">Confirmar cancelación</v-card-title>
        <v-card-text>
          ¿Seguro que quieres cancelar tu turno? Si cancelas, perderás tu posición en la cola.
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn variant="text" @click="confirmDialog = false" :disabled="loading">Volver</v-btn>
          <v-btn color="error" @click="onCancelConfirm" :loading="loading">
            Cancelar turno
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup lang="ts">
import { onMounted, watch, computed, onBeforeUnmount, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useTicketSessionStore } from '@/stores/ticketSession'
import { initTicketSessionSignalR } from '@/stores/ticketSession'

const route = useRoute()
const store = useTicketSessionStore()
let unsubscribe: null | (() => void) = null

const confirmDialog = ref(false)

const publicId = computed(() => String(route.params.publicId ?? ''))
const loading = computed(() => store.loading)
const error = computed(() => store.error)
const status = computed(() => store.status)

const canCancel = computed(() => {
  const s = status.value?.status?.toLowerCase?.() ?? ''
  return s === 'waiting' || s === 'notified'
})

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

async function onCancelConfirm() {
  if (!publicId.value) return
  try {
    await store.cancelByClient(publicId.value)
    confirmDialog.value = false
  } catch {}
}

watch(publicId, load)
</script>
