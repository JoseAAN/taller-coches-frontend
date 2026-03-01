<template>
    <div class="container py-5">
        <div class="row g-3 row-cols-1 row-cols-md-2 row-cols-lg-3 justify-content-center">
            <div v-for="service in services" :key="service.id" class="col d-flex">
                <div class="card service-card shadow-sm w-100 flex-row">
                    <div
                        class="card-img-side d-flex align-items-center justify-content-center bg-light-gray text-navy p-2">
                        <h5 class="fw-bold m-0 text-center">
                            {{ service.name }}
                        </h5>
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

                        <div class="mt-auto pt-1 border-top">
                            <h4 class="fw-bold text-navy mb-1">Desde {{parseInt(service.price) }}€</h4>
                            <button class="btn btn-action-card w-100 fw-bold py-1">
                                RESERVAR AHORA
                            </button>
                        </div>
                    </div>
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
            fetch('http://127.0.0.1:8000/api/v1/services/services-home')
                .then(response => response.json())
                .then(data => {
                    this.services = data.data;
                })
                .catch(error => {
                    console.error('Error fetching services:', error);
                });
        }
    },
    mounted() {
        this.getServicesOnHome();
    }
}
</script>

<style scoped>
.service-card {
    border: none;
    border-radius: 12px;
    overflow: hidden;
    background-color: var(--nav-bg);
    transition: transform 0.3s ease, background-color 0.3s ease;
    width: 100%;
    max-width: 480px;
    height: 180px;
    display: flex;
}

.service-card:hover {
    transform: translateY(-4px);
}

.card-img-side {
    min-width: 120px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #f4f4f4;
    padding: 0.5rem;
}

.text-navy {
    color: var(--nav-text);
    transition: color 0.3s ease;
    font-size: 0.85rem;
}

.text-secondary-custom {
    color: var(--nav-text);
    opacity: 0.8;
    font-size: 0.75rem;
}

.icon-green {
    color: #52b155;
    font-size: 0.9rem;
}

.btn-action-card {
    background-color: #52b155;
    color: white;
    border: none;
    border-radius: 8px;
    transition: all 0.3s ease;
    font-size: 0.8rem;
}

.btn-action-card:hover {
    background-color: #469c49;
    transform: scale(1.02);
}

[data-theme="dark"] .card-img-side {
    background-color: #1a2e44;
    color: #f8f9fa;
}

@media (max-width: 991px) {
    .service-card {
        flex-direction: column;
        height: auto;
        max-width: 100%;
    }

    .card-img-side {
        min-width: 100%;
        padding: 1rem;
    }
}
</style>