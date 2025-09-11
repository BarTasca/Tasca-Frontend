<template>
  <section class="p-4 max-w-md mx-auto space-y-4">
    <header>
      <h1 class="text-xl font-semibold">Unirse a la cola</h1>
      <p class="text-sm text-gray-600">Introduce tus datos para crear tu turno.</p>
    </header>

    <form @submit.prevent="onSubmit" class="space-y-3">
      <div>
        <label class="block text-sm mb-1">Nombre</label>
        <input v-model.trim="FullName" required class="w-full border p-2 rounded" />
      </div>
      <div>
        <label class="block text-sm mb-1">Teléfono</label>
        <input v-model.trim="Phone" type="tel" required class="w-full border p-2 rounded" />
      </div>
      <div>
        <label class="block text-sm mb-1">Personas</label>
        <input
          v-model.number="PeopleCount"
          type="number"
          min="1"
          max="15"
          required
          class="w-full border p-2 rounded"
        />
      </div>

      <button :disabled="loading" class="w-full border p-2 rounded">
        {{ loading ? 'Creando…' : 'Crear turno' }}
      </button>

      <p v-if="error" class="text-red-600 text-sm">{{ error }}</p>
    </form>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useTicketSessionStore } from '@/stores/ticketSession'
import { useRouter } from 'vue-router'

const FullName = ref('')
const Phone = ref('')
const PeopleCount = ref<number>(2)

const loading = ref(false)
const error = ref<string | null>(null)

const store = useTicketSessionStore()
const router = useRouter()

async function onSubmit() {
  loading.value = true
  error.value = null
  try {
    const { publicId } = await store.createAndInit({
      fullName: FullName.value,
      phone: Phone.value,
      peopleCount: PeopleCount.value,
    })
    router.replace({ name: 'ticket.status', params: { publicId } })
  } catch (e: any) {
    error.value = e?.message ?? 'Error al crear el turno'
  } finally {
    loading.value = false
  }
}
</script>
