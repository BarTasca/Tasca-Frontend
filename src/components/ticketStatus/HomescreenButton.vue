<template>
  <div class="d-flex flex-column ga-2">
    <v-btn
      color="success"
      variant="flat"
      :loading="installing"
      :disabled="!deferredPrompt || installing || alreadyInstalled"
      @click="installApp"
      block
      class="app-button text-white font-weight-bold"
    >
      Añadir a inicio
    </v-btn>

    <v-alert
      v-if="alreadyInstalled"
      type="success"
      variant="tonal"
      density="comfortable"
    >
      Esta pantalla ya está añadida al inicio en este dispositivo.
    </v-alert>

    <v-alert
      v-else-if="!deferredPrompt"
      type="info"
      variant="tonal"
      density="comfortable"
    >
      La opción de instalación no está disponible todavía en este navegador.
    </v-alert>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[]
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed'
    platform: string
  }>
  prompt(): Promise<void>
}

const deferredPrompt = ref<BeforeInstallPromptEvent | null>(null)
const installing = ref(false)
const alreadyInstalled = ref(false)
const route = useRoute()
let dynamicManifestUrl: string | null = null
let originalManifestHref: string | null = null

function getInstallStorageKey(): string | null {
  const publicId = String(route.params.publicId ?? '').trim()
  if (!publicId) return null
  return `pwa.installed.ticket.${publicId}`
}

function isStandaloneMode(): boolean {
  const byDisplayMode = window.matchMedia('(display-mode: standalone)').matches
  const byIosFlag = (window.navigator as Navigator & { standalone?: boolean }).standalone === true
  return byDisplayMode || byIosFlag
}

function markInstalled(): void {
  alreadyInstalled.value = true
  deferredPrompt.value = null

  const key = getInstallStorageKey()
  if (key) {
    localStorage.setItem(key, '1')
  }
}

const handleInstallPrompt = (e: Event) => {
  e.preventDefault()
  deferredPrompt.value = e as BeforeInstallPromptEvent
}

async function setTicketManifestStartUrl(): Promise<void> {
  const publicId = String(route.params.publicId ?? '').trim()
  if (!publicId) return

  const manifestLink = document.querySelector<HTMLLinkElement>('link[rel="manifest"]')
  if (!manifestLink) return

  if (originalManifestHref === null) {
    originalManifestHref = manifestLink.getAttribute('href')
  }

  const response = await fetch('/manifest.json', { cache: 'no-store' })
  if (!response.ok) return

  const manifest = (await response.json()) as Record<string, unknown>
  manifest.start_url = `/ticket/${encodeURIComponent(publicId)}`

  const blob = new Blob([JSON.stringify(manifest)], { type: 'application/manifest+json' })

  if (dynamicManifestUrl) {
    URL.revokeObjectURL(dynamicManifestUrl)
  }

  dynamicManifestUrl = URL.createObjectURL(blob)
  manifestLink.href = dynamicManifestUrl
}

onMounted(() => {
  window.addEventListener('beforeinstallprompt', handleInstallPrompt)
  window.addEventListener('appinstalled', markInstalled)

  const key = getInstallStorageKey()
  if (key && localStorage.getItem(key) === '1') {
    alreadyInstalled.value = true
  }

  if (isStandaloneMode()) {
    markInstalled()
  }

  void setTicketManifestStartUrl()
})

onUnmounted(() => {
  window.removeEventListener('beforeinstallprompt', handleInstallPrompt)
  window.removeEventListener('appinstalled', markInstalled)

  const manifestLink = document.querySelector<HTMLLinkElement>('link[rel="manifest"]')
  if (manifestLink && originalManifestHref) {
    manifestLink.href = originalManifestHref
  }

  if (dynamicManifestUrl) {
    URL.revokeObjectURL(dynamicManifestUrl)
    dynamicManifestUrl = null
  }

  originalManifestHref = null
})

const installApp = async () => {
  if (!deferredPrompt.value || alreadyInstalled.value) return

  installing.value = true
  try {
    const promptEvent = deferredPrompt.value
    deferredPrompt.value = null

    await promptEvent.prompt()
    const { outcome } = await promptEvent.userChoice

    if (outcome === 'accepted') {
      markInstalled()
    }
  } finally {
    installing.value = false
  }
}
</script>

<style scoped>
.app-button {
  border-radius: 19px;
  height: 60px !important;
}
</style>