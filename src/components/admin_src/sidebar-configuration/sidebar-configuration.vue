<template>
    <div class="admin-container p-4">
        <div class="d-flex justify-content-between align-items-center mb-5 ml-5">
            <div>
                <h2 class="text-white fw-bold h4 ">Sidebar Configuración</h2>
                <button @click="openModal()" class="btn-action btn-create-neon mt-3 w-100">
                    <span class="material-symbols-outlined">add_circle</span>
                    Nuevo Módulo
                </button>
            </div>
            <!-- <span class="badge-status">
                <span class="pulse-dot"></span>
                {{ services.length }} Módulos totales
            </span> -->
        </div>

        <div class="section-wrapper">
            <div class="table-responsive shadow-lg rounded-3 overflow-hidden border border-secondary border-opacity-10">
                <table class="table table-dark align-middle m-0">
                    <thead>
                        <tr>
                            <th class="text-center">Módulo / Submenú</th>
                            <th class="text-center">Ruta de Acceso</th>
                            <th class="text-center">Orden</th>
                            <th class="text-center">Estado</th>
                            <th class="text-center">Acciones</th>
                        </tr>
                    </thead>
                    <template v-for="parent in services" :key="parent.id">
                        <tr class="row-item">
                            <td class="td-service ps-4">
                                <div class="d-flex align-items-center">
                                    <div class="icon-box active-icon me-3">
                                        <span class="material-symbols-outlined">{{ parent.icon }}</span>
                                    </div>
                                    <div>
                                        <div class="fw-bold text-white">{{ parent.label }}</div>
                                        <small class="text-id-highlight">ID: #{{ parent.id }}</small>
                                    </div>
                                </div>
                            </td>
                            <td><span class="route-badge">{{ parent.route || '---' }}</span></td>
                            <td class="text-center"><span class="badge-order-highlight">{{ parent.order }}</span></td>
                            <td class="text-center">
                                <div class="status-container justify-content-center">
                                    <span class="dot-status"
                                        :class="parent.is_active ? 'bg-success' : 'bg-danger'"></span>
                                    <span :class="parent.is_active ? 'text-success' : 'text-danger'"
                                        class="small fw-bold">{{ parent.is_active ? 'Activo' : 'Inactivo' }}</span>
                                </div>
                            </td>
                            <td class="text-end pe-4">
                                <div class="action-buttons">
                                    <button @click="openModal(parent)" class="btn-action btn-edit-neon">
                                        <span class="material-symbols-outlined">edit</span>
                                    </button>
                                    <button @click="deleteService(parent.id)" class="btn-action btn-delete-neon">
                                        <span class="material-symbols-outlined">delete</span>
                                    </button>
                                </div>
                            </td>
                        </tr>
                        <tr v-for="child in parent.children" :key="child.id" class="row-item row-child">
                            <td class="td-service ps-5">
                                <div class="d-flex align-items-center">
                                    <div class="child-indicator me-3"></div>
                                    <div class="icon-box active-icon me-3 icon-sm">
                                        <span class="material-symbols-outlined">{{ child.icon }}</span>
                                    </div>
                                    <div>
                                        <div class="fw-bold text-white small">{{ child.label }}</div>
                                        <small class="text-id-highlight small">ID: #{{ child.id }}</small>
                                    </div>
                                </div>
                            </td>
                            <td><span class="route-badge child-route-color">{{ child.route || '---' }}</span></td>
                            <td class="text-center"><span class="badge-order-highlight sub-order">{{
                                    child.order}}</span></td>
                            <td class="text-center">
                                <div class="status-container justify-content-center">
                                    <span class="dot-status"
                                        :class="child.is_active ? 'bg-success' : 'bg-danger'"></span>
                                    <span :class="child.is_active ? 'text-success' : 'text-danger'"
                                        class="small fw-bold">{{ child.is_active ? 'Activo' : 'Inactivo' }}</span>
                                </div>
                            </td>
                            <td class="text-end pe-4">
                                <div class="action-buttons">
                                    <button @click="openModal(child)" class="btn-action btn-edit-neon">
                                        <span class="material-symbols-outlined">edit</span>
                                    </button>
                                    <button @click="deleteService(child.id)" class="btn-action btn-delete-neon">
                                        <span class="material-symbols-outlined">delete</span>
                                    </button>
                                </div>
                            </td>
                        </tr>
                    </template>
                    <sidebar-configuration-modal v-if="isModalOpen" :key="serviceSelected.id || 'new'"
                        :service="serviceSelected" :services="services" :isOpen="isModalOpen"
                        @close="isModalOpen = false" @save="saveChanges">
                    </sidebar-configuration-modal>
                </table>
            </div>
        </div>
    </div>
