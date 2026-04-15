<template>
    <div class="cart-container">

        <div class="cart-header">
            <h2 class="cart-title">
                <span class="material-symbols-outlined">shopping_cart</span>
                Mi Carrito
            </h2>
            <span class="cart-count">{{ cart.items?.length || 0 }} elemento(s)</span>
        </div>

        <!-- CARRITO VACÍO -->
        <div v-if="cart.items.length === 0" class="empty-state">
            <span class="material-symbols-outlined empty-icon">remove_shopping_cart</span>
            <p class="empty-title">Tu carrito está vacío</p>
            <p class="empty-subtitle">Explora nuestros productos y servicios</p>
            <div class="cart-items">
                <router-link to="/products" class="btn-action">Ver Productos</router-link>
                <router-link to="/services" class="btn-action">Ver Servicios</router-link>
            </div>
        </div>

        <!-- CONTENIDO DEL CARRITO -->
        <div v-else class="cart-content">

            <div class="cart-items">
                <div v-for="item in cart.items" :key="item.id" class="cart-item">

                    <div class="item-image">
                        <img :src="getItemImage(item)" :alt="item.details.name" />
                    </div>

                    <div class="item-info">
                        <div class="d-flex align-items-center gap-2">
                            <h4 class="item-name">{{ item.details.name }}</h4>
                        </div>

                        <p class="item-price-unit">
                            <BasePrice :amount="item.price_at_time" size="sm" />
                            <span class="unit-label">/ unidad</span>
                        </p>

                        <template v-if="item.type === 'PRODUCT'">
                            <span v-if="item.details.stock <= 3 && item.details.stock > 0" class="stock-warning">
                                <span class="material-symbols-outlined" style="font-size: 14px;">warning</span>
                                Quedan {{ item.details.stock }} unidades
                            </span>
                            <span v-else-if="item.details.stock === 0" class="stock-out">
                                Agotado
                            </span>
                        </template>
                    </div>

                    <div class="item-actions">
                        <div class="quantity-control">
                            <button class="qty-btn" @click="decreaseQuantity(item)"
                                :disabled="item.quantity <= 1 || item.type === 'SERVICE'">
                                <span class="material-symbols-outlined">remove</span>
                            </button>
                            <span class="qty-value">{{ item.quantity }}</span>
                            <button class="qty-btn" @click="increaseQuantity(item)"
                                :disabled="item.type === 'SERVICE' || (item.type === 'PRODUCT' && item.quantity >= item.details.stock)">
                                <span class="material-symbols-outlined">add</span>
                            </button>
                        </div>

                        <div class="item-subtotal">
                            <BasePrice :amount="String(item.subtotal)" size="md" />
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
                        <span>Líneas de pedido ({{ cart.items.length }})</span>
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

                    <button class="btn-checkout" @click="checkout" :disabled="cart.items.length === 0 || isProcessing">
                        <span class="material-symbols-outlined" v-if="!isProcessing">lock</span>
                        <span v-else class="material-symbols-outlined loader-spin">sync</span>
                        {{ isProcessing ? 'Procesando...' : 'Pagar de forma segura' }}
                    </button>

                    <div class="stripe-badge" v-if="cart.items.length > 0">
                        <span class="material-symbols-outlined" style="font-size: 16px;">verified_user</span>
                        Pagos seguros mediante Stripe
                    </div>
                </div>
            </div>

        </div>

    </div>
</template>

<script>
import { cart } from '@/JS/Cart.js'
import BasePrice from '../../UI/global-price.vue'
import { useToast } from 'vue-toastification'

