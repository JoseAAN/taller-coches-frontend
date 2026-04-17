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

    <teleport to="body">
      <div v-if="showRestockModal" class="restock-modal-overlay" @click.stop="closeModal">
        <div class="filter-box modal-content" @click.stop>
          <div class="d-flex align-items-center justify-content-between mb-4">
            <h3 class="filter-title m-0">
              <span class="material-symbols-outlined me-2" style="color: #52b155;">notifications_active</span>
              Aviso de Stock
            </h3>
            <button class="text-reset-link" @click="closeModal" title="Cerrar">
               <i class="pi pi-times"></i>
            </button>
          </div>

          <template v-if="!currentUserEmail">
            <p class="filter-label" style="text-transform: none; font-size: 0.85rem; margin-bottom: 1rem; opacity: 0.8;">
              Déjanos tu correo y te avisaremos en cuanto el producto <strong>{{ product.name }}</strong> vuelva a estar disponible.
            </p>
            <div class="filter-group mb-4">
              <label class="filter-label" style="margin-bottom: 0.5rem;">Correo electrónico</label>
              <input type="email" v-model="restockEmail" class="custom-select" placeholder="tu@email.com" @keyup.enter="submitRestock" />
            </div>
          </template>
          <template v-else>
            <p class="filter-label" style="text-transform: none; font-size: 0.9rem; margin-bottom: 1.5rem; opacity: 0.8; line-height: 1.5;">
              ¿Deseas suscribirte para recibir un aviso a <strong>{{ currentUserEmail }}</strong> cuando repongamos el producto <strong>{{ product.name }}</strong>?
            </p>
          </template>

          <div class="d-flex justify-content-center">
              <button class="btn-apply-filters" @click="submitRestock" :disabled="isSubmitting">
                  {{ isSubmitting ? 'Procesando...' : 'Avísame' }}
              </button>
          </div>
        </div>
      </div>
    </teleport>

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

    data() {
        return {
            showRestockModal: false,
            restockEmail: '',
            isSubmitting: false,
        }
    },

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
        },
        currentUserEmail() {
            const userString = localStorage.getItem('user');
            if (userString) {
                try {
                    const userObj = JSON.parse(userString);
                    return userObj.email || '';
                } catch(e) {}
            }
            return '';
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

        promptRestock() {
            this.showRestockModal = true;
            if (this.currentUserEmail) {
                this.restockEmail = this.currentUserEmail;
            } else {
                this.restockEmail = '';
            }
        },

        closeModal() {
            this.showRestockModal = false;
        },

        async submitRestock() {
            const toast = useToast();
            let email = this.restockEmail.trim();
            
            if (!email || !email.includes('@')) {
                toast.error("Por favor, introduce un correo electrónico válido.");
                return;
            }

            this.isSubmitting = true;

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
                    toast.success("¡Perfecto! Te avisaremos por correo cuando haya stock.");
                    this.closeModal();
                } else {
                    toast.error("Hubo un problema al suscribirte. Inténtalo de nuevo.");
                }
            } catch (err) {
                console.error(err);
                toast.error("Error de conexión externa.");
            } finally {
                this.isSubmitting = false;
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

.product-card {
  position: relative;
  background-color: var(--nav-bg, #fff);
  background-image: linear-gradient(160deg, transparent 0%, rgba(82, 177, 85, 0.04) 100%);
  border: 1px solid rgba(10, 31, 51, 0.07);
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
  box-shadow: 0 24px 56px rgba(0, 0, 0, 0.08), 0 12px 24px rgba(82, 177, 85, 0.08);
  border-color: rgba(82, 177, 85, 0.4);
}

.product-card:hover .card-img {
  transform: scale(1.06);
}

.product-card:hover .card-accent {
  transform: scaleX(1);
}

.product-card:hover .cart-btn:not(:disabled),
.product-card:hover .notify-btn {
  background: linear-gradient(135deg, #5ce261, #48b44c);
  color: #fff;
  border-color: transparent;
  box-shadow: 0 6px 16px rgba(82, 177, 85, 0.3);
}

.card-image-wrap {
  position: relative;
  width: 100%;
  height: 230px;
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

.card-footer-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 14px;
  border-top: 1px solid rgba(10, 31, 51, 0.1);
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

.cart-btn,
.notify-btn {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 9px 16px;
  border-radius: 100px;
  border: 1.5px solid rgba(10, 31, 51, 0.18);
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

.card-accent {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, transparent, #5ce261, #48b44c, transparent);
  transform: scaleX(0);
  transform-origin: center;
  transition: transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

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

[data-theme="dark"] .card-image-wrap {
  background-color: #0d1117;
}

[data-theme="dark"] .product-card {
  background-image: linear-gradient(160deg, transparent 0%, rgba(82, 177, 85, 0.05) 100%);
  border-color: rgba(255, 255, 255, 0.06);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.03);
}

[data-theme="dark"] .cart-btn {
  border-color: rgba(255, 255, 255, 0.15);
}

[data-theme="dark"] .product-card:hover {
  box-shadow: 0 24px 56px rgba(0, 0, 0, 0.5), 0 10px 30px rgba(82, 177, 85, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.05);
  border-color: rgba(82, 177, 85, 0.35);
}

[data-theme="dark"] .product-card:hover .cart-btn:not(:disabled),
[data-theme="dark"] .product-card:hover .notify-btn {
  background: linear-gradient(135deg, #5ce261, #48b44c);
  border-color: transparent;
  box-shadow: 0 6px 18px rgba(82, 177, 85, 0.3);
}

.restock-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.45);
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);
  z-index: 99999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
}

.modal-content {
  width: 100%;
  max-width: 440px;
  animation: modal-pop 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
  box-sizing: border-box;
}

@keyframes modal-pop {
  0% { transform: scale(0.9); opacity: 0; }
  100% { transform: scale(1); opacity: 1; }
}

.filter-box {
    background: var(--nav-bg, #fff);
    padding: 2rem;
    border-radius: 20px;
    border: 1px solid var(--nav-border, rgba(0, 0, 0, 0.08));
    color: var(--nav-text, #0a1f33);
    box-shadow: 0 16px 48px rgba(0, 0, 0, 0.15);
    font-family: 'DM Sans', sans-serif;
}
.filter-title {
    font-family: 'Syne', sans-serif;
    font-size: 1.25rem;
    font-weight: 700;
    color: var(--nav-text, #0a1f33);
    display: flex;
    align-items: center;
}
.text-reset-link {
    background: rgba(0,0,0,0.04);
    border: none;
    border-radius: 50%;
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--nav-text, #0a1f33);
    cursor: pointer;
    transition: all 0.2s ease;
}
.text-reset-link:hover { 
    background: rgba(230, 57, 70, 0.1); 
    color: #e63946; 
}
.filter-label {
    display: block;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.75rem;
    font-weight: 500;
    color: var(--nav-text, #0a1f33);
}
.custom-select {
    width: 100%;
    padding: 12px 18px;
    border-radius: 12px;
    border: 1.5px solid var(--nav-border, rgba(0, 0, 0, 0.11));
    background: var(--nav-bg, #f8fafc);
    color: var(--nav-text, #0a1f33);
    font-family: 'DM Sans', sans-serif;
    font-size: 0.95rem;
    outline: none;
    transition: border-color 0.3s ease, box-shadow 0.3s ease;
}
.custom-select:focus {
    border-color: #52b155;
    box-shadow: 0 0 0 4px rgba(82, 177, 85, 0.12);
}
.btn-apply-filters {
    width: 100%;
    background: #52b155;
    color: #fff;
    border: none;
    padding: 14px;
    border-radius: 100px;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.95rem;
    font-weight: 600;
    cursor: pointer;
    transition: transform 0.3s, box-shadow 0.3s, background 0.3s;
}
.btn-apply-filters:hover:not(:disabled) {
    background: #3d9640;
    transform: translateY(-2px);
    box-shadow: 0 12px 24px rgba(82, 177, 85, 0.3);
}
.btn-apply-filters:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

[data-theme='dark'] .filter-box {
    background: linear-gradient(145deg, rgba(30, 36, 48, 0.98), rgba(20, 24, 32, 1));
    border: 1px solid rgba(255, 255, 255, 0.08);
    box-shadow: 0 12px 42px rgba(0, 0, 0, 0.6);
}
[data-theme='dark'] .custom-select {
    background: rgba(0,0,0,0.2);
    border-color: rgba(255,255,255,0.1);
    color: #fff;
}
[data-theme='dark'] .text-reset-link {
    background: rgba(255,255,255,0.05);
}
[data-theme='dark'] .custom-select:focus {
    border-color: #5ce261;
    box-shadow: 0 0 0 4px rgba(92, 226, 97, 0.2);
}
[data-theme='dark'] .btn-apply-filters {
    background: linear-gradient(135deg, #5ce261, #48b44c);
    box-shadow: 0 6px 20px rgba(82, 177, 85, 0.3);
}
[data-theme='dark'] .btn-apply-filters:hover:not(:disabled) {
    box-shadow: 0 8px 28px rgba(82, 177, 85, 0.5);
}

@media (max-width: 768px) {
    .card-image-wrap {
        height: 180px;
    }

    .card-body {
        padding: 14px 14px 12px;
    }

    .card-title {
        font-size: 0.9rem;
    }

    .card-desc {
        font-size: 0.75rem;
        margin-bottom: 12px;
    }

    .card-footer-row {
        padding-top: 10px;
    }

    .cart-btn,
    .notify-btn {
        padding: 8px 12px;
        font-size: 0.7rem;
    }

    .btn-icon {
        font-size: 0.9rem;
    }
}

@media (max-width: 480px) {
    .card-image-wrap {
        height: 140px;
    }

    .card-body {
        padding: 10px 10px 8px;
    }

    .card-title {
        font-size: 0.85rem;
    }

    .card-desc {
        font-size: 0.65rem;
        margin-bottom: 6px;
        line-clamp: 2;
        -webkit-line-clamp: 2;
    }

    .card-footer-row {
        flex-direction: column;
        gap: 6px;
        align-items: stretch;
        padding-top: 8px;
    }

    .card-price-block {
        align-items: center;
    }

    .price-from {
        font-size: 0.6rem;
    }

    .cart-btn,
    .notify-btn {
        justify-content: center;
        width: 100%;
        padding: 7px 10px;
    }
}
</style>