</template>

<script>
import SidebarConfigurationModal from './sidebar-configuration-modal.vue';
export default {
    components: {
        SidebarConfigurationModal
    },
    data() {
        return {
            services: [],
            isModalOpen: false,
            serviceSelected: {},
            emptyForm: {
                label: '',
                icon: '',
                route: '',
                order: 0,
                parent_id: null,
                is_active: false
            },

        }
    },
    methods: {
        openModal(service = null) {
            this.isModalOpen = true;
            this.serviceSelected = service ? { ...service } : { ...this.emptyForm };
        },
        getServices() {
            fetch('http://127.0.0.1:8000/api/v1/admin-navigation')
                .then(res => {
                    if (!res.ok) {
                        throw new Error('La respuesta de la red no fue correcta');
                    }
                    return res.json();
                })
                .then(res => {
                    this.services = res.data;
                })
                .catch(err => {
                    console.error("Ocurrió un problema, inténtalo de nuevo:");
                    this.errorMessage = "No se pudo conectar con el servidor.";
                });
        },
        saveChanges(serviceSelected) {
            this.serviceSelected = serviceSelected;
            if (this.serviceSelected.parent_id == null) {
                this.serviceSelected.route = "";
            }

            // Si tiene ID es EDITAR, si no tiene es CREAR
            const id = this.serviceSelected.id;
            const method = id ? 'PUT' : 'POST';
            const url = id
                ? `http://127.0.0.1:8000/api/v1/admin-navigation/${id}`
                : `http://127.0.0.1:8000/api/v1/admin-navigation`;

            fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(this.serviceSelected)
            })
                .then(res => {
                    if (!res.ok) throw new Error('Error en servidor');
                    return res.json();
                })
                .then(data => {
                    this.getServices();
                    this.isModalOpen = false;
                    window.location.reload()
                })
                .catch(err => alert("No se pudo procesar la solicitud"));
        },
        deleteService(id) {
            if (!confirm("¿Estás seguro de eliminar este módulo?")) return;

            fetch(`http://127.0.0.1:8000/api/v1/admin-navigation/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            })
                .then(res => {
                    if (!res.ok) throw new Error('Error en servidor');
                    return res.json();
                })
                .then(data => {
                    this.getServices();
                    window.location.reload()
                })
                .catch(err => alert("No se pudo eliminar el módulo"));
        },
    },
    mounted() {
        this.getServices();

    }
}
</script>

<style scoped>
.admin-container {
    background-color: #0f172a;
    min-height: 100vh;
    color: #cbd5e1;
}

.section-title {
    color: #94a3b8;
    font-size: 0.8rem;
    text-transform: uppercase;
    letter-spacing: 1.5px;
    margin-bottom: 1rem;
    font-weight: 800;
}

.badge-status {
    background: rgba(163, 230, 53, 0.1);
    color: #a3e635;
    border: 1px solid rgba(163, 230, 53, 0.3);
    padding: 0.5rem 1rem;
    border-radius: 8px;
    font-weight: 700;
    display: flex;
    align-items: center;
    gap: 8px;
}

.pulse-dot {
    width: 8px;
    height: 8px;
    background: #a3e635;
    border-radius: 50%;
    animation: pulse 2s infinite;
}

.table-dark {
    --bs-table-bg: #1e293b;
    border-color: rgba(255, 255, 255, 0.05);
}

.row-item {
    border-bottom: 1px solid rgba(255, 255, 255, 0.03);
    transition: background 0.2s;
}

.row-item:hover {
    background: rgba(163, 230, 53, 0.02) !important;
}

.row-child {
    background: rgba(15, 23, 42, 0.2);
}

.text-id-highlight {
    color: #94a3b8;
    font-weight: 500;
    letter-spacing: 0.5px;
}

.badge-order-highlight {
    background: rgba(163, 230, 53, 0.1);
    color: #a3e635;
    border: 1px solid rgba(163, 230, 53, 0.3);
    padding: 2px 10px;
    border-radius: 6px;
    font-weight: 700;
    font-family: 'Fira Code', monospace;
}

.sub-order {
    background: #1e293b;
    color: #cbd5e1;
    border-color: #334155;
}

.route-badge {
    background: rgba(45, 212, 191, 0.1);
    color: #2dd4bf;
    padding: 4px 10px;
    border-radius: 6px;
    font-family: 'Fira Code', monospace;
    font-size: 0.75rem;
    border: 1px solid rgba(45, 212, 191, 0.2);
}

.child-route-color {
    color: #94a3b8;
    background: rgba(255, 255, 255, 0.05);
}

.child-indicator {
    width: 4px;
    height: 20px;
    background: #475569;
    border-radius: 2px;
}

.icon-box {
    width: 40px;
    height: 40px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.icon-sm {
    width: 32px;
    height: 32px;
}

.active-icon {
    background: rgba(163, 230, 53, 0.1);
    color: #a3e635;
    border: 1px solid rgba(163, 230, 53, 0.2);
}

.dot-status {
    display: inline-block;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    margin-right: 8px;
}

.action-buttons {
    display: flex;
    justify-content: flex-end;
    gap: 8px;
}

.btn-action {
    width: 38px;
    height: 38px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 8px;
    transition: all 0.2s ease;
    border: none;
    cursor: pointer;
}

.btn-edit-neon {
    background: rgba(45, 212, 191, 0.1);
    color: #2dd4bf;
    border: 1px solid rgba(45, 212, 191, 0.2);
}

.btn-edit-neon:hover {
    background: #2dd4bf;
    color: #0f172a;
    box-shadow: 0 0 12px rgba(45, 212, 191, 0.4);
}

.btn-delete-neon {
    background: rgba(239, 68, 68, 0.1);
    color: #f87171;
    border: 1px solid rgba(239, 68, 68, 0.2);
}

.btn-delete-neon:hover {
    background: #ef4444;
    color: white;
    box-shadow: 0 0 12px rgba(239, 68, 68, 0.4);
}

.btn-create-neon {
    background: rgba(163, 230, 53, 0.15);
    color: #a3e635;
    border: 1px solid #a3e635;
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 0.4rem 1rem;
    font-weight: 700;
}

.btn-create-neon:hover {
    background: #a3e635;
    color: #0f172a;
    box-shadow: 0 0 15px rgba(163, 230, 53, 0.4);
}

.btn-action .material-icons {
    font-size: 1.2rem;
}

.btn-sm {
    width: 32px;
    height: 32px;
}

.btn-sm .material-icons {
    font-size: 1rem;
}

.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(2, 6, 23, 0.85);
    backdrop-filter: blur(8px);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999;
}

.modal-content-custom {
    background-color: #1e293b;
    width: 100%;
    max-width: 500px;
    border-radius: 16px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    overflow: hidden;
    animation: slideIn 0.3s ease-out;
}

.modal-header-custom {
    padding: 1.5rem;
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.close-btn {
    background: none;
    border: none;
    color: #64748b;
    font-size: 1.5rem;
    cursor: pointer;
}

.modal-body-custom {
    padding: 1.5rem;
}

.modal-footer-custom {
    padding: 1.2rem 1.5rem;
    background: rgba(15, 23, 42, 0.5);
    display: flex;
    justify-content: flex-end;
    gap: 10px;
}
</style>