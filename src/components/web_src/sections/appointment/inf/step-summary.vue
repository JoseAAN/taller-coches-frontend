<template>
  <div class="step-wrapper">

    <div class="step-header">
      <span class="material-symbols-outlined step-header-icon">task_alt</span>
      <div>
        <h2 class="step-title">Resumen de tu cita</h2>
        <p class="step-subtitle">Revisa los detalles antes de confirmar</p>
      </div>
    </div>

    <div class="summary-box">

      <!-- COCHE -->
      <div class="summary-row">
        <div class="summary-icon-wrap">
          <span class="material-symbols-outlined">directions_car</span>
        </div>
        <div class="summary-info">
          <p class="summary-label">Vehículo</p>
          <p class="summary-value">{{ vehicle.brand }} {{ vehicle.model }}</p>
          <div class="summary-tags">
            <span class="summary-tag">{{ vehicle.license_plate }}</span>
            <span class="summary-tag">{{ vehicle.color }}</span>
            <span class="summary-tag">{{ vehicle.vehicle_type.name }}</span>
          </div>
        </div>
      </div>

      <div class="summary-divider"></div>

      <!-- SERVICIO -->
      <div class="summary-row">
        <div class="summary-icon-wrap">
          <span class="material-symbols-outlined">home_repair_service</span>
        </div>
        <div class="summary-info">
          <p class="summary-label">Servicio</p>
          <p class="summary-value">{{ service.name }}</p>
          <div class="summary-tags">
            <span class="summary-tag">{{ service.type.name }}</span>
            <span class="summary-tag">
              <span class="material-symbols-outlined" style="font-size:13px">schedule</span>
              {{ service.average_duration_mins }} min
            </span>
          </div>
        </div>
        <span class="summary-price">{{ service.price }} €</span>
      </div>

      <div class="summary-divider"></div>

      <!-- FECHA Y HORA -->
      <div class="summary-row">
        <div class="summary-icon-wrap">
          <span class="material-symbols-outlined">calendar_month</span>
        </div>
        <div class="summary-info">
          <p class="summary-label">Fecha y hora</p>
          <p class="summary-value">{{ date }}</p>
          <div class="summary-tags">
            <span class="summary-tag">
              <span class="material-symbols-outlined" style="font-size:13px">schedule</span>
              Entrada: {{ startTime }}
            </span>
            <span class="summary-tag">
              <span class="material-symbols-outlined" style="font-size:13px">flag</span>
              Salida: {{ endTime }}
            </span>
          </div>
        </div>
      </div>

      <div class="summary-divider"></div>

      <div class="summary-total">
        <span class="summary-total-label">Total</span>
        <span class="summary-total-value">{{ service.price }} €</span>
      </div>

    </div>

    <div class="summary-notice">
      <span class="material-symbols-outlined">info</span>
      <p>Al confirmar, la cita se añadirá a tu carrito y podrás completar el pago desde allí.</p>
    </div>

    <div class="step-actions">
      <button class="btn-back" @click="$emit('back')">
        <span class="material-symbols-outlined">arrow_back</span>
        Volver
      </button>
      <button class="btn-confirm" :disabled="loading" @click="confirmar">
        <span v-if="loading" class="material-symbols-outlined rotating">progress_activity</span>
        <span v-else class="material-symbols-outlined">shopping_cart</span>
        {{ loading ? 'Añadiendo...' : 'Añadir al carrito' }}
      </button>
    </div>

  </div>
</template>

<script>
import { cart,ITEM_TYPES } from '/src/js/Cart.js' 

const BASE_URL = import.meta.env.VITE_API_BASE_URL

