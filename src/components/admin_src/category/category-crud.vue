<template>
    <div class="admin-container p-4">

        <div class="header-section mb-4">
            <div>
                <h2 class="section-title d-flex align-items-center gap-2">
                    <span class="material-symbols-outlined icon-title">label</span>
                    Gestión de Categorías
                </h2>
                <p class="section-subtitle">Aquí se podrán gestionar las categorías del sistema</p>
            </div>

            <button class="btn-create-neon" @click="openCreate">
                <span class="material-symbols-outlined">add</span>
                <span class="btn-text">Nueva Categoría</span>
            </button>
        </div>

        <div class="table-wrapper">
            <table class="table table-dark custom-table">
                <thead>
                    <tr>
                        <th class="ps-4" style="width: 15%">ID</th>
                        <th style="width: 60%">Nombre</th>
                        <th class="text-end pe-4" style="width: 25%">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-if="categories.length === 0">
                        <td colspan="3" class="text-center py-5 text-muted">
                            <div class="d-flex flex-column align-items-center">
                                <span class="material-symbols-outlined mb-2" style="font-size: 2rem; opacity: 0.5;">label_off</span>
                                No hay categorías registradas.
                            </div>
                        </td>
                    </tr>

                    <tr v-for="category in categories" :key="category.id" class="row-item">
                        <td class="ps-4 text-id">#{{ category.id }}</td>
                        <td class="fw-bold text-white">
                            <div class="d-flex align-items-center gap-3">
                                <div class="icon-box">
                                    <span class="material-symbols-outlined">label</span>
                                </div>
                                {{ category.name }}
                            </div>
                        </td>
                        <td class="text-end pe-4">
                            <div class="action-buttons justify-content-end">
                                <button class="btn-action btn-edit-neon" @click="openEdit(category)" title="Editar">
                                    <span class="material-symbols-outlined">edit</span>
                                </button>
                                <button class="btn-action btn-delete-neon" @click="deleteCategory(category.id, category.name)" title="Eliminar">
                                    <span class="material-symbols-outlined">delete</span>
                                </button>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

    
        <CategoryModal
            :category="selectedCategory"
            :isEdit="isEdit"
            :show="showModal"
            @refresh="getCategories"
            @close="showModal = false"
        />
    </div>
</template>

<script>
import CategoryModal from './category-modal.vue';
import { loaderState } from '@/loaderState';

export default {
    components: {
        CategoryModal,
    },

    data() {
        return {
            categories: [],
            isEdit: false,
            selectedCategory: null,
            showModal: false,
        };
    },

    methods: {
        
        async getCategories() {
            try {
                loaderState.show();
                const response = await fetch(`${this.$BASE_URL}/v1/categories`);
                const data = await response.json();
                this.categories = Array.isArray(data) ? data : [];
            } catch (error) {
                console.error('Error al obtener categorías:', error);
            } finally {
                loaderState.hide();
            }
        },

        openCreate() {
            this.isEdit = false;
            this.selectedCategory = null;
            this.showModal = true;
        },

        openEdit(category) {
            this.isEdit = true;
            this.selectedCategory = category;
            this.showModal = true;
        },

        async deleteCategory(id,name) {
            if (!confirm('¿Seguro que quieres eliminar la categoría de ' +  name + '?')) return;

            const token = localStorage.getItem('user_token');

            try {
                loaderState.show();

                const response = await fetch(`${this.$BASE_URL}/v1/categories/${id}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        Accept: 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    console.error('Error al eliminar la categoría');
                    return;
                }

                await this.getCategories();
            } catch (error) {
                console.error('Error al eliminar categoría:', error);
            } finally {
                loaderState.hide();
            }
        },
    },

    mounted() {
        this.getCategories();
    },
};
</script>

<style scoped>
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

.btn-action .material-symbols-outlined {
    font-size: 1.1rem;
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
    cursor: pointer;
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
</style>