export default {
    name: 'CartPage',
    components: { BasePrice },

    data() {
        return {
            cart,
            isProcessing: false,
            toast: useToast()
        }
    },

    computed: {
        isLoggedIn() {
            return !!localStorage.getItem('user')
        }
    },

    methods: {
        async removeItem(item) {
            const appointmentId = item.type === 'SERVICE' ? item.details?.id : null
            await cart.removeItem(item.id, appointmentId)
        },

        async increaseQuantity(item) {
            const currentQty = item.quantity
            if (item.type === 'PRODUCT' && currentQty >= item.details.stock) return
            await cart.updateQuantity(item.id, currentQty + 1)
        },

        async decreaseQuantity(item) {
            const currentQty = item.quantity
            if (currentQty <= 1) return
            await cart.updateQuantity(item.id, currentQty - 1)
        },

        async checkout() {
            if (!this.isLoggedIn) {
                this.toast.warning('Inicia sesión o regístrate para finalizar tu compra.');
                this.$router.push('/login');
                return;
            }

            try {
                this.isProcessing = true;

                this.toast.info('Redirigiendo a pasarela segura de Stripe...', { timeout: 1500 });

                const stripeRes = await fetch(`${this.$BASE_URL}/v1/checkout/stripe`, {
                    method: 'POST',
                    credentials: 'include',
                    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                    body: JSON.stringify({ cart_id: cart.id })
                });

                const stripeData = await stripeRes.json();

                if (stripeData.url) {
                    window.location.href = stripeData.url; //redirige al checkout mediante Stripe
                } else {
                    this.toast.error(stripeData.message || 'Error al iniciar Stripe');
                    this.isProcessing = false;
                }

            } catch (err) {
                console.error(err);
                this.toast.error('Error de conexión al finalizar compra');
                this.isProcessing = false;
            }
        },

        async checkStripeRedirect() {
            //usamos URLSearchParams para obtener los parámetros de la URL
            const params = new URLSearchParams(window.location.search);

            if (params.get('stripe_success') === 'true') {
                this.toast.success('Pago autorizado por Stripe. Generando tu comprobante...');
                this.isProcessing = true;

                window.history.replaceState({}, document.title, window.location.pathname);

                try {
                    const res = await fetch(`${this.$BASE_URL}/v1/invoices`, {
                        method: 'POST',
                        credentials: 'include',
                        headers: {
                            'Content-Type': 'application/json',
                            'Accept': 'application/json',
                        },
                        body: JSON.stringify({
                            total: cart.total,
                            cart_id: params.get('cart_id') || cart.id,
                            stripe_session_id: params.get('session_id')
                        })
                    });

                    const data = await res.json();

                    if (!res.ok) {
                        this.toast.error(data.message || 'Error al generar comprobante post-pago');
                        this.isProcessing = false;
                        return;
                    }

                    const purchasedCartId = params.get('cart_id') || cart.id;
                    cart.clearCart();
                    this.$router.push({ name: 'CheckoutView', query: { cart_id: purchasedCartId } });

                } catch (err) {
                    console.error(err);
                    this.toast.error('Error de conexión post-pago');
                    this.isProcessing = false;
                }
            } else if (params.get('stripe_cancel') === 'true') {
                this.toast.info('Se canceló el pago. Tu carrito sigue guardado y puedes intentarlo de nuevo.');
                window.history.replaceState({}, document.title, window.location.pathname);
            }
        },

        getItemImage(item) {
            if (item.type === 'SERVICE') {
                const images = item.details.images || [];
                const mainImage = images.find(img => img.is_primary) || images[0];

                if (mainImage?.url) {
                    if (mainImage.url.startsWith('http')) {
                        return mainImage.url;
                    }

                    return new URL(`../../../../assets/img-servicios/${mainImage.url}`, import.meta.url).href;
                }

                if (item.details.image) {
                    if (item.details.image.startsWith('http')) {
                        return item.details.image;
                    }

                    return new URL(`../../../../assets/img-servicios/${item.details.image}`, import.meta.url).href;
                }

                return 'https://placehold.co/120x120?text=Servicio';
            }

            const images = item.details.images;

            if (!images || images.length === 0) {
                return 'https://placehold.co/120x120?text=Producto';
            }

            const mainImage = images.find(img => img.is_primary) || images[0];

            if (mainImage.url.startsWith('http')) {
                return mainImage.url;
            }

            return `/img-productos/${mainImage.url}`;
        }
    },

    async mounted() {
        await cart.loadUserCart()
        this.checkStripeRedirect()
        document.title = "Mi carrito"
    }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=DM+Sans:wght@300;400;500&display=swap');

/* ─── CONTENEDOR ─────────────────────────────────────────── */
.cart-container {
    width: 100%;
    max-width: 1200px;
    margin: auto;
    padding: 2rem 1rem 4rem;
    font-family: 'DM Sans', sans-serif;
}

/* ─── HEADER ─────────────────────────────────────────────── */
.cart-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 2rem;
}

