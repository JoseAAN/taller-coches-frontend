<template>
    <div class="product-card" @click="goToDetails(product.id)">

        <div class="image-wrapper">
            <img :src="product.image || defaultImage" :alt="product.name" class="product-image" />


            <span v-if="product.stock <= 0" class="stock out-stock">
                Agotado
            </span>
        </div>

        <div class="product-content">

            <h3 class="product-name">
                {{ product.name }}
            </h3>

            <p class="product-description">
                {{ shortDescription }}
            </p>

            <div class="product-footer">

                <BasePrice
                    :amount="product.price"
                    :locale="locale"
                    :currency="currency"
                    size="lg"
                />

                <button
                    class="cart-btn"
                    @click.stop="addToCart"
                    :disabled="isOutOfStock"
                >
                    <span class="material-symbols-outlined">
                        shopping_cart
                    </span>
                </button>

            </div>

        </div>

    </div>
</template>

<script>
import { loaderState } from '@/loaderState'
import BasePrice from '../../UI/global-price.vue'
import { cart } from '@/JS/Cart.js'

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
        },
        defaultImage: {
            type: String,
            default: 'https://placehold.co/600x700'
        }
    },

    computed: {
        shortDescription() {
            if (!this.product.description) return ''
            return this.product.description.length > 90
                ? this.product.description.substring(0, 90) + '...'
                : this.product.description
        },
        isOutOfStock() {
            const inCart = cart.getProductQuantityInCart(this.product.id);
            return this.product.stock <= inCart;
        }
    },

    methods: {
        async addToCart() {
            await cart.addToCart(this.product.id, 1, this.product.price);
        },

        goToDetails(productId) {
            this.$router.push({ name: 'ProductDetails', params: { id: productId } })
        }
    }
}
</script>

<style scoped>
.product-card {
    display: flex;
    flex-direction: column;
    border: 1px solid var(--nav-border);
    border-radius: 10px;
    overflow: hidden;
    background: var(--bg-color);
    color: var(--nav-text);
    cursor: pointer;
    transition: transform 0.15s ease, box-shadow 0.15s ease;
}

.product-card:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(0,0,0,0.08);
}

.image-wrapper {
    position: relative;
    width: 100%;
    aspect-ratio: 4 / 5;
    overflow: hidden;
}

.product-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.stock {
    position: absolute;
    top: 10px;
    left: 10px;
    font-size: 0.75rem;
    font-weight: 600;
    padding: 4px 8px;
    border-radius: 4px;
}

.in-stock {
    background: #16a34a;
    color: white;
}

.out-stock {
    background: #dc2626;
    color: white;
}

.product-content {
    display: flex;
    flex-direction: column;
    gap: 0.6rem;
    padding: 0.9rem;
}

.product-name {
    font-size: 1rem;
    font-weight: 600;
    line-height: 1.3;
}

.product-description {
    font-size: 0.85rem;
    opacity: 0.75;
    line-height: 1.35;
}

.product-footer {
    margin-top: auto;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.cart-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 38px;
    height: 38px;
    border-radius: 50%;
    border: none;
    cursor: pointer;
    background: #2563eb;
    color: white;
    transition: background 0.2s ease, transform 0.1s ease;
}

.cart-btn:hover {
    background: #1d4ed8;
}

.cart-btn:disabled {
    background: #9ca3af;
    cursor: not-allowed;
}
</style>