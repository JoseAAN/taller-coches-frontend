<template>
    <div class="cart-container">

        <div class="cart-header">
            <h2 class="cart-title">
                <span class="material-symbols-outlined">shopping_cart</span>
                Mi Carrito
            </h2>
            <span class="cart-count">{{ cart.products.length }} producto(s)</span>
        </div>

        <!-- CARRITO VACÍO -->
        <div v-if="!isLoggedIn" class="empty-state">
            <span class="material-symbols-outlined empty-icon">login</span>
            <p class="empty-title">Inicia sesión para ver tu carrito</p>
            <router-link to="/login" class="btn-action">Iniciar Sesión</router-link>
        </div>

        <div v-else-if="cart.products.length === 0" class="empty-state">
            <span class="material-symbols-outlined empty-icon">remove_shopping_cart</span>
            <p class="empty-title">Tu carrito está vacío</p>
            <p class="empty-subtitle">Explora nuestros productos y añade lo que necesites</p>
            <router-link to="/products" class="btn-action">Ver Productos</router-link>
        </div>

        <!-- CONTENIDO DEL CARRITO -->
        <div v-else class="cart-content">

            <div class="cart-items">
                <div
                    v-for="item in cart.products"
                    :key="item.id"
                    class="cart-item"
                >
                    <div class="item-image">
                        <img :src="item.image || 'https://placehold.co/120x120'" :alt="item.name" />
                    </div>

                    <div class="item-info">
                        <h4 class="item-name">{{ item.name }}</h4>
                        <p class="item-price-unit">
                            <BasePrice :amount="item.pivot?.priceInTime || item.price" size="sm" />
                            <span class="unit-label">/ unidad</span>
                        </p>

                        <span v-if="item.stock <= 3 && item.stock > 0" class="stock-warning">
                            <span class="material-symbols-outlined" style="font-size: 14px;">warning</span>
                            Quedan {{ item.stock }} unidades
                        </span>
                        <span v-else-if="item.stock === 0" class="stock-out">
                            Agotado
                        </span>
                    </div>

                    <div class="item-actions">
                        <div class="quantity-control">
                            <button
                                class="qty-btn"
                                @click="decreaseQuantity(item)"
                                :disabled="(item.pivot?.quantity || 1) <= 1"
                            >
                                <span class="material-symbols-outlined">remove</span>
                            </button>

                            <span class="qty-value">{{ item.pivot?.quantity || 1 }}</span>

                            <button
                                class="qty-btn"
                                @click="increaseQuantity(item)"
                                :disabled="(item.pivot?.quantity || 1) >= item.stock"
                            >
                                <span class="material-symbols-outlined">add</span>
                            </button>
                        </div>

                        <div class="item-subtotal">
                            <BasePrice :amount="String(item.pivot?.totalPerProduct || item.price)" size="md" />
                        </div>

                        <button class="btn-remove" @click="removeItem(item)">
                            <span class="material-symbols-outlined">delete</span>
                        </button>
                    </div>
                </div>
            </div>

            <!-- RESUMEN -->
            <div class="cart-summary">
                <div class="summary-card">
                    <h3 class="summary-title">Resumen del pedido</h3>

                    <div class="summary-row">
                        <span>Productos ({{ cart.quantity }})</span>
                        <BasePrice :amount="String(cart.total)" size="sm" />
                    </div>

                    <div class="summary-row">
                        <span>Envío</span>
                        <span class="free-shipping">Gratis</span>
                    </div>

                    <hr class="summary-divider" />

                    <div class="summary-row summary-total">
                        <span>Total</span>
                        <BasePrice :amount="String(cart.total)" size="lg" />
                    </div>

                    <button class="btn-checkout" @click="checkout" :disabled="cart.products.length === 0 || isProcessing">
                        <span class="material-symbols-outlined" v-if="!isProcessing">shopping_bag</span>
                        <span v-else class="material-symbols-outlined loader-spin">sync</span>
                        {{ isProcessing ? 'Procesando...' : 'Finalizar compra' }}
                    </button>
                </div>
            </div>

        </div>

    </div>
