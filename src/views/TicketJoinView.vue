<template>
  <div v-if="store.isServiceOpen === null" class="text-center py-6">
    <v-progress-circular indeterminate />
  </div>

  <v-container v-else class="py-8">
    <v-alert
      v-if="store.error && store.isServiceOpen === false"
      type="error"
      variant="tonal"
      density="comfortable"
      class="mb-4"
    >
      {{ store.error }}
    </v-alert>
    <v-row justify="center">
      <v-col cols="12" sm="10" md="6" lg="4">
        <AppCard
          title="Unirse a la cola"
          subtitle="Introduce tus datos para crear tu turno."
          :maxWidth="640"
        >
          <v-progress-circular v-if="qrValidating" indeterminate class="mb-4" />

          <v-alert
            v-if="store.isServiceOpen === true && !qrValidating && qrError"
            type="error"
            variant="tonal"
            density="comfortable"
            class="mb-4"
          >
            {{ qrError }}
          </v-alert>

          <v-alert
            v-if="store.isServiceOpen === false"
            type="warning"
            variant="tonal"
            density="comfortable"
            class="mb-4"
          >
            El servicio está cerrado en este momento.
          </v-alert>

          <v-alert
            v-if="error && store.isServiceOpen !== false"
            type="error"
            variant="tonal"
            density="comfortable"
            class="mb-4"
          >
            {{ error }}
          </v-alert>

          <v-alert
            v-if="store.isServiceOpen === true && store.queueAhead"
            type="info"
            variant="tonal"
            density="comfortable"
            class="mb-4"
          >
            <template v-if="store.queueAhead.ahead === 0"> Eres el siguiente </template>
            <template v-else> Tienes {{ store.queueAhead.ahead }} por delante </template>
          </v-alert>

          <!-- <div class="text-caption mb-2">
            isServiceOpen: {{ store.isServiceOpen }} | serviceClosed: {{ store.serviceClosed }}
          </div> -->

          <v-form
            v-if="store.isServiceOpen === true && qrValid"
            @submit.prevent="onSubmit"
            validate-on="submit"
          >
            <div class="d-flex flex-column ga-3">
              <v-text-field
                v-model.trim="FullName"
                label="Nombre"
                required
                prepend-inner-icon="mdi-account-outline"
                autocomplete="name"
              />

              <div class="d-flex ga-2">
                <v-select
                  v-model="PhonePrefix"
                  :items="phonePrefixes"
                  label="Prefijo"
                  class="flex-0-0"
                  style="max-width: 130px"
                  prepend-inner-icon="mdi-flag-outline"
                  density="comfortable"
                />
                <v-text-field
                  v-model.trim="Phone"
                  label="Teléfono"
                  type="tel"
                  required
                  prepend-inner-icon="mdi-phone-outline"
                  autocomplete="tel"
                  class="flex-1-1"
                  :placeholder="'600000000'"
                />
              </div>

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
import { apiFetch, ApiError } from '@/lib/http'

import { onMounted, ref, onUnmounted } from 'vue'
import { useTicketSessionStore } from '@/stores/ticketSession'
import { useRouter } from 'vue-router'
import { useRoute } from 'vue-router'
import AppCard from '@/components/ui/AppCard.vue'
import { getQueueAhead } from '@/services/tickets'

const FullName = ref('')
const PhonePrefix = ref('+34')
const Phone = ref('')
const PeopleCount = ref<number>(2)

const loading = ref(false)
const error = ref<string | null>(null)

const qrValidating = ref(false)
const qrValid = ref(false)
const qrError = ref<string | null>(null)

let cleanupPublicSignalR: (() => void | Promise<void>) | null = null

const phonePrefixes = ['+34', '+33', '+351', '+49', '+44', '+39', '+41', '+43']

const store = useTicketSessionStore()
const router = useRouter()
const route = useRoute()

onMounted(async () => {
  await store.loadServiceState()
  if (store.isServiceOpen !== true) return

  const qt = getQrTokenFromUrl()
  if (!qt) {
    qrValid.value = false
    qrError.value = 'QR no detectado. Escanea el QR de la pantalla del bar.'
    return
  }

  qrValidating.value = true
  qrError.value = null
  try {
    const ok = await validateQrToken(qt)
    qrValid.value = ok
    if (!ok) {
      qrError.value = 'QR caducado. Escanea el QR actual de la pantalla del bar.'
      return
    }

    await store.loadQueueAhead()
    cleanupPublicSignalR = await store.initPublicQueueSignalR()
  } finally {
    qrValidating.value = false
  }
})

onUnmounted(async () => {
  if (cleanupPublicSignalR) {
    await cleanupPublicSignalR()
    cleanupPublicSignalR = null
  }
})

async function onSubmit() {
  loading.value = true
  error.value = null
  try {
    const phoneE164Like = `${PhonePrefix.value} ${Phone.value}`.trim()

    const qrToken = getQrTokenFromUrl()
    if (!qrToken) {
      error.value = 'Falta el QR. Vuelve a escanear el QR de la pantalla.'
      return
    }

    const created = await store.createAndInit({
      fullName: FullName.value,
      phone: phoneE164Like,
      peopleCount: PeopleCount.value,
      qrToken,
    })

    if (!created) {
      if (store.error?.toLowerCase().includes('qr')) {
        qrValid.value = false
        qrError.value = store.error
      }
      return
    }

    router.replace({ name: 'ticket.status', params: { publicId: created.publicId } })
  } catch (e: any) {
    if (store.isServiceOpen === false) return

    const message = e?.message ?? 'Error al crear el turno'

    if (message.toLowerCase().includes('qr')) {
      qrValid.value = false
      qrError.value = message
      return
    }

    error.value = message
  } finally {
    loading.value = false
  }
}

function getQrTokenFromUrl(): string | null {
  const qt = route.query.qt
  if (typeof qt === 'string' && qt.trim()) return qt.trim()
  return null
}

async function validateQrToken(token: string): Promise<boolean> {
  try {
    await apiFetch(`/api/Qr/validate?token=${encodeURIComponent(token)}`, { method: 'GET' })
    return true
  } catch (e: any) {
    if (e instanceof ApiError) {
      const code = (e.body as any)?.code
      if (e.status === 410 && code === 'QR_EXPIRED') return false
      if (e.status === 400 && code === 'QR_TOKEN_REQUIRED') return false
    }
    return false
  }
}
</script>
