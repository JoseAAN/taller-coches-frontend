<template>
    <div class="admin-home p-4">

        <!-- Cabecera -->
        <div class="home-header mb-5">
            <div>
                <h1 class="text-white fw-bold mb-1">Panel de Administración</h1>
                <p class="text-white mb-0">Bienvenido al panel de control. Gestiona todos los recursos de la plataforma.
                </p>
            </div>
            <div class="header-time">
                <span class="material-symbols-outlined" style="font-size:18px">schedule</span>
                {{ currentTime }}
            </div>
        </div>

        <!-- Tarjetas de Métricas -->
        <div class="metrics-grid mb-5" v-if="!loadingStats">
            <div class="metric-card">
                <div class="metric-icon icon-blue"><span class="material-symbols-outlined">payments</span></div>
                <div class="metric-info">
                    <span class="metric-label">Ingresos de Hoy</span>
                    <span class="metric-value">{{ stats.cards.today_revenue }} €</span>
                </div>
            </div>
            <div class="metric-card">
                <div class="metric-icon icon-pink"><span class="material-symbols-outlined">calendar_clock</span></div>
                <div class="metric-info">
                    <span class="metric-label">Pendientes Hoy</span>
                    <span class="metric-value">{{ stats.cards.appointments_today }} citas</span>
                </div>
            </div>
            <div class="metric-card">
                <div class="metric-icon icon-purple"><span class="material-symbols-outlined">group_add</span></div>
                <div class="metric-info">
                    <span class="metric-label">Nuevos Usuarios</span>
                    <span class="metric-value">{{ stats.cards.new_users_week }} esta sem.</span>
                </div>
            </div>
            <div class="metric-card" @click="showOutOfStockModal = true"
                style="cursor: pointer; transition: transform 0.2s;"
                onmouseover="this.style.transform='translateY(-2px)'" onmouseout="this.style.transform='none'"
                title="Ver lista de productos agotados">
                <div class="metric-icon icon-orange"><span class="material-symbols-outlined">conveyor_belt</span></div>
                <div class="metric-info">
                    <span class="metric-label">Sin Stock</span>
                    <span class="metric-value" :class="{ 'text-danger': stats.cards.out_of_stock > 0 }">{{
                        stats.cards.out_of_stock }} productos</span>
                </div>
            </div>
        </div>

        <!-- Gráfico e información -->
        <div class="chart-section mb-5" v-if="!loadingStats && chartData">
            <div class="d-flex justify-content-between align-items-center mb-3">
                <h6 class="section-label mb-0">Evolución (Últimos 7 días)</h6>
                <div class="d-flex gap-2 align-items-center">
                    <select v-model="selectedDataset" @change="setChartData" class="form-select form-select-sm"
                        style="background-color: #1e293b; color: white; border-color: #334155; width: auto;">
                        <option value="revenue">Ingresos (€)</option>
                        <option value="users">Nuevos Usuarios</option>
                        <option value="appointments">Nuevas Citas</option>
                    </select>
                    <select v-model="selectedChartType" class="form-select form-select-sm"
                        style="background-color: #1e293b; color: white; border-color: #334155; width: auto;">
                        <option value="line">Línea</option>
                        <option value="bar">Barras</option>
                    </select>
                    <button class="btn btn-sm" :class="showDataValues ? 'btn-light' : 'btn-outline-light'"
                        @click="showDataValues = !showDataValues" style="font-size: 0.8rem; font-weight: 600;">
                        {{ showDataValues ? 'OCULTAR VALORES' : 'VER VALORES' }}
                    </button>
                </div>
            </div>

            <div class="chart-card">
                <Chart :type="selectedChartType" :data="chartData" :options="chartOptions" style="height: 300px" />
            </div>

            <div v-if="showDataValues" class="mt-3 p-3 text-white"
                style="background: #1e293b; border: 1px solid rgba(255,255,255,0.07); border-radius: 12px; overflow-x: auto;">
                <table class="table table-dark table-borderless table-sm mb-0 text-center"
                    style="background: transparent;">
                    <thead style="border-bottom: 1px solid #334155">
                        <tr>
                            <th v-for="label in stats.chart.labels" :key="'th-' + label" class="pb-2"
                                style="background: transparent; color: #94a3b8">{{ label }}</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td v-for="(val, index) in currentDatasetValues" :key="'td-' + index"
                                class="pt-2 font-monospace fw-bold" style="background: transparent; color: #a3e635;">
                                {{ val }}{{ selectedDataset === 'revenue' ? ' €' : '' }}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <!-- Sección: Gestión del admin -->
        <h6 class="section-label mb-3">Gestión</h6>
        <div class="cards-grid mb-5">

            <button class="nav-card" @click="goTo('/admin/users')">
                <div class="card-icon icon-blue">
                    <span class="material-symbols-outlined">group</span>
                </div>
                <div class="card-content">
                    <span class="card-title">Usuarios</span>
                    <span class="card-desc">Listado y gestión de usuarios</span>
                </div>
                <span class="material-symbols-outlined card-arrow">chevron_right</span>
            </button>

            <button class="nav-card" @click="goTo('/admin/service-home-edit')">
                <div class="card-icon icon-green">
                    <span class="material-symbols-outlined">build</span>
                </div>
                <div class="card-content">
                    <span class="card-title">Servicios Home</span>
                    <span class="card-desc">Servicios destacados en portada</span>
                </div>
                <span class="material-symbols-outlined card-arrow">chevron_right</span>
            </button>

            <button class="nav-card" @click="goTo('/admin/admin-sidebar-configuration')">
                <div class="card-icon icon-purple">
                    <span class="material-symbols-outlined">menu_open</span>
                </div>
                <div class="card-content">
                    <span class="card-title">Menú lateral</span>
                    <span class="card-desc">Configurar navegación del admin</span>
                </div>
                <span class="material-symbols-outlined card-arrow">chevron_right</span>
            </button>

            <button class="nav-card" @click="goTo('/admin/vehicles')">
                <div class="card-icon"
                    style="background: rgba(234, 179, 8, 0.12); color: #eab308; border: 1px solid rgba(234, 179, 8, 0.2);">
                    <span class="material-symbols-outlined">directions_car</span>
                </div>
                <div class="card-content">
                    <span class="card-title">Vehículos</span>
                    <span class="card-desc">Gestionar flota de clientes</span>
                </div>
                <span class="material-symbols-outlined card-arrow">chevron_right</span>
            </button>

            <button class="nav-card" @click="goTo('/admin/categories')">
                <div class="card-icon icon-teal">
                    <span class="material-symbols-outlined">label</span>
                </div>
                <div class="card-content">
                    <span class="card-title">Categorías</span>
                    <span class="card-desc">Gestionar categorías del sistema</span>
                </div>
                <span class="material-symbols-outlined card-arrow">chevron_right</span>
            </button>

            <button class="nav-card" @click="goTo('/admin/appointments')">
                <div class="card-icon icon-pink">
                    <span class="material-symbols-outlined">edit_calendar</span>
                </div>
                <div class="card-content">
                    <span class="card-title">Citas</span>
                    <span class="card-desc">Calendario y estados de las citas</span>
                </div>
                <span class="material-symbols-outlined card-arrow">chevron_right</span>
            </button>
        </div>

        <!-- Sección: Accesos a la web -->
        <h6 class="section-label mb-3">Accesos a la web</h6>
        <div class="cards-grid">

            <button class="nav-card nav-card--web" @click="goTo('/products')">
                <div class="card-icon icon-orange">
                    <span class="material-symbols-outlined">inventory_2</span>
                </div>
                <div class="card-content">
                    <span class="card-title">Productos</span>
                    <span class="card-desc">Ver catálogo de productos</span>
                </div>
                <span class="material-symbols-outlined card-arrow">open_in_new</span>
            </button>

            <button class="nav-card nav-card--web" @click="goTo('/services')">
                <div class="card-icon icon-teal">
                    <span class="material-symbols-outlined">local_car_wash</span>
                </div>
                <div class="card-content">
                    <span class="card-title">Servicios</span>
                    <span class="card-desc">Catálogo de servicios del taller</span>
                </div>
                <span class="material-symbols-outlined card-arrow">open_in_new</span>
            </button>

            <button class="nav-card nav-card--web" @click="goTo('/appointments')">
                <div class="card-icon icon-pink">
                    <span class="material-symbols-outlined">calendar_month</span>
                </div>
                <div class="card-content">
                    <span class="card-title">Citas</span>
                    <span class="card-desc">Calendario de citas</span>
                </div>
                <span class="material-symbols-outlined card-arrow">open_in_new</span>
            </button>

        </div>

        <!-- Modal Productos sin stock -->
        <div v-if="showOutOfStockModal" class="modal-overlay" @click.self="showOutOfStockModal = false">
            <div class="modal-card shadow-lg"
                style="background: #0f172a; padding: 1.5rem; border-radius: 16px; width: 100%; max-width: 500px; border: 1px solid #334155;">
                <div class="d-flex justify-content-between align-items-center mb-4">
                    <h5 class="text-white m-0 d-flex align-items-center gap-2 fw-bold">
                        <span class="material-symbols-outlined text-danger">warning</span>
                        Productos Agotados
                    </h5>
                    <button class="btn btn-sm btn-outline-secondary border-0 text-white"
                        @click="showOutOfStockModal = false" style="background: transparent;">
                        <span class="material-symbols-outlined">close</span>
                    </button>
                </div>

                <div v-if="!stats.cards.out_of_stock_list || stats.cards.out_of_stock_list.length === 0"
                    class="text-center text-light py-4">
                    <span class="material-symbols-outlined d-block mb-2"
                        style="font-size: 32px; opacity: 0.5;">inventory_2</span>
                    Todos los productos tienen stock suficiente.
                </div>
                <div v-else class="table-responsive" style="max-height: 350px; overflow-y: auto;">
                    <table class="table table-dark table-sm align-middle m-0" style="background: transparent;">
                        <thead>
                            <tr style="border-bottom: 2px solid #334155;">
                                <th class="text-light pb-2 bg-transparent border-0 font-monospace">Producto</th>
                                <th class="text-light text-center pb-2 bg-transparent border-0 font-monospace">Stock
                                </th>
                                <th class="text-light text-end pb-2 bg-transparent border-0 font-monospace">Precio</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="prod in stats.cards.out_of_stock_list" :key="prod.id"
                                style="border-bottom: 1px solid rgba(255,255,255,0.05);">
                                <td class="text-white fw-medium py-3 bg-transparent border-0">{{ prod.name }}</td>
                                <td class="text-center py-3 bg-transparent border-0">
                                    <span class="badge bg-danger rounded-pill px-2">{{ prod.stock }}</span>
                                </td>
                                <td class="text-end text-light py-3 bg-transparent border-0 fw-bold">{{ prod.price }} €
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

    </div>
