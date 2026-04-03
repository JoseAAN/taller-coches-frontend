<template>
    <div class="admin-container p-4">
        <div class="mb-5">
            <button class="btn-back mb-3" @click="$router.push('/admin')">
                <span class="material-symbols-outlined">arrow_back</span>
                Panel de administración
            </button>
            <div class="d-flex justify-content-between align-items-center">
                <div>
                    <h2 class="text-white fw-bold h4 text-glow-subtle">Sidebar Configuración</h2>
                    <button @click="openModal()" class="btn-create-neon mt-3">
                        <span class="material-symbols-outlined">add_circle</span>
                        Nuevo Módulo
                    </button>
                </div>
            </div>
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
                            <td class="text-center"><span class="route-badge">{{ parent.route || '---' }}</span></td>
                            <td class="text-center"><span class="badge-order-highlight">{{ parent.order }}</span></td>
                            <td class="text-center">
                                <div class="status-container justify-content-center">
                                    <span class="dot-status"
                                        :class="parent.is_active ? 'bg-success' : 'bg-danger'"></span>
                                    <span :class="parent.is_active ? 'text-success' : 'text-danger'"
                                        class="small fw-bold">{{ parent.is_active ? 'Activo' : 'Inactivo' }}</span>
                                </div>
                            </td>
                            <td class="text-center">
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
                            <td class="text-center"><span class="route-badge child-route-color">{{ child.route || '---' }}</span></td>
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
                            <td class="text-center">
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
import { useToast } from 'vue-toastification';
export default {
    components: {
        SidebarConfigurationModal
    },
    data() {
        return {
            toast: useToast(),
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
            fetch(`${this.$BASE_URL}/v1/admin-navigation`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('user_token')}`
                }
            })
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
                ? `${this.$BASE_URL}/v1/admin-navigation/${id}`
                : `${this.$BASE_URL}/v1/admin-navigation`;

            fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('user_token')}`
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
                .catch(err => this.toast.error("No se pudo procesar la solicitud"));
        },
        deleteService(id) {
            if (!confirm("¿Estás seguro de eliminar este módulo?")) return;

            fetch(`${this.$BASE_URL}/v1/admin-navigation/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('user_token')}`
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
                .catch(err => this.toast.error("No se pudo eliminar el módulo"));
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
.btn-back:hover { color: #a3e635; }
.btn-back .material-symbols-outlined { font-size: 17px; }

.section-title {
    color: #94a3b8;
    font-size: 0.8rem;
    text-transform: uppercase;
    letter-spacing: 1.5px;
    margin-bottom: 1rem;
    font-weight: 800;
}

.text-glow-subtle {
    text-shadow: 0 0 15px rgba(255, 255, 255, 0.15);
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
    transition: background 0.3s ease, border-left 0.2s ease;
    border-left: 2px solid transparent;
}

.row-item:hover {
    background: linear-gradient(90deg, rgba(163, 230, 53, 0.04) 0%, transparent 100%) !important;
    border-left: 2px solid #a3e635;
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

.status-container {
    background-color: #0f172a;
    display: inline-flex;
    align-items: center;
    padding: 6px 12px;
}

.action-buttons {
    display: inline-flex;
    justify-content: center;
    gap: 8px;
    background-color: #0f172a;
    align-items: center;
    padding: 6px 12px;
    border-radius: 8px;
}

.btn-action {
    width: 38px;
    height: 38px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 8px;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    border: none;
    cursor: pointer;
}

.btn-edit-neon {
    background: transparent;
    color: #2dd4bf;
    border: none;
}

.btn-edit-neon:hover {
    color: #14b8a6;
    transform: translateY(-1px);
}

.btn-delete-neon {
    background: transparent;
    color: #f87171;
    border: none;
}

.btn-delete-neon:hover {
    color: #dc2626;
    transform: translateY(-1px);
}

.btn-create-neon {
    background: transparent;
    color: #a3e635;
    border: 1px solid #a3e635;
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 0.5rem 1.2rem;
    font-weight: 700;
    border-radius: 8px;
    transition: all 0.2s ease;
    cursor: pointer;
}

.btn-create-neon:hover {
    background: rgba(163, 230, 53, 0.1);
    color: #a3e635;
    box-shadow: 0 0 12px rgba(163, 230, 53, 0.2);
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