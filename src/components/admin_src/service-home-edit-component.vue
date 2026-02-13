<template>
    <div class="admin-container p-4">
        <div class="d-flex justify-content-between align-items-center mb-4">
            <h2 class="text-white fw-bold">Gestionar Servicios en Home</h2>
            <span class="badge bg-neon text-dark">
                {{ selectedCount }} / 3 seleccionados
            </span>
        </div>

        <div class="table-responsive shadow-lg rounded-3">
            <table class="table table-dark table-hover align-middle m-0">
                <thead>
                    <tr>
                        <th>Servicio</th>
                        <th>Precio</th>
                        <th class="text-center">Estado en Home</th>
                        <th class="text-end">Acción</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="service in this.services" :key="service.id"
                        :class="{ 'row-active': service.show_on_home }">
                        <td>
                            <div class="d-flex align-items-center">
                                <div class="icon-box me-3">{{ service.name.charAt(0) }}</div>
                                <div>
                                    <div class="fw-bold">{{ service.name }}</div>
                                    <small class="text-muted">{{ service.description.substring(0, 40) }}...</small>
                                </div>
                            </div>
                        </td>
                        <td>{{ service.price }}€</td>
                        <td class="text-center">
                            <span v-if="service.show_on_home" class="badge bg-success">Visible</span>
                            <span v-else class="badge bg-secondary">Oculto</span>
                        </td>
                        <td class="text-end">
                            <button @click="toggleHomeStatus(service)"
                                :disabled="!service.show_on_home && selectedCount >= 3"
                                :class="['btn btn-sm px-3 fw-bold', service.show_on_home ? 'btn-danger' : 'btn-neon']">
                                {{ service.show_on_home ? 'Quitar' : 'Mostrar' }}
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
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
        selectedCount() {
            return this.services.filter(s => s.show_on_home).length;
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

            //IMPORTANTE: Reemplazar el token hardcodeado por una gestión de autenticación real
            let token;
            console.log(this.$toast);

            fetch(`http://127.0.0.1:8000/api/v1/services/${service.id}/toggle-home`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ show_on_home: newStatus })
            })
                .then(res => {
                    if (!res.ok) {
                        throw new Error('Error en la respuesta del servidor');
                    }
                    return res.json();
                })
                .then(() => {
                    service.show_on_home = newStatus;
                })
                .catch(err => {
                    console.error("Could not change visibility:", err);
                    this.$toast.error("Failed to connect to the server", {
                        timeout: 5000
                    });
                    
                });
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

.bg-neon {
    background-color: #a3e635;
}

.btn-neon {
    background-color: #a3e635;
    color: #000;
}

.btn-neon:hover:not(:disabled) {
    background-color: #bef264;
    transform: translateY(-2px);
}

.btn-neon:disabled {
    background-color: #334155;
    color: #94a3b8;
    cursor: not-allowed;
}

.table-dark {
    --bs-table-bg: #1e293b;
    border-color: #334155;
}

.row-active {
    background-color: rgba(163, 230, 53, 0.05) !important;
}

.icon-box {
    width: 40px;
    height: 40px;
    background: #334155;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #a3e635;
    font-weight: bold;
}

.badge {
    font-size: 0.8rem;
    padding: 0.5em 1em;
}
</style>