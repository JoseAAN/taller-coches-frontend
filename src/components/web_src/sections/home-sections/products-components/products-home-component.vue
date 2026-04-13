<template>
    <div class="carousel-container">
        <!-- PrimeVue Carousel -->
        <Carousel 
            v-if="products.length > 0 && !loading"
            :value="products" 
            :numVisible="4" 
            :numScroll="1" 
            :responsiveOptions="responsiveOptions" 
            circular 
            :autoplayInterval="4000"
            class="custom-carousel"
        >
            <template #item="property">
                <div class="product-card" @click="goToProduct(property.data.id)">
                    <div class="image-wrapper">
                        <span class="best-seller-badge">
                            <i class="pi pi-star-fill text-yellow-400 mr-1" style="font-size: 0.8rem"></i> Top Ventas
                        </span>
                        
                        <img 
                            :src="getPrimaryImage(property.data)" 
                            :alt="property.data.name" 
                            class="product-image"
                        />
                    </div>
                    
                    <div class="product-info">
                        <div class="category text-sm font-semibold mb-2 tracking-wider uppercase" style="color: #52b155;">
                            {{ property.data.categories && property.data.categories.length ? property.data.categories[0].name : 'Destacado' }}
                        </div>
                        <h4 class="product-name">{{ property.data.name }}</h4>
                        <div class="price-stock-flex">
                            <span class="product-price">{{ property.data.price }} €</span>
                            <span v-if="property.data.stock > 0" class="stock-badge in-stock text-xs">
                                <i class="pi pi-check-circle mr-1"></i> Stock
                            </span>
                            <span v-else class="stock-badge out-stock text-xs">
                                <i class="pi pi-times-circle mr-1"></i> Agotado
                            </span>
                        </div>
                    </div>
                </div>
            </template>
        </Carousel>

        <div v-else-if="loading" class="skeleton-grid py-5">
            <div class="skeleton-card" v-for="i in 4" :key="i"></div>
        </div>

        <!-- esto es por si no hay productos o rompe la api -->
        <div v-else class="text-center py-5 empty-state">
            <i class="pi pi-box mb-3 text-4xl text-gray-400"></i>
            <p>Nuestros productos estrella se están actualizando.</p>
        </div>
    </div>
</template>

<script>
import Carousel from 'primevue/carousel';
import Button from 'primevue/button';

