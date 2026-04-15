<template>
  <div class="split-container">
    <div class="image-section"></div>

    <div class="form-section">
      <div class="register-card">
        <div class="text-end mb-4">
          <router-link to="/">
            <div class="logo-container"></div>
          </router-link>
        </div>

        <h2 class="fw-bold mb-1 register-title">Inicio de Sesión</h2>
        <p class="text-muted mb-4">Ingresa tus datos para iniciar sesión</p>

        <form autocomplete="on" class="d-flex flex-column gap-4">

          <FloatLabel>
            <InputText id="email" autocomplete="email" v-model="form.email" type="email"
              :class="['w-100', { 'p-invalid': errors.email }]" @focus="clearError('email')" />
            <label for="email">Email</label>
          </FloatLabel>

          <FloatLabel>
            <Password id="password" :inputProps="{ autocomplete: 'current-password', name: 'password' }"
              v-model="form.password" toggleMask :feedback="false" :class="['w-100', { 'p-invalid': errors.password }]"
              @focus="clearError('password')" />
            <label for="password">Contraseña</label>
          </FloatLabel>
          <small class="p-error" v-if="errors.email">{{ errors.email[0] }}</small>
          <small class="p-error" v-if="errors.password">{{ errors.password[0] }}</small>

          <div ref="recaptcha" class="d-flex justify-content-center mt-2"></div>

          <!-- Error genérico de validación -->
          <div v-if="Object.keys(errors).length > 0" class="custom-error-alert">
            {{ errors.general || errors.email?.[0] || 'Error al iniciar sesión, revisa tus datos' }}
          </div>

          <!-- Bloqueado por admin -->
          <div v-if="blockedMessage" class="custom-error-alert alert-blocked">
            <span class="material-symbols-outlined"
              style="font-size:18px;vertical-align:middle;margin-right:6px">block</span>
            {{ blockedMessage }}
          </div>

          <!-- Bloqueo temporal por intentos -->
          <div v-if="lockedMessage" class="custom-error-alert alert-locked">
            <span class="material-symbols-outlined"
              style="font-size:18px;vertical-align:middle;margin-right:6px">timer</span>
            {{ lockedMessage }}
          </div>

          <Button :label="loading ? 'Iniciando...' : 'Iniciar Sesión'" :disabled="loading || !captchaResolved"
            class="btn-register w-100 fw-bold py-3 mt-2" @click.prevent="iniciarSesion" />
          <div class="text-center ">
            <router-link to="/"
              class="d-inline-block text-secondary text-decoration-none fw-semibold border border-2 border-secondary rounded-pill px-8 py-2"
              style="transition: color 0.3s ease;">
              Quizás más tarde
            </router-link>
          </div>

          <Message v-if="success" severity="success">Sesión iniciada correctamente</Message>

          <div class="text-center mt-4 mb-3">
            <div class="d-flex align-items-center mb-3">
              <div class="flex-grow-1 border-top border-secondary opacity-25"></div>
              <span class="mx-3 text-secondary" style="font-size: 0.85rem">o</span>
              <div class="flex-grow-1 border-top border-secondary opacity-25"></div>
            </div>

            <a :href="`${$BASE_URL}/google-auth/redirect`"
              class="btn-google d-flex align-items-center justify-content-center w-100 text-decoration-none">
              <img src="https://developers.google.com/identity/images/g-logo.png" alt="Google logo"
                class="google-icon" />
              <span>Continuar con Google</span>
            </a>

          </div>

          <div class="text-center mt-3">
            <span class="text-secondary">¿No tienes cuenta? </span>
            <router-link to="/register" class=" text-decoration-none fw-semibold">
              Regístrate aquí
            </router-link>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import FloatLabel from 'primevue/floatlabel'
import InputText from 'primevue/inputtext'
import Password from 'primevue/password'
import Button from 'primevue/button'
import Message from 'primevue/message'
import { loaderState } from '@/loaderState';
import { cart } from '@/JS/Cart.js';
import { fetchUserData, authState } from '@/JS/Auth.js';

