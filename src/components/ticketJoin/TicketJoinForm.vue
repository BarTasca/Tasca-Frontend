<template>
  <v-form @submit.prevent="emitSubmit" validate-on="submit">
    <div class="d-flex flex-column ga-3">
      
      <v-text-field
        v-model.trim="fullName"
        placeholder="Nombre"
        persistent-placeholder
        variant="solo-filled"
        flat
        bg-color="wood"
        class="custom-input center-input"
        hide-details
      >
        <template #prepend-inner>
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/><path d="m15 5 4 4"/></svg>
        </template>
      </v-text-field>

      <div class="d-flex ga-2">
        <v-select
          v-model="phonePrefix"
          :items="phonePrefixes"
          variant="solo-filled"
          flat
          bg-color="wood"
          style="max-width: 120px"
          class="custom-input prefix-input"
          hide-details
        >
          <template #prepend-inner>
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 22V4a1 1 0 0 1 .4-.8A6 6 0 0 1 8 2c3 0 5 2 7.333 2q2 0 3.067-.8A1 1 0 0 1 20 4v10a1 1 0 0 1-.4.8A6 6 0 0 1 16 16c-3 0-5-2-8-2a6 6 0 0 0-4 1.528"/></svg>
          </template>
        </v-select>

        <v-text-field
          v-model.trim="phone"
          placeholder="Teléfono"
          persistent-placeholder
          type="tel"
          variant="solo-filled"
          flat
          bg-color="wood"
          class="custom-input center-input flex-grow-1"
          hide-details
        >
          <template #prepend-inner>
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384"/></svg>
          </template>
        </v-text-field>
      </div>

      <v-text-field
        v-model.number="peopleCount"
        placeholder="Personas"
        persistent-placeholder
        type="number"
        variant="solo-filled"
        flat
        bg-color="wood"
        class="custom-input center-input"
        hide-details
      >
        <template #prepend-inner>
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
        </template>
      </v-text-field>

      <SubmitButton
        text="Pedir mesa"
        loadingText="Creando"
        :loading="loading"
      />
      
      <!-- faltan las montañicas!!!! -->
    </div>
  </v-form>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import SubmitButton from '../common/SubmitButton.vue'

defineProps<{ loading: boolean }>()
const emit = defineEmits(['submit'])

const fullName = ref('')
const phonePrefix = ref('+34')
const phone = ref('')
const peopleCount = ref()
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

<style scoped>
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