<template>
    <div class="maintenance-container">
        <div class="lottie-wrapper">
            <lottie-player :src="animationData" background="transparent" speed="1" style="width: 100%; height: 100%;"
                loop autoplay></lottie-player>
        </div>

        <h2 class="main-title">Sección en boxes</h2>
        <div class="title-underline"></div>

        <p class="description">
            Estamos trabajando para traerte una experiencia aún mejor.
            ¡Volverá pronto con mejoras increíbles!
        </p>

        <router-link to="/" class="btn-home">
            <span class="material-symbols-outlined">home</span>
            Ir al inicio
        </router-link>
    </div>
</template>

<script>
import "@lottiefiles/lottie-player";
import carWashJson from "@/assets/animations/Car Wash.json";

export default {
    name: 'MaintenanceView',
    data() {
        return {
            animationData: carWashJson
        }
    }
}
</script>

<style scoped>
.maintenance-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 70vh;
    text-align: center;
    padding: 2rem;
    color: var(--nav-text);
}

.lottie-wrapper {
    width: 300px;
    height: 300px;
    margin-bottom: 1rem;
    display: flex;
    justify-content: center;
    align-items: center;
}

.lottie-animation {
    width: 100%;
    height: 100%;
}

.main-title {
    font-size: 2.8rem;
    font-weight: 850;
    margin: 0;
    text-transform: uppercase;
    letter-spacing: -1px;
}

.title-underline {
    width: 150px;
    height: 4px;
    background: #52b155;
    margin: 1rem auto 1.5rem;
    border-radius: 2px;
}

.description {
    font-size: 1.2rem;
    max-width: 500px;
    opacity: 0.8;
    margin-bottom: 2.5rem;
    line-height: 1.6;
}

.btn-home {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 12px 30px;
    background-color: var(--nav-text);
    color: var(--nav-bg);
    text-decoration: none;
    border-radius: 12px;
    font-weight: 700;
    transition: all 0.3s ease;
}

.btn-home:hover {
    transform: translateY(-3px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
    opacity: 0.9;
}

@media (max-width: 768px) {
    .main-title {
        font-size: 2rem;
    }
    .lottie-wrapper {
        width: 200px;
        height: 200px;
    }
}
</style>