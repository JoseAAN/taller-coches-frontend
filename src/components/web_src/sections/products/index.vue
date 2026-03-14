<template>
    <div class="products-container">
        <div class="row">
            <div class="col-md-3">
                <ProductFilter @filter-changed="handleFilters" />
            </div>

            <div class="col-md-9">
                <div class="products-header">
                    <div class="products-count">
                        {{ meta.total }} productos encontrados
                    </div>
                    <div class="products-page">
                        Página {{ meta.current_page }} de {{ meta.last_page }}
                    </div>
                </div>

                <div v-if="activeFilters.search" class="active-search mb-3">
                    Buscando: "{{ activeFilters.search }}"
                </div>

                <div class="products-grid">
                    <ProductCard v-for="product in products" :key="product.id" :product="product" :locale="locale"
                        :currency="currency" />
                </div>

                <nav aria-label="Page navigation" v-if="meta.last_page > 1" class="mt-5">
                    <ul class="pagination justify-content-center">
                        <li class="page-item" :class="{ disabled: meta.current_page === 1 }">
                            <a class="page-link" href="#" @click.prevent="goToPage(meta.current_page - 1)">
                                <span class="material-symbols-outlined" style="vertical-align: middle;">chevron_left</span>
                            </a>
                        </li>
                        <li v-for="page in meta.last_page" :key="page" class="page-item"
                            :class="{ active: page === meta.current_page }">
                            <a class="page-link" href="#" @click.prevent="goToPage(page)">{{ page }}</a>
                        </li>
                        <li class="page-item" :class="{ disabled: meta.current_page === meta.last_page }">
                            <a class="page-link" href="#" @click.prevent="goToPage(meta.current_page + 1)">
                                <span class="material-symbols-outlined" style="vertical-align: middle;">chevron_right</span>
                            </a>
                        </li>
                    </ul>
                </nav>
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
            if (this.activeFilters.category) params.append('category', this.activeFilters.category);
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
.products-container {
    width: 100%;
    max-width: 1400px;
    margin: auto;
    padding: 1.5rem 1rem 2rem;
}
.products-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
    font-weight: 600;
    color: var(--nav-text);
}
.products-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1.6rem;
}
.page-link {
    color: var(--nav-text);
    border: 1px solid #dee2e6;
}
.page-item.active .page-link {
    background-color: var(--nav-text);
    border-color: var(--nav-text);
    color: white;
}
@media (max-width: 1100px) {
    .products-grid { grid-template-columns: repeat(2, 1fr); }
}
@media (max-width: 768px) {
    .products-grid { grid-template-columns: 1fr; }
}
</style>