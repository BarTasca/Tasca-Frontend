<script setup lang="ts">
import { ref } from 'vue'
import SubmitButton from '../common/SubmitButton.vue'
import { Mail, LockKeyhole, Eye, EyeOff } from 'lucide-vue-next'

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

<template>
  <v-form @submit.prevent="onSubmit" validate-on="submit">
    <div class="d-flex flex-column ga-3">
      <v-text-field
        v-model.trim="email"
        placeholder="Email"
        persistent-placeholder
        variant="solo-filled"
        flat
        type="email"
        bg-color="wood"
        autocomplete="username"
        required
        class="custom-input center-input"
      >
        <template #prepend-inner>
          <Mail class="lucide-icon" />
        </template>
      </v-text-field>

      <v-text-field
        v-model="password"
        :type="showPass ? 'text' : 'password'"
        placeholder="Contraseña"
        persistent-placeholder
        autocomplete="current-password"
        variant="solo-filled"
        flat
        bg-color="wood"
        required
        class="custom-input center-input"
      >
        <!-- Candado -->
        <template #prepend-inner>
          <LockKeyhole class="lucide-icon" />
        </template>

        <!-- Ojo -->
        <template #append-inner>
          <component
            :is="showPass ? EyeOff : Eye"
            class="lucide-icon clickable"
            @click="showPass = !showPass"
          />
        </template>
      </v-text-field>

      <SubmitButton text="Entrar" loading-text="entrando" :loading="loading" />
    </div>
  </v-form>
</template>

<style scoped>

.lucide-icon {
  opacity: 0.5;
}

.clickable {
  cursor: pointer;
}

.v-field__prepend-inner,
.v-field__append-inner {
  display: flex;
  align-items: center;
}

:deep(.v-field) {
  border-radius: 19px !important;
}

:deep(.custom-input .v-field__input) {
  color: var(--color-dark-wood) !important;
  font-weight: 700;
  opacity: 1;
}

:deep(.v-field__prepend-inner) {
  color: var(--color-dark-wood) !important;
  align-items: center;
  padding-top: 0;
  opacity: 1;
}

:deep(.center-input .v-field__input) {
  text-align: center;
  padding-right: 45px;
}

:deep(.v-field--variant-solo-filled) {
  box-shadow: none !important;
}

:deep(input::-webkit-outer-spin-button),
:deep(input::-webkit-inner-spin-button) {
  -webkit-appearance: none;
  margin: 0;
}

:deep(.v-select .v-field__append-inner) {
  display: none;
}
</style>
