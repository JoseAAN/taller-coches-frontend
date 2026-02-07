import { createApp } from 'vue'
import App from './App.vue'
import router from './routes/index.js'
import PrimeVue from 'primevue/config'
import Aura from '@primevue/themes/aura'

import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'

import 'primeicons/primeicons.css'
import 'primeflex/primeflex.css'
import './assets/main.css' 

const app = createApp(App)

app.use(router)
app.use(PrimeVue, {
  theme: {
    preset: Aura,
    options: {
      darkModeSelector: false
    }
  }
})

app.mount('#app')