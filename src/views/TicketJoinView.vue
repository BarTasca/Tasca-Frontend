<template>
  <div v-if="store.isServiceOpen === null" class="text-center py-6">
    <v-progress-circular indeterminate />
  </div>

  <v-container v-else fluid class="pa-0 mt-6 d-flex flex-column flex-grow-1">
    <TicketJoinHeader class="flex-grow-1">
      <TicketJoinAlerts
        :isServiceOpen="store.isServiceOpen"
        :qrValidating="qrValidating"
        :qrError="qrError"
        :submitError="error"
        :queueAhead="store.queueAhead"
      />

      <TicketJoinForm
        v-if="store.isServiceOpen === true && qrValid"
        :loading="loading"
        @submit="handleSubmit"
      />
    </TicketJoinHeader>
  </v-container>
</template>


<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useTicketSessionStore } from '@/stores/ticketSession'
import { useRouter, useRoute } from 'vue-router'
import { apiFetch, ApiError } from '@/lib/http'

import TicketJoinHeader from '@/components/ticketJoin/TicketJoinHeader.vue'
import TicketJoinAlerts from '@/components/ticketJoin/TicketJoinAlerts.vue'
import TicketJoinForm from '@/components/ticketJoin/TicketJoinForm.vue'

const store = useTicketSessionStore()
const router = useRouter()
const route = useRoute()

const loading = ref(false)
const error = ref<string | null>(null)

const qrValidating = ref(false)
const qrValid = ref(false)
const qrError = ref<string | null>(null)

let cleanupPublicSignalR: (() => void | Promise<void>) | null = null

onMounted(async () => {
  await store.loadServiceState()
  if (store.isServiceOpen !== true) return

  const qt = getQrTokenFromUrl()
  if (!qt) {
    qrError.value = 'QR no detectado. Escanea el QR de la pantalla del bar.'
    return
  }

  qrValidating.value = true
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

async function handleSubmit(payload: any) {
  loading.value = true
  error.value = null

  try {
    const qrToken = getQrTokenFromUrl()
    if (!qrToken) {
      qrError.value = 'Falta el QR. Vuelve a escanear el QR.'
      return
    }

    const created = await store.createAndInit({
      fullName: payload.fullName,
      phone: `${payload.phonePrefix} ${payload.phone}`,
      peopleCount: payload.peopleCount,
      qrToken,
    })

    if (!created) return

    router.replace({ name: 'ticket.status', params: { publicId: created.publicId } })
  } catch (e: any) {
    error.value = e?.message ?? 'Error al crear el turno'
  } finally {
    loading.value = false
  }
}

function getQrTokenFromUrl(): string | null {
  const qt = route.query.qt
  return typeof qt === 'string' && qt.trim() ? qt.trim() : null
}

async function validateQrToken(token: string): Promise<boolean> {
  try {
    await apiFetch(`/api/Qr/validate?token=${encodeURIComponent(token)}`)
    return true
  } catch (e: any) {
    if (e instanceof ApiError) return false
    return false
  }
}
</script>
