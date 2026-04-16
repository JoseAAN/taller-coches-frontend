<template>
    <div v-if="product" class="product-details">

        <div class="product-left">
            <div class="product-image-container">
                <img :src="getMainImage(product?.images)" :alt="product?.name" class="product-image">
            </div>
        </div>

        <div class="product-right">

            <div class="product-categories">
                <span v-for="category in product.categories" :key="category.id" class="category-pill">
                    {{ category.name }}
                </span>
            </div>

            <h2 class="product-name">{{ product.name }}</h2>

            <div class="product-price">
                {{ product.price }} €
            </div>

            <div class="product-stock" :class="{ 'out-of-stock': product.stock === 0 }">
                <span class="stock-dot"></span>
                {{ product.stock > 0 ? `En stock: ${product.stock} unidades` : 'Agotado' }}
            </div>

            <p class="product-description">{{ product.description }}</p>

            <div class="quantity-selector">
                <label for="minmax-buttons">Cantidad</label>
                <InputNumber v-model="value" inputId="minmax-buttons" mode="decimal" showButtons :min="1"
                    :max="availableStock" fluid class="quantityInput" :disabled="availableStock <= 0" />
                <span class="stock-warning" v-if="availableStock <= 0">Máximo alcanzado en carrito</span>
                <span class="stock-warning" v-else-if="availableStock < product.stock">
                    Tienes {{ cartQuantity }} en el carrito (Máx: {{ product.stock }})
                </span>
            </div>

            <div class="product-actions">
                <button :disabled="availableStock <= 0" @click="addToCart" class="btn-cart">
                    <span class="material-symbols-outlined btn-cart-icon">shopping_cart</span>
                    <span>Añadir al carrito</span>
                </button>
            </div>

        </div>

    </div>

    <RelatedProductsCarousel v-if="product" :productId="product.id" />
</template>

