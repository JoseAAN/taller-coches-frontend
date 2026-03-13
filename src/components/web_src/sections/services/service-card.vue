<template>
    <div class="card service-card shadow-sm w-100 flex-row" @click="goToDetails(service.id)">
        
        <div class="card-img-side p-0">
            <img :src="getImageUrl(service.image)" :alt="service.name" class="service-img-cover">
        </div>

        <div class="card-body d-flex flex-column p-2">
            <h6 class="card-title fw-bold mb-1 text-navy">
                {{ service.name }}
            </h6>

            <ul class="list-unstyled mb-2 flex-grow-1">
                <li class="d-flex align-items-start mb-1">
                    <i class="pi pi-check-circle me-2 icon-green mt-1"></i>
                    <span class="text-secondary-custom small">{{ service.description }}</span>
                </li>
            </ul>

            <div class="mt-auto pt-1 border-top d-flex flex-column gap-2">
                <div class="d-flex align-items-center gap-1">
                    <span class="fw-bold text-navy small">Desde</span>
                    <BasePrice :amount="service.price" :locale="locale" :currency="currency" size="md" />
                </div>
                
                <button @click.stop="bookService" class="btn btn-action-card w-100 fw-bold py-1">
                    RESERVAR AHORA
                </button>
                
            </div>
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
        // NUEVO: Función para resolver imágenes en Vite
        getImageUrl(imageName) {
            // Si no hay imagen en la API, mostramos un placeholder
            if (!imageName) return 'https://placehold.co/400x400/e2e8f0/475569?text=Sin+Imagen';
            
            // Si la API devuelve una URL completa (http...), la usamos tal cual
            if (imageName.startsWith('http')) return imageName;
            
            // Si es un archivo local, le decimos a Vite dónde buscarlo
            try {
                return new URL(`../../../../assets/img-servicios/${imageName}`, import.meta.url).href;
            } catch (error) {
                return 'https://placehold.co/400x400/e2e8f0/475569?text=Error';
            }
        },
        bookService() {
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
    border: none;
    border-radius: 12px;
    overflow: hidden;
    background-color: var(--nav-bg);
    color: var(--nav-text);
    transition: transform 0.3s ease, background-color 0.3s ease, box-shadow 0.3s ease;
    width: 100%;
    height: 100%; 
    min-height: 180px; 
    display: flex;
    cursor: pointer;
}

.service-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 10px 20px rgba(0,0,0,0.1) !important;
}

/* NUEVOS ESTILOS PARA LA IMAGEN */
.card-img-side {
    width: 140px; /* Ancho fijo para la imagen lateral */
    min-width: 140px;
    flex-shrink: 0;
    overflow: hidden;
    background-color: #f8f9fa;
}

.service-img-cover {
    width: 100%;
    height: 100%;
    object-fit: cover; /* Evita que la imagen se deforme */
    object-position: center;
}

.text-navy { color: var(--nav-text); font-size: 0.85rem; }
.text-secondary-custom { color: var(--nav-text); opacity: 0.8; font-size: 0.75rem; }
.icon-green { color: #52b155; font-size: 0.9rem; }
.btn-action-card {
    background-color: #52b155;
    color: white;
    border: none;
    border-radius: 8px;
    transition: all 0.3s ease;
    font-size: 0.8rem;
}
.btn-action-card:hover { background-color: #469c49; transform: scale(1.02); }

@media (max-width: 991px) {
    .service-card { flex-direction: column; }
    .card-img-side {
        width: 100%;
        height: 200px; /* En móviles la imagen se pone arriba y le damos altura */
    }
}
</style>