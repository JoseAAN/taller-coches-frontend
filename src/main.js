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

// Interceptor global de fetch para inyectar credentials: 'include' en peticiones a la API
const originalFetch = window.fetch;
window.fetch = async (...args) => {
  let [resource, config] = args;
  const url = typeof resource === 'string' ? resource : resource?.url;

  if (url && url.startsWith(import.meta.env.VITE_API_BASE_URL)) {
    config = config || {};
    config.credentials = 'include';

    // Limpiamos cabeceras Authorization antiguas
    const headers = new Headers(config.headers || {});
    headers.delete('Authorization');
    headers.set('Accept', 'application/json'); // FORZAR JSON siempre
    config.headers = headers;

    args[1] = config;
  }
  return originalFetch(...args);
};

//BASE_URL así será global, con hacer this.$BASE_URL ya se llamaría
app.config.globalProperties.$BASE_URL = import.meta.env.VITE_API_BASE_URL

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
