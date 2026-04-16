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
                    <span class="material-symbols-outlined icon-title">inventory_2</span>
                    Gestión de Productos
                </h2>
                <p class="section-subtitle">Administra tu catálogo de productos, precios y niveles de stock</p>
            </div>
            <span class="badge-status ms-2">
                <span class="material-symbols-outlined"
                    style="font-size:16px;vertical-align:middle;margin-right:4px;">inventory_2</span>
                {{ totalProducts }} productos
            </span>
            <button class="btn-create-neon" data-bs-toggle="modal" data-bs-target="#productModal" @click="openCreate">
                <span class="material-symbols-outlined">add</span>
                <span class="btn-text">Nuevo Producto</span>
            </button>
        </div>

        <div class="table-wrapper">
            <table class="table table-dark custom-table">
                <thead>
                    <tr>
                        <th class="ps-4 col-id">ID</th>
                        <th class="col-name">Producto</th>
                        <th class="col-type">Categoría</th>
                        <th class="col-price">Precio</th>
                        <th class="col-stock">Stock</th>
                        <th class="text-end pe-4 col-actions">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-if="products.length === 0">
                        <td colspan="6" class="text-center py-5 text-muted">
                            <div class="d-flex flex-column align-items-center">
                                <span class="material-symbols-outlined empty-icon mb-2">inventory_2</span>
                                No hay productos registrados en el catálogo.
                            </div>
                        </td>
                    </tr>
                    <tr v-for="product in products" :key="product.id" class="row-item">
                        <td class="ps-4 text-id">#{{ product.id }}</td>
                        <td class="fw-bold text-white">
                            <div class="d-flex align-items-center gap-3">
                                <div class="icon-box"
                                    :style="product.images && product.images.length ? `background-image: url(${getImageUrl(product.images[0].url)}); background-size: cover; background-position: center;` : ''">
                                    <span v-if="!product.images || !product.images.length"
                                        class="material-symbols-outlined">category</span>
                                </div>
                                <div class="text-truncate" style="max-width: 250px;" :title="product.name">
                                    {{ product.name }}
                                </div>
                            </div>
                        </td>
                        <td class="text-white opacity-75">
                            <span class="badge-type">{{ product.categories && product.categories.length ? product.categories[0].name : 'Sin Categoría' }}</span>
                        </td>
                        <td class="text-neon-green fw-bold">{{ product.price }} €</td>
                        <td class="text-white">
                            <span class="badge"
                                :class="product.stock > 5 ? 'bg-success bg-opacity-25 text-success' : (product.stock > 0 ? 'bg-warning bg-opacity-25 text-warning' : 'bg-danger bg-opacity-25 text-danger')">
                                {{ product.stock }} ud.
                            </span>
                        </td>
                        <td class="text-end pe-4">
                            <div class="action-buttons justify-content-end">
                                <button class="btn-action btn-edit-neon" data-bs-toggle="modal"
                                    data-bs-target="#productModal" @click="openEdit(product)" title="Editar">
                                    <span class="material-symbols-outlined">edit</span>
                                </button>
                                <button class="btn-action btn-delete-neon" @click="deleteProduct(product.id)"
                                    title="Eliminar">
                                    <span class="material-symbols-outlined">delete</span>
                                </button>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div class="pagination-container mt-5 d-flex flex-column align-items-center gap-3" v-if="lastPage > 1">

            <ul class="pagination pagination-custom mb-0">
                <li class="page-item" :class="{ disabled: currentPage === 1 }">
                    <button class="page-link" @click="fetchProducts(currentPage - 1)">
                        <span class="material-symbols-outlined" style="font-size: 18px;">chevron_left</span>
                    </button>
                </li>

                <li class="page-item" v-for="page in visiblePages" :key="page"
                    :class="{ active: currentPage === page }">
                    <button class="page-link" @click="fetchProducts(page)">{{ page }}</button>
                </li>

                <li class="page-item" :class="{ disabled: currentPage === lastPage }">
                    <button class="page-link" @click="fetchProducts(currentPage + 1)">
                        <span class="material-symbols-outlined" style="font-size: 18px;">chevron_right</span>
                    </button>
                </li>
            </ul>

            <div class="pagination-info text-center" style="color: #cbd5e1; font-size: 0.85rem; letter-spacing: 0.3px;">
                Mostrando página <span class="text-white fw-bold mx-1">{{ currentPage }}</span> de <span
                    class="text-white fw-bold mx-1">{{ lastPage }}</span>
                <span style="color: #94a3b8;" class="ms-1">({{ totalProducts }} productos en total)</span>
            </div>

        </div>

        <ProductsCrudModal :selectedProduct="selectedProduct" :isEdit="isEdit" @refresh="fetchProducts" />
    </div>
</template>

<script>
import ProductsCrudModal from './products-crud-modal.vue';
import { loaderState } from '@/loaderState';

