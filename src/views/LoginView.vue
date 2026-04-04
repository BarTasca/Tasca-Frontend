<template>
  <CenteredLayout>
    <AppCard
      title="Acceso staff"
      subtitle="Introduce tus credenciales para entrar al panel"
      :maxWidth="480"
    >
      <AuthErrorAlert :error="error" />

      <AuthLoginForm :loading="loading" @submit="handleSubmit" />
    </AppCard>
  </CenteredLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter, useRoute } from 'vue-router'

import AppCard from '@/components/ui/AppCard.vue'
import AuthLoginForm from '@/components/auth/AuthLoginForm.vue'
import AuthErrorAlert from '@/components/auth/AuthErrorAlert.vue'
import CenteredLayout from '@/layouts/CenteredLayout.vue'

const loading = ref(false)
const error = ref<string | null>(null)

const auth = useAuthStore()
const router = useRouter()
const route = useRoute()

async function handleSubmit(payload: { email: string; password: string }) {
  loading.value = true
  error.value = null
  try {
    await auth.login(payload)
    const redirect = (route.query.redirect as string) || '/staff'
    router.replace(redirect)
  } catch (e: any) {
    error.value = e?.message ?? 'Error de autenticación'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-view {
  min-height: 0;
  overflow: hidden;
}
</style>
