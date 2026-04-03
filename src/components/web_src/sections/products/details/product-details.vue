<template>
    <div v-if="product" class="product-details">

        <div class="product-left">
            <div class="product-image-container">
                <img :src="getMainImage(product?.images)" :alt="product?.name" class="product-image">
            </div>
        </div>

        <div class="product-right">
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

            <div class="quantity-selector">
                <label for="minmax-buttons">Cantidad:</label>
                <InputNumber v-model="value" inputId="minmax-buttons" mode="decimal" showButtons :min="1"
                    :max="availableStock" fluid class="quantityInput" :disabled="availableStock <= 0" />
                <span class="stock-warning" v-if="availableStock <= 0">Máximo alcanzado en carrito</span>
                <span class="stock-warning" v-else-if="availableStock < product.stock">Tienes {{ cartQuantity }} en el
                    carrito (Máx: {{ product.stock }})</span>
            </div>

            <div class="product-actions">
                <button :disabled="availableStock <= 0" @click="addToCart" class="btn-cart material-symbols-outlined">
                    shopping_cart
                </button>
            </div>
        </div>

    </div>
</template>

<script>
import InputNumber from 'primevue/inputnumber';
import { cart, ITEM_TYPES } from '@/JS/Cart.js';
import { useToast } from "vue-toastification";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;
export default {
    name: "ProductDetails",
    components: { InputNumber },
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
            // Buscar en cart.items el item que sea PRODUCT y tenga el id de este producto
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
            // Asegúrate de que BASE_URL esté definido o importado en tu componente
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
            // Nueva firma: typeId, targetId, quantity, price
            const result = await cart.addToCart(ITEM_TYPES.PRODUCT, this.productId, this.value, this.product.price);
            if (result.success) {
                toast.success(`Añadido(s) ${this.value} ${this.product.name} al carrito`);
                this.value = 1; // Reset quantity after successful add
            }
        },

        getMainImage(images) {
            // 1. Si no hay imágenes, placeholder
            if (!images || images.length === 0) {
                return 'https://placehold.co/600x700?text=Sin+Imagen';
            }

            // 2. Buscamos la principal
            const mainImage = images.find(img => img.is_primary) || images[0];

            // 3. Si es una URL externa (http)
            if (mainImage.url.startsWith('http')) {
                return mainImage.url;
            }

            // 4. La ruta milimétrica para Vite desde la carpeta 'details'
            try {
                return new URL(`../../../../../assets/img-productos/${mainImage.url}`, import.meta.url).href;
            } catch (error) {
                console.error("Vite no encuentra la imagen:", error);
                return 'https://placehold.co/600x700?text=Error';
            }
        }
    },
    mounted() {
        this.productId = this.$route.params.id;
        this.getProduct();
    },
}
</script>

<style scoped>
.product-details {
    max-width: 1000px;
    margin: 2rem auto;
    padding: 2rem;
    border: 1px solid #ddd;
    border-radius: 8px;
    background: var(--bg-color);
    display: flex;
    gap: 2rem;
}

.product-left {
    flex: 1;
}

.productImage {
    width: 500px;
    border-radius: 8px;
    object-fit: cover;
}

/* Esta es la "caja" que pone el límite */
.product-image-container {
    width: 100%;
    max-width: 500px; /* <-- Aquí pones el límite máximo de ancho */
    height: 500px;    /* <-- Y aquí el límite máximo de alto */
    margin: 0 auto;   /* Para centrar la caja horizontalmente */
    background-color: #f8fafc; /* Un fondo sutil por si la imagen es transparente */
    border-radius: 12px; /* Bordes redondeados para que quede profesional */
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
}

/* Esta es la imagen en sí, obedeciendo a su caja */
.product-image {
    width: 100%;
    height: 100%;
    /* 'contain' hace que la foto se encoja para caber sin recortarse ni deformarse */
    /* Si prefieres que llene la caja recortando los bordes, usa 'cover' */
    object-fit: contain; 
}

.product-right {
    flex: 2;
    display: flex;
    flex-direction: column;
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

.quantity-selector {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 0.25rem;
    margin-bottom: 1rem;
}

.quantity-selector label {
    font-weight: 500;
}

.quantityInput {
    width: 100px;
}

.product-actions {
    display: flex;
    align-items: center;
    gap: 1rem;
}

.btn-cart {
    background-color: #1d4ed8;
    color: #fff;
    border: none;
    width: 48px;
    height: 48px;
    border-radius: 50%;
    font-size: 1.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
}

.btn-cart:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

@media (max-width: 992px) {
    .product-details {
        flex-direction: column;
        padding: 1rem;
        gap: 1rem;
    }

    .productImage {
        width: 100%;
        max-height: 400px;
        object-fit: contain;
    }

    .product-right {
        flex: 1;
    }

    .quantityInput {
        width: 80px;
    }

    .btn-cart {
        width: 40px;
        height: 40px;
        font-size: 1.3rem;
    }
}

@media (max-width: 576px) {
    .product-details {
        padding: 0.5rem;
        gap: 0.5rem;
    }

    .product-name {
        font-size: 1.4rem;
    }

    .product-price {
        font-size: 1.6rem;
    }

    .category {
        font-size: 0.75rem;
        padding: 1px 4px;
    }

    .quantityInput {
        width: 90px;
    }

    .btn-cart {
        width: 36px;
        height: 36px;
        font-size: 1.2rem;
    }
}
</style>