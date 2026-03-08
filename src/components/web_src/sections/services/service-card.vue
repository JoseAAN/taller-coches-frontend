<template>
    <div class="card service-card shadow-sm w-100 flex-row" @click="goToDetails(service.id)">
        
        <div class="card-img-side d-flex align-items-center justify-content-center bg-light-gray text-navy p-2">
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
        service: {
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
        }
    },

    methods: {
        bookService() {
            this.$emit('book-service', this.service);
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
    transition: transform 0.3s ease, background-color 0.3s ease, box-shadow 0.3s ease;
    width: 100%;
    height: 180px;
    display: flex;
    cursor: pointer; 
}

.service-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 10px 20px rgba(0,0,0,0.1) !important;
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
    }

    .card-img-side {
        min-width: 100%;
        padding: 1rem;
    }
}
</style>