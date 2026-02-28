<template>
    <div v-if="product" class="product-details">
        <h2 class="product-name">{{ product.name }}</h2>

        <div class="product-price">
            {{ product.price }} €
        </div>

        <div class="product-stock" :class="{ 'out-of-stock': product.stock === 0 }">
            {{ product.stock > 0 ? `En stock: ${product.stock}` : 'Agotado' }}
        </div>

        <div class="product-categories">
            <span v-for="category in product.categories" :key="category" class="category">
                {{ category }}
            </span>
        </div>

        <p class="product-description">{{ product.description }}</p>

        <div class="product-actions">
            <button :disabled="product.stock === 0" class="btn btn-primary">
                Añadir al carrito
            </button>
            <button class="btn btn-secondary">
                Volver a productos
            </button>
        </div>
    </div>
</template>

<script>
export default {
    name: "ProductDetails",
    data() {
        return {
            productId: null,
            product: null
        }
    },

    methods: {
        getProduct() {
            console.log('dentro');
            
            fetch(`http://127.0.0.1:8000/api/v1/products/${this.productId}`, {
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
                    this.product = data.data
                })
                .catch(err => console.error('Error al cargar productos:', err))
        },
    },


    mounted() {
        this.productId = this.$route.params.id;
        this.getProduct();
    },
}
</script>

<style scoped>
.product-details {
    max-width: 600px;
    margin: 2rem auto;
    padding: 1rem 2rem;
    border: 1px solid #ddd;
    border-radius: 8px;
    background: var(--bg-color);;
}

.product-name {
    font-size: 1.6rem;
    font-weight: 700;
    margin-bottom: 0.5rem;
}

.product-price {
    font-size: 1.4rem;
    color: #1d4ed8;
    font-weight: 600;
    margin-bottom: 0.5rem;
}

.product-stock {
    margin-bottom: 1rem;
    font-weight: 500;
}

.product-stock.out-of-stock {
    color: #e63946;
}

.product-categories {
    margin-bottom: 1rem;
}

.category {
    background: #f0f0f0;
    color: #333;
    font-size: 0.85rem;
    padding: 2px 6px;
    border-radius: 4px;
    margin-right: 5px;
}

.product-description {
    margin-bottom: 1.5rem;
    line-height: 1.4;
}

.product-actions button {
    padding: 0.5rem 1rem;
    border-radius: 6px;
    border: none;
    cursor: pointer;
    margin-right: 0.5rem;
}

.btn-primary {
    background-color: #1d4ed8;
    color: #fff;
}

.btn-secondary {
    background-color: #eee;
    color: #333;
}
</style>