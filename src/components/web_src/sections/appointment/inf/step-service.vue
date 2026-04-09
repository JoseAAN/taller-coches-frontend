<template>
  <div class="step-wrapper">

    <div class="step-header">
      <span class="material-symbols-outlined step-header-icon">home_repair_service</span>
      <div>
        <h2 class="step-title">Selecciona el servicio</h2>
        <p class="step-subtitle">Elige el servicio que quieres aplicar a tu vehículo</p>
      </div>
    </div>

    <div v-if="loading" class="loading-state">
      <span class="material-symbols-outlined loading-icon">hourglass_empty</span>
      <p class="loading-text">Cargando servicios...</p>
    </div>

    <div v-else-if="error" class="error-state">
      <span class="material-symbols-outlined">error</span>
      <p>{{ error }}</p>
    </div>

    <!-- SERVICIOS AGRUPADOS POR TIPO -->
    <div v-else>
      <div
        v-for="(group, typeName) in groupedServices"
        :key="typeName"
        class="service-group"
      >
        <p class="group-title">
          <span class="material-symbols-outlined group-icon">category</span>
          {{ typeName }}
        </p>

        <div class="services-grid">
          <div
            v-for="service in group"
            :key="service.id"
            class="service-card"
            :class="{ selected: selectedId === service.id }"
            @click="selectService(service)"
          >
            <div class="service-card-top">
              <div class="service-icon-wrap" :class="{ 'service-icon-wrap--selected': selectedId === service.id }">
                <span class="material-symbols-outlined">home_repair_service</span>
              </div>
              <span v-if="selectedId === service.id" class="check-badge">
                <span class="material-symbols-outlined">check</span>
              </span>
            </div>

            <p class="service-name">{{ service.name }}</p>
            <p class="service-description">{{ service.description }}</p>

            <div class="service-meta">
              <span class="service-tag">
                <span class="material-symbols-outlined">schedule</span>
                {{ service.average_duration_mins }} min
              </span>
              <span class="service-price">{{ service.price }} €</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="step-actions">
      <button class="btn-back" @click="$emit('back')">
        <span class="material-symbols-outlined">arrow_back</span>
        Volver
      </button>
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
  emits: ['select', 'back'],
    props: {
    preselectedId: { default: null }
  },
  data() {
    return {
      services: [],
      selectedId: null,
      selectedService: null,
      loading: false,
      error: null
    }
  },
  computed: {
    //agrupo los servicios por nombre
    groupedServices() {
      return this.services.reduce((groups, service) => {
        const typeName = service?.type?.name || 'Otros'
        if (!groups[typeName]) {
          groups[typeName] = []
        }
        groups[typeName].push(service)
        return groups
      }, {})
    }
  },
  async mounted() {
    await this.fetchServices()

    if (this.preselectedId) {
      const service = this.services.find(s => s.id == this.preselectedId)
      if (service) this.selectService(service)
    }
  },
  methods: {
    async fetchServices() {
      this.loading = true
      this.error = null
      this.services = []
      try {
        const token = localStorage.getItem('user')
        const response = await fetch(`${BASE_URL}/v1/services`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json'
          }
        })

        const data = await response.json().catch(() => null)
        if (!response.ok) {
          this.error = data?.message || 'No se pudieron cargar los servicios'
          return
        }

        if (!Array.isArray(data?.data)) {
          this.error = 'La lista de servicios no tiene un formato valido'
          return
        }

        this.services = data.data
      } catch (e) {
        this.error = 'No se pudieron cargar los servicios'
      } finally {
        this.loading = false
      }
    },
    selectService(service) {
      this.selectedId = service.id
      this.selectedService = service
    },
    confirm() {
      if (!this.selectedService) return
      this.$emit('select', this.selectedService)
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

/* ── GRUPOS ── */
.service-group {
  margin-bottom: 2rem;
}

.group-title {
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
}

.group-icon { font-size: 16px; }

/* ── GRID ── */
.services-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 1rem;
}

.service-card {
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

.service-card-top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 1rem;
}

.service-icon-wrap {
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
    .material-symbols-outlined { color: #fff; }
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

.service-name {
  font-weight: 700;
  font-size: 0.95rem;
  color: var(--nav-text);
  margin: 0 0 6px 0;
}

.service-description {
  font-size: 0.82rem;
  color: var(--nav-text);
  opacity: 0.5;
  margin: 0 0 12px 0;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.service-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.service-tag {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 0.75rem;
  font-weight: 600;
  padding: 3px 10px;
  border-radius: 20px;
  background-color: var(--nav-border, #f0f0f0);
  color: var(--nav-text);
  opacity: 0.7;

  .material-symbols-outlined { font-size: 14px; }
}

.service-price {
  font-size: 1rem;
  font-weight: 850;
  color: #52b155;
  letter-spacing: -0.5px;
}

/* ── ACCIONES ── */
.step-actions {
  display: flex;
  justify-content: space-between;
  margin-top: 2rem;
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

.loading-text { font-weight: 600; }

.error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 30vh;
  color: #dc3545;
  gap: 1rem;

  .material-symbols-outlined { font-size: 48px; }
}

/* ── RESPONSIVE ── */
@media (max-width: 576px) {
  .step-wrapper { padding: 0 1rem; }
  .services-grid { grid-template-columns: 1fr; }
}
</style>
