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

        <h2 class="fw-bold mb-1 register-title">Crear Cuenta</h2>
        <p class="text-muted mb-4">Ingresa tus datos para registrarte</p>

        <form class="d-flex flex-column gap-4">
          
          <FloatLabel>
            <InputText id="name" v-model="form.name" :class="['w-100', { 'p-invalid': errors.name }]" @focus="clearError('name')"/>
            <label for="name">Nombre Completo</label>
          </FloatLabel>
          <small class="p-error" v-if="errors.name">{{ errors.name[0] }}</small>

          <FloatLabel>
            <InputText id="email" v-model="form.email" type="email" :class="['w-100', { 'p-invalid': errors.email }]" @focus="clearError('email')"/>
            <label for="email">Email</label>
          </FloatLabel>
          <small class="p-error" v-if="errors.email">{{ errors.email[0] }}</small>

          <FloatLabel>
            <Password id="password" v-model="form.password" toggleMask
              :class="['w-100', { 'p-invalid': errors.password }]" @focus="clearError('password')"/>
            <label for="password">Contraseña</label>
          </FloatLabel>
          <small class="p-error" v-if="errors.password">{{ errors.password[0] }}</small>

          <FloatLabel>
            <Password id="password_confirmation" v-model="form.password_confirmation" toggleMask :feedback="false"
              class="w-100" @focus="clearError('password_confirmation')"/>
            <label for="password_confirmation">Confirmar Contraseña</label>
          </FloatLabel>

          <div ref="recaptcha" class="d-flex justify-content-center mt-2"></div>

          <div v-if="Object.keys(errors).length > 0" class="custom-error-alert">
            {{ errors.general || 'Registro fallido, rellene todos los campos' }}
          </div>

          <Button :label="loading ? 'Registrando...' : 'Registrarse'" :disabled="loading"
            class="btn-register w-100 fw-bold py-3 mt-2" @click.prevent="registrar" />

          <Message v-if="success" severity="success">Usuario creado correctamente</Message>
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

export default {
  name: 'RegisterComponent',
  components: { FloatLabel, InputText, Password, Button, Message },
  data() {
    return {
      form: { name: '', email: '', password: '', password_confirmation: '' },
      loading: false,
      errors: {},
      success: false
    }
  },
  mounted() {
    if (window.grecaptcha) {
      window.grecaptcha.render(this.$refs.recaptcha, { sitekey: '6LcA8mIsAAAAAL1hrZC4H9GamA3rqF_PFZQbjaME' });
    }
  },
  methods: {
    clearError(campo) {
      if (this.errors[campo]) {
        delete this.errors[campo];
      }
    },
    validateForm() {
      //aqui validamos el formulario antes de hacer la peti, así no hacemos llamadas innicesarias al backend (aunque dentro de este siguen habiendo validacions)
      const checkErrors = {};
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!this.form.name.trim()) checkErrors.name = ['El nombre es obligatorio'];
      if (!this.form.email.trim()) {
        checkErrors.email = ['El email es obligatorio'];
      } else if (!emailRegex.test(this.form.email)) {
        checkErrors.email = ['El formato del email no es válido'];
      }
      
      if (this.form.password.length < 8) {
        checkErrors.password = ['La contraseña debe tener al menos 8 caracteres'];
      }

      if (this.form.password !== this.form.password_confirmation) {
        checkErrors.password_confirmation = ['Las contraseñas no coinciden'];
        checkErrors.password = ['Las contraseñas no coinciden'];
      }

      return checkErrors;
    },
    registrar() {
      this.errors = {};
      this.success = false;

      const checkErrors = this.validateForm();
      
      const token = window.grecaptcha.getResponse();
      if (!token) {
        checkErrors.captcha = ['Completa el captcha'];
      }

      // buscamos si existen errores para no llamar al back
      if (Object.keys(checkErrors).length > 0) {
        this.errors = checkErrors;
        return;
      }

      this.loading = true;
      this.form.captcha = token;

      fetch('http://127.0.0.1:8000/api/v1/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(this.form)
      })
      .then(response => {
        return response.json().then(data => {
          if (response.status === 422) {
            this.errors = data.errors;
          } else if (response.ok) {
            console.log(data);
            
            this.success = true;
            this.form = { name: '', email: '', password: '', password_confirmation: '' };
            
            window.grecaptcha.reset();
            localStorage.setItem('user_token', data.token);
          } else {
            throw new Error('Error de servidor');
          }
        })
      })
      .catch(error => {
        this.errors = { general: 'No se pudo conectar con el servidor.' };
        console.error(error);
      })
      .finally(() => {
        this.loading = false;
      });
    }
  }
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
  background-image: url('../../assets/limpiezaregister2.jpg');
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