<template>
    <div class="product-card" @click="goToDetails(product.id)">
        <img :src="product.image" :alt="product.name" class="product-image" />

        <h3 class="product-name">{{ product.name }}</h3>
        <BasePrice :amount="product.price" :locale="locale" :currency="currency" size="md" />

        <button @click.stop="addToCart" class="btn material-icons">
            shopping_cart
        </button>
    </div>
</template>

<script>
import BasePrice from '../../UI/global-price.vue'

export default {
    name: 'ProductCard',
    components: { BasePrice },

    props: {
        product: {
            type: Object,
            required: true
        },
        locale: {
            type: String,
            default: 'es'
        },
        currency: {
            type: String,
            default: 'EUR'
        }
    },

    methods: {
        addToCart() {
            //meter llamada a carrito
        },
        goToDetails(productId) {
            console.log(productId);
            
            this.$router.push({name: 'ProductDetails', params: {id: productId}})
        }
    },
    mounted() {
    }
}
</script>

<style scoped>
.product-card {
    border: 1px solid var(--nav-border);
    border-radius: 8px;
    padding: 1rem;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    cursor: pointer;
    transition: box-shadow 0.2s, background 0.2s;
    background:var(--bg-color);
    color: var(--nav-text);
}

.product-card:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.product-image {
    width: 100%;
    height: auto;
    border-radius: 4px;
    object-fit: cover;
}

.product-name {
    font-weight: 600;
    font-size: 1.1rem;
}

.btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    padding: 0;
    border-radius: 50%;
    cursor: pointer;
    border: none;
    margin-top: 0.5rem;
    background-color: #1d49d8;
    color: white;
    transition: background-color 0.2s;
}

.btn:hover {
    background-color: #3561f1;
}

.p-dark .product-card,
[data-theme='dark'] .product-card {
    border-color: var(--nav-border);
    background: var(--nav-bg);
    color: var(--nav-text);
}

.p-dark .pagination button,
[data-theme='dark'] .pagination button {
    border-color: var(--nav-text);
    color: var(--nav-text);
}

.p-dark .pagination button.active,
[data-theme='dark'] .pagination button.active {
    background: var(--nav-text);
    color: var(--nav-bg);
}

.p-dark .btn-primary,
[data-theme='dark'] .btn-primary {
    background-color: #1d4ed8;
    color: white;
}
</style>