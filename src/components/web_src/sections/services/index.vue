<template>
    <div>
        <div class="services-grid">
            <ServiceCard v-for="service in services" :key="service.id" :service="service" />
        </div>

        <div class="pagination" v-if="meta.last_page > 1">
            <button v-for="page in meta.last_page" :key="page" :class="{ active: page === meta.current_page }"
                @click="goToPage(page)">
                {{ page }}
            </button>
        </div>
    </div>
</template>

<script>
import ServiceCard from './service-card.vue'

export default {
    name: 'ServicesIndex',
    components: { ServiceCard },

    data() {
        return {
            services: [],
            meta: { current_page: 1, last_page: 1 }
        }
    },

    methods: {
        getServices(url = null) {
            const fetchUrl = url || `${this.$BASE_URL}/v1/services`;
            fetch(fetchUrl, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            })
                .then(res => {
                    if (!res.ok) throw new Error("Error al recoger los servicios")
                    return res.json()
                })
                .then(data => {
                    this.services = data.data
                    this.meta = {
                        current_page: data.meta?.current_page || 1,
                        last_page: data.meta?.last_page || 1,
                        path: data.meta?.path || url
                    }
                })
                .catch(err => console.error('Error al cargar servicios:', err))
        },

        goToPage(page) {
            const url = `${this.meta.path}?page=${page}`
            this.getServices(url)
        }
    },

    mounted() {
        this.getServices()
        document.title = "Servicios"
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

.pagination {
    display: flex;
    justify-content: center;
    gap: 0.5rem;
    margin: 2rem 0;
}

.pagination button {
    border: 1px solid var(--nav-text);
    background: transparent;
    color: var(--nav-text);
    padding: 0.4rem 0.8rem;
    border-radius: 4px;
    cursor: pointer;
}

.pagination button.active {
    background: var(--nav-text);
    color: var(--nav-bg);
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