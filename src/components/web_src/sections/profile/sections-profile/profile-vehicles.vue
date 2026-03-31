<template>
    <div v-if="!infoVehicles?.vehicle" class="loading-state">
        <span class="material-symbols-outlined loading-icon">hourglass_empty</span>
        <p class="loading-text">Cargando vehículos...</p>
    </div>

    <div v-else class="vehicles-wrapper">

        <div class="page-header">
            <div class="d-flex align-items-center gap-2">
                <span class="material-symbols-outlined header-icon">directions_car</span>
                <h4 class="page-title">Mis Vehículos</h4>
            </div>
            <div class="d-flex align-items-center gap-3">
                <span class="vehicle-count">{{ infoVehicles.vehicle.length }} vehículo{{ infoVehicles.vehicle.length !==
                    1 ? 's' : '' }}</span>
                <button @click="openModal" class="btn-add">
                    <span class="material-symbols-outlined">add</span>
                    Añadir vehículo
                </button>
            </div>
        </div>

        <!-- EMPTY STATE -->
        <div v-if="!infoVehicles.vehicle.length" class="empty-state">
            <span class="material-symbols-outlined">garage</span>
            <p>No tienes vehículos registrados.</p>
        </div>

        <!-- LISTADO -->
        <div v-else class="vehicles-grid">
            <div v-for="(vehicle, index) in infoVehicles.vehicle" :key="index" class="vehicle-card">
                <div class="vehicle-card-top">
                    <div class="vehicle-icon-wrap">
                        <span class="material-symbols-outlined">directions_car</span>
                    </div>
                    <div class="d-flex align-items-center gap-2">
                        <span class="vehicle-type-badge">{{ vehicle.vehicle_type.name }}</span>
                        <button @click="confirmDelete(vehicle, index)" class="btn-delete-card">
                            <span class="material-symbols-outlined">delete</span>
                        </button>
                    </div>
                </div>
                <h5 class="vehicle-name">{{ vehicle.brand }} {{ vehicle.model }}</h5>
                <div class="vehicle-details">
                    <div class="vehicle-detail">
                        <span class="material-symbols-outlined detail-icon">palette</span>
                        <span>{{ vehicle.color }}</span>
                    </div>
                    <div class="vehicle-detail">
                        <span class="material-symbols-outlined detail-icon">pin</span>
                        <span>{{ vehicle.license_plate }}</span>
                    </div>
                    <div class="vehicle-detail">
                        <span class="material-symbols-outlined detail-icon">straighten</span>
                        <span>{{ vehicle.vehicle_type.dimensions }}</span>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- ── MODAL ── -->
    <Transition name="modal">
        <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
            <div class="modal-box">

                <div class="modal-header">
                    <div class="d-flex align-items-center gap-2">
                        <span class="material-symbols-outlined"
                            style="color: #52b155; font-size: 22px;">directions_car</span>
                        <h5 class="modal-title">Añadir vehículo</h5>
                    </div>
                    <button @click="closeModal" class="btn-close-modal">
                        <span class="material-symbols-outlined">close</span>
                    </button>
                </div>

                <div class="modal-body">

                    <div class="edit-field">
                        <label class="edit-label">
                            <span class="material-symbols-outlined detail-icon">directions_car</span>
                            Marca
                        </label>
                        <input v-model="vehicleForm.brand" class="edit-input" type="text" placeholder="Ej: Toyota" />
                    </div>

                    <div class="edit-field">
                        <label class="edit-label">
                            <span class="material-symbols-outlined detail-icon">car_repair</span>
                            Modelo
                        </label>
                        <input v-model="vehicleForm.model" class="edit-input" type="text" placeholder="Ej: Corolla" />
                    </div>

                    <div class="edit-field">
                        <label class="edit-label">
                            <span class="material-symbols-outlined detail-icon">palette</span>
                            Color
                        </label>
                        <input v-model="vehicleForm.color" class="edit-input" type="text" placeholder="Ej: Rojo" />
                    </div>

                    <div class="edit-field">
                        <label class="edit-label">
                            <span class="material-symbols-outlined detail-icon">pin</span>
                            Matrícula
                        </label>
                        <input v-model="vehicleForm.license_plate" class="edit-input" type="text"
                            placeholder="Ej: 1234ABC" />
                    </div>

                    <div class="edit-field">
                        <label class="edit-label">
                            <span class="material-symbols-outlined detail-icon">category</span>
                            Tipo de vehículo
                        </label>
                        <select v-model="vehicleForm.vehicle_type_id" class="edit-input">
                            <option value="" disabled>Selecciona un tipo</option>
                            <option v-for="type in vehicleTypes" :key="type.id" :value="type.id">
                                {{ type.name }} — {{ type.dimensions }}
                            </option>
                        </select>
                    </div>

                    <!-- ERROR -->
                    <p v-if="formError" class="form-error">
                        <span class="material-symbols-outlined" style="font-size:16px">error</span>
                        {{ formError }}
                    </p>

                </div>

                <div class="modal-footer">
                    <button @click="closeModal" class="btn-cancel">
                        <span class="material-symbols-outlined">close</span>
                        Cancelar
                    </button>
                    <button @click="submitVehicle" class="btn-save" :disabled="saving">
                        <span class="material-symbols-outlined">{{ saving ? 'hourglass_empty' : 'check' }}</span>
                        {{ saving ? 'Guardando...' : 'Añadir' }}
                    </button>
                </div>

            </div>
        </div>
    </Transition>

    <!--Modal de eliminación-->
    <Transition name="modal">
        <div v-if="showDeleteModal" class="modal-overlay" @click.self="closeDeleteModal">
            <div class="modal-box" style="max-width: 400px">

                <div class="modal-header">
                    <div class="d-flex align-items-center gap-2">
                        <span class="material-symbols-outlined" style="color: #dc3545; font-size: 22px;">delete</span>
                        <h5 class="modal-title">Eliminar vehículo</h5>
                    </div>
                    <button @click="closeDeleteModal" class="btn-close-modal">
                        <span class="material-symbols-outlined">close</span>
                    </button>
                </div>

                <div class="modal-body">
                    <p style="color: var(--nav-text); margin: 0;">
                        ¿Estás seguro de que quieres eliminar
                        <strong>{{ vehicleToDelete?.brand }} {{ vehicleToDelete?.model }}</strong>?
                        Esta acción no se puede deshacer.
                    </p>
                </div>

                <div class="modal-footer">
                    <button @click="closeDeleteModal" class="btn-cancel">
                        <span class="material-symbols-outlined">close</span>
                        Cancelar
                    </button>
                    <button @click="deleteVehicle" class="btn-delete" :disabled="deleting">
                        <span class="material-symbols-outlined">{{ deleting ? 'hourglass_empty' : 'delete' }}</span>
                        {{ deleting ? 'Eliminando...' : 'Eliminar' }}
                    </button>
                </div>

            </div>
        </div>
    </Transition>

