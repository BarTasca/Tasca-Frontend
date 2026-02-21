<template>
  <DisplayLayout>
    <AppCard
      :maxWidth="640"
      title="Escanea para unirte a la cola"
      subtitle="El QR se renueva automáticamente."
    >
      <DisplayQrBlock
        :loading="loading"
        :error="error"
        :qrDataUrl="qrDataUrl"
        :expiresInSec="expiresInSec"
      />

      <template #actions>
        <DisplayFooter>
          <span class="text-caption">Mantén esta pantalla visible en la vitrina.</span>
        </DisplayFooter>
      </template>
    </AppCard>
  </DisplayLayout>
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref } from 'vue'
import { useRouter } from 'vue-router'
import QRCode from 'qrcode'
import AppCard from '@/components/ui/AppCard.vue'
import DisplayLayout from '@/components/display/DisplayLayout.vue'
import DisplayHeader from '@/components/display/DisplayHeader.vue'
import DisplayQrBlock from '@/components/display/DisplayQrBlock.vue'
import DisplayFooter from '@/components/display/DisplayFooter.vue'
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
    qrDataUrl.value = await QRCode.toDataURL(joinUrl, { margin: 1, width: 420 })

    const expiresMs = Date.parse(expiresAtUtc)
    const nowMs = Date.now()
    const msLeft = Math.max(0, expiresMs - nowMs)

    expiresInSec.value = Math.ceil(msLeft / 1000)
    countdownTimer = window.setInterval(() => {
      if (expiresInSec.value === null) return
      expiresInSec.value = Math.max(0, expiresInSec.value - 1)
    }, 1000)

    const refreshIn = Math.max(1000, msLeft - 3000)
    refreshTimer = window.setTimeout(() => loadAndSchedule(), refreshIn)
  } catch (e: any) {
    error.value = e?.message ?? 'No se pudo cargar el QR'
  } finally {
    loading.value = false
  }
}

onMounted(() => loadAndSchedule())
onBeforeUnmount(() => clearTimers())
</script>
