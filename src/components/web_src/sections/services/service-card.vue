<template>
    <div class="card service-card shadow-sm w-100 flex-column" @click="goToDetails(service.id)">
        
        <div class="card-img-top-container">
            <img :src="getImageUrl(service.image)" :alt="service.name" class="service-img-cover">
        </div>

        <hr class="card-separator">

        <div class="card-body d-flex flex-column p-3">
            <h5 class="card-title fw-bold mb-2 text-navy text-center">
                {{ service.name }}
            </h5>

            <div class="d-flex align-items-start mt-2">
                <i class="pi pi-check-circle me-2 icon-green mt-1"></i>
                <span class="text-secondary-custom small line-clamp">{{ service.description }}</span>
            </div>
        </div>

        <hr class="card-separator">

        <div class="card-footer bg-transparent border-0 p-3 pt-2 d-flex flex-column gap-2 mt-auto">
            <div class="d-flex align-items-center justify-content-between mb-1">
                <span class="fw-bold text-navy small">Desde</span>
                <BasePrice :amount="service.price" :locale="locale" :currency="currency" size="md" />
            </div>
            
            <button @click.stop="bookService" class="btn btn-action-card w-100 fw-bold py-2">
                RESERVAR AHORA
            </button>
        </div>
    </div>
</template>

<script>
import BasePrice from '../../UI/global-price.vue'

export default {
    name: 'ServiceCard',
    components: { BasePrice },
    props: {
        service: { type: Object, required: true },
        locale: { type: String, default: 'es' },
        currency: { type: String, default: 'EUR' }
    },
    methods: {
        getImageUrl(imageName) {
            // Chivato temporal: te dirá en consola qué está intentando buscar
            console.log(`Buscando imagen para ${this.service.name}:`, imageName);

            if (!imageName) return 'https://placehold.co/600x400/e2e8f0/475569?text=Sin+Imagen';
            
            if (imageName.startsWith('http')) return imageName;
            
            try {
                return new URL(`../../../../assets/img-servicios/${imageName}`, import.meta.url).href;
            } catch (error) {
                console.error("Error cargando la imagen local:", error);
                return 'https://placehold.co/600x400/e2e8f0/475569?text=Error';
            }
        },
        bookService() {
            // Tu lógica original intacta
            this.$router.push({
                name: 'AppointmentCalendar'
            });
        },
        goToDetails(serviceId) {
            this.$router.push({ name: 'ServiceDetails', params: { id: serviceId } });
        }
    }
}
</script>

<style scoped>
.service-card {
    border: 1px solid var(--nav-border);
    border-radius: 12px;
    overflow: hidden;
    background-color: var(--nav-bg);
    color: var(--nav-text);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    width: 100%;
    height: 100%; 
    min-height: 380px; 
    display: flex;
    cursor: pointer;
}

.service-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 24px rgba(0,0,0,0.08) !important;
}

/* Contenedor de la foto arriba */
.card-img-top-container {
    width: 100%;
    height: 180px;
    overflow: hidden;
    background-color: #f8f9fa;
}

.service-img-cover {
    width: 100%;
    height: 100%;
    object-fit: cover; 
    object-position: center;
    transition: transform 0.5s ease;
}

.service-card:hover .service-img-cover {
    transform: scale(1.05);
}

/* Separadores */
.card-separator {
    margin: 0;
    border: 0;
    border-top: 1px solid var(--nav-border);
    opacity: 0.6;
}

/* Textos */
.text-navy { color: var(--nav-text); }

.text-secondary-custom { 
    color: var(--nav-text); 
    opacity: 0.8; 
    font-size: 0.85rem; 
    line-height: 1.4;
}

/* Trunca textos largos a 3 líneas */
.line-clamp {
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;  
    overflow: hidden;
}

.icon-green { color: #52b155; font-size: 1rem; }

/* Botón */
.btn-action-card {
    background-color: #52b155;
    color: white;
    border: none;
    border-radius: 8px;
    transition: all 0.3s ease;
    font-size: 0.85rem;
    letter-spacing: 0.5px;
}
.btn-action-card:hover { 
    background-color: #469c49; 
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(82, 177, 85, 0.3);
}

[data-theme="dark"] .card-img-top-container {
    background-color: #0f172a;
}
</style>