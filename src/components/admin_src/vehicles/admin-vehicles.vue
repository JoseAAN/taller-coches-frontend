<template>
    <div class="admin-container p-4">

        <!-- Cabecera -->
        <div class="mb-4">
            <button class="btn-back mb-3" @click="$router.push('/admin')">
                <span class="material-symbols-outlined">arrow_back</span>
                Panel de administración
            </button>
            <div class="d-flex justify-content-between align-items-center">
                <div>
                    <h2 class="text-white fw-bold h4 m-0">Gestión de Vehículos</h2>
                    <p class="text-white small mb-0 mt-1">Directorio de los vehículos de todos los usuarios.</p>
                </div>
                <button class="btn btn-success" @click="openCreateModal" style="display:flex; align-items:center; gap:5px;">
                    <span class="material-symbols-outlined">add</span> Añadir Vehículo
                </button>
            </div>
        </div>

        <!-- Filtros -->
        <div class="d-flex gap-3 mb-4 flex-wrap">
            <div class="search-wrapper flex-grow-1" style="background: #1e293b; padding: 10px 15px; border-radius: 8px; display: flex; align-items: center; gap: 10px; border: 1px solid #334155;">
                <span class="material-symbols-outlined" style="color: #94a3b8;">search</span>
                <input
                    v-model="search"
                    type="text"
                    class="form-control custom-search-input bg-transparent text-white border-0 shadow-none p-0"
                    placeholder="Buscar por matrícula, marca, modelo o dueño..."
                />
            </div>

            <div style="min-width: 250px;">
                <select v-model="filterType" class="form-select h-100 shadow-none" style="background: #1e293b; color: #f8fafc; border: 1px solid #334155;">
                    <option value="">Todos los tipos</option>
                    <option v-for="t in vehicleTypes" :key="t.id" :value="t.id">{{ t.name }}</option>
                </select>
            </div>
        </div>

        <!-- Mensaje de carga -->
        <div v-if="loading" class="text-center text-white py-5">
            Cargando vehículos...
        </div>

        <!-- Tabla -->
        <div v-else class="table-responsive shadow-lg rounded-3">
            <table class="table table-dark align-middle m-0" style="background-color: #1e293b;">
                <thead style="border-bottom: 2px solid #334155;">
                    <tr>
                        <th>Matrícula</th>
                        <th>Marca y Modelo</th>
                        <th>Color</th>
                        <th>Tipo</th>
                        <th>Propietario</th>
                        <th class="text-end">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-if="filteredVehicles.length === 0">
                        <td colspan="6" class="text-center text-white-50 py-5">
                            No se encontraron vehículos.
                        </td>
                    </tr>
                    <tr v-for="vehicle in filteredVehicles" :key="vehicle.id" style="border-bottom: 1px solid #334155;">
                        <td class="text-white fw-bold"><span class="badge bg-secondary">{{ vehicle.license_plate }}</span></td>
                        <td class="text-white fw-medium">{{ vehicle.brand }} {{ vehicle.model }}</td>
                        <td class="text-white">{{ vehicle.color }}</td>
                        <td class="text-light">{{ vehicle.vehicle_type?.name || vehicle.vehicleType?.name || '---' }}</td>
                        <td class="text-light">{{ vehicle.user?.name || 'Varios/Ninguno' }}</td>
                        <td class="text-end">
                            <button class="btn btn-sm btn-outline-light me-2" @click="openEditModal(vehicle)" title="Editar">
                                <span class="material-symbols-outlined" style="font-size: 18px">edit</span>
                            </button>
                            <button class="btn btn-sm btn-outline-danger" @click="confirmDelete(vehicle)" title="Eliminar">
                                <span class="material-symbols-outlined" style="font-size: 18px">delete</span>
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- Modal Crear/Editar -->
        <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
            <div class="modal-card" style="background: #0f172a; padding: 2rem; border-radius: 12px; width: 100%; max-width: 500px; border: 1px solid #334155;">
                <h4 class="text-white mb-4">{{ isEditing ? 'Editar Vehículo' : 'Nuevo Vehículo' }}</h4>
                <form @submit.prevent="saveVehicle">
                    
                    <div class="mb-3">
                        <label class="form-label text-light">A nombre de (Cliente)</label>
                        <select v-model="form.user_id" class="form-select bg-dark text-white border-secondary">
                            <option value="">Seleccione el propietario...</option>
                            <option v-for="u in usersList" :key="u.id" :value="u.id">{{ u.name }} ({{ u.email }})</option>
                        </select>
                    </div>

                    <div class="mb-3">
                        <label class="form-label text-light">Matrícula</label>
                        <input v-model="form.license_plate" type="text" class="form-control bg-dark text-white border-secondary" required />
                    </div>

                    <div class="row">
                        <div class="col-6 mb-3">
                            <label class="form-label text-light">Marca</label>
                            <input v-model="form.brand" type="text" class="form-control bg-dark text-white border-secondary" required />
                        </div>
                        <div class="col-6 mb-3">
                            <label class="form-label text-light">Modelo</label>
                            <input v-model="form.model" type="text" class="form-control bg-dark text-white border-secondary" required />
                        </div>
                    </div>

                    <div class="row">
                        <div class="col-6 mb-3">
                            <label class="form-label text-light">Color</label>
                            <input v-model="form.color" type="text" class="form-control bg-dark text-white border-secondary" required />
                        </div>
                        <div class="col-6 mb-3">
                            <label class="form-label text-light">Tipo de Vehículo</label>
                            <select v-model="form.vehicle_type_id" class="form-select bg-dark text-white border-secondary" required>
                                <option value="" disabled>Seleccione...</option>
                                <option v-for="t in vehicleTypes" :key="t.id" :value="t.id">{{ t.name }}</option>
                            </select>
                        </div>
                    </div>

                    <div class="d-flex justify-content-end mt-4 gap-2">
                        <button type="button" class="btn btn-secondary" @click="closeModal">Cancelar</button>
                        <button type="submit" class="btn btn-success" :disabled="saving">
                            {{ saving ? 'Guardando...' : 'Guardar' }}
                        </button>
                    </div>
                </form>
            </div>
        </div>

    </div>