export default {
  name: 'login-component',
  components: { FloatLabel, InputText, Password, Button, Message },

  data() {
    return {
      form: {
        email: '',
        password: '',
      },
      loading: false,
      errors: {},
      success: false,
      blockedMessage: '',
      lockedMessage: '',
      captchaResolved: false,
    }
  },

  methods: {
    async iniciarSesion() {
      loaderState.show();
      this.errors = {};
      this.success = false;
      this.blockedMessage = '';
      this.lockedMessage = '';

      const checkErrors = this.validateForm();
      const token = window.grecaptcha.getResponse();
      if (!token) checkErrors.captcha = ['Completa el captcha'];

      if (Object.keys(checkErrors).length > 0) {
        this.errors = checkErrors;
        loaderState.hide();
        return;
      }

      this.loading = true;
      this.form.captcha = token;
      fetch(`${this.$BASE_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(this.form)
      })
        .then(async response => {
          const data = await response.json();
          if (response.status === 422) {
            this.errors = data.errors;
          } else if (response.status === 403 && data.code === 'ACCOUNT_BLOCKED') {
            this.blockedMessage = data.message;
          } else if (response.status === 429 && data.code === 'TOO_MANY_ATTEMPTS') {
            this.lockedMessage = data.message;
          } else if (response.ok) {
            this.success = true;
            this.form = { email: '', password: '' };
            window.grecaptcha.reset();
            this.captchaResolved = false;
            await fetchUserData();

            // Sincroniza posibles carritos de invitado y luego carga el carrito real internamente
            await cart.syncGuestCart();
            // Si el guest cart estaba vacio, syncGuestCart hace return, así que nos aseguramos de cargarlo.
            if (cart.items.length === 0 && !cart.id) {
              await cart.loadUserCart();
            }

            if (data.user.role.name === 'admin') {
              this.$router.push('/admin');
            } else {
              this.$router.push('/');
            }
          } else {
            throw new Error('Error de servidor');
          }
        })
        .catch(error => {
          this.errors = { general: 'No se pudo conectar con el servidor.' };
          console.error(error);
        })
        .finally(() => {
          this.loading = false;
          loaderState.hide();
        });
    },

    clearError(campo) {
      if (this.errors[campo]) delete this.errors[campo];
    },

    validateForm() {
      const checkErrors = {};
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!this.form.email.trim()) {
        checkErrors.email = ['El email es obligatorio'];
      } else if (!emailRegex.test(this.form.email)) {
        checkErrors.email = ['El formato del email no es válido'];
      }

      if (this.form.password.length < 4) {
        checkErrors.password = ['La contraseña debe tener al menos 4 caracteres'];
      }

      return checkErrors;
    },
  },

  async mounted() {
    const oauthErrors = {
      google_auth_failed: 'No se pudo completar la autenticación con Google. Inténtalo de nuevo.',
      google_invalid_state: 'La autenticación con Google ha caducado o no es válida. Vuelve a intentarlo.',
      google_account_mismatch: 'Esta cuenta de Google no coincide con la que estaba enlazada a este usuario.',
      account_blocked: 'Tu cuenta está bloqueada y no puede iniciar sesión con Google.',
      too_many_attempts: 'Tu cuenta sigue temporalmente bloqueada. Espera antes de volver a intentarlo.',
      role_not_configured: 'No se pudo completar el acceso con Google por un problema de configuración interna.',
      google_email_missing: 'Google no devolvió un correo válido para completar el acceso.',
    };

    if (this.$route.query.error && oauthErrors[this.$route.query.error]) {
      this.errors = { general: oauthErrors[this.$route.query.error] };
    }

    if (this.$route.query.google === 'success') {
      this.loading = true;
      try {
        await fetchUserData();
        await cart.syncGuestCart();
        if (cart.items.length === 0 && !cart.id) {
          await cart.loadUserCart();
        }

        if (authState.user && authState.user.role.name === 'admin') {
          this.$router.push('/admin');
        } else {
          this.$router.push('/');
        }
      } catch (error) {
        console.error("Error validando el logueo de Google", error);
        this.errors = { general: 'No se pudo completar el login con Google.' };
      } finally {
        this.loading = false;
      }
      return;
    }
    const renderRecaptcha = setInterval(() => {
      if (window.grecaptcha && window.grecaptcha.render) {
        clearInterval(renderRecaptcha);
        this.$refs.recaptcha.innerHTML = '';
        window.grecaptcha.render(this.$refs.recaptcha, {
          sitekey: '6LcA8mIsAAAAAL1hrZC4H9GamA3rqF_PFZQbjaME',
          callback: () => { this.captchaResolved = true; },
          'expired-callback': () => { this.captchaResolved = false; }
        });
      }
    }, 100);
    document.title = "Inicio de Sesión"

  },
}
</script>

<style scoped>
.split-container {
  display: flex;
  min-height: 100vh;
  width: 100%;
}

.image-section {
  flex: 1.2;
  background-image: url('../../../assets/limpiezaregister2.jpg');
  background-size: cover;
  background-position: center;
}

.form-section {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  background-color: #ffffff;
}

.register-card {
  width: 100%;
  max-width: 420px;
}

.logo-container {
  width: 150px;
  height: 60px;
  background-image: url('@/assets/LogoModoClaro.png');
  background-size: contain;
  background-repeat: no-repeat;
  background-position: right center;
  display: inline-block;
  transition: transform 0.3s ease;
}

.logo-container:hover {
  transform: scale(1.05);
}

.custom-error-alert {
  background-color: #eef2ff;
  color: #3b82f6;
  padding: 0.8rem;
  border-radius: 6px;
  font-size: 0.85rem;
  text-align: left;
}

.alert-blocked {
  background-color: #fff1f2;
  color: #be123c;
  border: 1px solid #fecdd3;
}

.alert-locked {
  background-color: #fff7ed;
  color: #c2410c;
  border: 1px solid #fed7aa;
}

.register-title {
  color: #1a1a1a;
  font-size: 1.8rem;
}

.btn-register {
  background-color: #3b82f6;
  border: none;
  border-radius: 8px;
  color: white;
}

.btn-register:hover {
  background-color: #2563eb;
}

.btn-google {
  background-color: #ffffff;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  color: #374151;
  font-weight: 500;
  padding: 0.75rem 1rem;
  transition: background-color 0.2s, box-shadow 0.2s;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.btn-google:hover {
  background-color: #f9fafb;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
}

.google-icon {
  width: 20px;
  height: 20px;
  margin-right: 12px;
}

.p-error {
  color: #ef4444;
  font-size: 0.75rem;
  margin-top: -0.5rem;
}

@media (max-width: 992px) {
  .image-section {
    display: none;
  }

  .form-section {
    padding: 1.5rem;
  }
}
</style>
