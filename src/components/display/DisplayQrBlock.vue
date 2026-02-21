<template>
  <div class="qr-block">
    <div class="qr-body">
      <v-progress-circular v-if="loading" indeterminate />

      <v-alert
        v-else-if="error"
        type="error"
        variant="tonal"
        density="comfortable"
        class="w-100"
      >
        {{ error }}
      </v-alert>

      <img
        v-else-if="qrDataUrl"
        :src="qrDataUrl"
        alt="QR para unirse"
        class="qr-image"
      />

      <div v-if="expiresInSec !== null && !loading" class="qr-countdown">
        Renueva en ~{{ expiresInSec }}s
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  loading: boolean
  error: string | null
  qrDataUrl: string | null
  expiresInSec: number | null
}>()
</script>

<style scoped>
.qr-block {
  display: flex;
  justify-content: center;
}

.qr-body {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 14px;
  align-items: center;
}

.qr-image {
  width: 320px;
  max-width: 100%;
  border-radius: 12px;
}

.qr-countdown {
  font-size: 12px;
  opacity: 0.9;
}
</style>
