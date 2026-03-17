<template>
    <div v-if="!infoAppointments?.appointments" class="loading-state">
        <span class="material-symbols-outlined loading-icon">hourglass_empty</span>
        <p class="loading-text">Cargando citas...</p>
    </div>

    <div v-else class="appointments-wrapper">

        <div class="page-header">
            <div class="d-flex align-items-center gap-2">
                <span class="material-symbols-outlined header-icon">calendar_month</span>
                <h4 class="page-title">Mis Citas</h4>
            </div>
            <div class="d-flex align-items-center gap-3">
                <span class="appointment-count">{{ infoAppointments.appointments.length }} cita{{ infoAppointments.appointments.length !== 1 ? 's' : '' }}</span>
            </div>
        </div>

        <!-- EMPTY STATE -->
        <div v-if="!infoAppointments.appointments.length" class="empty-state">
            <span class="material-symbols-outlined">event_busy</span>
            <p>No tienes citas programadas.</p>
        </div>

        <!-- LISTADO -->
        <div v-else class="appointments-grid">
            <div v-for="(appointment, index) in infoAppointments.appointments" :key="index" class="appointment-card">
                <div class="appointment-card-top">
                    <div class="appointment-icon-wrap">
                        <span class="material-symbols-outlined">event</span>
                    </div>
                    <div class="d-flex align-items-center gap-2">
                        <span class="service-type-badge">{{ appointment.service.type.name }}</span>
                    </div>
                </div>
                
                <h5 class="service-name">{{ appointment.service.name }}</h5>
                
                <div class="appointment-details">
                    <div class="appointment-detail">
                        <span class="material-symbols-outlined detail-icon">directions_car</span>
                        <span>{{ appointment.vehicle.brand }} {{ appointment.vehicle.model }}</span>
                    </div>
                    <div class="appointment-detail">
                        <span class="material-symbols-outlined detail-icon">pin</span>
                        <span>{{ appointment.vehicle.license_plate }}</span>
                    </div>
                    <div class="appointment-detail">
                        <span class="material-symbols-outlined detail-icon">calendar_today</span>
                        <span>{{ formatDate(appointment.appointment_date) }}</span>
                    </div>
                    <div class="appointment-detail">
                        <span class="material-symbols-outlined detail-icon">schedule</span>
                        <span>{{ formatTime(appointment.appointment_date) }} - {{ formatTime(appointment.end_time) }}</span>
                    </div>
                    <div class="appointment-detail">
                        <span class="material-symbols-outlined detail-icon">payments</span>
                        <span>{{ appointment.final_price }}€</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        infoUser: { type: Object, default: () => ({}) },
        infoVehicles: { type: Object, default: () => ({}) },
        infoCartInvoices: { type: Array, default: () => [] },
        infoServiceInvoices: { type: Array, default: () => [] },
        infoAppointments: { type: Object, default: () => ({}) }
    },
    emits: ['infoUser-update'],
    methods: {
        formatDate(dateString) {
            const date = new Date(dateString);
            return date.toLocaleDateString('es-ES', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
            });
        },
        formatTime(dateString) {
            const date = new Date(dateString);
            return date.toLocaleTimeString('es-ES', { 
                hour: '2-digit', 
                minute: '2-digit' 
            });
        }
    }
}
</script>

<style lang="scss" scoped>
.appointments-wrapper {
    padding: 2rem 1.5rem;
    max-width: 960px;
    margin: 0 auto;
}

/* ── HEADER ── */
.page-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 1.5rem;
}

.header-icon {
    font-size: 28px;
    color: #52b155;
}

.page-title {
    font-size: 1.3rem;
    font-weight: 850;
    color: var(--nav-text);
    letter-spacing: -0.5px;
    margin: 0;
}

.appointment-count {
    font-size: 0.85rem;
    font-weight: 600;
    color: var(--nav-text);
    opacity: 0.5;
    background-color: var(--nav-border, #f0f0f0);
    padding: 4px 12px;
    border-radius: 20px;
}

/* ── GRID ── */
.appointments-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 1.2rem;
}

/* ── CARD ── */
.appointment-card {
    background-color: var(--nav-bg);
    border: 1px solid var(--nav-border, #ddd);
    border-radius: 14px;
    padding: 1.4rem;
    display: flex;
    flex-direction: column;
    gap: 12px;
    transition: all 0.3s ease;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);

    &:hover {
        border-color: #52b155;
        transform: translateY(-3px);
        box-shadow: 0 6px 16px rgba(82, 177, 85, 0.15);
    }
}

.appointment-card-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.appointment-icon-wrap {
    width: 48px;
    height: 48px;
    border-radius: 12px;
    background-color: rgba(82, 177, 85, 0.12);
    display: flex;
    align-items: center;
    justify-content: center;

    .material-symbols-outlined {
        font-size: 28px;
        color: #52b155;
    }
}

.service-type-badge {
    font-size: 0.75rem;
    font-weight: 700;
    padding: 3px 10px;
    border-radius: 20px;
    background-color: var(--nav-border, #f0f0f0);
    color: var(--nav-text);
}

.service-name {
    font-size: 1.05rem;
    font-weight: 700;
    color: var(--nav-text);
    margin: 0;
}

.appointment-details {
    display: flex;
    flex-direction: column;
    gap: 6px;
}

.appointment-detail {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 0.88rem;
    color: var(--nav-text);
    opacity: 0.65;
}

.detail-icon {
    font-size: 16px !important;
    color: #52b155;
    opacity: 1;
}

/* ── EMPTY STATE ── */
.empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 4rem 2rem;
    color: var(--nav-text);
    opacity: 0.4;

    .material-symbols-outlined {
        font-size: 56px;
        margin-bottom: 1rem;
    }

    p {
        margin: 0;
        font-size: 0.95rem;
        font-weight: 600;
    }
}

/* ── LOADING ── */
.loading-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 60vh;
    color: var(--nav-text);
    opacity: 0.5;
}

.loading-icon {
    font-size: 52px;
    color: #52b155;
    margin-bottom: 1rem;
}

.loading-text {
    font-weight: 600;
}

/* ── RESPONSIVE ── */
@media (max-width: 576px) {
    .appointments-wrapper {
        padding: 1rem;
    }

    .appointments-grid {
        grid-template-columns: 1fr;
    }

    .page-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 1rem;
    }
}
</style>