export default {
  props: {
    vehicle:   { type: Object, required: true },
    service:   { type: Object, required: true },
    date:      { type: String, required: true },
    startTime: { type: String, required: true }
  },
  emits: ['confirm', 'back'],
  data() {
    return {
      loading: false
    }
  },
    computed: {
    endTime() {
      if (!this.startTime || !this.service.average_duration_mins) return null
      const [hours, minutes] = this.startTime.split(':').map(Number)

      const date = new Date()
      date.setHours(hours)
      date.setMinutes(minutes + this.service.average_duration_mins)

      const h = String(date.getHours()).padStart(2, '0')
      const m = String(date.getMinutes()).padStart(2, '0')
      return `${h}:${m}`
    }
  },
  methods: {
  async confirmar() {
    this.loading = true
    const token = localStorage.getItem('user_token')

    try {

       await cart.loadUserCart()
      const appointmentResponse = await fetch(`${BASE_URL}/v1/appointment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          vehicle_id: this.vehicle.id,
          service_id: this.service.id,
          date: this.date,
          start_time: this.startTime
        })
      })

      if (!appointmentResponse.ok) {
        alert('Error al crear la cita')
        return
      }

      const appointmentData = await appointmentResponse.json()

      const result = await cart.addToCart(
        ITEM_TYPES.SERVICE,
        appointmentData.appointment.id,
        1,
        this.service.price
      )

      if (result.success) {
        this.$router.push('/cart')
      }

    } catch (e) {
      console.error(e)
      alert('Error inesperado, inténtalo de nuevo')
    } finally {
      this.loading = false
    }
  }
}
}
</script>

<style lang="scss" scoped>
.step-wrapper {
  max-width: 620px;
  margin: 2rem auto;
  padding: 0 1.5rem;
}

.step-header {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 2rem;
}

.step-header-icon {
  font-size: 36px;
  color: #52b155;
  flex-shrink: 0;
}

.step-title {
  font-size: 1.3rem;
  font-weight: 850;
  color: var(--nav-text);
  letter-spacing: -0.5px;
  margin: 0 0 4px 0;
}

.step-subtitle {
  font-size: 0.88rem;
  color: var(--nav-text);
  opacity: 0.5;
  margin: 0;
}


.summary-box {
  background-color: var(--nav-bg);
  border: 1px solid var(--nav-border, #ddd);
  border-radius: 16px;
  padding: 1.5rem;
  margin-bottom: 1rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.summary-row {
  display: flex;
  align-items: flex-start;
  gap: 14px;
}

.summary-icon-wrap {
  width: 42px;
  height: 42px;
  border-radius: 10px;
  background-color: rgba(82, 177, 85, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  .material-symbols-outlined {
    font-size: 22px;
    color: #52b155;
  }
}

.summary-info {
  flex: 1;
}

.summary-label {
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: var(--nav-text);
  opacity: 0.45;
  margin: 0 0 4px 0;
}

.summary-value {
  font-size: 0.95rem;
  font-weight: 700;
  color: var(--nav-text);
  margin: 0 0 6px 0;
}

.summary-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  align-items: center;
}

.summary-tag {
  display: inline-flex;
  align-items: center;
  gap: 3px;
  font-size: 0.72rem;
  font-weight: 600;
  padding: 3px 10px;
  border-radius: 20px;
  background-color: var(--nav-border, #f0f0f0);
  color: var(--nav-text);
  opacity: 0.7;
}

.summary-price {
  font-size: 1rem;
  font-weight: 850;
  color: #52b155;
  white-space: nowrap;
  padding-top: 2px;
}

.summary-divider {
  height: 1px;
  background-color: var(--nav-border, #ddd);
  margin: 1.2rem 0;
}


.summary-total {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.2rem;
  background-color: rgba(82, 177, 85, 0.08);
  border: 1.5px solid #52b155;
  border-radius: 10px;
  margin-top: 0.5rem;
}

.summary-total-label {
  font-weight: 700;
  font-size: 0.95rem;
  color: var(--nav-text);
}

.summary-total-value {
  font-size: 1.2rem;
  font-weight: 850;
  color: #52b155;
  letter-spacing: -0.5px;
}


.summary-notice {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  padding: 10px 14px;
  border-radius: 10px;
  background-color: rgba(91, 143, 212, 0.08);
  border: 1px solid rgba(91, 143, 212, 0.3);
  margin-bottom: 1.5rem;

  .material-symbols-outlined {
    font-size: 18px;
    color: #5b8fd4;
    flex-shrink: 0;
    margin-top: 1px;
  }

  p {
    font-size: 0.82rem;
    color: var(--nav-text);
    opacity: 0.7;
    margin: 0;
    line-height: 1.4;
  }
}

.step-actions {
  display: flex;
  justify-content: space-between;
}

.btn-back {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  border-radius: 10px;
  border: 2px solid var(--nav-border, #ddd);
  background: transparent;
  color: var(--nav-text);
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.2s ease;

  .material-symbols-outlined { font-size: 20px; }
  &:hover { background-color: var(--nav-border, #f0f0f0); }
}

.btn-confirm {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 24px;
  border-radius: 10px;
  border: none;
  background-color: #52b155;
  color: #fff;
  font-weight: 700;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.2s ease;

  .material-symbols-outlined { font-size: 20px; }

  &:hover {
    background-color: #469c49;
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
}


@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.rotating {
  animation: spin 1s linear infinite;
}

/* ── RESPONSIVE ── */
@media (max-width: 576px) {
  .step-wrapper { padding: 0 1rem; }
}
</style>