<template>
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
</template>

<script setup lang="ts">
import { ref } from 'vue'

defineProps<{ loading: boolean }>()

const emit = defineEmits<{
  (e: 'submit', payload: { email: string; password: string }): void
}>()

const email = ref('')
const password = ref('')
const showPass = ref(false)

function onSubmit() {
  emit('submit', { email: email.value, password: password.value })
}
</script>
