<template>
  <div class="step-wrapper">

    <div class="step-header">
      <span class="material-symbols-outlined step-header-icon">directions_car</span>
      <div>
        <h2 class="step-title">Selecciona tu vehículo</h2>
        <p class="step-subtitle">Elige el coche al que quieres aplicar el servicio</p>
      </div>
    </div>

    <!-- SIN SESIÓN INICIADA -->
    <div v-if="notLoggedIn" class="login-required-state">
      <span class="material-symbols-outlined login-icon">lock</span>
      <h3 class="login-title">Inicia sesión para continuar</h3>
      <p class="login-desc">Necesitas una cuenta para poder seleccionar un vehículo y reservar una cita.</p>
      <button class="btn-next" @click="$router.push('/login')">
        <span class="material-symbols-outlined">login</span>
        Iniciar sesión
      </button>
    </div>

    <div v-else-if="loading" class="loading-state">
      <span class="material-symbols-outlined loading-icon">hourglass_empty</span>
      <p class="loading-text">Cargando vehículos...</p>
    </div>

    <div v-else-if="error" class="error-state">
      <span class="material-symbols-outlined">error</span>
      <p>{{ error }}</p>
    </div>

    <!--EN CASO DE QUE NO TENGA COCHES-->
    <div v-else-if="!vehicles.length" class="loading-state">
      <span class="material-symbols-outlined loading-icon">garage</span>
      <p class="loading-text">No tienes vehículos registrados</p>
      <button class="btn-next" @click="$router.push('/profile/vehicles')">
        <span class="material-symbols-outlined">add_circle</span>
        Añadir vehículo
      </button>
    </div>

    <!-- LISTA DE COCHES -->
    <div v-else class="vehicles-grid">
      <div v-for="vehicle in vehicles" :key="vehicle.id" class="vehicle-card"
        :class="{ selected: selectedId === vehicle.id }" @click="selectVehicle(vehicle)">
        <div class="vehicle-card-top">
          <div class="vehicle-icon-wrap" :class="{ 'vehicle-icon-wrap--selected': selectedId === vehicle.id }">
            <span class="material-symbols-outlined">directions_car</span>
          </div>
          <span v-if="selectedId === vehicle.id" class="check-badge">
            <span class="material-symbols-outlined">check</span>
          </span>
        </div>

        <p class="vehicle-brand">{{ vehicle.brand }} {{ vehicle.model }}</p>
        <p class="vehicle-plate">{{ vehicle.license_plate }}</p>

        <div class="vehicle-meta">
          <span class="vehicle-tag">{{ vehicle.vehicle_type.name }}</span>
          <span class="vehicle-tag">{{ vehicle.color }}</span>
        </div>
      </div>
    </div>

    <div class="step-actions">
      <button class="btn-next" :disabled="!selectedId" @click="confirm">
        Siguiente
        <span class="material-symbols-outlined">arrow_forward</span>
      </button>
    </div>

  </div>
</template>

<script>
const BASE_URL = import.meta.env.VITE_API_BASE_URL

export default {
  emits: ['select'],
  data() {
    return {
      vehicles: [],
      selectedId: null,
      selectedVehicle: null,
      loading: false,
      error: null,
      notLoggedIn: false
    }
  },
  async mounted() {
    const token = localStorage.getItem('user')
    if (!token) {
      this.notLoggedIn = true
      return
    }
    await this.fetchVehicles()
    document.title = "Cita | Vehículo"

  },
  methods: {
    async fetchVehicles() {
      this.loading = true
      try {
        const token = localStorage.getItem('user')
        const response = await fetch(`${BASE_URL}/v1/vehicles`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json'
          }
        })
        const data = await response.json()
        this.vehicles = data.data
      } catch (e) {
        this.error = 'No se pudieron cargar los vehículos'
      } finally {
        this.loading = false
      }
    },
    selectVehicle(vehicle) {
      this.selectedId = vehicle.id
      this.selectedVehicle = vehicle
    },
    confirm() {
      if (!this.selectedVehicle) return
      this.$emit('select', this.selectedVehicle)
    }
  }
}
</script>

<style lang="scss" scoped>
.step-wrapper {
  max-width: 860px;
  margin: 2rem auto;
  padding: 0 1.5rem;
}

/* ── HEADER DEL PASO ── */
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

/* ── GRID DE VEHÍCULOS ── */
.vehicles-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
}

.vehicle-card {
  background-color: var(--nav-bg);
  border: 2px solid var(--nav-border, #ddd);
  border-radius: 14px;
  padding: 1.2rem;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  position: relative;

  &:hover {
    border-color: #52b155;
    box-shadow: 0 4px 12px rgba(82, 177, 85, 0.12);
    transform: translateY(-2px);
  }

  &.selected {
    border-color: #52b155;
    background-color: rgba(82, 177, 85, 0.06);
    box-shadow: 0 4px 16px rgba(82, 177, 85, 0.2);
  }
}

.vehicle-card-top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 1rem;
}

.vehicle-icon-wrap {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background-color: rgba(82, 177, 85, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;

  .material-symbols-outlined {
    font-size: 26px;
    color: #52b155;
  }

  &--selected {
    background-color: #52b155;

    .material-symbols-outlined {
      color: #fff;
    }
  }
}

.check-badge {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background-color: #52b155;
  display: flex;
  align-items: center;
  justify-content: center;

  .material-symbols-outlined {
    font-size: 16px;
    color: #fff;
  }
}

.vehicle-brand {
  font-weight: 700;
  font-size: 0.95rem;
  color: var(--nav-text);
  margin: 0 0 4px 0;
}

.vehicle-plate {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--nav-text);
  opacity: 0.5;
  margin: 0 0 10px 0;
  letter-spacing: 0.5px;
}

.vehicle-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.vehicle-tag {
  font-size: 0.72rem;
  font-weight: 600;
  padding: 3px 10px;
  border-radius: 20px;
  background-color: var(--nav-border, #f0f0f0);
  color: var(--nav-text);
  opacity: 0.7;
}

/* ── ACCIONES ── */
.step-actions {
  display: flex;
  justify-content: flex-end;
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

  .material-symbols-outlined {
    font-size: 20px;
  }

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

/* ── ESTADOS ── */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 30vh;
  color: var(--nav-text);
  opacity: 0.5;
  gap: 1rem;
}

.loading-icon {
  font-size: 52px;
  color: #52b155;
}

.loading-text {
  font-weight: 600;
}

.error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 30vh;
  color: #dc3545;
  gap: 1rem;

  .material-symbols-outlined {
    font-size: 48px;
  }
}

/* ── ESTADO: REQUIERE LOGIN ── */
.login-required-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 35vh;
  text-align: center;
  gap: 0.5rem;
}

.login-icon {
  font-size: 56px;
  color: #f59e0b;
  margin-bottom: 0.5rem;
}

.login-title {
  font-size: 1.2rem;
  font-weight: 800;
  color: var(--nav-text);
  margin: 0;
}

.login-desc {
  font-size: 0.88rem;
  color: var(--nav-text);
  opacity: 0.55;
  margin: 0 0 1rem 0;
  max-width: 360px;
}

/* ── RESPONSIVE ── */
@media (max-width: 576px) {
  .step-wrapper {
    padding: 0 1rem;
  }

  .vehicles-grid {
    grid-template-columns: 1fr 1fr;
  }
}
</style>