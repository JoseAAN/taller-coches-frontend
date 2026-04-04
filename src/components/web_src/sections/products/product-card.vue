<template>
    <div class="product-card" :class="{ 'is-empty': product.stock <= 0 }" @click="goToDetails(product.id)">

        <div class="image-wrapper">
            <img :src="getMainImage(product.images)" :alt="product.name" class="product-image" />
            <span v-if="product.stock <= 0" class="stock out-stock">
                SIN STOCK
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

                <BasePrice :amount="product.price" :locale="locale" :currency="currency" size="lg" />

                <button v-if="product.stock > 0" class="cart-btn" @click.stop="addToCart" :disabled="isOutOfStock" title="Añadir al carrito">
                    <span class="material-symbols-outlined">
                        shopping_cart
                    </span>
                </button>

                <!-- botón por si no hay stock -->
                <button v-else class="notify-btn" @click.stop="promptRestock" title="Avisarme cuando haya stock">
                    <span class="material-symbols-outlined">
                        notifications_active
                    </span>
                </button>

            </div>

        </div>

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
                console.log(userObj);
                email = userObj.email;
            } else {
                email = window.prompt("Introduce tu correo electrónico para avisarte cuando repongamos stock:");
            }
            
            console.log(email);
            
            
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

    // Usamos la ruta que te ha funcionado en el navegador
    return `/src/assets/img-productos/${mainImage.url}`;
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
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.08);
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

/* Modificadores cuando no hay stock */

/* tuve que hacerlo así para para difuminar solo algunas cosas del card */
.is-empty .image-wrapper,
.is-empty .product-name,
.is-empty .product-description {
    opacity: 0.5;
    transition: opacity 0.3s ease;
}

.is-empty:hover .image-wrapper,
.is-empty:hover .product-name,
.is-empty:hover .product-description {
    opacity: 0.85;
}

.is-empty .product-image {
    filter: grayscale(85%); 
}

.out-stock {
    background: #1f2937; 
    color: white;
    font-size: 0.75rem;
    padding: 6px 12px;
    letter-spacing: 0.05em;
    font-weight: 500;
    box-shadow: 0 2px 5px rgba(0,0,0,0.2);
}

.notify-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 38px;
    height: 38px;
    border-radius: 50%;
    border: none;
    cursor: pointer;
    background: #e8ff65; 
    color: rgb(10, 10, 10);
    transition: all 0.3s ease;
    box-shadow: 0 4px 10px rgba(218, 229, 70, 0.4); 
}

.notify-btn:hover {
    background: #4338ca;
    transform: scale(1.1) translateY(-2px); 
    box-shadow: 0 6px 14px rgba(79, 70, 229, 0.5);
}
</style>