<template>
    <div class="container py-5">
        <div class="row g-4 row-cols-1 row-cols-md-2 row-cols-lg-3 justify-content-center">
            <div v-for="service in services" :key="service.id" class="col d-flex">
                <div class="card service-card shadow-sm w-100">
                    <div
                        class="card-img-top d-flex align-items-center justify-content-center bg-light-gray text-navy p-5">
                        <h3 class="fw-bold m-0 text-center">
                            {{ service.name }}
                        </h3>
                    </div>

                    <div class="card-body d-flex flex-column p-4">
                        <h4 class="card-title fw-bold mb-3 text-navy">
                            {{ service.name }}
                        </h4>

                        <ul class="list-unstyled mb-4 flex-grow-1">
                            <li class="d-flex align-items-start mb-2">
                                <i class="pi pi-check-circle me-2 icon-green mt-1"></i>
                                <span class="text-secondary-custom small">{{ service.description }}</span>
                            </li>
                        </ul>

                        <div class="mt-auto pt-3 border-top">
                            <h2 class="fw-bold text-navy mb-3">{{ service.price }}€</h2>
                            <button class="btn btn-action-card w-100 fw-bold py-2">
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
                    console.info('Servicios obtenidos:', data);
                    this.services = data.data;
                })
                .catch(error => {
                    console.error('Error fetching services:', error);
                }
                );
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
}

.service-card:hover {
    transform: translateY(-8px);
}

.text-navy {
    color: var(--nav-text);
    transition: color 0.3s ease;
}

.text-secondary-custom {
    color: var(--nav-text);
    opacity: 0.8;
}

.bg-light-gray {
    background-color: #f4f4f4;
    min-height: 200px;
}

.icon-green {
    color: #52b155;
    font-size: 1.1rem;
}

.btn-action-card {
    background-color: #52b155;
    color: white;
    border: none;
    border-radius: 8px;
    transition: all 0.3s ease;
}

.btn-action-card:hover {
    background-color: #469c49;
    transform: scale(1.02);
}

[data-theme="dark"] .bg-light-gray {
    background-color: #1a2e44;
    color: #f8f9fa;
}

@media (min-width: 992px) {
    .service-card {
        max-width: 350px;
        margin: 0 auto;
    }
}
</style>