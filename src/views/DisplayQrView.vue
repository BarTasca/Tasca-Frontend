<template>
  <v-container class="py-8">
    <v-row justify="center">
      <v-col cols="12" sm="10" md="6" lg="5">
        <AppCard
          title="Escanea para unirte a la cola"
          subtitle="El QR se renueva automáticamente."
          :maxWidth="640"
        >
          <div class="d-flex flex-column align-center ga-4">
            <v-progress-circular v-if="loading" indeterminate />

            <v-alert v-if="error" type="error" variant="tonal" density="comfortable" class="w-100">
              {{ error }}
            </v-alert>

            <img
              v-if="qrDataUrl && !loading"
              :src="qrDataUrl"
              alt="QR para unirse"
              style="width: 320px; max-width: 100%; border-radius: 12px;"
            />

            <div v-if="expiresInSec !== null" class="text-caption">
              Renueva en ~{{ expiresInSec }}s
            </div>
          </div>
        </AppCard>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref } from 'vue'
import { useRouter } from 'vue-router'
import QRCode from 'qrcode'
import AppCard from '@/components/common/AppCard.vue'
import { getCurrentQrToken } from '@/services/qr'

const router = useRouter()

const loading = ref(true)
const error = ref<string | null>(null)

const qrDataUrl = ref<string | null>(null)
const expiresInSec = ref<number | null>(null)

let refreshTimer: number | null = null
let countdownTimer: number | null = null

function clearTimers() {
  if (refreshTimer !== null) {
    window.clearTimeout(refreshTimer)
    refreshTimer = null
  }
  if (countdownTimer !== null) {
    window.clearInterval(countdownTimer)
    countdownTimer = null
  }
}

function buildJoinUrl(qt: string): string {
  const base = window.location.origin
  const joinPath = router.resolve({ name: 'ticket.join' }).href
  const url = new URL(joinPath, base)
  url.searchParams.set('qt', qt)
  return url.toString()
}

async function loadAndSchedule() {
  clearTimers()
  loading.value = true
  error.value = null

  try {
    const { token, expiresAtUtc } = await getCurrentQrToken()

    const joinUrl = buildJoinUrl(token)
    qrDataUrl.value = await QRCode.toDataURL(joinUrl, {
      margin: 1,
      width: 420,
    })

    const expiresMs = Date.parse(expiresAtUtc)
    const nowMs = Date.now()
    const msLeft = Math.max(0, expiresMs - nowMs)

    // countdown visual (opcional, pero útil en vitrina)
    expiresInSec.value = Math.ceil(msLeft / 1000)
    countdownTimer = window.setInterval(() => {
      if (expiresInSec.value === null) return
      expiresInSec.value = Math.max(0, expiresInSec.value - 1)
    }, 1000)

    // refresca un poco antes de expirar para evitar “casi caducado”
    const refreshIn = Math.max(1000, msLeft - 3000)
    refreshTimer = window.setTimeout(() => {
      loadAndSchedule()
    }, refreshIn)
  } catch (e: any) {
    error.value = e?.message ?? 'No se pudo cargar el QR'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadAndSchedule()
})

onBeforeUnmount(() => {
  clearTimers()
})
</script>
