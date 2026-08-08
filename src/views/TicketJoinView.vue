<template>
  <div v-if="store.isServiceOpen === null" class="text-center py-6">
    <v-progress-circular indeterminate />
  </div>

  <CenteredLayout v-else>
    <TicketJoinHeader>
      <TicketJoinAlerts
        :isServiceOpen="store.isServiceOpen"
        :qrValidating="qrValidating"
        :qrError="qrError"
        :submitError="store.error"
        :queueAhead="store.queueAhead"
      />

      <TicketJoinForm
        v-if="qrValid"
        :loading="loading"
        @submit="handleSubmit"
      />
    </TicketJoinHeader>
  </CenteredLayout>
  <ConfirmDialog
    v-model="showFoodOnlyNotice"
    title="Aviso importante"
    confirmText="Entendido"
    hideCancel
    @confirm="showFoodOnlyNotice = false"
  >
    <p class="food-only-notice">
      <span class="food-only-notice__normal">Las mesas son exclusivamente para comidas y cenas</span><br />
      <span class="food-only-notice__alert">Si es para picar no te apuntes</span>
    </p>
  </ConfirmDialog>

  <ConfirmDialog
    v-model="showServiceClosedDialog"
    title="Servicio cerrado"
    confirmText="Entendido"
    hideCancel
    @confirm="showServiceClosedDialog = false"
  >
    El servicio está cerrado en este momento.
  </ConfirmDialog>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useTicketSessionStore } from '@/stores/ticketSession'
import { useRouter, useRoute } from 'vue-router'
import { apiFetch, ApiError } from '@/lib/http'
import { persistTicketPublicId } from '@/services/tickets'

import TicketJoinHeader from '@/components/ticketJoin/TicketJoinHeader.vue'
import TicketJoinAlerts from '@/components/ticketJoin/TicketJoinAlerts.vue'
import TicketJoinForm from '@/components/ticketJoin/TicketJoinForm.vue'
import CenteredLayout from '@/layouts/CenteredLayout.vue'
import ConfirmDialog from '@/components/common/ConfirmDialog.vue'

const store = useTicketSessionStore()
const router = useRouter()
const route = useRoute()

const loading = ref(false)

const qrValidating = ref(false)
const qrValid = ref(false)
const qrError = ref<string | null>(null)

const showFoodOnlyNotice = ref(true)
const showServiceClosedDialog = ref(false)

let cleanupPublicSignalR: (() => void | Promise<void>) | null = null

onMounted(async () => {
  await store.loadServiceState()

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

    if (store.isServiceOpen === true) {
      await store.loadQueueAhead()
      cleanupPublicSignalR = await store.initPublicQueueSignalR()
    }
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
  store.error = null

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

    if (!created) {
      if (store.blockedByClosedService) showServiceClosedDialog.value = true
      return
    }

    persistTicketPublicId(created.publicId)
    router.replace({ name: 'ticket.status', params: { publicId: created.publicId } })
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

<style scoped>
.food-only-notice {
  margin: 0;
  font-size: 1.6rem;
  font-weight: 800;
  line-height: 1.25;
  color: var(--color-ultra-dark-wood);
}

.food-only-notice__alert {
  color: red;
}
</style>
