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
                <span class="appointment-count">
                    {{ infoAppointments.appointments.length }} cita{{ infoAppointments.appointments.length !== 1 ? 's' :
                    '' }}
                </span>
            </div>
        </div>

        <div v-if="!infoAppointments.appointments.length" class="empty-state">
            <span class="material-symbols-outlined">event_busy</span>
            <p>No tienes citas programadas.</p>
        </div>

        <div v-else class="appointments-grid">
            <div v-for="(appointment, index) in infoAppointments.appointments" :key="index" class="appointment-card">
                <div class="appointment-card-top">
                    <div class="appointment-icon-wrap">
                        <span class="material-symbols-outlined">event</span>
                    </div>
                    <span class="service-type-badge">{{ appointment.service.type.name }}</span>
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
                        <span>{{ formatTime(appointment.appointment_date) }} - {{ formatTime(appointment.end_time)
                            }}</span>
                    </div>
                    <div class="appointment-detail">
                        <span class="material-symbols-outlined detail-icon">payments</span>
                        <span>{{ appointment.final_price }}€</span>
                    </div>
                </div>

                <button @click="confirmCancel(appointment, index)" class="btn-cancel-cita">
                    <span class="material-symbols-outlined">cancel</span>
                    Cancelar cita
                </button>
            </div>
        </div>
    </div>

    <Transition name="modal">
        <div v-if="showDeleteModal" class="modal-overlay" @click.self="closeDeleteModal">
            <div class="modal-box">

                <div class="modal-header">
                    <div class="d-flex align-items-center gap-2">
                        <span class="material-symbols-outlined" style="color: #dc3545; font-size: 22px;">cancel</span>
                        <h5 class="modal-title">Cancelar cita</h5>
                    </div>
                    <button @click="closeDeleteModal" class="btn-close-modal">
                        <span class="material-symbols-outlined">close</span>
                    </button>
                </div>

                <div class="modal-body">
                    <p style="color: var(--nav-text); margin: 0;">
                        ¿Estás seguro de que quieres cancelar la cita de
                        <strong>{{ appointmentToDelete?.service?.name }}</strong>
                        del día
                        <strong>{{ appointmentToDelete ? formatDate(appointmentToDelete.appointment_date) : ''
                            }}</strong>?
                        Esta acción no se puede deshacer.
                    </p>
                </div>

                <div class="modal-footer">
                    <button @click="closeDeleteModal" class="btn-cancel">
                        <span class="material-symbols-outlined">close</span>
                        Volver
                    </button>
                    <button @click="cancelarCita" class="btn-delete" :disabled="deleting">
                        <span class="material-symbols-outlined">{{ deleting ? 'hourglass_empty' : 'cancel' }}</span>
                        {{ deleting ? 'Cancelando...' : 'Cancelar cita' }}
                    </button>
                </div>

            </div>
        </div>
    </Transition>
</template>

<script>
import { loaderState } from '@/loaderState';