.cart-title {
    display: flex;
    align-items: center;
    gap: 10px;
    font-family: 'Syne', sans-serif;
    font-size: 1.7rem;
    font-weight: 800;
    letter-spacing: -0.03em;
    color: var(--nav-text, #0a1f33);
    margin: 0;
}

.cart-title .material-symbols-outlined {
    font-size: 28px;
    color: #52b155;
}

.cart-count {
    font-family: 'DM Sans', sans-serif;
    font-size: 0.78rem;
    font-weight: 500;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: var(--nav-text, #0a1f33);
    opacity: 0.4;
}

/* ─── EMPTY STATE ────────────────────────────────────────── */
.empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 5rem 2rem;
    text-align: center;
}

.empty-icon {
    font-size: 72px;
    color: var(--nav-text, #0a1f33);
    opacity: 0.15;
    margin-bottom: 1.2rem;
}

.empty-title {
    font-family: 'Syne', sans-serif;
    font-size: 1.4rem;
    font-weight: 700;
    color: var(--nav-text, #0a1f33);
    margin: 0 0 0.5rem;
}

.empty-subtitle {
    font-family: 'DM Sans', sans-serif;
    font-size: 0.9rem;
    font-weight: 300;
    color: var(--nav-text, #0a1f33);
    opacity: 0.5;
    margin: 0 0 2rem;
    max-width: 360px;
    line-height: 1.6;
}

.btn-action {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 14px 32px;
    background: #52b155;
    color: #fff;
    border: none;
    border-radius: 100px;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.9rem;
    font-weight: 500;
    text-decoration: none;
    cursor: pointer;
    transition:
        transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1),
        box-shadow 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94),
        background 0.25s ease;
}

.btn-action:hover {
    background: #3d9640;
    transform: translateY(-3px);
    box-shadow: 0 12px 32px rgba(82, 177, 85, 0.4);
    color: #fff;
}

/* ─── LAYOUT ─────────────────────────────────────────────── */
.cart-content {
    display: grid;
    grid-template-columns: 1fr 360px;
    gap: 2rem;
    align-items: start;
}

/* ─── ITEMS LIST ─────────────────────────────────────────── */
.cart-items {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

/* ─── ITEM CARD ──────────────────────────────────────────── */
.cart-item {
    display: flex;
    align-items: center;
    gap: 1.2rem;
    padding: 1.2rem 1.4rem;
    border: 1px solid var(--nav-border, rgba(0, 0, 0, 0.08));
    border-radius: 20px;
    background: var(--nav-bg, #fff);
    transition:
        transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94),
        box-shadow 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94),
        border-color 0.3s ease;
}

.cart-item:hover {
    transform: translateY(-3px);
    box-shadow: 0 12px 36px rgba(0, 0, 0, 0.08);
    border-color: rgba(82, 177, 85, 0.25);
}

/* ─── IMAGEN ─────────────────────────────────────────────── */
.item-image {
    width: 88px;
    height: 88px;
    border-radius: 14px;
    overflow: hidden;
    flex-shrink: 0;
    background: rgba(0, 0, 0, 0.04);
}

.item-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

/* ─── INFO ───────────────────────────────────────────────── */
.item-info {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 4px;
    min-width: 0;
}

.item-name {
    font-family: 'Syne', sans-serif;
    font-size: 0.98rem;
    font-weight: 700;
    letter-spacing: -0.01em;
    color: var(--nav-text, #0a1f33);
    margin: 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.item-price-unit {
    display: flex;
    align-items: center;
    gap: 4px;
    margin: 0;
}

.unit-label {
    font-family: 'DM Sans', sans-serif;
    font-size: 0.78rem;
    font-weight: 300;
    color: var(--nav-text, #0a1f33);
    opacity: 0.45;
}

.stock-warning {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.75rem;
    font-weight: 500;
    color: #e67e22;
}

.stock-out {
    font-family: 'DM Sans', sans-serif;
    font-size: 0.75rem;
    font-weight: 500;
    color: #e63946;
}

/* ─── ACCIONES ───────────────────────────────────────────── */
.item-actions {
    display: flex;
    align-items: center;
    gap: 1rem;
    flex-shrink: 0;
}

/* ─── QUANTITY CONTROL ───────────────────────────────────── */
.quantity-control {
    display: flex;
    align-items: center;
    background: var(--nav-bg, #f8fafc);
    border: 1.5px solid var(--nav-border, rgba(0, 0, 0, 0.09));
    border-radius: 100px;
    overflow: hidden;
    padding: 2px;
    gap: 2px;
}

.qty-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 30px;
    height: 30px;
    border-radius: 100px;
    border: none;
    background: transparent;
    color: var(--nav-text, #0a1f33);
    cursor: pointer;
    transition: background 0.2s ease, color 0.2s ease;
    flex-shrink: 0;
}

.qty-btn:hover:not(:disabled) {
    background: #52b155;
    color: #fff;
}

.qty-btn:disabled {
    opacity: 0.25;
    cursor: not-allowed;
}

.qty-btn .material-symbols-outlined {
    font-size: 16px;
    line-height: 1;
}

.qty-value {
    min-width: 28px;
    text-align: center;
    font-family: 'Syne', sans-serif;
    font-size: 0.9rem;
    font-weight: 700;
    color: var(--nav-text, #0a1f33);
    line-height: 1;
}

/* ─── SUBTOTAL ───────────────────────────────────────────── */
.item-subtotal {
    min-width: 72px;
    text-align: right;
    font-family: 'Syne', sans-serif;
    font-weight: 700;
}

/* ─── BOTÓN ELIMINAR ─────────────────────────────────────── */
.btn-remove {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    border-radius: 100px;
    border: 1.5px solid rgba(0, 0, 0, 0.1);
    background: transparent;
    color: var(--nav-text, #0a1f33);
    opacity: 0.4;
    cursor: pointer;
    transition:
        background 0.25s ease,
        border-color 0.25s ease,
        color 0.25s ease,
        opacity 0.25s ease,
        transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.btn-remove:hover {
    background: rgba(230, 57, 70, 0.08);
    border-color: #e63946;
    color: #e63946;
    opacity: 1;
    transform: scale(1.1);
}

.btn-remove .material-symbols-outlined {
    font-size: 18px;
}

/* ─── SUMMARY ────────────────────────────────────────────── */
.cart-summary {
    position: sticky;
    top: 2rem;
}

.summary-card {
    padding: 1.6rem;
    border: 1px solid var(--nav-border, rgba(0, 0, 0, 0.08));
    border-radius: 20px;
    background: var(--nav-bg, #fff);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.06);
}

.summary-title {
    font-family: 'Syne', sans-serif;
    font-size: 1.05rem;
    font-weight: 700;
    letter-spacing: -0.02em;
    color: var(--nav-text, #0a1f33);
    margin: 0 0 1.2rem;
}

.summary-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.55rem 0;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.88rem;
    font-weight: 400;
    color: var(--nav-text, #0a1f33);
    opacity: 0.75;
}

.summary-total {
    font-family: 'Syne', sans-serif;
    font-size: 1rem;
    font-weight: 800;
    opacity: 1;
    color: var(--nav-text, #0a1f33);
}

.free-shipping {
    font-family: 'DM Sans', sans-serif;
    font-weight: 600;
    color: #52b155;
    opacity: 1;
}

.summary-divider {
    border: none;
    border-top: 1px solid var(--nav-border, rgba(0, 0, 0, 0.07));
    margin: 0.6rem 0;
}

/* ─── BOTÓN CHECKOUT ─────────────────────────────────────── */
.btn-checkout {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    width: 100%;
    padding: 14px 24px;
    margin-top: 1.2rem;
    border: none;
    border-radius: 100px;
    background: #52b155;
    color: #fff;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.92rem;
    font-weight: 500;
    cursor: pointer;
    transition:
        transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1),
        box-shadow 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94),
        background 0.25s ease;
}

.btn-checkout:hover:not(:disabled) {
    background: #3d9640;
    transform: translateY(-3px);
    box-shadow: 0 12px 32px rgba(82, 177, 85, 0.4);
}

.btn-checkout:active:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 6px 16px rgba(82, 177, 85, 0.3);
}

.btn-checkout:disabled {
    opacity: 0.45;
    cursor: not-allowed;
}

.btn-checkout .material-symbols-outlined {
    font-size: 18px;
}

.stripe-badge {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 6px;
    margin-top: 1rem;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.8rem;
    font-weight: 500;
    color: var(--nav-text, #0a1f33);
    opacity: 0.6;
}

.stripe-badge .material-symbols-outlined {
    color: #635bff;
    opacity: 1;
}

/* ─── RESPONSIVE 900px ───────────────────────────────────── */
@media (max-width: 900px) {
    .cart-content {
        grid-template-columns: 1fr;
    }

    .cart-summary {
        position: static;
    }
}

/* ─── RESPONSIVE 600px ───────────────────────────────────── */
@media (max-width: 600px) {
    .cart-container {
        padding: 1.2rem 0.75rem 3rem;
    }

    .cart-item {
        flex-wrap: wrap;
        gap: 0.75rem;
        padding: 1rem;
        align-items: flex-start;
    }

    .item-image {
        width: 76px;
        height: 76px;
        border-radius: 12px;
        flex-shrink: 0;
    }

    .item-info {
        flex: 1;
        min-width: 0;
    }

    .item-actions {
        width: 100%;
        justify-content: space-between;
        padding-top: 0.5rem;
        border-top: 1px solid var(--nav-border, rgba(0, 0, 0, 0.06));
    }

    .item-name {
        font-size: 0.9rem;
    }

    .item-subtotal {
        min-width: auto;
    }

    .cart-title {
        font-size: 1.3rem;
    }
}

/* ─── LOADER ─────────────────────────────────────────────── */
.loader-spin {
    animation: spin 1s linear infinite;
}

@keyframes spin {
    100% {
        transform: rotate(360deg);
    }
}
</style>