export default {
    name: 'AdminProducts',
    components: {
        ProductsCrudModal,
    },
    data() {
        return {
            products: [],
            isEdit: false,
            selectedProduct: null,
            currentPage: 1,
            lastPage: 1,
            totalProducts: 0,
        };
    },

    computed: {
        visiblePages() {
            let pages = [];
            let start = Math.max(1, this.currentPage - 2);
            let end = Math.min(this.lastPage, this.currentPage + 2);

            for (let i = start; i <= end; i++) {
                pages.push(i);
            }
            return pages;
        }
    },

    methods: {
        fetchProducts(page = 1) {
            // Evitar peticiones fuera de rango
            if (page < 1 || (this.lastPage && page > this.lastPage)) return;

            loaderState.show();
            fetch(`${this.$BASE_URL}/v1/products?page=${page}`)
                .then(res => res.json())
                .then(data => {
                    this.products = data.data || [];

                    if (data.meta) {
                        this.currentPage = data.meta.current_page;
                        this.lastPage = data.meta.last_page;
                        this.totalProducts = data.meta.total;
                    } else if (data.current_page !== undefined) {
                        this.currentPage = data.current_page;
                        this.lastPage = data.last_page;
                        this.totalProducts = data.total;
                    }
                })
                .catch(err => {
                    console.error("Error obteniendo productos:", err);
                })
                .finally(() => {
                    loaderState.hide();
                });
        },

        openCreate() {
            this.isEdit = false;
            this.selectedProduct = null;
        },

        openEdit(product) {
            this.isEdit = true;
            this.selectedProduct = { ...product };
        },

        deleteProduct(id) {
            if (!confirm("¿Seguro que quieres eliminar este producto? Esta acción no se puede deshacer.")) return;
            const token = localStorage.getItem("user");

            loaderState.show();
            fetch(`${this.$BASE_URL}/v1/products/${id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    Authorization: `Bearer ${token}`,
                },
            })
                .then(res => {
                    if (!res.ok) return res.json().then(err => { throw err; });
                    // Al borrar, recargamos la PÁGINA ACTUAL para no volver a la 1
                    this.fetchProducts(this.currentPage);
                })
                .catch(err => console.error("Error al eliminar producto:", err))
                .finally(() => loaderState.hide());
        },

        getImageUrl(url) {
            if (!url) return '';
            if (url.startsWith('http')) return url;
            return `/img-productos/${url}`;
        }
    },

    mounted() {
        this.fetchProducts();
        document.title = "Productos | Administrar"
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

.col-stock {
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
    color: #f97316;
    font-size: 1.8rem;
    filter: drop-shadow(0 0 8px rgba(249, 115, 22, 0.4));
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
    background: rgba(249, 115, 22, 0.03);
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
    background: rgba(249, 115, 22, 0.1);
    color: #f97316;
}

.badge-status {
    background: rgba(249, 115, 22, 0.1);
    color: #f97316;
    border: 1px solid rgba(249, 115, 22, 0.3);
    padding: 0.6rem 1.2rem;
    border-radius: 10px;
    font-weight: 700;
    display: flex;
    align-items: center;
}

.badge-type {
    background: rgba(100, 116, 139, 0.2);
    padding: 4px 10px;
    border-radius: 8px;
    font-size: 0.8rem;
    font-weight: 600;
    border: 1px solid rgba(255, 255, 255, 0.05);
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
    background: linear-gradient(135deg, rgba(249, 115, 22, 0.2), rgba(249, 115, 22, 0.05));
    color: #f97316;
    border: 1px solid rgba(249, 115, 22, 0.4);
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 0.6rem 1.2rem;
    border-radius: 12px;
    font-weight: 700;
    transition: all 0.3s;
}

.btn-create-neon:hover {
    background: #f97316;
    color: #0f172a;
    box-shadow: 0 0 20px rgba(249, 115, 22, 0.4);
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

/* --- ESTILOS DE PAGINACIÓN --- */
.pagination-custom .page-link {
    background-color: rgba(15, 23, 42, 0.6);
    border: 1px solid rgba(255, 255, 255, 0.05);
    color: #cbd5e1;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 38px;
    min-width: 38px;
    margin: 0 4px;
    border-radius: 10px;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    font-weight: 600;
}

.pagination-custom .page-item.active .page-link {
    background-color: #f97316;
    border-color: #f97316;
    color: #0f172a;
    box-shadow: 0 0 15px rgba(249, 115, 22, 0.4);
}

.pagination-custom .page-item:not(.active):not(.disabled) .page-link:hover {
    background-color: rgba(249, 115, 22, 0.1);
    color: #f97316;
    border-color: rgba(249, 115, 22, 0.3);
    transform: translateY(-2px);
}

.pagination-custom .page-item.disabled .page-link {
    opacity: 0.4;
    cursor: not-allowed;
    background-color: rgba(15, 23, 42, 0.3);
}
</style>