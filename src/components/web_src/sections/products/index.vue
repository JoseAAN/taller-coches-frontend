<template>
    <div class="products-container">
        <div class="row mb-3 justify-content-center">
            <div class="col-12 d-flex justify-content-center gap-2">
                <input v-model="activeFilters.search" type="text" class="form-control search-input"
                    placeholder="Buscar producto..." @keyup.enter="handleFilters({ ...activeFilters })" />
                <button class="btn btn-primary filter-btn" data-bs-toggle="modal" data-bs-target="#filterModal">
                    <span class="material-symbols-outlined">instant_mix</span>
                </button>
            </div>
        </div>

        <div class="row justify-content-center">
            <div class="col-md-9">
                <div class="products-header">
                    <div class="products-count">{{ meta.total }} productos encontrados</div>
                    <div class="products-page">Página {{ meta.current_page }} de {{ meta.last_page }}</div>
                </div>

                <div class="products-grid">
                    <ProductCard v-for="product in products" :key="product.id" :product="product" :locale="locale"
                        :currency="currency" />
                </div>

                <nav aria-label="Page navigation" v-if="meta.last_page > 1" class="mt-5">
                    <ul class="pagination justify-content-center">
                        <li class="page-item" :class="{ disabled: meta.current_page === 1 }">
                            <a class="page-link" href="#" @click.prevent="goToPage(meta.current_page - 1)">
                                <span class="material-symbols-outlined">chevron_left</span>
                            </a>
                        </li>
                        <li v-for="page in meta.last_page" :key="page" class="page-item"
                            :class="{ active: page === meta.current_page }">
                            <a class="page-link" href="#" @click.prevent="goToPage(page)">{{ page }}</a>
                        </li>
                        <li class="page-item" :class="{ disabled: meta.current_page === meta.last_page }">
                            <a class="page-link" href="#" @click.prevent="goToPage(meta.current_page + 1)">
                                <span class="material-symbols-outlined">chevron_right</span>
                            </a>
                        </li>
                    </ul>
                </nav>
            </div>
        </div>

        <div class="modal fade" id="filterModal" tabindex="-1" aria-labelledby="filterModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="filterModalLabel">Filtros</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <ProductFilter v-model="activeFilters" @filter-changed="handleFilters" />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import ProductCard from '../products/product-card.vue'
import ProductFilter from '../products/filter-component.vue'
import { loaderState } from '@/loaderState';

export default {
    name: 'Index',
    components: { ProductCard, ProductFilter },
    data() {
        return {
            products: [],
            locale: 'es',
            currency: 'EUR',
            activeFilters: {
                search: '',
                category: '',
                maxPrice: 1000
            },
            meta: { current_page: 1, last_page: 1, total: 0, path: '' }
        }
    },
    methods: {
        getProducts(url = `${this.$BASE_URL}/v1/products`) {
            loaderState.show();
            const params = new URLSearchParams();
            if (this.activeFilters.search) params.append('search', this.activeFilters.search);
            if (this.activeFilters.category) params.append('category_id', this.activeFilters.category.id);
            if (this.activeFilters.maxPrice) params.append('max_price', this.activeFilters.maxPrice);

            const finalUrl = url.includes('?') ? `${url}&${params.toString()}` : `${url}?${params.toString()}`;

            fetch(finalUrl, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }
            })
                .then(res => res.json())
                .then(data => {
                    this.products = data.data;
                    this.meta = data.meta;
                    loaderState.hide();
                })
                .catch(err => console.error(err));
        },
        handleFilters(filters) {
            this.activeFilters = filters;
            this.getProducts();
        },
        goToPage(page) {
            this.getProducts(`${this.meta.path}?page=${page}`);
        }
    },
    mounted() {
        this.getProducts();
    }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=DM+Sans:wght@300;400;500&display=swap');

/* ─── CONTENEDOR ─────────────────────────────────────────── */
.products-container {
    width: 100%;
    max-width: 1400px;
    margin: auto;
    padding: 2rem 1rem 3rem;
    font-family: 'DM Sans', sans-serif;
}

