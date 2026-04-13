<template>
  <div class="product-card" :class="{ 'is-empty': product.stock <= 0 }" @click="goToDetails(product.id)">

    <div class="card-image-wrap">
      <img :src="getMainImage(product.images)" :alt="product.name" class="card-img" />
      <div class="card-img-overlay"></div>
      <div v-if="product.stock <= 0" class="card-badge-stock">
        <span class="badge-dot"></span>
        Sin stock
      </div>
    </div>

    <div class="card-body">

      <h3 class="card-title">{{ product.name }}</h3>
      <p class="card-desc">{{ shortDescription }}</p>

      <div class="card-footer-row">
        <div class="card-price-block">
          <span class="price-from">Precio</span>
          <BasePrice :amount="product.price" :locale="locale" :currency="currency" size="md" />
        </div>

        <button
          v-if="product.stock > 0"
          class="cart-btn"
          @click.stop="addToCart"
          :disabled="isOutOfStock"
          title="Añadir al carrito"
        >
          <span class="material-symbols-outlined btn-icon">shopping_cart</span>
          <span class="btn-label">Añadir</span>
        </button>

        <button
          v-else
          class="notify-btn"
          @click.stop="promptRestock"
          title="Avisarme cuando haya stock"
        >
          <span class="material-symbols-outlined btn-icon">notifications_active</span>
          <span class="btn-label">Avisar</span>
        </button>
      </div>

    </div>

    <div class="card-accent"></div>

  </div>
</template>

<script>
import { loaderState } from '@/loaderState'
import BasePrice from '../../UI/global-price.vue'
import { cart, ITEM_TYPES } from '@/JS/Cart.js'
import { useToast } from "vue-toastification"

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
            const itemInCart = cart.items.find(i => i.type === 'PRODUCT' && i.details.id === this.product.id);
            const inCart = itemInCart ? itemInCart.quantity : 0;
            return this.product.stock <= inCart;
        }
    },

    methods: {
        async addToCart() {
            const toast = useToast();
            const result = await cart.addToCart(ITEM_TYPES.PRODUCT, this.product.id, 1, this.product.price);
            if (result.success) {
                toast.success(`Añadido al carrito: ${this.product.name}`);
            }
        },

        async promptRestock() {
            const userString = localStorage.getItem('user');
            const toast = useToast();
            let email = '';
            
            if (userString) {
                const userObj = JSON.parse(userString);
                email = userObj.email;
            } else {
                email = window.prompt("Introduce tu correo electrónico para avisarte cuando repongamos stock:");
            }
            
            if (!email || !email.includes('@')) {
                if(email !== null) toast.error("Correo electrónico no válido.");
                return;
            }

            try {
                const res = await fetch(`${this.$BASE_URL}/v1/products/${this.product.id}/restock-subscribe`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify({ email: email })
                });

                if (res.ok) {
                    toast.success("¡Perfecto! Te avisaremos por correo.");
                } else {
                    toast.error("Hubo un problema al suscribirte. Inténtalo de nuevo.");
                }
            } catch (err) {
                console.error(err);
                toast.error("Error de conexión externa.");
            }
        },

        goToDetails(productId) {
            this.$router.push({ name: 'ProductDetails', params: { id: productId } })
        },

        getMainImage(images) {
            if (!images || images.length === 0) {
                return this.defaultImage;
            }
            const mainImage = images.find(img => img.is_primary) || images[0];
            if (mainImage.url.startsWith('http')) {
                return mainImage.url;
            }
            return `/img-productos/${mainImage.url}`;
        }
    }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,300&display=swap');

/* ─── CARD ───────────────────────────────────────────────── */
.product-card {
  position: relative;
  background: var(--nav-bg, #fff);
  border: 1px solid var(--nav-border, rgba(0, 0, 0, 0.08));
  border-radius: 20px;
  overflow: hidden;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  transition:
    transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94),
    box-shadow 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94),
    border-color 0.3s ease;
}

.product-card:hover {
  transform: translateY(-7px);
  box-shadow: 0 24px 56px rgba(0, 0, 0, 0.13);
  border-color: rgba(82, 177, 85, 0.3);
}

