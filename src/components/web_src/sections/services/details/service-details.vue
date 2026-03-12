<template>
    <div v-if="service" class="service-details">

        <div class="service-left">
            <img :src="getImageUrl(service.image)" :alt="service.name" class="serviceImage">
        </div>

        <div class="service-right">
            <h2 class="service-name">{{ service.name }}</h2>

            <div class="service-price text-neon">
                Desde {{ service.price }} €
            </div>

            <div class="service-features" v-if="service.features">
                <span v-for="feature in service.features" :key="feature" class="feature-badge">
                    {{ feature }}
                </span>
            </div>

            <p class="service-description">{{ service.description }}</p>

            <div class="service-actions mt-4">
                <button @click="bookService" class="btn-book fw-bold">
                    RESERVAR AHORA
                </button>
            </div>
        </div>

    </div>
    
    <div v-else class="text-center py-5">
        <p>Cargando información del servicio...</p>
    </div>
</template>

<script>
export default {
    name: "ServiceDetails",
    data() {
        return {
            serviceId: null,
            service: null,
            defaultImage: 'https://placehold.co/600x700'
        }
    },
    methods: {
        // 1. Nuestra nueva función
        getImageUrl(imageName) {
            if (!imageName) return 'https://placehold.co/800x600/e2e8f0/475569?text=Sin+Imagen';
            if (imageName.startsWith('http')) return imageName;
            try {
                return new URL(`../../../../../assets/img-servicios/${imageName}`, import.meta.url).href;
            } catch (error) {
                return 'https://placehold.co/800x600/e2e8f0/475569?text=Error';
            }
        }, // <--- ¡ESTA ES LA COMA VITAL QUE FALTABA!

        // 2. Tu función original
        getService() {
            fetch(`http://127.0.0.1:8000/api/v1/services/${this.serviceId}`)
                .then(res => {
                    if (!res.ok) throw new Error("Error al recoger los datos del servicio");
                    return res.json();
                })
                .then(data => this.service = data.data)
                .catch(err => console.error('Error al cargar servicio:', err));
        },
        
        // 3. Función de reserva
        bookService() {
            alert(`Iniciando reserva para: ${this.service?.name}`);
        }
    },
    mounted() {
        this.serviceId = this.$route.params.id;
        this.getService();
    },
}
</script>

<style scoped>
.service-details {
    max-width: 1000px;
    margin: 2rem auto;
    padding: 2rem;
    border: 1px solid var(--nav-border);
    border-radius: 12px;
    background: var(--nav-bg);
    display: flex;
    gap: 3rem;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.service-left {
    flex: 1;
}

.serviceImage {
    width: 100%;
    border-radius: 12px;
    object-fit: cover;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.service-right {
    flex: 1.2;
    display: flex;
    flex-direction: column;
    justify-content: center;
}

.service-name {
    font-size: 2rem;
    font-weight: 800;
    color: var(--nav-text);
    margin-bottom: 0.5rem;
}

.service-price {
    font-size: 1.6rem;
    color: #52b155;
    font-weight: 700;
    margin-bottom: 1.5rem;
}

.feature-badge {
    background: #f0f4f8;
    color: #334155;
    font-size: 0.85rem;
    padding: 4px 10px;
    border-radius: 6px;
    margin-right: 8px;
    font-weight: 600;
}

.service-description {
    margin-top: 1.5rem;
    margin-bottom: 2rem;
    line-height: 1.6;
    color: var(--nav-text);
    opacity: 0.9;
    font-size: 1.1rem;
}

.btn-book {
    background-color: #52b155;
    color: #fff;
    border: none;
    padding: 14px 30px;
    border-radius: 8px;
    font-size: 1.1rem;
    cursor: pointer;
    transition: all 0.3s ease;
    width: 100%;
    max-width: 300px;
}

.btn-book:hover {
    background-color: #469c49;
    transform: translateY(-2px);
    box-shadow: 0 6px 12px rgba(82, 177, 85, 0.3);
}

/* Modo oscuro */
[data-theme="dark"] .feature-badge {
    background: #1e293b;
    color: #cbd5e1;
}

@media (max-width: 992px) {
    .service-details {
        flex-direction: column;
        padding: 1.5rem;
        gap: 1.5rem;
    }

    .serviceImage {
        max-height: 400px;
    }

    .btn-book {
        max-width: 100%;
    }
}
</style>