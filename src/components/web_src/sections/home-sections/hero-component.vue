<template>
    <section class="hero-container d-flex align-items-center text-white">
        <div class="container px-md-5">
            <div class="row">
                <div class="col-lg-8 col-xl-7 content-wrapper">
                    <h1 class="display-3 fw-bold mb-3 hero-title">
                        Tu coche, tan nuevo como el primer día.
                    </h1>

                    <p class="lead mb-5 hero-subtitle">
                        Limpieza profesional a domicilio y en centro. Cuidamos cada detalle
                        con productos ecológicos.
                    </p>

                    <div class="d-flex btn-container">
                        <button class="btn btn-action fw-bold shadow-sm">
                            VER PAQUETES DE LIMPIEZA
                        </button>
                    </div>
                </div>

                <div class="col-lg-5 d-none d-xxl-block position-relative">
                    <div class="car-wrapper">
                        <img src="@/assets/cartest2.webp" alt="Coche reluciente" class="img-fluid car-image">
                    </div>
                </div>
            </div>
        </div>
    </section>

    <div class="features-bar py-5 shadow-sm">
        <div class="container px-md-5">
            <div class="row align-items-center justify-content-center">
                <div class="col-md-4 d-flex align-items-center justify-content-center justify-content-md-start mb-md-0">
                    <div class="dot me-3"></div>
                    <span class="fw-semibold feature-text">Servicio en 60 min</span>
                </div>
                <div class="col-md-4 d-flex align-items-center justify-content-center justify-content-md-start mb-md-0">
                    <div class="dot me-3"></div>
                    <span class="fw-semibold feature-text">Productos Eco-Friendly</span>
                </div>
                <div class="col-md-4 d-flex align-items-center justify-content-center justify-content-md-start mb-md-0">
                    <div class="dot me-3"></div>
                    <span class="fw-semibold feature-text">Seguro de Responsabilidad</span>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.hero-container {
    background: radial-gradient(circle at 80% 50%, rgba(82, 177, 85, 0.08) 0%, transparent 50%),
        linear-gradient(135deg, #0a1f33 0%, #051221 100%);
    min-height: 70vh;
    padding: 100px 0;
    overflow: hidden;
}

.content-wrapper {
    z-index: 2;
}

.hero-title {
    line-height: 1.1;
    letter-spacing: -2px;
}

.hero-subtitle {
    font-size: 1.25rem;
    opacity: 0.9;
    max-width: 600px;
}

.btn-action {
    background-color: #52b155;
    color: white;
    padding: 15px 35px;
    border-radius: 10px;
    border: none;
    font-size: 1rem;
    transition: all 0.3s ease;
}

.btn-action:hover {
    background-color: #469c49;
    transform: translateY(-2px);
    color: white;
}

.car-wrapper {
    position: absolute;
    right: -50px;
    top: 50%;
    transform: translateY(-50%);
    width: 600px;
}

.car-image {
    filter: drop-shadow(0 20px 30px rgba(0, 0, 0, 0.5));
    -webkit-box-reflect: below -20px linear-gradient(transparent 70%, rgba(255, 255, 255, 0.05));
}

.features-bar {
    background-color: var(--nav-bg);
    border-bottom: 1px solid var(--nav-border);
    transition: background-color 0.3s ease, border-color 0.3s ease;
}

.feature-text {
    color: var(--nav-text);
}

.dot {
    width: 12px;
    height: 12px;
    background-color: var(--nav-text);
    border-radius: 50%;
}

@media (max-width: 1399px) {
    .hero-container {
        text-align: center;
        padding: 80px 0;
    }

    .hero-subtitle {
        margin: 0 auto 3rem auto;
    }

    .btn-container {
        justify-content: center;
    }

    .btn-action {
        width: 100%;
        max-width: 400px;
    }

    .col-lg-5 {
        display: none !important;
    }

    .col-lg-8 {
        width: 100%;
        flex: 0 0 100%;
        max-width: 100%;
    }
}

@media (max-width: 768px) {
    .hero-title {
        font-size: 2.5rem;
    }
}
</style>