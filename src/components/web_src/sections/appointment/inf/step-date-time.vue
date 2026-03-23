<template>
  <div class="step-wrapper">

    <div class="step-header">
      <span class="material-symbols-outlined step-header-icon">calendar_month</span>
      <div>
        <h2 class="step-title">Elige fecha y hora</h2>
        <p class="step-subtitle">Selecciona el día y el horario que mejor te venga</p>
      </div>
    </div>

    <div class="datetime-layout">

      <!-- COLUMNA IZQUIERDA: FECHA -->
      <div class="date-column">
        <p class="column-label">
          <span class="material-symbols-outlined">calendar_today</span>
          Fecha
        </p>
        <input
          type="date"
          class="date-input"
          v-model="selectedDate"
          :min="today"
          @change="fetchSlots"
        />

        <!-- INFO SERVICIO -->
        <div class="service-info-box" v-if="serviceDuration">
          <span class="material-symbols-outlined">schedule</span>
          <span>Duración: <strong>{{ serviceDuration }} min</strong></span>
        </div>
      </div>

      <!-- COLUMNA DERECHA: SLOTS -->
      <div class="slots-column">
        <p class="column-label">
          <span class="material-symbols-outlined">schedule</span>
          Horario disponible
        </p>

        <!-- SIN FECHA -->
        <div v-if="!selectedDate" class="slots-empty">
          <span class="material-symbols-outlined">touch_app</span>
          <p>Selecciona primero una fecha</p>
        </div>

        <!-- CARGANDO -->
        <div v-else-if="loading" class="loading-state">
          <span class="material-symbols-outlined loading-icon">hourglass_empty</span>
          <p class="loading-text">Buscando huecos disponibles...</p>
        </div>

        <!-- SIN SLOTS -->
        <div v-else-if="!slots.length" class="slots-empty">
          <span class="material-symbols-outlined">event_busy</span>
          <p>No hay huecos disponibles para este día</p>
        </div>

        <!-- SLOTS AGRUPADOS POR HORA -->
        <div v-else class="slots-groups">
          <div
            v-for="(group, hour) in groupedSlots"
            :key="hour"
            class="slots-hour-group"
          >
            <p class="slots-hour-label">{{ hour }}h</p>
            <div class="slots-grid">
              <button
                v-for="slot in group"
                :key="slot.start"
                class="slot-btn"
                :class="{ selected: selectedSlot?.start === slot.start }"
                @click="selectSlot(slot)"
              >
                {{ slot.start }}
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>

    <!-- ACCIONES -->
    <div class="step-actions">
      <button class="btn-back" @click="$emit('back')">
        <span class="material-symbols-outlined">arrow_back</span>
        Volver
      </button>
      <button class="btn-next" :disabled="!selectedSlot" @click="confirm">
        Siguiente
        <span class="material-symbols-outlined">arrow_forward</span>
      </button>
    </div>

  </div>
</template>

<script>
const BASE_URL = import.meta.env.VITE_API_BASE_URL

export default {
  props: {
    serviceId: { type: Number, required: true }
  },
  emits: ['select', 'back'],
  data() {
    return {
      selectedDate: null,
      selectedSlot: null,
      slots: [],
      serviceDuration: null,
      loading: false,
      today: new Date().toISOString().split('T')[0] // formato YYYY-MM-DD para el min del input
    }
  },
  computed: {
    // Agrupo las horas por las horas a las que empiezan las de las 10:00 las de las 11:00 etc..
    groupedSlots() {
      return this.slots.reduce((groups, slot) => {
        const hour = slot.start.split(':')[0] 
        if (!groups[hour]) groups[hour] = []
        groups[hour].push(slot)
        return groups
      }, {})
    }
  },
  methods: {
    async fetchSlots() {
      if (!this.selectedDate) return
      this.selectedSlot = null
      this.slots = []
      this.loading = true
      try {
        const token = localStorage.getItem('user_token')
        const response = await fetch(
          `${BASE_URL}/v1/appointment?service_id=${this.serviceId}&date=${this.selectedDate}`,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Accept': 'application/json'
            }
          }
        )
        const data = await response.json()
        this.slots = data.available_slots
        this.serviceDuration = data.service_duration
      } catch (e) {
        this.slots = []
      } finally {
        this.loading = false
      }
    },
    selectSlot(slot) {
      this.selectedSlot = slot
    },
    confirm() {
      if (!this.selectedSlot) return
      this.$emit('select', {
        date: this.selectedDate,
        start_time: this.selectedSlot.start
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.step-wrapper {
  max-width: 960px;
  margin: 2rem auto;
  padding: 0 1.5rem;
}

/* ── HEADER ── */
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

/* ── LAYOUT DOS COLUMNAS ── */
.datetime-layout {
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 2rem;
  margin-bottom: 2rem;
}

.column-label {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.78rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: var(--nav-text);
  opacity: 0.5;
  margin-bottom: 1rem;

  .material-symbols-outlined { font-size: 16px; }
}

/* ── COLUMNA FECHA ── */
.date-input {
  width: 100%;
  padding: 12px 14px;
  border: 2px solid var(--nav-border, #ddd);
  border-radius: 12px;
  background-color: var(--nav-bg);
  color: var(--nav-text);
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: border-color 0.2s ease;
  margin-bottom: 1rem;

  &:focus {
    outline: none;
    border-color: #52b155;
  }
}

.service-info-box {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 14px;
  border-radius: 10px;
  background-color: rgba(82, 177, 85, 0.08);
  border: 1.5px solid #52b155;
  font-size: 0.88rem;
  color: var(--nav-text);

  .material-symbols-outlined {
    font-size: 18px;
    color: #52b155;
  }
}

/* ── COLUMNA SLOTS ── */
.slots-column {
  min-height: 300px;
}

.slots-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 200px;
  color: var(--nav-text);
  opacity: 0.4;
  gap: 0.8rem;
  border: 2px dashed var(--nav-border, #ddd);
  border-radius: 14px;

  .material-symbols-outlined { font-size: 40px; }
  p { font-weight: 600; margin: 0; }
}

.slots-groups {
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
  max-height: 420px;
  overflow-y: auto;
  padding-right: 4px;
}

.slots-hour-group {}

.slots-hour-label {
  font-size: 0.78rem;
  font-weight: 700;
  color: var(--nav-text);
  opacity: 0.45;
  margin: 0 0 6px 0;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.slots-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.slot-btn {
  padding: 6px 14px;
  border-radius: 8px;
  border: 2px solid var(--nav-border, #ddd);
  background: transparent;
  color: var(--nav-text);
  font-weight: 600;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    border-color: #52b155;
    color: #52b155;
  }

  &.selected {
    background-color: #52b155;
    border-color: #52b155;
    color: #fff;
  }
}

/* ── ACCIONES ── */
.step-actions {
  display: flex;
  justify-content: space-between;
  margin-top: 1rem;
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

.btn-next {
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
    opacity: 0.4;
    cursor: not-allowed;
    transform: none;
  }
}

/* ── LOADING ── */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 200px;
  color: var(--nav-text);
  opacity: 0.5;
  gap: 1rem;
}

.loading-icon { font-size: 48px; color: #52b155; }
.loading-text { font-weight: 600; }

/* ── RESPONSIVE ── */
@media (max-width: 768px) {
  .datetime-layout {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 576px) {
  .step-wrapper { padding: 0 1rem; }
}
</style>