<template>
    <div>
        <div class="products-grid">
            <ProductCard v-for="product in products" :key="product.id" :product="product" :locale="locale"
                :amount="product.price" :currency="currency" @add-to-cart="addToCart" />
        </div>

        <div class="pagination" v-if="meta.last_page > 1">
            <button v-for="page in meta.last_page" :key="page" :class="{ active: page === meta.current_page }"
                @click="goToPage(page)">
                {{ page }}
            </button>
        </div>
    </div>
</template>

<script>
import ProductCard from '../products/product-card.vue'

export default {
    name: 'Index',
    components: { ProductCard },

    data() {
        return {
            products: [],
            locale: 'es',
            currency: 'EUR',
            meta: { current_page: 1, last_page: 1 }
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
                    if (!res.ok) {
                        throw new Error("Error al recoger los productos")
                    }
                    return res.json()
                })
                .then(data => {
                    this.products = data.data

                    this.meta = {
                        current_page: data.meta.current_page,
                        last_page: data.meta.last_page,
                        path: data.meta.path
                    }
                })
                .catch(err => console.error('Error al cargar productos:', err))
        },

        goToPage(page) {
            const url = `${this.meta.path}?page=${page}`
            this.getProducts(url)
        },

        addToCart(product) {
        },
    },

    mounted() {
        this.getProducts()
    }
}
</script>

<style scoped>
.products-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: 1rem;
    padding: 1rem;
}

.pagination {
    display: flex;
    justify-content: center;
    gap: 0.5rem;
    margin: 1rem 0;
}

.pagination button {
    border: 1px solid var(--nav-text);
    background: transparent;
    color: var(--nav-text);
    padding: 0.4rem 0.8rem;
    border-radius: 4px;
    cursor: pointer;
}

.pagination button.active {
    background: var(--nav-text);
    color: var(--nav-bg);
}

.load-more button {
    border: 1px solid var(--nav-text);
    background: transparent;
    color: var(--nav-text);
    padding: 0.5rem 1rem;
    border-radius: 4px;
    cursor: pointer;
}
</style>