<script>
import InputNumber from 'primevue/inputnumber';
import { cart, ITEM_TYPES } from '@/JS/Cart.js';
import { useToast } from "vue-toastification";
import RelatedProductsCarousel from '../related-products-carousel/related-products-carousel-component-component.vue';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;
export default {
    name: "ProductDetails",
    components: { InputNumber, RelatedProductsCarousel },
    data() {
        return {
            productId: null,
            product: null,
            value: 1,
            defaultImage: 'https://placehold.co/600x700'
        }
    },
    computed: {
        cartQuantity() {
            if (!this.product) return 0;
            const item = cart.items.find(i => i.type === 'PRODUCT' && i.details.id === this.product.id);
            return item ? item.quantity : 0;
        },
        availableStock() {
            if (!this.product) return 0;
            return Math.max(0, this.product.stock - this.cartQuantity);
        }
    },
    methods: {
        getProduct() {
            fetch(`${BASE_URL}/v1/products/${this.productId}`)
                .then(res => {
                    if (!res.ok) throw new Error("Error al recoger los productos");
                    return res.json();
                })
                .then(data => this.product = data.data)
                .catch(err => console.error('Error al cargar productos:', err));
        },

        async addToCart() {
            const toast = useToast();
            if (this.value > this.availableStock) {
                toast.warning('No puedes añadir más de ' + this.availableStock + ' unidades.');
                return;
            }
            const result = await cart.addToCart(ITEM_TYPES.PRODUCT, this.productId, this.value, this.product.price);
            if (result.success) {
                toast.success(`Añadido(s) ${this.value} ${this.product.name} al carrito`);
                this.value = 1;
            }
        },

        getMainImage(images) {
            if (!images || images.length === 0) {
                return 'https://placehold.co/600x700?text=Sin+Imagen';
            }
            const mainImage = images.find(img => img.is_primary) || images[0];
            if (mainImage.url.startsWith('http')) {
                return mainImage.url;
            }
            return `/img-productos/${mainImage.url}`;
        }
    },
    mounted() {
        this.productId = this.$route.params.id;
        this.getProduct();
        window.scrollTo({ top: 0, behavior: 'smooth' });
        document.title = "Productos"
    },
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,300&display=swap');

/* ─── LAYOUT ─────────────────────────────────────────────── */
.product-details {
    max-width: 1100px;
    margin: 2.5rem auto;
    padding: 2rem;
    display: flex;
    gap: 3.5rem;
    align-items: flex-start;
    font-family: 'DM Sans', sans-serif;
    background: transparent;
}

/* ─── COLUMNA IMAGEN ─────────────────────────────────────── */
.product-left {
    flex: 1;
    position: sticky;
    top: 2rem;
}

.product-image-container {
    width: 100%;
    aspect-ratio: 1 / 1;
    max-height: 480px;
    background: var(--nav-bg, #f8fafc);
    border-radius: 20px;
    border: 1px solid var(--nav-border, rgba(0, 0, 0, 0.07));
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.07);
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
    transition: box-shadow 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.product-image-container:hover {
    box-shadow: 0 16px 48px rgba(0, 0, 0, 0.11);
}

.product-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
    transition: transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.product-image-container:hover .product-image {
    transform: scale(1.04);
}

/* ─── COLUMNA DERECHA ────────────────────────────────────── */
.product-right {
    flex: 1.1;
    display: flex;
    flex-direction: column;
    gap: 1.2rem;
}

/* ─── CATEGORÍAS ─────────────────────────────────────────── */
.product-categories {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
}

.category-pill {
    font-family: 'DM Sans', sans-serif;
    font-size: 0.68rem;
    font-weight: 500;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: #52b155;
    border: 1.5px solid rgba(82, 177, 85, 0.35);
    background: rgba(82, 177, 85, 0.06);
    padding: 4px 12px;
    border-radius: 100px;
}

/* ─── TÍTULO ─────────────────────────────────────────────── */
.product-name {
    font-family: 'Syne', sans-serif;
    font-size: 2rem;
    font-weight: 800;
    line-height: 1.15;
    letter-spacing: -0.03em;
    color: var(--nav-text, #0a1f33);
    margin: 0;
}

/* ─── PRECIO ─────────────────────────────────────────────── */
.product-price {
    font-family: 'Syne', sans-serif;
    font-size: 2.5rem;
    font-weight: 700;
    letter-spacing: -0.03em;
    color: var(--nav-text, #0a1f33);
    line-height: 1;
}

/* ─── STOCK ──────────────────────────────────────────────── */
.product-stock {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.85rem;
    font-weight: 500;
    color: #52b155;
}

.product-stock.out-of-stock {
    color: #e63946;
}

.stock-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: currentColor;
    flex-shrink: 0;
    box-shadow: 0 0 0 3px rgba(82, 177, 85, 0.2);
}

.product-stock.out-of-stock .stock-dot {
    box-shadow: 0 0 0 3px rgba(230, 57, 70, 0.2);
}

/* ─── DESCRIPCIÓN ────────────────────────────────────────── */
.product-description {
    font-family: 'DM Sans', sans-serif;
    font-size: 0.9rem;
    font-weight: 300;
    line-height: 1.7;
    color: var(--nav-text, #444);
    opacity: 0.7;
    margin: 0;
    padding-top: 1rem;
    border-top: 1px solid var(--nav-border, rgba(0, 0, 0, 0.07));
}

/* ─── SELECTOR CANTIDAD ──────────────────────────────────── */
.quantity-selector {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.quantity-selector label {
    font-family: 'DM Sans', sans-serif;
    font-size: 0.75rem;
    font-weight: 500;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--nav-text, #0a1f33);
    opacity: 0.55;
}

.quantityInput {
    width: 130px;
}

:deep(.p-inputnumber) {
    border-radius: 12px;
    overflow: hidden;
}

:deep(.p-inputnumber-input) {
    font-family: 'Syne', sans-serif;
    font-size: 1rem;
    font-weight: 600;
    border-radius: 0;
    border-color: var(--nav-border, rgba(0, 0, 0, 0.12));
    text-align: center;
}

:deep(.p-button) {
    background: transparent;
    border-color: var(--nav-border, rgba(0, 0, 0, 0.12));
    color: var(--nav-text, #0a1f33);
    transition: background 0.2s ease, color 0.2s ease;
}

:deep(.p-button:hover) {
    background: #52b155 !important;
    border-color: #52b155 !important;
    color: #fff !important;
}

.stock-warning {
    font-family: 'DM Sans', sans-serif;
    font-size: 0.78rem;
    font-weight: 400;
    color: #e67e22;
    opacity: 0.9;
}

/* ─── ACCIONES ───────────────────────────────────────────── */
.product-actions {
    padding-top: 0.4rem;
}

.btn-cart {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    width: 100%;
    padding: 15px 28px;
    border-radius: 100px;
    border: none;
    background: #52b155;
    color: #fff;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.95rem;
    font-weight: 500;
    cursor: pointer;
    transition:
        transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1),
        box-shadow 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94),
        background 0.25s ease;
}

.btn-cart:hover:not(:disabled) {
    background: #3d9640;
    transform: translateY(-3px);
    box-shadow: 0 12px 32px rgba(82, 177, 85, 0.4);
}

.btn-cart:active:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 6px 16px rgba(82, 177, 85, 0.3);
}

.btn-cart:disabled {
    opacity: 0.4;
    cursor: not-allowed;
    background: #9ca3af;
}

.btn-cart-icon {
    font-size: 1.15rem;
    line-height: 1;
}

/* ─── RESPONSIVE ─────────────────────────────────────────── */
@media (max-width: 992px) {
    .product-details {
        flex-direction: column;
        gap: 1.8rem;
        padding: 1.2rem;
        margin: 1rem auto;
    }

    .product-left {
        position: static;
        width: 100%;
    }

    .product-image-container {
        aspect-ratio: 1 / 1;
        max-height: 360px;
    }

    .product-name {
        font-size: 1.6rem;
    }

    .product-price {
        font-size: 2rem;
    }

    .btn-cart {
        padding: 14px 24px;
        font-size: 0.9rem;
    }
}

@media (max-width: 576px) {
    .product-details {
        padding: 1rem;
        gap: 1.4rem;
    }

    .product-name {
        font-size: 1.4rem;
    }

    .product-price {
        font-size: 1.75rem;
    }

    .product-image-container {
        aspect-ratio: 1 / 1;
        max-height: 280px;
    }

    .quantityInput {
        width: 110px;
    }
}

/* ─── DARK MODE ──────────────────────────────────────────── */
[data-theme="dark"] .product-image-container {
    background-color: #0f172a;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.35);
}

[data-theme="dark"] .product-image-container:hover {
    box-shadow: 0 16px 48px rgba(0, 0, 0, 0.5);
}
</style>