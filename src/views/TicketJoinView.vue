<template>
  <v-container class="py-8">
    <v-row justify="center">
      <v-col cols="12" sm="10" md="6" lg="4">
        <AppCard
          title="Unirse a la cola"
          subtitle="Introduce tus datos para crear tu turno."
          :maxWidth="640"
        >
          <v-alert
            v-if="error"
            type="error"
            variant="tonal"
            density="comfortable"
            class="mb-4"
          >
            {{ error }}
          </v-alert>

          <v-form @submit.prevent="onSubmit" validate-on="submit">
            <div class="d-flex flex-column ga-3">
              <v-text-field
                v-model.trim="FullName"
                label="Nombre"
                required
                prepend-inner-icon="mdi-account-outline"
                autocomplete="name"
              />

              <v-text-field
                v-model.trim="Phone"
                label="Teléfono"
                type="tel"
                required
                prepend-inner-icon="mdi-phone-outline"
                autocomplete="tel"
              />

              <v-text-field
                v-model.number="PeopleCount"
                label="Personas"
                type="number"
                min="1"
                max="15"
                required
                prepend-inner-icon="mdi-account-group-outline"
              />

              <v-btn
                type="submit"
                color="primary"
                :loading="loading"
                :disabled="loading"
                size="large"
                block
              >
                {{ loading ? 'Creando…' : 'Crear turno' }}
              </v-btn>
            </div>
          </v-form>
        </AppCard>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useTicketSessionStore } from '@/stores/ticketSession'
import { useRouter } from 'vue-router'
import AppCard from '@/components/common/AppCard.vue'

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
