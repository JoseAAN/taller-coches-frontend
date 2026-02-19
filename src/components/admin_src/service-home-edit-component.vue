<template>
    <div class="admin-container p-4">
        <div class="d-flex justify-content-between align-items-center mb-4">
            <h2 class="text-white fw-bold h4 m-0">Gestionar Servicios en Home</h2>
            <span class="badge-status">
                {{ selectedCount }} / 3 seleccionados
            </span>
        </div>

        <div v-if="activeServices.length > 0" class="section-wrapper mb-5">
            <h5 class="section-title">Servicios Destacados (Visible en Home)</h5>
            <div class="table-responsive shadow-lg rounded-3">
                <table class="table table-dark align-middle m-0">
                    <thead>
                        <tr>
                            <th>Servicio</th>
                            <th>Precio</th>
                            <th class="text-center">Estado</th>
                            <th class="text-end">Acción</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="service in activeServices" :key="service.id" class="row-active">
                            <td class="td-service">
                                <div class="d-flex align-items-center">
                                    <div class="icon-box active-icon me-3">{{ service.name.charAt(0) }}</div>
                                    <div>
                                        <div class="fw-bold text-white">{{ service.name }}</div>
                                        <small class="description-text">{{ service.description.substring(0, 40) }}...</small>
                                    </div>
                                </div>
                            </td>
                            <td class="td-price"><span class="text-neon fw-bold">{{ service.price }}€</span></td>
                            <td class="td-status text-center">
                                <div class="status-container">
                                    <span class="dot-status bg-success"></span>
                                    <span class="text-success small fw-bold">Visible</span>
                                </div>
                            </td>
                            <td class="td-action text-end">
                                <button @click="toggleHomeStatus(service)" class="btn btn-action btn-remove">
                                    Quitar de Home
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <div class="section-wrapper">
            <h5 class="section-title">Resto de Servicios</h5>
            <div class="table-responsive shadow-lg rounded-3">
                <table class="table table-dark align-middle m-0">
                    <thead>
                        <tr>
                            <th>Servicio</th>
                            <th>Precio</th>
                            <th class="text-center">Estado</th>
                            <th class="text-end">Acción</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="service in inactiveServices" :key="service.id">
                            <td class="td-service">
                                <div class="d-flex align-items-center">
                                    <div class="icon-box me-3">{{ service.name.charAt(0) }}</div>
                                    <div>
                                        <div class="fw-bold text-light">{{ service.name }}</div>
                                        <small class="description-text">{{ service.description.substring(0, 40) }}...</small>
                                    </div>
                                </div>
                            </td>
                            <td class="td-price text-light">{{ service.price }}€</td>
                            <td class="td-status text-center">
                                <div class="status-container">
                                    <span class="dot-status bg-danger"></span>
                                    <span class="label-hidden">Oculto</span>
                                </div>
                            </td>
                            <td class="td-action text-end">
                                <button @click="toggleHomeStatus(service)" 
                                    :disabled="selectedCount >= 3"
                                    class="btn btn-action btn-add">
                                    Mostrar en Home
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'ServiceHomeEditComponent',
    data() {
        return {
            services: []
        }
    },
    computed: {
        activeServices() {
            return this.services.filter(s => s.show_on_home);
        },
        inactiveServices() {
            return this.services.filter(s => !s.show_on_home);
        },
        selectedCount() {
            return this.activeServices.length;
        }
    },
    methods: {
        getServicesOnHome() {
            fetch('http://127.0.0.1:8000/api/v1/services')
                .then(res => res.json())
                .then(res => {
                    this.services = res.data;
                })
                .catch(err => console.error(err));
        },
        toggleHomeStatus(service) {
            const newStatus = !service.show_on_home;
            let token = localStorage.getItem('token'); 
            fetch(`http://127.0.0.1:8000/api/v1/services/${service.id}/toggle-home`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ show_on_home: newStatus })
            })
            .then(res => {
                if (!res.ok) throw new Error('Error');
                return res.json();
            })
            .then(() => {
                service.show_on_home = newStatus;
            })
            .catch(err => console.error(err));
        }
    },
    mounted() {
        this.getServicesOnHome();
    }
}
</script>

<style scoped>
.admin-container {
    background-color: #0f172a;
    min-height: 100vh;
}

.section-title {
    color: #cbd5e1;
    font-size: 0.85rem;
    text-transform: uppercase;
    letter-spacing: 1px;
    margin-bottom: 1.2rem;
    font-weight: 700;
}

.description-text {
    color: #94a3b8 !important;
    display: block;
    margin-top: 2px;
}

.label-hidden {
    color: #fca5a5;
    font-size: 0.85rem;
    font-weight: 600;
}

.badge-status {
    background: rgba(163, 230, 53, 0.1);
    color: #a3e635;
    border: 1px solid rgba(163, 230, 53, 0.3);
    padding: 0.6rem 1.2rem;
    border-radius: 10px;
    font-weight: 700;
}

.table-dark {
    --bs-table-bg: #1e293b;
    border-color: rgba(255, 255, 255, 0.08);
}

.row-active {
    background: linear-gradient(90deg, rgba(163, 230, 53, 0.05) 0%, transparent 100%) !important;
}

.icon-box {
    width: 40px;
    height: 40px;
    background: #334155;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #cbd5e1;
    font-weight: bold;
}

.active-icon {
    background: rgba(163, 230, 53, 0.2);
    color: #a3e635;
    border: 1px solid rgba(163, 230, 53, 0.2);
}

.dot-status {
    display: inline-block;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    margin-right: 8px;
}

.text-neon {
    color: #a3e635;
}

.btn-action {
    padding: 0.5rem 1.2rem;
    border-radius: 8px;
    font-size: 0.85rem;
    font-weight: 700;
    transition: all 0.2s ease;
    border: none;
}

.btn-add {
    background: #a3e635;
    color: #0f172a;
}

.btn-add:disabled {
    background: #334155;
    color: #64748b;
    opacity: 0.6;
}

.btn-remove {
    background: rgba(239, 68, 68, 0.15);
    color: #f87171;
    border: 1px solid rgba(239, 68, 68, 0.3);
}

.status-container {
    display: flex;
    align-items: center;
    justify-content: center;
}

.table tbody td {
    padding: 1rem;
}

@media (max-width: 768px) {
    .table thead {
        display: none; 
    }

    .table tbody tr {
        display: block;
        margin-bottom: 1.5rem;
        background: #1e293b;
        border: 1px solid rgba(255, 255, 255, 0.08);
        border-radius: 12px;
        padding: 1rem;
    }

    .table tbody td {
        display: block;
        width: 100% !important;
        padding: 0.5rem 0 !important;
        text-align: left !important;
        border: none;
    }

    .td-service {
        border-bottom: 1px solid rgba(255, 255, 255, 0.05) !important;
        padding-bottom: 1rem !important;
        margin-bottom: 0.5rem;
    }

    .td-price {
        font-size: 1.2rem;
    }

    .status-container {
        justify-content: flex-start;
    }

    .td-action {
        margin-top: 0.5rem;
    }

    .btn-action {
        width: 100%;
        padding: 0.8rem;
    }
}
</style>