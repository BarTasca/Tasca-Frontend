<template>
  <v-container class="py-8">
    <v-row justify="center">
      <v-col cols="12" sm="10" md="6" lg="4">
        <v-card rounded="xl" elevation="3">
          <AuthCardHeader
            title="Acceso staff"
            subtitle="Introduce tus credenciales para entrar al panel"
          />
          <v-divider />

          <v-card-text>
            <v-alert
              v-if="error"
              type="error"
              variant="tonal"
              density="comfortable"
              class="mb-4"
            >
              {{ error }}
            </v-alert>

            <v-form @submit.prevent="onSubmit" validate-on="submit">
              <div class="d-flex flex-column ga-3">
                <v-text-field
                  v-model.trim="email"
                  label="Email"
                  type="email"
                  autocomplete="username"
                  required
                  prepend-inner-icon="mdi-email-outline"
                />

                <v-text-field
                  v-model="password"
                  :type="showPass ? 'text' : 'password'"
                  label="Password"
                  autocomplete="current-password"
                  required
                  prepend-inner-icon="mdi-lock-outline"
                  :append-inner-icon="showPass ? 'mdi-eye-off' : 'mdi-eye'"
                  @click:append-inner="showPass = !showPass"
                />

                <v-btn
                  type="submit"
                  :loading="loading"
                  :disabled="loading"
                  color="primary"
                  size="large"
                  block
                >
                  {{ loading ? 'Entrando…' : 'Entrar' }}
                </v-btn>
              </div>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter, useRoute } from 'vue-router'
import AuthCardHeader from '@/components/auth/AuthCardHeader.vue'

const email = ref('')
const password = ref('')
const showPass = ref(false)
const loading = ref(false)
const error = ref<string | null>(null)

const auth = useAuthStore()
const router = useRouter()
const route = useRoute()

async function onSubmit() {
  loading.value = true
  error.value = null
  try {
    await auth.login({ email: email.value, password: password.value })
    const redirect = (route.query.redirect as string) || '/staff'
    router.replace(redirect)
  } catch (e: any) {
    error.value = e?.message ?? 'Error de autenticación'
  } finally {
    loading.value = false
  }
}
</script>
