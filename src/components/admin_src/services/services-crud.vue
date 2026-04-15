<template>
    <div class="admin-container p-4">
        <div class="mb-4">
            <button class="btn-back" @click="$router.push('/admin')">
                <span class="material-symbols-outlined">arrow_back</span>
                Panel de administración
            </button>
        </div>
        <div class="header-section mb-4">
            <div>
                <h2 class="section-title d-flex align-items-center gap-2">
                    <span class="material-symbols-outlined icon-title">home_repair_service</span>
                    Gestión de Servicios
                </h2>
                <p class="section-subtitle">Administra los servicios específicos, su precio y duración</p>
            </div>
            <button class="btn-create-neon" data-bs-toggle="modal" data-bs-target="#serviceModal" @click="openCreate">
                <span class="material-symbols-outlined">add</span>
                <span class="btn-text">Nuevo Servicio</span>
            </button>
        </div>

        <div class="table-wrapper">
            <table class="table table-dark custom-table">
                <thead>
                    <tr>
                        <th class="ps-4 col-id">ID</th>
                        <th class="col-name">Nombre del Servicio</th>
                        <th class="col-type">Tipo</th>
                        <th class="col-price">Precio</th>
                        <th class="col-duration">Duración</th>
                        <th class="text-end pe-4 col-actions">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-if="services.length === 0">
                        <td colspan="6" class="text-center py-5 text-muted">
                            <div class="d-flex flex-column align-items-center">
                                <span class="material-symbols-outlined empty-icon mb-2">home_repair_service</span>
                                No hay servicios registrados.
                            </div>
                        </td>
                    </tr>
                    <tr v-for="service in services" :key="service.id" class="row-item">
                        <td class="ps-4 text-id">#{{ service.id }}</td>
                        <td class="fw-bold text-white">
                            <div class="d-flex align-items-center gap-3">
                                <div class="icon-box">
                                    <span class="material-symbols-outlined">build</span>
                                </div>
                                <div>
                                    {{ service.name }}
                                </div>
                            </div>
                        </td>
                        <td class="text-white opacity-75">
                            <span class="badge-type">{{ service.type?.name || '---' }}</span>
                        </td>
                        <td class="text-neon-green fw-bold">{{ service.price }} €</td>
                        <td class="text-white opacity-75">{{ service.average_duration_mins ?
                            service.average_duration_mins + ' min' : 'N/A' }}</td>
                        <td class="text-end pe-4">
                            <div class="action-buttons justify-content-end">
                                <button class="btn-action btn-edit-neon" data-bs-toggle="modal"
                                    data-bs-target="#serviceModal" @click="openEdit(service)" title="Editar">
                                    <span class="material-symbols-outlined">edit</span>
                                </button>
                                <button class="btn-action btn-delete-neon" @click="deleteService(service.id)"
                                    title="Eliminar">
                                    <span class="material-symbols-outlined">delete</span>
                                </button>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <ServiceCrudModal :selectedService="selectedService" :isEdit="isEdit" @refresh="fetchServices" />
    </div>
</template>

<script>
import ServiceCrudModal from './services-crud-modal.vue';
import { loaderState } from '@/loaderState';