</template>

<script>
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default {
    props: {
        infoUser: { type: Object, default: () => ({}) },
        infoVehicles: { type: Object, default: () => ({}) },
        infoCartInvoices: { type: Array, default: () => [] },
        infoServiceInvoices: { type: Array, default: () => [] },
        infoAppointments: { type: Array, default: () => [] }
    },
    emits: ['infoUser-update'],
    data() {
        return {
            showModal: false,
            saving: false,
            formError: null,
            vehicleTypes: [],
            vehicleForm: {
                brand: '',
                model: '',
                color: '',
                license_plate: '',
                vehicle_type_id: ''
            },
            showDeleteModal: false,
            deleting: false,
            vehicleToDelete: null,
            vehicleToDeleteIndex: null
        }
    },
    methods: {
        async openModal() {
            this.resetForm();
            this.showModal = true;
            await this.loadVehicleTypes();
        },
        closeModal() {
            this.showModal = false;
            this.resetForm();
        },
        resetForm() {
            this.vehicleForm = {
                brand: '',
                model: '',
                color: '',
                license_plate: '',
                vehicle_type_id: ''
            };
            this.formError = null;
        },
        async loadVehicleTypes() {
            try {
                const token = localStorage.getItem('user_token');
                const response = await fetch(`${BASE_URL}/v1/vehicleType`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                });
                const data = await response.json();
                this.vehicleTypes = data.vehiclesTypes;
            } catch (error) {
                console.error('Error cargando tipos de vehículo:', error);
            }
        },
        async submitVehicle() {
            const token = localStorage.getItem('user_token');
            if(!token) return this.$router.push('/login');

            const { brand, model, color, license_plate, vehicle_type_id } = this.vehicleForm;
            if (!brand || !model || !color || !license_plate || !vehicle_type_id) {
                this.formError = 'Por favor rellena todos los campos.';
                return;
            }

            try {
                this.saving = true;
                this.formError = null;
                const token = localStorage.getItem('user_token');

                const response = await fetch(`${BASE_URL}/v1/vehicles`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(this.vehicleForm)
                });

                const data = await response.json();

                if (!response.ok) {
                    this.formError = data.message ?? 'Error al añadir el vehículo.';
                    return;
                }

                this.infoVehicles.vehicle.push(data.vehicle);
                this.closeModal();

            } catch (error) {
                this.formError = 'Error de conexión, intenta de nuevo.';
                console.error(error);
            } finally {
                this.saving = false;
            }
        },
        confirmDelete(vehicle, index) {
            this.vehicleToDelete = vehicle;
            this.vehicleToDeleteIndex = index;
            this.showDeleteModal = true;
        },
        closeDeleteModal() {
            this.showDeleteModal = false;
            this.vehicleToDelete = null;
            this.vehicleToDeleteIndex = null;
        },
        async deleteVehicle() {
            const token = localStorage.getItem('user_token');
            if(!token) return this.$router.push('/login');
            try {
                this.deleting = true;
                const token = localStorage.getItem('user_token');
            
                const response = await fetch(`${BASE_URL}/v1/vehicles/${this.vehicleToDelete.id}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!response.ok) throw new Error('Error al eliminar');

                this.infoVehicles.vehicle.splice(this.vehicleToDeleteIndex, 1);
                this.closeDeleteModal();

            } catch (error) {
                console.error('Error eliminando vehículo:', error);
            } finally {
                this.deleting = false;
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.vehicles-wrapper {
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

.vehicle-count {
    font-size: 0.85rem;
    font-weight: 600;
    color: var(--nav-text);
    opacity: 0.5;
    background-color: var(--nav-border, #f0f0f0);
    padding: 4px 12px;
    border-radius: 20px;
}

.btn-add {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 8px 16px;
    border-radius: 8px;
    border: 2px solid #52b155;
    background-color: #52b155;
    color: #fff;
    font-weight: 600;
    font-size: 0.9rem;
    cursor: pointer;
    transition: all 0.2s ease;

    .material-symbols-outlined {
        font-size: 20px;
    }

    &:hover {
        opacity: 0.85;
    }
}

/* ── GRID ── */
.vehicles-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    gap: 1.2rem;
}

/* ── CARD ── */
.vehicle-card {
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

.vehicle-card-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.vehicle-icon-wrap {
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

.vehicle-type-badge {
    font-size: 0.75rem;
    font-weight: 700;
    padding: 3px 10px;
    border-radius: 20px;
    background-color: var(--nav-border, #f0f0f0);
    color: var(--nav-text);
}

.vehicle-name {
    font-size: 1.05rem;
    font-weight: 700;
    color: var(--nav-text);
    margin: 0;
}

.vehicle-details {
    display: flex;
    flex-direction: column;
    gap: 6px;
}

.vehicle-detail {
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

/* ── MODAL ── */
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
    max-width: 480px;
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
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.modal-footer {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    padding: 1rem 1.5rem;
    border-top: 1px solid var(--nav-border, #ddd);
}

/* ── FORMULARIO ── */
.edit-field {
    display: flex;
    flex-direction: column;
    gap: 4px;
    margin-bottom: 10px;
}

.edit-label {
    display: flex;
    align-items: center;
    gap: 5px;
    font-size: 0.78rem;
    font-weight: 700;
    color: var(--nav-text);
    opacity: 0.6;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

.edit-input {
    background-color: var(--nav-bg);
    border: 1.5px solid var(--nav-border, #ddd);
    border-radius: 8px;
    padding: 8px 12px;
    color: var(--nav-text);
    font-size: 0.95rem;
    font-weight: 500;
    transition: border-color 0.2s ease;
    outline: none;
    width: 100%;

    &:focus {
        border-color: #52b155;
    }

    option {
        background-color: var(--nav-bg);
        color: var(--nav-text);
    }
}

.form-error {
    display: flex;
    align-items: center;
    gap: 6px;
    color: #dc3545;
    font-size: 0.85rem;
    font-weight: 600;
    margin: 4px 0 0 0;
}

/* ── BOTONES ── */
.btn-save {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 8px 18px;
    border-radius: 8px;
    border: 2px solid #52b155;
    background-color: #52b155;
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

/* ── ANIMACIÓN MODAL ── */
.modal-enter-active,
.modal-leave-active {
    transition: all 0.25s ease;
}

.modal-enter-from,
.modal-leave-to {
    opacity: 0;
    transform: scale(0.95);
}

/* ── RESPONSIVE ── */
@media (max-width: 576px) {
    .vehicles-wrapper {
        padding: 1rem;
    }

    .vehicles-grid {
        grid-template-columns: 1fr;
    }

    .page-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 1rem;
    }
}
.btn-delete-card {
  border: none;
  background: transparent;
  color: #dc3545;
  cursor: pointer;
  padding: 4px;
  border-radius: 6px;
  transition: all 0.2s ease;
  opacity: 0.6;

  .material-symbols-outlined { font-size: 18px; }

  &:hover {
    background-color: rgba(220, 53, 69, 0.1);
    opacity: 1;
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

  .material-symbols-outlined { font-size: 18px; }
  &:hover { opacity: 0.85; }
  &:disabled { opacity: 0.6; cursor: not-allowed; }
}
</style>