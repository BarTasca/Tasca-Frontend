<template>
  <div class="d-flex flex-column ga-2">
    <v-btn
      color="success"
      variant="flat"
      :loading="installing"
      :disabled="!deferredPrompt || installing"
      @click="installApp"
      block
      class="app-button text-white font-weight-bold"
    >
      Añadir a inicio
    </v-btn>

    <v-alert
      v-if="!deferredPrompt"
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
const route = useRoute()
let dynamicManifestUrl: string | null = null
let originalManifestHref: string | null = null

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
  void setTicketManifestStartUrl()
})

onUnmounted(() => {
  window.removeEventListener('beforeinstallprompt', handleInstallPrompt)

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
  if (!deferredPrompt.value) return

  installing.value = true
  try {
    deferredPrompt.value.prompt()
    const { outcome } = await deferredPrompt.value.userChoice

    if (outcome === 'accepted') {
      deferredPrompt.value = null
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