export default {
    name: 'ProductsHomeComponent',
    components: {
        Carousel,
        Button
    },
    data() {
        return {
            products: [],
            loading: true,
            responsiveOptions: [
                { breakpoint: '1400px', numVisible: 4, numScroll: 1 },
                { breakpoint: '1199px', numVisible: 3, numScroll: 1 },
                { breakpoint: '991px', numVisible: 2, numScroll: 1 },
                { breakpoint: '767px', numVisible: 1, numScroll: 1 }
            ]
        };
    },
    methods: {
        fetchBestSellers() {
            fetch(`${this.$BASE_URL}/v1/products/best-sellers`)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                })
                .then(data => {
                    this.products = data;
                })
                .catch(error => {
                    console.error("Error cargando productos estrella:", error);
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        getPrimaryImage(product) {
            if (product.images && product.images.length > 0) {
                const mainImage = product.images.find(img => img.is_primary) || product.images[0];
                
                if (mainImage.url.startsWith('http')) {
                    return mainImage.url;
                }
                
                return `/img-productos/${mainImage.url}`;
            }
            return 'https://placehold.co/600x700?text=Sin+Imagen';
        },
        goToProduct(id) {
            this.$router.push(`/product/${id}`); 
        }
    },
    mounted() {
        this.fetchBestSellers();
    }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,wght@0,400;0,500;0,700;1,400&display=swap');

.carousel-container {
    width: 100%;
    max-width: 1400px;
    margin: 0 auto;
    padding: 1rem 0 3rem 0;
}

.product-card {
    background: var(--nav-bg, #ffffff);
    border-radius: 20px;
    margin: 1rem;
    overflow: hidden;
    transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
    border: 1px solid var(--nav-border, rgba(0, 0, 0, 0.04));
    box-shadow: 0 12px 35px rgba(0, 0, 0, 0.08);
    position: relative;
    cursor: pointer;
    height: 100%;
    display: flex;
    flex-direction: column;
}

.product-card:hover {
    transform: translateY(-8px);
    box-shadow: 0 22px 45px rgba(82, 177, 85, 0.18);
    border-color: rgba(82, 177, 85, 0.3);
}

.image-wrapper {
    position: relative;
    width: 100%;
    height: 230px;
    background: transparent;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    transition: background 0.3s ease;
    border-bottom: 1px solid var(--nav-border, rgba(0,0,0,0.04));
    padding-top: 1rem;
}

[data-theme='dark'] .image-wrapper,
.p-dark .image-wrapper {
    background: #08192E;
}

.product-image {
    width: 80%;
    height: 80%;
    object-fit: contain;
    transition: transform 0.6s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.product-card:hover .product-image {
    transform: scale(1.1);
}
.best-seller-badge {
    position: absolute;
    top: 15px;
    left: 15px;
    background: rgba(20, 20, 20, 0.85);
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
    color: white;
    padding: 6px 14px;
    border-radius: 30px;
    font-size: 0.75rem;
    font-weight: 700;
    z-index: 10;
    font-family: 'DM Sans', sans-serif;
    letter-spacing: 0.5px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}


.product-info {
    padding: 2rem;
    display: flex;
    flex-direction: column;
    flex-grow: 1;
}

.category {
    font-family: 'DM Sans', sans-serif;
    font-size: 0.83rem;
    opacity: 0.9;
}

.product-name {
    font-family: 'Syne', sans-serif;
    font-size: 1.15rem;
    font-weight: 700;
    color: var(--nav-text);
    margin: 0 0 1rem 0;
    line-height: 1.4;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    overflow: hidden;
    flex-grow: 1;
}

.price-stock-flex {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-top: 1rem;
    border-top: 1px dashed var(--nav-border);
}

.product-price {
    font-family: 'Syne', sans-serif;
    font-size: 1.25rem;
    font-weight: 700;
    color: var(--nav-text);
}

.stock-badge {
    font-family: 'DM Sans', sans-serif;
    font-weight: 600;
    padding: 5px 12px;
    border-radius: 20px;
    display: flex;
    align-items: center;
    letter-spacing: 0.2px;
}

.in-stock {
    background: rgba(16, 185, 129, 0.12);
    color: #10b981;
}
.out-stock {
    background: rgba(239, 68, 68, 0.12);
    color: #ef4444;
}

.skeleton-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 2rem;
    padding: 1rem 1.5rem;
}

.skeleton-card {
    height: 420px;
    border-radius: 20px;
    background: linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%);
    background-size: 200% 100%;
    animation: pulsing 2s infinite linear;
}

[data-theme='dark'] .skeleton-card,
.p-dark .skeleton-card {
    background: linear-gradient(90deg, #0d2345 25%, #163660 50%, #0d2345 75%);
    background-size: 200% 100%;
}

@keyframes pulsing {
    0% { background-position: 200% 0; }
    100% { background-position: -200% 0; }
}

.empty-state {
    font-family: 'DM Sans', sans-serif;
    color: var(--nav-text);
    opacity: 0.6;
}

@media (max-width: 1400px) { .skeleton-grid { grid-template-columns: repeat(4, 1fr); } }
@media (max-width: 1199px) { .skeleton-grid { grid-template-columns: repeat(3, 1fr); } }
@media (max-width: 991px) { .skeleton-grid { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 767px) { .skeleton-grid { grid-template-columns: 1fr; } }

:deep(.p-carousel-indicator) button {
    background-color: var(--nav-border) !important;
    border-radius: 50% !important;
    width: 8px !important;
    height: 8px !important;
    margin: 0 4px !important;
    transition: all 0.35s cubic-bezier(0.25, 0.8, 0.25, 1);
}

:deep(.p-carousel-indicator.p-carousel-indicator-active) button {
    background-color: #52b155 !important;
    width: 28px !important;
    border-radius: 10px !important;
}

[data-theme='dark'] .product-card,
.p-dark .product-card {
    background: linear-gradient(145deg, #0d2345, #08162b);
    border-color: rgba(255, 255, 255, 0.03);
}

[data-theme='dark'] .product-card:hover,
.p-dark .product-card:hover {
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.6);
    border-color: #52b155;
    background: linear-gradient(145deg, #112d58, #0a1c36);
}
</style>