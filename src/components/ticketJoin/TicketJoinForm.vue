<template>
  <v-form @submit.prevent="emitSubmit" validate-on="submit">
    <div class="d-flex flex-column ga-3">
      <v-text-field
        v-model.trim="fullName"
        label="Nombre"
        required
        prepend-inner-icon="mdi-account-outline"
        autocomplete="name"
      />

      <div class="d-flex ga-2">
        <v-select
          v-model="phonePrefix"
          :items="phonePrefixes"
          label="Prefijo"
          style="max-width: 130px"
          prepend-inner-icon="mdi-flag-outline"
          density="comfortable"
        />
        <v-text-field
          v-model.trim="phone"
          label="Teléfono"
          type="tel"
          required
          prepend-inner-icon="mdi-phone-outline"
          autocomplete="tel"
          placeholder="600000000"
        />
      </div>

      <v-text-field
        v-model.number="peopleCount"
        label="Personas"
        type="number"
        min="1"
        max="15"
        required
        prepend-inner-icon="mdi-account-group-outline"
      />

      <v-btn
        type="submit"
        color="primary"
        :loading="loading"
        :disabled="loading"
        size="large"
        block
      >
        {{ loading ? 'Creando…' : 'Crear turno' }}
      </v-btn>
    </div>
  </v-form>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{
  loading: boolean
}>()

const emit = defineEmits<{
  (e: 'submit', payload: {
    fullName: string
    phonePrefix: string
    phone: string
    peopleCount: number
  }): void
}>()

const fullName = ref('')
const phonePrefix = ref('+34')
const phone = ref('')
const peopleCount = ref<number>(2)

const phonePrefixes = ['+34', '+33', '+351', '+49', '+44', '+39', '+41', '+43', '+376']

function emitSubmit() {
  emit('submit', {
    fullName: fullName.value,
    phonePrefix: phonePrefix.value,
    phone: phone.value,
    peopleCount: peopleCount.value,
  })
}
</script>
