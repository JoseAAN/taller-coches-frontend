<template>
  <div class="split-container">
    <div class="image-section"></div>

    <div class="form-section">
      <div class="register-card">
        <div class="text-end mb-4">
          <div class="logo-container">
            <div class="logo-icon"></div>
            <span class="logo-text">LOGASO</span>
          </div>
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
            <Password id="password" 
            :inputProps="{autocomplete: 'current-password', name: 'password'}" 
            v-model="form.password" 
            toggleMask
            :feedback="false"
            :class="['w-100', { 'p-invalid': errors.password }]"
            @focus="clearError('password')" 
            />
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
            <span class="material-symbols-outlined" style="font-size:18px;vertical-align:middle;margin-right:6px">block</span>
            {{ blockedMessage }}
          </div>

          <!-- Bloqueo temporal por intentos -->
          <div v-if="lockedMessage" class="custom-error-alert alert-locked">
            <span class="material-symbols-outlined" style="font-size:18px;vertical-align:middle;margin-right:6px">timer</span>
            {{ lockedMessage }}
          </div>

          <Button :label="loading ? 'Iniciando...' : 'Iniciar Sesión'" :disabled="loading"
            class="btn-register w-100 fw-bold py-3 mt-2" @click.prevent="iniciarSesion" />
          <div class="text-center ">
            <router-link to="/" class="d-inline-block text-secondary text-decoration-none fw-semibold border border-2 border-secondary rounded-pill px-8 py-2" style="transition: color 0.3s ease;">
              Quizás más tarde
            </router-link>
          </div>

          <Message v-if="success" severity="success">Sesión iniciada correctamente</Message>

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
import { fetchUserData } from '@/JS/Auth.js';

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
            localStorage.setItem('user_token', data.access_token);
            await fetchUserData();
            
            // Sincroniza posibles carritos de invitado y luego carga el carrito real internamente
            await cart.syncGuestCart(); 
            // Si el guest cart estaba vacio, syncGuestCart hace return, así que nos aseguramos de cargarlo.
            if(cart.items.length === 0 && !cart.id) {
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

  mounted() {
    if (window.grecaptcha) {
      window.grecaptcha.render(this.$refs.recaptcha, { sitekey: '6LcA8mIsAAAAAL1hrZC4H9GamA3rqF_PFZQbjaME' });
    }
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
  display: inline-flex;
  flex-direction: column;
  align-items: flex-end;
}

.logo-text {
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 1px;
  color: #333;
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