export default {
    components: {
        ServiceCrudModal,
    },
    data() {
        return {
            services: [],
            isEdit: false,
            selectedService: null,
        };
    },

    methods: {
        fetchServices() {
            loaderState.show();
            const token = localStorage.getItem("user");
            fetch(`${this.$BASE_URL}/v1/services`, {
                headers: { 'Authorization': `Bearer ${token}` }
            })
                .then(res => res.json())
                .then(data => {
                    this.services = data.data || [];
                })
                .catch(err => {
                    console.error(err);
                })
                .finally(() => {
                    loaderState.hide();
                });
        },

        openCreate() {
            this.isEdit = false;
            this.selectedService = null;
        },

        openEdit(service) {
            this.isEdit = true;
            this.selectedService = { ...service };
        },

        deleteService(id) {
            if (!confirm("¿Seguro que quieres eliminar este servicio?")) return;
            const token = localStorage.getItem("user");

            loaderState.show();
            fetch(`${this.$BASE_URL}/v1/services/${id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    Authorization: `Bearer ${token}`,
                },
            })
                .then(res => {
                    if (!res.ok) {
                        return res.json().then(err => { throw err; });
                    }
                    this.fetchServices();
                })
                .catch(err => {
                    console.error(err);
                })
                .finally(() => {
                    loaderState.hide();
                });
        },
    },

    mounted() {
        this.fetchServices();
    },
};
</script>

<style scoped>
.col-id {
    width: 10%;
}

.col-name {
    width: 25%;
}

.col-type {
    width: 20%;
}

.col-price {
    width: 15%;
}

.col-duration {
    width: 15%;
}

.col-actions {
    width: 15%;
}

.empty-icon {
    font-size: 2rem;
    opacity: 0.5;
}

.admin-container {
    background-color: #0f172a;
    min-height: 100vh;
    color: #cbd5e1;
    font-family: 'Inter', system-ui, -apple-system, sans-serif;
}

.header-section {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: linear-gradient(145deg, rgba(30, 41, 59, 0.7) 0%, rgba(15, 23, 42, 0.4) 100%);
    padding: 1.5rem 2rem;
    border-radius: 16px;
    border: 1px solid rgba(255, 255, 255, 0.05);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
}

.section-title {
    color: #f8fafc;
    font-size: 1.5rem;
    font-weight: 800;
    margin: 0;
    letter-spacing: -0.5px;
}

.icon-title {
    color: #a3e635;
    font-size: 1.8rem;
    filter: drop-shadow(0 0 8px rgba(163, 230, 53, 0.4));
}

.section-subtitle {
    color: #94a3b8;
    margin: 0.5rem 0 0 0;
    font-size: 0.9rem;
}

.table-wrapper {
    background: #1e293b;
    border-radius: 16px;
    border: 1px solid rgba(255, 255, 255, 0.05);
    overflow: hidden;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}

.custom-table {
    margin: 0;
    --bs-table-bg: transparent;
    --bs-table-color: #cbd5e1;
}

.custom-table thead th {
    background: rgba(15, 23, 42, 0.6);
    color: #94a3b8;
    font-size: 0.8rem;
    text-transform: uppercase;
    letter-spacing: 1px;
    font-weight: 700;
    padding: 1.2rem 1rem;
    border-bottom: 2px solid rgba(255, 255, 255, 0.05);
}

.row-item {
    transition: all 0.3s ease;
    border-bottom: 1px solid rgba(255, 255, 255, 0.03);
}

.row-item td {
    padding: 1rem;
    vertical-align: middle;
}

.row-item:hover {
    background: rgba(163, 230, 53, 0.03);
    transform: translateY(-1px);
}

.text-id {
    color: #64748b;
    font-family: 'Fira Code', monospace;
    font-weight: 600;
}

.icon-box {
    width: 36px;
    height: 36px;
    border-radius: 10px;
    background: rgba(255, 255, 255, 0.05);
    display: flex;
    align-items: center;
    justify-content: center;
    color: #94a3b8;
    transition: all 0.3s;
}

.row-item:hover .icon-box {
    background: rgba(163, 230, 53, 0.1);
    color: #a3e635;
}

.badge-type {
    background: rgba(100, 116, 139, 0.2);
    padding: 4px 10px;
    border-radius: 8px;
    font-size: 0.8rem;
    font-weight: 600;
    border: 1px solid rgba(255, 255, 255, 0.05);
}

.badge-neon {
    background: linear-gradient(135deg, rgba(250, 204, 21, 0.2), rgba(250, 204, 21, 0.05));
    color: #facc15;
    border: 1px solid rgba(250, 204, 21, 0.4);
    padding: 2px 8px;
    border-radius: 6px;
    font-size: 0.75rem;
    font-weight: 700;
    display: inline-flex;
    align-items: center;
    gap: 4px;
}

.action-buttons {
    display: flex;
    gap: 10px;
}

.btn-action {
    width: 36px;
    height: 36px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: none;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.btn-action .material-symbols-outlined {
    font-size: 1.1rem;
}

.btn-back {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: transparent;
    border: none;
    color: #64748b;
    font-size: 0.82rem;
    font-weight: 600;
    cursor: pointer;
    padding: 0;
    transition: color 0.2s;
    letter-spacing: 0.2px;
}

.btn-back:hover {
    color: #a3e635;
}

.btn-back .material-symbols-outlined {
    font-size: 17px;
}

.btn-create-neon {
    background: linear-gradient(135deg, rgba(163, 230, 53, 0.2), rgba(163, 230, 53, 0.05));
    color: #a3e635;
    border: 1px solid rgba(163, 230, 53, 0.4);
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 0.6rem 1.2rem;
    border-radius: 12px;
    font-weight: 700;
    transition: all 0.3s;
}

.btn-create-neon:hover {
    background: #a3e635;
    color: #0f172a;
    box-shadow: 0 0 20px rgba(163, 230, 53, 0.4);
    transform: translateY(-2px);
}

.btn-edit-neon {
    background: rgba(45, 212, 191, 0.1);
    color: #2dd4bf;
    border: 1px solid rgba(45, 212, 191, 0.2);
}

.btn-edit-neon:hover {
    background: #2dd4bf;
    color: #0f172a;
    box-shadow: 0 0 15px rgba(45, 212, 191, 0.4);
    transform: translateY(-2px);
}

.btn-star-neon {
    background: rgba(250, 204, 21, 0.1);
    color: #facc15;
    border: 1px solid rgba(250, 204, 21, 0.2);
}

.btn-star-neon:hover,
.btn-star-neon.active {
    background: #facc15;
    color: #0f172a;
    box-shadow: 0 0 15px rgba(250, 204, 21, 0.4);
    transform: translateY(-2px);
}

.btn-delete-neon {
    background: linear-gradient(135deg, rgba(239, 68, 68, 0.8), rgba(220, 38, 38, 0.9));
    color: white;
    border: 1px solid #ef4444;
}

.btn-delete-neon:hover {
    background: #dc2626;
    color: white;
    box-shadow: 0 0 15px rgba(239, 68, 68, 0.6);
    transform: translateY(-2px);
}

.text-neon-green {
    color: #a3e635;
}
</style>
