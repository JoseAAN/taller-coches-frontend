<template>
    <div class="appointment-card-container">
        <div v-if="loading" class="loading-state">
            <span class="material-symbols-outlined loader-spin">sync</span>
            <p>Cargando opciones de reserva...</p>
        </div>

        <div v-else class="appointment-form-card">
            <div class="card-header">
                <h2 class="form-title">Configura tu Cita</h2>
                <p class="form-subtitle">Selecciona tu vehículo y el horario que mejor te venga.</p>
            </div>

            <div class="form-body">
                <!-- SECCIÓN SERVICIO -->
                <div v-if="selectedService" class="form-section service-summary">
                    <div class="section-icon">
                        <span class="material-symbols-outlined">build</span>
                    </div>
                    <div class="section-content">
                        <h4 class="service-name">{{ selectedService.name }}</h4>
                        <p class="service-price">Precio del servicio: {{ selectedService.price }}€</p>
                    </div>
                </div>

                <!-- SECCIÓN VEHÍCULO -->
                <div class="form-section">
                    <label class="section-label">
                        <span class="material-symbols-outlined">directions_car</span>
                        Tu Vehículo
                    </label>
                    <div v-if="vehicles.length === 0" class="no-vehicles">
                        <p>No tienes vehículos registrados.</p>
                        <router-link to="/profile/vehicles" class="btn-link">Añadir Vehículo</router-link>
                    </div>
                    <select v-else v-model="booking.vehicle_id" class="form-select">
                        <option value="" disabled>Selecciona un vehículo</option>
                        <option v-for="v in vehicles" :key="v.id" :value="v.id">
                            {{ v.brand }} {{ v.model }} ({{ v.license_plate }})
                        </option>
                    </select>
                </div>

                <!-- SECCIÓN FECHA -->
                <div class="form-section">
                    <label class="section-label">
                        <span class="material-symbols-outlined">calendar_today</span>
                        Fecha de la Cita
                    </label>
                    <input type="date" v-model="booking.date" :min="minDate" class="form-input" @change="fetchAvailableSlots" />
                </div>

                <!-- SECCIÓN HORAS -->
                <div v-if="booking.date" class="form-section">
                    <label class="section-label">
                        <span class="material-symbols-outlined">schedule</span>
                        Horarios Disponibles
                    </label>
                    
                    <div v-if="loadingSlots" class="slots-loading">
                        <span class="material-symbols-outlined loader-spin">sync</span>
                        <span>Buscando huecos...</span>
                    </div>

                    <div v-else-if="availableSlots.length === 0" class="no-slots">
                        <span class="material-symbols-outlined">event_busy</span>
                        <p>No hay huecos disponibles para esta fecha.</p>
                    </div>

                    <div v-else class="slots-grid">
                        <button 
                            v-for="slot in availableSlots" 
                            :key="slot.start" 
                            class="slot-btn"
                            :class="{ active: booking.start_time === slot.start }"
                            @click="booking.start_time = slot.start"
                        >
                            {{ slot.start }}
                        </button>
                    </div>
                </div>
            </div>

            <div class="form-footer">
                <button 
                    class="btn-confirm" 
                    :disabled="!isFormValid || saving"
                    @click="confirmBooking"
                >
                    <span v-if="saving" class="material-symbols-outlined loader-spin">sync</span>
                    <span v-else class="material-symbols-outlined">shopping_cart</span>
                    {{ saving ? 'Procesando...' : 'Añadir Cita al Carrito' }}
                </button>
            </div>
        </div>
    </div>
</template>