export default {
    props: {
        infoUser: { type: Object, default: () => ({}) },
        infoVehicles: { type: Object, default: () => ({}) },
        infoCartInvoices: { type: Array, default: () => [] },
        infoServiceInvoices: { type: Array, default: () => [] },
        infoAppointments: { type: Object, default: () => ({}) }
    },
    emits: ['infoUser-update'],

    data() {
        return {
            showDeleteModal: false,
            deleting: false,
            appointmentToDelete: null,
            appointmentToDeleteIndex: null,
        };
    },

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
        },

        confirmCancel(appointment, index) {
            this.appointmentToDelete = appointment;
            this.appointmentToDeleteIndex = index;
            this.showDeleteModal = true;
        },

        closeDeleteModal() {
            this.showDeleteModal = false;
            this.appointmentToDelete = null;
            this.appointmentToDeleteIndex = null;
        },

        async cancelarCita() {
            const token = localStorage.getItem('user_token');
            if (!token) return this.$router.push('/login');

            try {
                this.deleting = true;
                loaderState.show();

                // 1. Buscamos si la cita tiene un item en el carrito
                // La cita ya tiene el item_id si la API lo devuelve,
                // sino buscamos en el carrito del usuario
                const cartResponse = await fetch(`${this.$BASE_URL}/v1/user-cart`, {
                    headers: {
                        'Content-Type': 'application/json',
                        Accept: 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (cartResponse.ok) {
                    const cartData = await cartResponse.json();

                    // Buscamos dentro de los items del carrito si alguno
                    // corresponde a esta cita
                    const itemEnCarrito = cartData.items?.find(
                        item => item.itemAppointment?.appointment_id === this.appointmentToDelete.id
                    );

                    // 2. Si existe el item en el carrito, lo borramos primero
                    if (itemEnCarrito) {
                        await fetch(`${this.$BASE_URL}/v1/cart-items/${itemEnCarrito.id}`, {
                            method: 'DELETE',
                            headers: {
                                'Content-Type': 'application/json',
                                Accept: 'application/json',
                                Authorization: `Bearer ${token}`,
                            },
                        });
                    }
                }

                // 3. Borramos la cita
                const response = await fetch(`${this.$BASE_URL}/v1/appointment/${this.appointmentToDelete.id}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        Accept: 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    console.error('Error al cancelar la cita');
                    return;
                }

                // 4. La quitamos de la lista visual
                this.infoAppointments.appointments.splice(this.appointmentToDeleteIndex, 1);
                this.closeDeleteModal();

            } catch (error) {
                console.error('Error al cancelar cita:', error);
            } finally {
                this.deleting = false;
                loaderState.hide();
            }
        },
    }
}
</script>

<style lang="scss" scoped>
.appointments-wrapper {
    padding: 2rem 1.5rem;
    max-width: 960px;
    margin: 0 auto;
}

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

.appointments-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 1.2rem;
}

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

.btn-cancel-cita {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    width: 100%;
    padding: 10px 16px;
    border-radius: 10px;
    border: 2px solid #dc3545;
    background-color: transparent;
    color: #dc3545;
    font-weight: 700;
    font-size: 0.9rem;
    cursor: pointer;
    transition: all 0.2s ease;
    margin-top: 4px;

    .material-symbols-outlined {
        font-size: 18px;
    }

    &:hover {
        background-color: #dc3545;
        color: #fff;
    }
}

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

.modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 200;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1rem;
}

.modal-box {
    background-color: var(--nav-bg);
    border: 1px solid var(--nav-border, #ddd);
    border-radius: 16px;
    width: 100%;
    max-width: 440px;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
    overflow: hidden;
}

.modal-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1.2rem 1.5rem;
    border-bottom: 1px solid var(--nav-border, #ddd);
}

.modal-title {
    font-size: 1rem;
    font-weight: 700;
    color: var(--nav-text);
    margin: 0;
}

.btn-close-modal {
    border: none;
    background: transparent;
    color: var(--nav-text);
    cursor: pointer;
    opacity: 0.5;
    transition: opacity 0.2s;

    .material-symbols-outlined {
        font-size: 22px;
    }

    &:hover {
        opacity: 1;
    }
}

.modal-body {
    padding: 1.5rem;
}

.modal-footer {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    padding: 1rem 1.5rem;
    border-top: 1px solid var(--nav-border, #ddd);
}

.btn-cancel {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 8px 18px;
    border-radius: 8px;
    border: 2px solid var(--nav-border, #ddd);
    background: transparent;
    color: var(--nav-text);
    font-weight: 600;
    font-size: 0.9rem;
    cursor: pointer;
    transition: all 0.2s ease;

    .material-symbols-outlined {
        font-size: 18px;
    }

    &:hover {
        background-color: var(--nav-border, #f0f0f0);
    }
}

.btn-delete {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 8px 18px;
    border-radius: 8px;
    border: 2px solid #dc3545;
    background-color: #dc3545;
    color: #fff;
    font-weight: 600;
    font-size: 0.9rem;
    cursor: pointer;
    transition: all 0.2s ease;

    .material-symbols-outlined {
        font-size: 18px;
    }

    &:hover {
        opacity: 0.85;
    }

    &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }
}

.modal-enter-active,
.modal-leave-active {
    transition: all 0.25s ease;
}

.modal-enter-from,
.modal-leave-to {
    opacity: 0;
    transform: scale(0.95);
}

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