</template>

<script>
import Chart from 'primevue/chart';

export default {
    name: 'AdminHome',
    components: { Chart },
    data() {
        return {
            currentTime: '',
            loadingStats: true,
            stats: null,
            chartData: null,
            chartOptions: null,
            selectedChartType: 'line',
            selectedDataset: 'revenue',
            currentDatasetValues: [],
            showDataValues: false,
            showOutOfStockModal: false,
        }
    },
    methods: {
        goTo(route) {
            this.$router.push(route);
        },
        updateTime() {
            const now = new Date();
            this.currentTime = now.toLocaleString('es-ES', {
                weekday: 'long',
                day: '2-digit',
                month: 'long',
                hour: '2-digit',
                hour: '2-digit',
                minute: '2-digit'
            });
        },
        fetchStats() {
            const token = localStorage.getItem('user_token');
            fetch(`${this.$BASE_URL}/v1/dashboard-stats`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
                .then(res => res.json())
                .then(data => {
                    this.stats = data;
                    this.setChartData();
                    this.loadingStats = false;
                })
                .catch(err => console.error("Error cargando estadísticas: ", err));
        },
        setChartData() {
            const documentStyle = getComputedStyle(document.documentElement);
            const textColor = documentStyle.getPropertyValue('--p-text-color') || '#e2e8f0';
            const textColorSecondary = documentStyle.getPropertyValue('--p-text-muted-color') || '#94a3b8';
            const surfaceBorder = documentStyle.getPropertyValue('--p-content-border-color') || '#334155';

            let datasetValues = [];
            let datasetLabel = '';
            let datasetColor = '';

            if (this.selectedDataset === 'revenue') {
                datasetLabel = 'Ingresos (€)';
                datasetValues = this.stats.chart.datasets.revenue;
                datasetColor = '#a3e635'; // Lime green
            } else if (this.selectedDataset === 'users') {
                datasetLabel = 'Nuevos Usuarios';
                datasetValues = this.stats.chart.datasets.users;
                // Purple similar to primevue theme or my palette
                datasetColor = '#a78bfa';
            } else if (this.selectedDataset === 'appointments') {
                datasetLabel = 'Nuevas Citas Registradas';
                datasetValues = this.stats.chart.datasets.appointments;
                // Pink
                datasetColor = '#f472b6';
            }

            this.currentDatasetValues = datasetValues;

            this.chartData = {
                labels: this.stats.chart.labels,
                datasets: [
                    {
                        label: datasetLabel,
                        data: datasetValues,
                        backgroundColor: datasetColor,
                        borderColor: datasetColor,
                        borderWidth: 2,
                        tension: 0.4
                    }
                ]
            };

            this.chartOptions = {
                maintainAspectRatio: false,
                aspectRatio: 0.6,
                plugins: {
                    legend: {
                        labels: {
                            color: textColor
                        },
                        onClick: null // Desactiva la función de ocultar al hacer click
                    }
                },
                scales: {
                    x: {
                        ticks: {
                            color: textColorSecondary
                        },
                        grid: {
                            color: surfaceBorder
                        }
                    },
                    y: {
                        ticks: {
                            color: textColorSecondary
                        },
                        grid: {
                            color: surfaceBorder
                        }
                    }
                }
            };
        }
    },
    mounted() {
        this.updateTime();
        this.fetchStats();
        this._timer = setInterval(this.updateTime, 60000);
    },
    beforeUnmount() {
        clearInterval(this._timer);
    }
}
</script>

<style scoped>
.admin-home {
    background-color: #0f172a;
    min-height: 100vh;
}

/* Header */
.home-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 1rem;
}

