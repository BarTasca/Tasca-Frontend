<template>
  <section class="max-w-md mx-auto p-4">
    <h1 class="text-xl font-semibold mb-4">Acceso staff</h1>

    <form @submit.prevent="onSubmit" class="space-y-3">
      <div>
        <label class="block text-sm mb-1">Email</label>
        <input v-model.trim="email" type="email" required class="w-full border p-2 rounded" />
      </div>
      <div>
        <label class="block text-sm mb-1">Password</label>
        <input v-model="password" type="password" required class="w-full border p-2 rounded" />
      </div>

      <button :disabled="loading" class="w-full border p-2 rounded">
        {{ loading ? 'Entrando…' : 'Entrar' }}
      </button>

      <p v-if="error" class="text-red-600 text-sm">{{ error }}</p>
    </form>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useRouter, useRoute } from 'vue-router';

const email = ref('');
const password = ref('');
const loading = ref(false);
const error = ref<string | null>(null);

const auth = useAuthStore();
const router = useRouter();
const route = useRoute();

async function onSubmit() {
  loading.value = true;
  error.value = null;
  try {
    await auth.login({ email: email.value, password: password.value });
    const redirect = (route.query.redirect as string) || '/staff';
    router.replace(redirect);
  } catch (e: any) {
    error.value = e?.message ?? 'Error de autenticación';
  } finally {
    loading.value = false;
  }
}
</script>
