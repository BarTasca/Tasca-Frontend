<template>
  <section class="p-4 space-y-3">
    <header>
      <h1 class="text-xl font-semibold">Estado del turno</h1>
      <p class="text-sm text-gray-600">Seguimiento de tu posición en la cola.</p>
    </header>

    <p v-if="error" class="text-red-600 text-sm">{{ error }}</p>
    <div v-if="loading" class="text-sm">Cargando…</div>

    <div v-if="status" class="space-y-1">
      <div><strong>Estado:</strong> {{ status.status }}</div>
      <div><strong>Posición:</strong> {{ status.position }}</div>
      <div><strong>Por delante:</strong> {{ status.ahead }}</div>
      <div><strong>Personas en tu grupo:</strong> {{ status.peopleCount }}</div>
      <div>
        <strong>Creado:</strong>
        <time :datetime="status.createdAt">{{ format(status.createdAt) }}</time>
      </div>
      <div v-if="status.notifiedAt">
        <strong>Avisado:</strong>
        <time :datetime="status.notifiedAt">{{ format(status.notifiedAt) }}</time>
      </div>
    </div>

    <div class="flex gap-2">
      <button class="border rounded px-3 py-1" @click="refresh" :disabled="loading">
        Actualizar
      </button>
    </div>
  </section>
</template>

<script setup lang="ts">
import { onMounted, watch, computed, onBeforeUnmount  } from 'vue'
import { useRoute } from 'vue-router'
import { useTicketSessionStore } from '@/stores/ticketSession'
import { initTicketSessionSignalR } from '@/stores/ticketSession';


const route = useRoute()
const store = useTicketSessionStore()
let unsubscribe: null | (() => void) = null;

const publicId = computed(() => String(route.params.publicId ?? ''))
const loading = computed(() => store.loading)
const error = computed(() => store.error)
const status = computed(() => store.status)

onMounted(async () => {
  await load();
  if (publicId.value) {
    unsubscribe = await initTicketSessionSignalR(publicId.value);
  }
});

onBeforeUnmount(() => {
  if (unsubscribe) unsubscribe();
});

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