.product-card:hover .card-img {
  transform: scale(1.06);
}

.product-card:hover .card-accent {
  transform: scaleX(1);
}

.product-card:hover .cart-btn:not(:disabled),
.product-card:hover .notify-btn {
  background: #52b155;
  color: #fff;
  border-color: #52b155;
}

/* ─── IMAGE ──────────────────────────────────────────────── */
.card-image-wrap {
  position: relative;
  width: 100%;
  height: 200px;
  overflow: hidden;
  flex-shrink: 0;
  background: #e8edf2;
}

.card-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  transition: transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.card-img-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to bottom, transparent 45%, rgba(0, 0, 0, 0.22) 100%);
  pointer-events: none;
}

/* ─── BADGE SIN STOCK ────────────────────────────────────── */
.card-badge-stock {
  position: absolute;
  top: 14px;
  left: 14px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-family: 'DM Sans', sans-serif;
  font-size: 0.65rem;
  font-weight: 500;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.92);
  background: rgba(10, 10, 15, 0.52);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.13);
  border-radius: 100px;
  padding: 4px 10px 4px 8px;
}

.badge-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #f87171;
  flex-shrink: 0;
  box-shadow: 0 0 0 2px rgba(248, 113, 113, 0.3);
}

/* ─── BODY ───────────────────────────────────────────────── */
.card-body {
  padding: 18px 18px 16px;
  display: flex;
  flex-direction: column;
  flex: 1;
}

.card-title {
  font-family: 'Syne', sans-serif;
  font-weight: 700;
  font-size: 1rem;
  line-height: 1.2;
  letter-spacing: -0.02em;
  color: var(--nav-text, #0a1f33);
  margin: 0 0 10px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-desc {
  font-family: 'DM Sans', sans-serif;
  font-size: 0.82rem;
  font-weight: 300;
  line-height: 1.6;
  color: var(--nav-text, #444);
  opacity: 0.65;
  margin: 0 0 16px;
  flex: 1;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* ─── FOOTER ─────────────────────────────────────────────── */
.card-footer-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 14px;
  border-top: 1px solid var(--nav-border, rgba(0, 0, 0, 0.07));
  margin-top: auto;
}

.card-price-block {
  display: flex;
  flex-direction: column;
  gap: 1px;
}

.price-from {
  font-family: 'DM Sans', sans-serif;
  font-size: 0.65rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: #52b155;
  opacity: 0.85;
}

/* ─── BUTTONS ────────────────────────────────────────────── */
.cart-btn,
.notify-btn {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 9px 16px;
  border-radius: 100px;
  border: 1.5px solid var(--nav-border, rgba(0, 0, 0, 0.12));
  background: transparent;
  color: var(--nav-text, #0a1f33);
  font-family: 'DM Sans', sans-serif;
  font-size: 0.78rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.25s ease;
  white-space: nowrap;
}

.btn-icon {
  font-size: 1rem;
  line-height: 1;
}

.cart-btn:disabled {
  opacity: 0.38;
  cursor: not-allowed;
  pointer-events: none;
}

.notify-btn {
  border-color: rgba(82, 177, 85, 0.3);
  color: #52b155;
}

/* ─── ACCENT LINE ────────────────────────────────────────── */
.card-accent {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, #52b155, #7dd87f);
  transform: scaleX(0);
  transform-origin: left center;
  transition: transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

/* ─── ESTADO SIN STOCK ───────────────────────────────────── */
.is-empty .card-image-wrap {
  opacity: 0.5;
}

.is-empty .card-img {
  filter: grayscale(90%);
}

.is-empty .card-title,
.is-empty .card-desc {
  opacity: 0.45;
}

.is-empty:hover .card-image-wrap {
  opacity: 0.72;
}

.is-empty:hover .card-img {
  filter: grayscale(50%);
}

.is-empty:hover .card-title,
.is-empty:hover .card-desc {
  opacity: 0.65;
}

/* ─── DARK MODE ──────────────────────────────────────────── */
[data-theme="dark"] .card-image-wrap {
  background-color: #0f172a;
}

[data-theme="dark"] .product-card:hover {
  box-shadow: 0 24px 56px rgba(0, 0, 0, 0.45);
}
</style>