<script>
import { cart, ITEM_TYPES } from '@/JS/Cart.js';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default {
    name: 'AppointmentView',
    data() {
        return {
            loading: true,
            saving: false,
            loadingSlots: false,
            vehicles: [],
            selectedService: null,
            availableSlots: [],
            booking: {
                vehicle_id: '',
                date: '',
                start_time: '',
            },
            minDate: new Date().toISOString().split('T')[0]
        }
    },

    computed: {
        isFormValid() {
            return this.booking.vehicle_id && this.booking.date && this.booking.start_time && this.selectedService;
        }
    },

    methods: {
        async loadInitialData() {
            const token = localStorage.getItem('user_token');
            const serviceId = this.$route.query.service_id;

            try {
                // 1. Cargar Vehículos
                const vRes = await fetch(`${BASE_URL}/v1/vehicles`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const vData = await vRes.json();
                this.vehicles = vData.vehicle || [];

                // 2. Cargar Servicio si viene en query
                if (serviceId) {
                    const sRes = await fetch(`${BASE_URL}/v1/services/${serviceId}`);
                    const sData = await sRes.json();
                    this.selectedService = sData.data;
                }

            } catch (err) {
                console.error('Error loading initial data:', err);
            } finally {
                this.loading = false;
            }
        },

        async fetchAvailableSlots() {
            if (!this.booking.date || !this.selectedService) return;

            this.loadingSlots = true;
            this.booking.start_time = '';
            try {
                const res = await fetch(`${BASE_URL}/v1/appointments?service_id=${this.selectedService.id}&date=${this.booking.date}`);
                const data = await res.json();
                this.availableSlots = data.available_slots || [];
            } catch (err) {
                console.error('Error fetching slots:', err);
            } finally {
                this.loadingSlots = false;
            }
        },

        async confirmBooking() {
            if (!this.isFormValid) return;

            this.saving = true;
            const token = localStorage.getItem('user_token');

            try {
                // 1. Crear la Cita en el backend (Appointment)
                const res = await fetch(`${BASE_URL}/v1/appointments`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        vehicle_id: this.booking.vehicle_id,
                        service_id: this.selectedService.id,
                        appointment_date: this.booking.date,
                        start_time: this.booking.start_time
                    })
                });

                const data = await res.json();

                if (!res.ok) {
                    alert(data.message || 'Error al crear la cita');
                    return;
                }

                const appointmentId = data.appointment.id;

                // 2. Añadir la cita al Carrito Unificado
                const cartResult = await cart.addToCart(
                    ITEM_TYPES.SERVICE, 
                    appointmentId, 
                    1, 
                    this.selectedService.price
                );

                if (cartResult.success) {
                    this.$router.push('/cart');
                }

            } catch (err) {
                console.error('Error confirming booking:', err);
                alert('Ocurrió un error al procesar tu reserva.');
            } finally {
                this.saving = false;
            }
        }
    },

    mounted() {
        this.loadInitialData();
    }
}
</script>

<style scoped>
.appointment-card-container {
    max-width: 600px;
    margin: 2rem auto;
    padding: 0 1rem;
}

.appointment-form-card {
    background: var(--nav-bg);
    border: 1px solid var(--nav-border);
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 10px 40px rgba(0,0,0,0.08);
}

.card-header {
    background: #52b155;
    padding: 1.5rem;
    color: white;
    text-align: center;
}

.form-title {
    font-size: 1.5rem;
    font-weight: 800;
    margin: 0;
}

.form-subtitle {
    font-size: 0.9rem;
    opacity: 0.9;
    margin: 0.5rem 0 0;
}

.form-body {
    padding: 2rem;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
}

.form-section {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.section-label {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 0.85rem;
    font-weight: 700;
    color: var(--nav-text);
    opacity: 0.7;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

.form-select, .form-input {
    width: 100%;
    padding: 12px;
    border-radius: 8px;
    border: 1.5px solid var(--nav-border);
    background: var(--nav-bg);
    color: var(--nav-text);
    font-size: 1rem;
    outline: none;
}

.form-select:focus, .form-input:focus {
    border-color: #52b155;
}

.service-summary {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1rem;
    background: rgba(82, 177, 85, 0.05);
    border-radius: 12px;
    border: 1px dashed #52b155;
}

.section-icon {
    width: 48px;
    height: 48px;
    background: #52b155;
    color: white;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
}

.service-name {
    margin: 0;
    font-size: 1.1rem;
    font-weight: 700;
}

.service-price {
    margin: 0;
    font-size: 0.9rem;
    color: #52b155;
    font-weight: 600;
}

.slots-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
    gap: 8px;
    margin-top: 0.5rem;
}

.slot-btn {
    padding: 10px;
    border: 1px solid var(--nav-border);
    border-radius: 8px;
    background: var(--nav-bg);
    color: var(--nav-text);
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
}

.slot-btn:hover {
    border-color: #52b155;
    color: #52b155;
}

.slot-btn.active {
    background: #52b155;
    color: white;
    border-color: #52b155;
}

.form-footer {
    padding: 1.5rem 2rem;
    background: rgba(0,0,0,0.02);
    border-top: 1px solid var(--nav-border);
}

.btn-confirm {
    width: 100%;
    padding: 14px;
    border-radius: 12px;
    border: none;
    background: #52b155;
    color: white;
    font-weight: 800;
    font-size: 1rem;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    cursor: pointer;
    transition: all 0.3s;
}

.btn-confirm:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(82, 177, 85, 0.3);
}

.btn-confirm:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.loader-spin {
    animation: spin 1s linear infinite;
}

@keyframes spin {
    100% { transform: rotate(360deg); }
}

.no-vehicles, .no-slots {
    padding: 1rem;
    text-align: center;
    border: 1px solid var(--nav-border);
    border-radius: 8px;
    opacity: 0.6;
}

.btn-link {
    color: #52b155;
    font-weight: 700;
    text-decoration: none;
}
</style>