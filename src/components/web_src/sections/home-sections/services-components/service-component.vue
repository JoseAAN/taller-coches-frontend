<template>
    <div class="services-grid">
        <div v-for="service in services" :key="service.id">
            <div class="card service-card shadow-sm flex-column" @click="goToDetails(service.id)">

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
                        <span class="fw-bold text-navy ">Desde</span>
                        <span class="fw-bold text-navy">{{ parseInt(service.price) }}€</span>
                    </div>
                    <button class="btn btn-action-card w-100 fw-bold py-2">
                        RESERVAR AHORA
                    </button>
                </div>

            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'ServiceComponent',

    data() {
        return {
            services: []
        }
    },

    methods: {

        getServicesOnHome() {
            fetch(`${this.$BASE_URL}/v1/services/services-home`)
                .then(response => response.json())
                .then(data => {
                    this.services = data.data;
                })
                .catch(error => {
                    console.error('Error fetching services:', error);
                });
        },

        getImageUrl(imageName) {


            if (!imageName) {
                return 'https://via.placeholder.com/600x400?text=Servicio';
            }

            return new URL(`../../../../../assets/img-servicios/${imageName}`, import.meta.url).href;
        }

    },

    mounted() {
        this.getServicesOnHome();
    }
}
</script>

<style scoped>
.services-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1.5rem;
    padding: 2rem;
    max-width: 1200px;
    margin: 0 auto;
}

.service-card {
    border: 1px solid var(--nav-border);
    border-radius: 12px;
    overflow: hidden;
    background-color: var(--nav-bg);
    color: var(--nav-text);
    display: flex;
    flex-direction: column;
    height: 100%;
    min-height: 380px;
    cursor: pointer;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.service-card:hover {
    transform: translateY(-1px);
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.08);
}

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
    transform: scale(1.02);
}

.card-separator {
    margin: 0;
    border: 0;
    border-top: 1px solid var(--nav-border);
    opacity: 0.6;
}

.text-navy {
    color: var(--nav-text);
}

.text-secondary-custom {
    color: var(--nav-text);
    opacity: 0.8;
    font-size: 0.85rem;
    line-height: 1.4;
}

.line-clamp {
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

.icon-green {
    color: #52b155;
    font-size: 1rem;
}

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

@media (max-width: 992px) {
    .services-grid {
        grid-template-columns: repeat(2, 1fr);
    }
}

@media (max-width: 768px) {
    .services-grid {
        grid-template-columns: 1fr;
        padding: 1rem;
    }
}
</style>