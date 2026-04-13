<template>
  <CenteredLayout>
    <AppCard title="Estado del turno" subtitle="Sigue tu posición en la cola.">
      <StatusError v-if="error" :error="error" class="mb-3" />

      <StatusLoading v-if="loading" />

      <StatusSummary
       v-if="status && !loading" 
       :status="status" 
       />

      <StatusAlerts
        v-if="status && !loading"
        :canCancel="canCancel"
        :loading="loading"
        :pushSupported="store.pushSupported"
        :pushUnsupportedReason="store.pushUnsupportedReason"
        :pushPermission="store.pushPermission"
        :pushEnabled="store.pushEnabled"
        :pushLoading="store.pushLoading"
        :pushError="store.pushError"
        @cancel="confirmDialog = true"
        @enable-push="onEnablePush"
        @disable-push="onDisablePush"
      />
    </AppCard>

    <ConfirmCancelDialog v-model="confirmDialog" :loading="loading" @confirm="onCancelConfirm" />
  </CenteredLayout>
</template>

<script setup lang="ts">
import { onMounted, watch, computed, onBeforeUnmount, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useTicketSessionStore, initTicketSessionSignalR } from '@/stores/ticketSession'

import AppCard from '@/components/ui/AppCard.vue'
import StatusSummary from '@/components/ticketStatus/StatusSummary.vue'
import StatusError from '@/components/ticketStatus/StatusError.vue'
import StatusLoading from '@/components/ticketStatus/StatusLoading.vue'
import StatusAlerts from '@/components/ticketStatus/StatusAlerts.vue'
import ConfirmCancelDialog from '@/components/ticketStatus/ConfirmCancelDialog.vue'
import CenteredLayout from '@/layouts/CenteredLayout.vue'

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
    await store.syncExistingPushSubscription()
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

async function onEnablePush() {
  if (!publicId.value) return
  await store.enablePushForTicket(publicId.value)
}

async function onDisablePush() {
  if (!publicId.value) return
  await store.disablePushForTicket(publicId.value)
}

watch(publicId, load)
</script>
