import '@/styles/index.scss'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

import { vuetify } from '@/plugins/vuetify'
import { registerPushServiceWorker } from '@/services/pushClient'

const app = createApp(App)
console.log('DEV?', import.meta.env.DEV)

app.use(createPinia())
app.use(router)
app.use(vuetify)

app.mount('#app')
void registerPushServiceWorker()