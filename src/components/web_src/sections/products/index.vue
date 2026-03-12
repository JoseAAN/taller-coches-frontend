<template>
    <div class="products-container">

        <div class="products-header">

            <div class="products-count">
                {{ meta.total }} productos encontrados
            </div>

            <div class="searchBox">
                <input
                    class="searchInput"
                    type="text"
                    v-model="search"
                    placeholder="Buscar producto..."
                    @keyup.enter="searchProducts"
                />
                <button class="searchButton" @click="searchProducts">
                    <i class="material-symbols-outlined">search</i>
                </button>
            </div>

            <div class="products-page">
                Página {{ meta.current_page }} de {{ meta.last_page }}
            </div>

        </div>

        <div v-if="search.trim() !== ''" class="active-search">
            Buscando: "{{ search }}"
            <button class="clear-search" @click="clearSearch">✕</button>
        </div>

        <div class="products-grid">
            <ProductCard
                v-for="product in products"
                :key="product.id"
                :product="product"
                :locale="locale"
                :currency="currency"
            />
        </div>

        <div class="pagination" v-if="meta.last_page > 1">

            <button
                class="nav-btn material-symbols-outlined"
                :disabled="meta.current_page === 1"
                @click="goToPage(meta.current_page - 1)"
            >
                chevron_left
            </button>

            <button
                v-for="page in meta.last_page"
                :key="page"
                :class="{ active: page === meta.current_page }"
                @click="goToPage(page)"
            >
                {{ page }}
            </button>

            <button
                class="nav-btn material-symbols-outlined"
                :disabled="meta.current_page === meta.last_page"
                @click="goToPage(meta.current_page + 1)"
            >
                chevron_right
            </button>

        </div>

    </div>
</template>

<script>
import ProductCard from '../products/product-card.vue'
import { loaderState } from '@/loaderState';

export default {
    name: 'Index',

    components: {
        ProductCard
    },

    data() {
        return {
            products: [],
            locale: 'es',
            currency: 'EUR',
            search: '',
            meta: {
                current_page: 1,
                last_page: 1,
                total: 0,
                path: ''
            }
        }
    },

    methods: {
        getProducts(url = 'http://127.0.0.1:8000/api/v1/products') {
            fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            })
            .then(res => {
                if (!res.ok) throw new Error("Error al recoger los productos")
                return res.json()
            })
            .then(data => {
                this.products = data.data
                this.meta = {
                    current_page: data.meta.current_page,
                    last_page: data.meta.last_page,
                    total: data.meta.total,
                    path: data.meta.path
                }
                loaderState.hide();
            })
            .catch(err => console.error('Error al cargar productos:', err))
        },

        searchProducts() {
            loaderState.show()
            let url = 'http://127.0.0.1:8000/api/v1/products'
            if (this.search.trim() !== '') {
                url += `?search=${this.search}`
            }
            this.getProducts(url)
        },

        clearSearch() {
            loaderState.show()
            this.search = ''
            this.getProducts()
        },

        goToPage(page) {
            let url = `${this.meta.path}?page=${page}`
            if (this.search.trim() !== '') {
                url += `&search=${this.search}`
            }
            this.getProducts(url)
        }
    },

    mounted() {
        this.getProducts()
    }
}
</script>

<style scoped>
.searchBox {
    position: relative;
    height: 40px;
    border-radius: 40px;
    background: #003366;
    display: flex;
    align-items: center;
    padding: 0 10px;
    transition: 0.4s;
}

.searchBox:hover > .searchInput {
    width: 240px;
    padding: 0 6px;
}

.searchBox:hover > .searchButton {
    background: #003366;
    color: white;
}

.searchButton {
    color: white;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: #003366;
    display: flex;
    justify-content: center;
    align-items: center;
    border: none;
    cursor: pointer;
    transition: 0.4s;
}

.searchInput {
    border: none;
    background: none;
    outline: none;
    color: white;
    font-size: 16px;
    width: 0px;
    transition: 0.4s;
    line-height: 40px;
}

.active-search {
    margin: 0.5rem 0;
    font-size: 0.9rem;
    color: #003366;
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.clear-search {
    background: transparent;
    border: none;
    cursor: pointer;
    font-weight: bold;
    color: #003366;
}

@media screen and (max-width: 620px) {
    .searchBox:hover > .searchInput {
        width: 150px;
        padding: 0 6px;
    }
}

/* --------  aqui empieza el css nuestro*/
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
    margin-bottom: 1rem;
    font-weight: 600;
    color: var(--nav-text);
    gap: 1rem;
}

.products-count {
    font-size: 0.95rem;
    opacity: 0.8;
}

.products-page {
    font-size: 0.9rem;
    opacity: 0.7;
}

.products-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 1.6rem;
}

.pagination {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 0.5rem;
    margin-top: 2rem;
    flex-wrap: wrap;
}

.pagination button {
    min-width: 38px;
    height: 38px;
    border: 1px solid var(--nav-text);
    background: transparent;
    color: var(--nav-text);
    border-radius: 6px;
    cursor: pointer;
    font-weight: 600;
    transition: all 0.2s ease;
}

.pagination button:hover:not(:disabled) {
    background: var(--nav-text);
    color: var(--nav-bg);
}

.pagination button.active {
    background: var(--nav-text);
    color: var(--nav-bg);
}

.pagination button:disabled {
    opacity: 0.4;
    cursor: not-allowed;
}

.nav-btn {
    font-size: 1.1rem;
}

@media (max-width: 900px) {
    .products-grid {
        grid-template-columns: repeat(2, 1fr);
    }
}

@media (max-width: 520px) {
    .products-header {
        flex-wrap: wrap;
        align-items: flex-start;
        gap: 0.5rem;
    }

    .products-grid {
        grid-template-columns: 1fr;
    }

    .searchBox {
        width: 100%;
    }
}
</style>