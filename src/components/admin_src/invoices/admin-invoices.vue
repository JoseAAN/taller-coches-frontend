<template>
    <div class="admin-container p-4">

        <button class="btn-back mb-3" @click="$router.push('/admin')">
            <span class="material-symbols-outlined">arrow_back</span>
            Panel de administración
        </button>

        <div class="header-section mb-4">
            <div>
                <h2 class="section-title d-flex align-items-center gap-2">
                    <span class="material-symbols-outlined icon-title">receipt_long</span>
                    Histórico de Facturas
                </h2>
                <p class="section-subtitle">Consulta de solo lectura del histórico de ventas</p>
            </div>
            
            <button class="btn btn-outline-light d-flex align-items-center gap-2" @click="fetchInvoices(1)">
                <span class="material-symbols-outlined">refresh</span> Actualizar
            </button>
        </div>

        <!-- Buscador -->
        <div class="d-flex gap-3 mb-4 flex-wrap">
            <div class="search-wrapper flex-grow-1" style="background: #1e293b; padding: 10px 15px; border-radius: 8px; display: flex; align-items: center; gap: 10px; border: 1px solid #334155;">
                <span class="material-symbols-outlined" style="color: #94a3b8;">search</span>
                <input
                    v-model="search"
                    @keyup.enter="fetchInvoices(1)"
                    type="text"
                    class="form-control custom-search-input bg-transparent text-white border-0 shadow-none p-0"
                    placeholder="Buscar por número de factura (Ej: INV-00001)... ENTER para buscar"
                />
            </div>
        </div>

        <div v-if="loading" class="text-center text-white py-5">
            Cargando facturas...
        </div>

        <div v-else class="table-wrapper">
            <table class="table table-dark custom-table">
                <thead>
                    <tr>
                        <th class="ps-4">ID</th>
                        <th>Factura º</th>
                        <th>Importe</th>
                        <th>Fecha Creación</th>
                        <th>Cliente</th>
                        <th class="text-end pe-4">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-if="invoices.length === 0">
                        <td colspan="6" class="text-center py-5 text-muted">
                            <div class="d-flex flex-column align-items-center">
                                <span class="material-symbols-outlined mb-2" style="font-size: 2rem; opacity: 0.5;">receipt_long</span>
                                No hay facturas registradas.
                            </div>
                        </td>
                    </tr>

                    <tr v-for="invoice in invoices" :key="invoice.id" class="row-item">
                        <td class="ps-4 text-id">#{{ invoice.id }}</td>
                        <td class="fw-bold text-white">
                            <span class="badge bg-secondary">{{ invoice.invoice_number }}</span>
                        </td>
                        <td class="text-success fw-bold">{{ invoice.total }} €</td>
                        <td class="text-light">{{ invoice.created_at || '---' }}</td>
                        <td class="text-light">
                            <span class="material-symbols-outlined" style="font-size: 16px; vertical-align: middle;">person</span> 
                            {{ invoice.user_name || 'Usuario #' + invoice.user_id }}
                        </td>
                        <td class="text-end pe-4">
                            <div class="action-buttons justify-content-end">
                                <button class="btn-action btn-view-neon" @click="viewDetails(invoice.id)" title="Ver Detalles">
                                    <span class="material-symbols-outlined">visibility</span>
                                </button>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>

            <!-- Paginación -->
            <div class="d-flex justify-content-center align-items-center gap-3 p-3" v-if="meta && meta.last_page > 1" style="border-top: 1px solid rgba(255, 255, 255, 0.05);">
                <button class="btn btn-sm btn-outline-secondary text-white" :disabled="meta.current_page === 1" @click="fetchInvoices(meta.current_page - 1)">Anterior</button>
                <span class="text-muted small">Página {{ meta.current_page }} de {{ meta.last_page }}</span>
                <button class="btn btn-sm btn-outline-secondary text-white" :disabled="meta.current_page === meta.last_page" @click="fetchInvoices(meta.current_page + 1)">Siguiente</button>
            </div>
        </div>

        <InvoiceModal 
            :show="showModal" 
            :invoice="selectedInvoice" 
            @close="showModal = false" 
        />
        
    </div>
</template>

<script>
import InvoiceModal from './invoice-modal.vue';
import { loaderState } from '@/loaderState';

export default {
    name: 'AdminInvoices',
    components: { InvoiceModal },
    data() {
        return {
            invoices: [],
            meta: null, // Para paginación Laravel
            search: '',
            loading: true,
            showModal: false,
            selectedInvoice: null
        }
    },
    methods: {
        async fetchInvoices(page = 1) {
            this.loading = true;
            const token = localStorage.getItem('user_token');
            try {
                let url = `${this.$BASE_URL}/v1/invoices?page=${page}`;
                if (this.search.trim() !== '') {
                    url += `&search=${encodeURIComponent(this.search)}`;
                }

                const res = await fetch(url, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                
                if (!res.ok) throw new Error("Error fetching invoices");
                
                const data = await res.json();
                this.invoices = data.data; // InvoiceCollection returns data inside data
                this.meta = data.meta; // Pagination info
            } catch (e) {
                console.error(e);
                alert("Error de conexión al cargar facturas");
            } finally {
                this.loading = false;
            }
        },
        async viewDetails(invoiceId) {
            loaderState.show();
            const token = localStorage.getItem('user_token');
            try {
                // Hacer fetch de la factura entera con sus items 
                const res = await fetch(`${this.$BASE_URL}/v1/invoices/${invoiceId}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                if (!res.ok) throw new Error("Error fetching detail");

                const data = await res.json();
                this.selectedInvoice = data.data; // El InvoiceResource
                this.showModal = true;

            } catch (e) {
                console.error(e);
                alert("Error visualizando factura");
            } finally {
                loaderState.hide();
            }
        }
    },
    mounted() {
        this.fetchInvoices();
    }
}
</script>

<style scoped>
.admin-container {
    background-color: #0f172a;
    min-height: 100vh;
    color: #cbd5e1;
    font-family: 'Inter', system-ui, -apple-system, sans-serif;
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

.custom-search-input::placeholder {
    color: #94a3b8 !important;
    opacity: 0.8;
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
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.btn-view-neon {
    background: rgba(99, 102, 241, 0.1);
    color: #818cf8;
    border: 1px solid rgba(99, 102, 241, 0.2);
}

.btn-view-neon:hover {
    background: #6366f1;
    color: #ffffff;
    box-shadow: 0 0 15px rgba(99, 102, 241, 0.4);
    transform: translateY(-2px);
}
</style>