</template>

<script>
export default {
    name: 'AdminVehicles',
    data() {
        return {
            vehicles: [],
            usersList: [],
            vehicleTypes: [],
            loading: true,
            saving: false,
            search: '',
            filterType: '',
            
            showModal: false,
            isEditing: false,
            currentId: null,
            form: {
                license_plate: '',
                brand: '',
                model: '',
                color: '',
                vehicle_type_id: '',
                user_id: ''
            }
        };
    },
    computed: {
        filteredVehicles() {
            let result = this.vehicles;

            if (this.filterType) {
                result = result.filter(v => v.vehicle_type_id == this.filterType);
            }

            const q = this.search.toLowerCase().trim();
            if (q) {
                result = result.filter(v => 
                    v.license_plate?.toLowerCase().includes(q) ||
                    v.brand?.toLowerCase().includes(q) ||
                    v.model?.toLowerCase().includes(q) ||
                    (v.vehicle_type?.name?.toLowerCase().includes(q)) ||
                    (v.user && v.user.name?.toLowerCase().includes(q))
                );
            }

            return result;
        }
    },
    methods: {
        async fetchAllData() {
            const token = localStorage.getItem('user_token');
            const headers = { 'Authorization': `Bearer ${token}` };
            try {
                // Fetch vehicles
                const resV = await fetch(`${this.$BASE_URL}/v1/vehicles`, { headers });
                const dataV = await resV.json();
                if(dataV.data) this.vehicles = dataV.data;

                // Fetch users public endpoint (but with auth header just in case)
                const resU = await fetch(`${this.$BASE_URL}/v1/users`, { headers });
                const dataU = await resU.json();
                if(dataU.data) this.usersList = dataU.data;

                // Fetch vehicle types
                const resT = await fetch(`${this.$BASE_URL}/v1/vehicleType`, { headers });
                const dataT = await resT.json();
                if(dataT && dataT.vehiclesTypes) this.vehicleTypes = dataT.vehiclesTypes;

            } catch (err) {
                console.error("Error al obtener datos:", err);
                alert("Error de conexión con el servidor.");
            } finally {
                this.loading = false;
            }
        },
        openCreateModal() {
            this.isEditing = false;
            this.currentId = null;
            this.form = { license_plate: '', brand: '', model: '', color: '', vehicle_type_id: '', user_id: '' };
            this.showModal = true;
        },
        openEditModal(vehicle) {
            this.isEditing = true;
            this.currentId = vehicle.id;
            this.form = {
                license_plate: vehicle.license_plate,
                brand: vehicle.brand,
                model: vehicle.model,
                color: vehicle.color,
                vehicle_type_id: vehicle.vehicle_type_id,
                user_id: vehicle.user_id || ''
            };
            this.showModal = true;
        },
        closeModal() {
            this.showModal = false;
        },
        async saveVehicle() {
            this.saving = true;
            const token = localStorage.getItem('user_token');
            const url = this.isEditing 
                ? `${this.$BASE_URL}/v1/vehicles/${this.currentId}`
                : `${this.$BASE_URL}/v1/vehicles`;
            
            const method = this.isEditing ? 'PUT' : 'POST';

            try {
                const res = await fetch(url, {
                    method,
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify(this.form)
                });

                if(!res.ok) {
                    const errorData = await res.json();
                    alert("Error: " + (errorData.message || JSON.stringify(errorData)));
                    return;
                }

                alert(this.isEditing ? "Vehículo actualizado" : "Vehículo creado");
                this.closeModal();
                this.loading = true;
                this.fetchAllData();
            } catch (err) {
                console.error(err);
                alert("Hubo un error");
            } finally {
                this.saving = false;
            }
        },
        async confirmDelete(vehicle) {
            if(!confirm(`¿Seguro que quieres eliminar el vehículo ${vehicle.license_plate}?`)) return;
            
            const token = localStorage.getItem('user_token');
            try {
                const res = await fetch(`${this.$BASE_URL}/v1/vehicles/${vehicle.id}`, {
                    method: 'DELETE',
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if(!res.ok) alert("Error eliminando vehículo");
                else {
                    this.vehicles = this.vehicles.filter(v => v.id !== vehicle.id);
                }
            } catch (err) {
                console.error(err);
                alert("Error de conexión");
            }
        }
    },
    mounted() {
        this.fetchAllData();
    }
}
</script>

<style scoped>
.admin-container {
    background-color: #0f172a;
    min-height: 100vh;
}
.btn-back {
    background: transparent;
    border: none;
    color: #94a3b8;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0;
    font-size: 0.9rem;
    cursor: pointer;
    transition: color 0.2s;
}
.btn-back:hover {
    color: #f1f5f9;
}
.modal-overlay {
    position: fixed;
    top: 0; left:0; width:100%; height:100%;
    background: rgba(0,0,0,0.7);
    z-index: 1050;
    display: flex;
    align-items: center;
    justify-content: center;
}
.custom-search-input::placeholder {
    color: #94a3b8 !important;
    opacity: 0.8;
}
</style>