/* ─── BUSCADOR ───────────────────────────────────────────── */
.search-input.form-control {
    max-width: 360px;
    height: 46px;
    padding: 10px 24px;
    border-radius: 100px;
    border: 1.5px solid var(--nav-border, rgba(0, 0, 0, 0.12));
    background: var(--nav-bg, rgba(255, 255, 255, 0.6));
    color: var(--nav-text, #0a1f33);
    font-family: 'DM Sans', sans-serif;
    font-size: 0.88rem;
    font-weight: 400;
    box-shadow: none;
    transition:
        border-color 0.3s ease,
        box-shadow 0.3s ease,
        background 0.3s ease;
}

.search-input.form-control::placeholder {
    color: var(--nav-text, #0a1f33);
    opacity: 0.38;
    font-weight: 300;
}

.search-input.form-control:focus {
    outline: none;
    box-shadow: 0 0 0 4px rgba(82, 177, 85, 0.12);
    border-color: #52b155;
    background: var(--nav-bg, #fff);
}

/* ─── BOTÓN FILTROS ──────────────────────────────────────── */
.filter-btn.btn.btn-primary {
    width: 46px;
    height: 46px;
    padding: 0;
    border-radius: 100px;
    border: 1.5px solid var(--nav-border, rgba(0, 0, 0, 0.12));
    background: transparent;
    color: var(--nav-text, #0a1f33);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    box-shadow: none;
    transition:
        background 0.25s ease,
        border-color 0.25s ease,
        color 0.25s ease,
        transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.filter-btn.btn.btn-primary:hover,
.filter-btn.btn.btn-primary:focus {
    background: #52b155;
    border-color: #52b155;
    color: #fff;
    transform: scale(1.07);
    box-shadow: 0 6px 18px rgba(82, 177, 85, 0.3);
}

.filter-btn.btn.btn-primary:active {
    transform: scale(0.97);
}

.filter-btn .material-symbols-outlined {
    font-size: 1.1rem;
    line-height: 1;
}

/* ─── CABECERA PRODUCTOS ─────────────────────────────────── */
.products-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.8rem;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.78rem;
    font-weight: 500;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: var(--nav-text, #0a1f33);
    opacity: 0.45;
}

/* ─── GRID ───────────────────────────────────────────────── */
.products-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 2rem;
    padding: 0.5rem 0.25rem 1rem;
    overflow: visible;
}

/* ─── PAGINACIÓN ─────────────────────────────────────────── */
.pagination {
    display: flex;
    gap: 6px;
    padding: 0;
    margin: 0;
    list-style: none;
}

.page-item .page-link {
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 40px;
    height: 40px;
    padding: 0 12px;
    border-radius: 10px;
    border: 1.5px solid var(--nav-border, rgba(0, 0, 0, 0.1));
    background: transparent;
    color: var(--nav-text, #0a1f33);
    font-family: 'DM Sans', sans-serif;
    font-size: 0.85rem;
    font-weight: 500;
    text-decoration: none;
    transition:
        background 0.25s ease,
        border-color 0.25s ease,
        color 0.25s ease,
        transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1),
        box-shadow 0.25s ease;
}

.page-item .page-link .material-symbols-outlined {
    font-size: 1.1rem;
    line-height: 1;
}

.page-item .page-link:hover {
    background: rgba(82, 177, 85, 0.08);
    border-color: rgba(82, 177, 85, 0.35);
    color: #52b155;
    transform: translateY(-1px);
}

.page-item.active .page-link {
    background: #52b155;
    border-color: #52b155;
    color: #fff;
    box-shadow: 0 6px 16px rgba(82, 177, 85, 0.35);
    transform: translateY(-1px);
}

.page-item.active .page-link:hover {
    background: #3d9640;
    border-color: #3d9640;
}

.page-item.disabled .page-link {
    opacity: 0.3;
    pointer-events: none;
    background: transparent;
    border-color: var(--nav-border, rgba(0, 0, 0, 0.08));
    color: var(--nav-text, #0a1f33);
    transform: none;
    box-shadow: none;
}

/* ─── MODAL ──────────────────────────────────────────────── */
.modal-content {
    border-radius: 20px;
    border: 1px solid var(--nav-border, rgba(0, 0, 0, 0.08));
    background: var(--nav-bg, #fff);
    box-shadow: 0 24px 56px rgba(0, 0, 0, 0.13);
    font-family: 'DM Sans', sans-serif;
}

.modal-header {
    border-bottom: 1px solid var(--nav-border, rgba(0, 0, 0, 0.07));
    padding: 1.2rem 1.5rem;
}

.modal-title {
    font-family: 'Syne', sans-serif;
    font-weight: 700;
    font-size: 1.1rem;
    color: var(--nav-text, #0a1f33);
}

.modal-body {
    padding: 1.5rem;
}

/* ─── RESPONSIVE ─────────────────────────────────────────── */
@media (max-width: 1200px) {
    .products-grid {
        grid-template-columns: repeat(3, 1fr);
    }
}

@media (max-width: 768px) {
    .products-grid {
        grid-template-columns: repeat(2, 1fr);
        gap: 1.2rem;
    }

    .search-input.form-control {
        max-width: 100%;
    }
}

@media (max-width: 480px) {
    .products-grid {
        grid-template-columns: 1fr;
    }

    .page-item .page-link {
        min-width: 36px;
        height: 36px;
        font-size: 0.8rem;
        border-radius: 8px;
    }
}
</style>