<template>
  <div class="split-container">
    <div class="image-section"></div>

    <div class="form-section">
      <div class="verify-card">
        <div class="text-end mb-4">
          <router-link to="/">
            <div class="logo-container"></div>
          </router-link>
        </div>

        <span class="material-symbols-outlined verify-icon">mark_email_read</span>

        <h2 class="fw-bold mb-1 verify-title">Verifica tu email</h2>
        <p class="text-muted mb-2">Hemos enviado un código de 6 dígitos a:</p>
        <p class="user-email mb-4">{{ userEmail }}</p>

        <div class="d-flex flex-column gap-3">
          <input
            type="text"
            maxlength="6"
            inputmode="numeric"
            class="code-input"
            v-model="code"
            placeholder="000000"
            @focus="hasError = false"
          />

          <div v-if="hasError" class="custom-error-alert">
            {{ errorMessage }}
          </div>

          <div v-if="success" class="custom-success-alert">
            ¡Email verificado! Redirigiendo...
          </div>

          <button
            class="btn-verify w-100 fw-bold py-3"
            :disabled="loading || code.length < 6"
            @click="verifyCode"
          >
            {{ loading ? 'Verificando...' : 'Verificar' }}
          </button>

          <button
            class="btn-later w-100 fw-bold py-3"
            @click="skipVerification"
          >
            Intentarlo más tarde
          </button>

          <p class="text-muted text-center resend-text">
            ¿No recibiste el código?
            <a
              href="#"
              class="resend-link"
              :class="{ 'disabled': resendCooldown > 0 }"
              @click.prevent="resendCode"
            >
              {{ resendCooldown > 0 ? `Reenviar en ${resendCooldown}s` : 'Reenviar código' }}
            </a>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { fetchUserData, verifyUserEmail, resendVerificationEmail } from '@/JS/Auth.js';
import { cart } from '@/JS/Cart.js';
import { loaderState } from '@/loaderState';

export default {
  name: 'VerifyEmailComponent',
  data() {
    return {
      code: '',
      loading: false,
      hasError: false,
      errorMessage: '',
      success: false,
      resendCooldown: 0,
      resendTimer: null,
      userEmail: ''
    }
  },
  mounted() {
    document.title = "Verificar Email";
    //recojo el email que tiene la ruta
    this.userEmail = this.$route.query.email || '';

    if (!this.userEmail) {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        try {
          const userObj = JSON.parse(userStr);
          this.userEmail = userObj.email || '';
        } catch (e) {
          console.error("No se encontro el email", e);
        }
      }
    }

    if (!this.userEmail) {
      this.$router.push('/register');
      return;
    }

    this.startResendCooldown();
  },
  beforeUnmount() {
    //lipieza del contador
    if (this.resendTimer) clearInterval(this.resendTimer);
  },
  methods: {
    async verifyCode() {
      this.loading = true;
      this.hasError = false;
      loaderState.show();

      const { ok, data } = await verifyUserEmail(this.userEmail, this.code);

      this.loading = false;
      loaderState.hide();

      if (ok) {
        this.success = true;
        await fetchUserData();
        await cart.syncGuestCart();
        if (cart.items.length === 0 && !cart.id) {
          await cart.loadUserCart();
        }
        setTimeout(() => {
          if (data.user?.role?.name === 'admin') {
            this.$router.push('/admin');
          } else {
            this.$router.push('/');
          }
        }, 1500);
      } else {
        this.hasError = true;
        this.errorMessage = data?.message || 'Código incorrecto.';
        this.code = '';
      }
    },
    async resendCode() {
      if (this.resendCooldown > 0) return;

      const response = await resendVerificationEmail(this.userEmail);
      
      if (response.ok) {
        this.startResendCooldown();
        this.hasError = false;
        this.code = '';
      } else {
        this.hasError = true;
        this.errorMessage = response.message || 'Error al reenviar el código.';
      }
    },
    startResendCooldown() {
      this.resendCooldown = 60;
      if (this.resendTimer) clearInterval(this.resendTimer);
      this.resendTimer = setInterval(() => {
        this.resendCooldown--;
        if (this.resendCooldown <= 0) clearInterval(this.resendTimer);
      }, 1000);
    },
    skipVerification() {
      this.$router.push('/');
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

.verify-card {
  width: 100%;
  max-width: 420px;
  text-align: center;
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

.verify-icon {
  font-size: 48px;
  color: #52b155;
  margin-bottom: 1rem;
  display: inline-block;
}

.verify-title {
  color: #1a1a1a;
  font-size: 1.8rem;
}

.user-email {
  color: #52b155;
  font-weight: 600;
  font-size: 0.95rem;
}

.code-input {
  width: 100%;
  text-align: center;
  font-size: 2rem;
  font-weight: 700;
  letter-spacing: 12px;
  padding: 14px;
  border: 2px solid #e2e8f0;
  border-radius: 10px;
  outline: none;
  transition: border-color 0.2s;
  color: #1a1a1a;
  background: #f8fafc;
}

.code-input:focus {
  border-color: #52b155;
  box-shadow: 0 0 0 3px rgba(82, 177, 85, 0.12);
}

.custom-error-alert {
  background-color: #fff1f2;
  color: #be123c;
  padding: 0.8rem;
  border-radius: 6px;
  font-size: 0.85rem;
  border: 1px solid #fecdd3;
}

.custom-success-alert {
  background-color: #f0fdf4;
  color: #166534;
  padding: 0.8rem;
  border-radius: 6px;
  font-size: 0.85rem;
  border: 1px solid #bbf7d0;
}

.btn-verify {
  background-color: #52b155;
  border: none;
  border-radius: 8px;
  color: white;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.btn-verify:hover:not(:disabled) {
  background-color: #469c49;
}

.btn-verify:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-later {
  background-color: #f5f5f5;
  border: 1px solid #d0d0d0;
  border-radius: 8px;
  color: #666666;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s;
  margin-top: 0.5rem;
}

.btn-later:hover {
  background-color: #e8e8e8;
  border-color: #999999;
  color: #333333;
}

.resend-text {
  font-size: 0.85rem;
  margin-top: 0.5rem;
}

.resend-link {
  color: #52b155;
  font-weight: 600;
  text-decoration: none;
}

.resend-link:hover {
  text-decoration: underline;
}

.resend-link.disabled {
  color: #9ca3af;
  pointer-events: none;
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
