<template>
  <header class="appointment-header">
    <div class="header-content">
      <div class="logo-container" @click="goHome">
        <div class="logo-image"></div>
      </div>
      
      <h1 class="appointment-title">Reserva tu Cita</h1>
      
      <div class="header-actions">
        <ThemeSwitcher />
        <button @click="goHome" class="btn-home" title="Volver al inicio">
          <span class="material-symbols-outlined">home</span>
        </button>
      </div>
    </div>
  </header>
</template>

<script>
import ThemeSwitcher from '../../UI/theme-switcher.vue';

export default {
  name: 'AppointmentLayout',
  components: { ThemeSwitcher },
  props: {
    showSteps: {
      type: Boolean,
      default: true
    },
    currentStep: {
      type: Number,
      default: 1
    },
    steps: {
      type: Array,
      default: () => ['Seleccionar Servicio', 'Elegir Fecha', 'Confirmar Datos']
    }
  },
  methods: {
    goHome() {
      this.$router.push('/');
    }
  }
}
</script>

<style scoped>
.appointment-layout {
  min-height: 100vh;
  background-color: var(--bg-color, #f8f9fa);
  display: flex;
  flex-direction: column;
}

/* Header */
.appointment-header {
  background-color: var(--nav-bg);
  border-bottom: 1px solid var(--nav-border, #ddd);
  padding: 1rem 2rem;
  position: sticky;
  top: 0;
  z-index: 50;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 2rem;
}

.logo-container {
  cursor: pointer;
  flex-shrink: 0;
}

.logo-image {
  width: 120px;
  height: 60px;
  background-image: url('src/assets/LogoModoClaro.png');
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  transition: transform 0.3s ease;
}

[data-theme="dark"] .logo-image {
  background-image: url('src/assets/LogoModoOscuro.png');
}

.logo-container:hover .logo-image {
  transform: scale(1.1);
}

.appointment-title {
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--nav-text);
  margin: 0;
  flex: 1;
  text-align: center;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-shrink: 0;
}

.btn-home {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: none;
  background-color: transparent;
  color: var(--nav-text);
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-home .material-symbols-outlined {
  font-size: 24px;
}

.btn-home:hover {
  background-color: var(--nav-border, #f0f0f0);
  color: #52b155;
}

/* Progress Steps */
.progress-steps {
  background-color: var(--nav-bg);
  padding: 1.5rem 2rem;
  border-bottom: 1px solid var(--nav-border, #ddd);
}

.progress-steps {
  max-width: 800px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
}

.progress-steps::before {
  content: '';
  position: absolute;
  top: 20px;
  left: 10%;
  right: 10%;
  height: 2px;
  background-color: var(--nav-border, #ddd);
  z-index: 0;
}

.step {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  flex: 1;
  position: relative;
  z-index: 1;
}

.step-number {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: var(--nav-bg);
  border: 2px solid var(--nav-border, #ddd);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  color: var(--nav-text);
  transition: all 0.3s ease;
}

.step-active .step-number {
  background-color: #52b155;
  border-color: #52b155;
  color: white;
  transform: scale(1.1);
}

.step-completed .step-number {
  background-color: #52b155;
  border-color: #52b155;
  color: white;
}

.step-number .material-symbols-outlined {
  font-size: 20px;
}

.step-label {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--nav-text);
  text-align: center;
  opacity: 0.6;
  transition: opacity 0.3s ease;
}

.step-active .step-label,
.step-completed .step-label {
  opacity: 1;
  color: #52b155;
}

/* Main Content */
.appointment-main {
  flex: 1;
  padding: 2rem;
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
}

/* Footer */
.appointment-footer {
  background-color: var(--nav-bg);
  border-top: 1px solid var(--nav-border, #ddd);
  padding: 1rem 2rem;
  margin-top: auto;
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
}

.footer-info {
  display: flex;
  align-items: center;
  gap: 8px;
  justify-content: center;
  color: var(--nav-text);
  font-size: 0.9rem;
}

.footer-info .material-symbols-outlined {
  font-size: 20px;
  color: #52b155;
}

.footer-info p {
  margin: 0;
}

.footer-info a {
  color: #52b155;
  text-decoration: none;
  font-weight: 600;
}

.footer-info a:hover {
  text-decoration: underline;
}

/* Responsive */
@media (max-width: 768px) {
  .appointment-header {
    padding: 1rem;
  }

  .header-content {
    gap: 1rem;
  }

  .logo-image {
    width: 80px;
    height: 40px;
  }

  .appointment-title {
    font-size: 1.25rem;
  }

  .progress-steps {
    padding: 1rem;
  }

  .step-label {
    font-size: 0.7rem;
    max-width: 80px;
  }

  .step-number {
    width: 32px;
    height: 32px;
    font-size: 0.85rem;
  }

  .appointment-main {
    padding: 1rem;
  }
}

@media (max-width: 480px) {
  .appointment-title {
    display: none;
  }

  .step-label {
    display: none;
  }

  .progress-steps::before {
    left: 5%;
    right: 5%;
  }
}
</style>