.header-time {
    display: flex;
    align-items: center;
    gap: 8px;
    background: #1e293b;
    border: 1px solid rgba(255, 255, 255, 0.08);
    color: #94a3b8;
    font-size: 0.8rem;
    padding: 0.5rem 1rem;
    border-radius: 10px;
    text-transform: capitalize;
    white-space: nowrap;
}

/* Section label */
.section-label {
    color: #475569;
    text-transform: uppercase;
    letter-spacing: 1px;
    font-size: 0.72rem;
    font-weight: 700;
}

.section-label {
    color: #94a3b8;
    text-transform: uppercase;
    letter-spacing: 1px;
    font-size: 0.72rem;
    font-weight: 700;
}

/* Metrics */
.metrics-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: 1rem;
}

.metric-card {
    background: #1e293b;
    border: 1px solid rgba(255, 255, 255, 0.07);
    border-radius: 14px;
    padding: 1.2rem;
    display: flex;
    align-items: center;
    gap: 1rem;
}

.metric-icon {
    width: 48px;
    height: 48px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.metric-info {
    display: flex;
    flex-direction: column;
}

.metric-label {
    color: #64748b;
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
}

.metric-value {
    color: #f1f5f9;
    font-size: 1.2rem;
    font-weight: 800;
}

.chart-card {
    background: #1e293b;
    border: 1px solid rgba(255, 255, 255, 0.07);
    border-radius: 14px;
    padding: 1.5rem;
}

/* Cards grid */
.cards-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 1rem;
}