</template>

<script>
import { cart } from '@/JS/Cart.js'
import BasePrice from '../../UI/global-price.vue'

export default {
    name: 'CartPage',
    components: { BasePrice },

    data() {
        return {
            cart,
            isProcessing: false
        }
    },

    computed: {
        isLoggedIn() {
            return !!localStorage.getItem('user_token')
        }
    },

    methods: {
        async removeItem(item) {
            const pivotId = item.pivot?.id
            if (!pivotId) return
            await cart.removeItem(pivotId)
        },

        async increaseQuantity(item) {
            const pivotId = item.pivot?.id
            const currentQty = item.pivot?.quantity || 1
            if (currentQty >= item.stock) return
            await cart.updateQuantity(pivotId, currentQty + 1, item.pivot?.priceInTime || item.price)
        },

        async decreaseQuantity(item) {
            const pivotId = item.pivot?.id
            const currentQty = item.pivot?.quantity || 1
            if (currentQty <= 1) return
            await cart.updateQuantity(pivotId, currentQty - 1, item.pivot?.priceInTime || item.price)
        },

        async checkout() {
            try {
                this.isProcessing = true;
                const token = localStorage.getItem('user_token');
                
                const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/v1/product-invoices`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        total: cart.total,
                        cart_id: cart.id
                    })
                });
                
                const data = await res.json();
                
                if (!res.ok) {
                    alert(data.message || 'Error al procesar la compra');
                    return;
                }
                
                // Clear local cart
                const purchasedCartId = cart.id;
                cart.clearCart();

                // Redirect to success route
                this.$router.push({ name: 'CheckoutView', query: { cart_id: purchasedCartId } });
                
            } catch (err) {
                console.error(err);
                alert('Error de conexión al finalizar compra');
            } finally {
                this.isProcessing = false;
            }
        }
    },

    mounted() {
        cart.loadUserCart()
    }
}
</script>

<style scoped>
.cart-container {
    width: 100%;
    max-width: 1200px;
    margin: auto;
    padding: 1.5rem 1rem 3rem;
}

.cart-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 1.5rem;
}

.cart-title {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 1.5rem;
    font-weight: 800;
    color: var(--nav-text);
    margin: 0;
}

.cart-title .material-symbols-outlined {
    font-size: 28px;
    color: #52b155;
}

.cart-count {
    font-size: 0.9rem;
    color: var(--nav-text);
    opacity: 0.6;
    font-weight: 600;
}

/* EMPTY STATE */
.empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 4rem 2rem;
    text-align: center;
}

.empty-icon {
    font-size: 64px;
    color: var(--nav-text);
    opacity: 0.25;
    margin-bottom: 1rem;
}

.empty-title {
    font-size: 1.3rem;
    font-weight: 700;
    color: var(--nav-text);
    margin: 0 0 0.5rem;
}

.empty-subtitle {
    font-size: 0.9rem;
    color: var(--nav-text);
    opacity: 0.5;
    margin: 0 0 1.5rem;
}

.btn-action {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 10px 24px;
    background: #52b155;
    color: #fff;
    border: none;
    border-radius: 8px;
    font-weight: 700;
    font-size: 0.9rem;
    text-decoration: none;
    cursor: pointer;
    transition: opacity 0.2s;
}

.btn-action:hover {
    opacity: 0.85;
}

/* LAYOUT CARRITO */
.cart-content {
    display: grid;
    grid-template-columns: 1fr 340px;
    gap: 2rem;
    align-items: start;
}

/* ITEMS */
.cart-items {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.cart-item {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1.2rem;
    border: 1px solid var(--nav-border, #ddd);
    border-radius: 12px;
    background: var(--nav-bg);
    transition: all 0.2s ease;
}

.cart-item:hover {
    border-color: #52b155;
    box-shadow: 0 2px 10px rgba(82, 177, 85, 0.1);
}

.item-image {
    width: 90px;
    height: 90px;
    border-radius: 8px;
    overflow: hidden;
    flex-shrink: 0;
}

.item-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.item-info {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.item-name {
    font-size: 1rem;
    font-weight: 700;
    color: var(--nav-text);
    margin: 0;
}

.item-price-unit {
    display: flex;
    align-items: center;
    gap: 4px;
    margin: 0;
}

.unit-label {
    font-size: 0.8rem;
    color: var(--nav-text);
    opacity: 0.5;
}

.stock-warning {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    font-size: 0.78rem;
    font-weight: 600;
    color: #e67e22;
    margin-top: 2px;
}

.stock-out {
    font-size: 0.78rem;
    font-weight: 600;
    color: #dc2626;
}

/* ACCIONES */
.item-actions {
    display: flex;
    align-items: center;
    gap: 1.2rem;
    flex-shrink: 0;
}

.quantity-control {
    display: flex;
    align-items: center;
    gap: 0;
    border: 1.5px solid var(--nav-border, #ddd);
    border-radius: 8px;
    overflow: hidden;
}

.qty-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 34px;
    height: 34px;
    border: none;
    background: transparent;
    color: var(--nav-text);
    cursor: pointer;
    transition: background 0.15s;
}

.qty-btn:hover:not(:disabled) {
    background: var(--nav-border, #f0f0f0);
}

.qty-btn:disabled {
    opacity: 0.3;
    cursor: not-allowed;
}

.qty-btn .material-symbols-outlined {
    font-size: 18px;
}

.qty-value {
    width: 36px;
    text-align: center;
    font-weight: 700;
    font-size: 0.95rem;
    color: var(--nav-text);
    border-left: 1.5px solid var(--nav-border, #ddd);
    border-right: 1.5px solid var(--nav-border, #ddd);
    line-height: 34px;
}

.item-subtotal {
    min-width: 80px;
    text-align: right;
    font-weight: 700;
}

.btn-remove {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    border-radius: 8px;
    border: 1.5px solid #dc2626;
    background: transparent;
    color: #dc2626;
    cursor: pointer;
    transition: all 0.2s;
}

.btn-remove:hover {
    background: #dc2626;
    color: #fff;
}

.btn-remove .material-symbols-outlined {
    font-size: 20px;
}

/* RESUMEN */
.summary-card {
    position: sticky;
    top: 2rem;
    padding: 1.5rem;
    border: 1px solid var(--nav-border, #ddd);
    border-radius: 12px;
    background: var(--nav-bg);
}

.summary-title {
    font-size: 1.1rem;
    font-weight: 800;
    color: var(--nav-text);
    margin: 0 0 1rem;
}

.summary-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.5rem 0;
    font-size: 0.9rem;
    color: var(--nav-text);
}

.summary-total {
    font-weight: 800;
    font-size: 1.05rem;
}

.free-shipping {
    color: #52b155;
    font-weight: 600;
}

.summary-divider {
    border: none;
    border-top: 1px solid var(--nav-border, #ddd);
    margin: 0.5rem 0;
}

.btn-checkout {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    width: 100%;
    padding: 12px;
    margin-top: 1rem;
    border: none;
    border-radius: 8px;
    background: #52b155;
    color: #fff;
    font-weight: 700;
    font-size: 0.95rem;
    cursor: pointer;
    transition: opacity 0.2s;
}

.btn-checkout:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.btn-checkout .material-symbols-outlined {
    font-size: 18px;
}

.checkout-notice {
    text-align: center;
    font-size: 0.78rem;
    color: var(--nav-text);
    opacity: 0.4;
    margin: 0.5rem 0 0;
}

/* RESPONSIVE */
@media (max-width: 900px) {
    .cart-content {
        grid-template-columns: 1fr;
    }

    .summary-card {
        position: static;
    }
}

@media (max-width: 600px) {
    .cart-item {
        flex-direction: column;
        align-items: flex-start;
        gap: 0.8rem;
    }

    .item-actions {
        width: 100%;
        justify-content: space-between;
    }

    .item-image {
        width: 100%;
        height: 160px;
    }
}

.loader-spin {
    animation: spin 1s linear infinite;
}

@keyframes spin {
    100% {
        transform: rotate(360deg);
    }
}
</style>
