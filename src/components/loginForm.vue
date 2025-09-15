
<template>
  <form>
    <v-text-field
      v-model="name"
      label="Name"
      required

    ></v-text-field>

    <v-text-field
      v-model="email"
      label="E-mail"
      required
    ></v-text-field>

    <v-select
      v-model="select"
      :items="items"
      label="Item"
      required
    ></v-select>


  </form>
</template>
<script setup>
import { reactive, ref } from 'vue'

const name = ref('')

const items = [
  'Item 1',
  'Item 2',
  'Item 3',
  'Item 4',
]

function clear () {
  for (const [key, value] of Object.entries(initialState)) {
    state[key] = value
  }
}
</script>