.nav-card {
    display: flex;
    align-items: center;
    gap: 1rem;
    background: #1e293b;
    border: 1px solid rgba(255, 255, 255, 0.07);
    border-radius: 14px;
    padding: 1.2rem 1.1rem;
    cursor: pointer;
    transition: all 0.2s ease;
    text-align: left;
    width: 100%;
}

.nav-card:hover {
    border-color: rgba(163, 230, 53, 0.25);
    background: #243044;
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.25);
}

.card-icon {
    width: 46px;
    height: 46px;
    min-width: 46px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.card-icon .material-symbols-outlined {
    font-size: 22px;
}

/* Icon color variants */
.icon-blue {
    background: rgba(99, 179, 237, 0.12);
    color: #63b3ed;
    border: 1px solid rgba(99, 179, 237, 0.2);
}

.icon-green {
    background: rgba(163, 230, 53, 0.12);
    color: #a3e635;
    border: 1px solid rgba(163, 230, 53, 0.2);
}

.icon-purple {
    background: rgba(167, 139, 250, 0.12);
    color: #a78bfa;
    border: 1px solid rgba(167, 139, 250, 0.2);
}

.icon-orange {
    background: rgba(251, 146, 60, 0.12);
    color: #fb923c;
    border: 1px solid rgba(251, 146, 60, 0.2);
}

.icon-teal {
    background: rgba(45, 212, 191, 0.12);
    color: #2dd4bf;
    border: 1px solid rgba(45, 212, 191, 0.2);
}

.icon-pink {
    background: rgba(244, 114, 182, 0.12);
    color: #f472b6;
    border: 1px solid rgba(244, 114, 182, 0.2);
}

.card-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 3px;
}

.card-title {
    color: #f1f5f9;
    font-weight: 600;
    font-size: 0.95rem;
}

.card-desc {
    color: #64748b;
    font-size: 0.78rem;
}

.card-arrow {
    color: #334155;
    font-size: 20px;
    transition: color 0.2s, transform 0.2s;
}

.nav-card:hover .card-arrow {
    color: #a3e635;
    transform: translateX(3px);
}

@media (max-width: 600px) {
    .cards-grid {
        grid-template-columns: 1fr;
    }

    .home-header {
        flex-direction: column;
    }
}

/* Variante web: borde y hover ligeramente distintos para diferenciarlas */
.nav-card--web {
    border-color: rgba(255, 255, 255, 0.05);
    opacity: 0.85;
}

.nav-card--web:hover {
    border-color: rgba(99, 179, 237, 0.25);
    opacity: 1;
}

.nav-card--web:hover .card-arrow {
    color: #63b3ed;
    transform: none;
}

.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.6);
    backdrop-filter: blur(4px);
    z-index: 1050;
    display: flex;
    align-items: center;
    justify-content: center;
}
</style>