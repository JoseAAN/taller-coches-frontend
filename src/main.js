import { createApp } from 'vue'
import App from './App.vue'
import router from './routes/index.js'

import PrimeVue from 'primevue/config'
import Aura from '@primevue/themes/aura'

import Toast from "vue-toastification"
import "vue-toastification/dist/index.css"

import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import 'primeicons/primeicons.css'
import 'primeflex/primeflex.css'
import './assets/main.css' 

const app = createApp(App)

localStorage.setItem('token', 'xi5oJtCIURyyLblFcGm5ZTXNlPG2tqAkSkJzLirVV0D1P8mzR9dl3MORD1h7')

// Toast options for notifications
const options = {
    position: "top-right",
    timeout: 3000,
    closeOnClick: true,
};

app.use(PrimeVue, {
  theme: {
    preset: Aura,
    options: {
      darkModeSelector: false
    }
  }
})
app.use(router)
app.use(Toast, options)

app.mount('#app')