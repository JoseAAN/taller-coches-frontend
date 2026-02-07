<template>
    <section class="hero-container d-flex align-items-center text-white">
        <div class="container px-md-5">
            <div class="row">
                <div class="col-lg-8 col-xl-7">
                    <h1 class="display-3 fw-bold mb-3 hero-title">
                        Tu coche, tan nuevo como el primer día.
                    </h1>

                    <p class="lead mb-5 hero-subtitle">
                        Limpieza profesional a domicilio y en centro. Cuidamos cada detalle
                        con productos ecológicos.
                    </p>

                    <div class="d-flex">
                        <button class="btn btn-action fw-bold shadow-sm">
                            VER PAQUETES DE LIMPIEZA
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <div class="features-bar bg-white py-4 shadow-sm">
    <div class="container px-md-5">
        <div class="row align-items-center justify-content-center">
            
            <div class="col-md-4 d-flex align-items-center justify-content-center justify-content-md-start mb-3 mb-md-0">
                <div class="dot me-3"></div>
                <span class="fw-semibold text-navy">Servicio en 60 min</span>
            </div>

            <div class="col-md-4 d-flex align-items-center justify-content-center justify-content-md-start mb-3 mb-md-0">
                <div class="dot me-3"></div>
                <span class="fw-semibold text-navy">Productos Eco-Friendly</span>
            </div>

            <div class="col-md-4 d-flex align-items-center justify-content-center justify-content-md-start mb-3 mb-md-0">
                <div class="dot me-3"></div>
                <span class="fw-semibold text-navy">Seguro de Responsabilidad</span>
            </div>

        </div>
    </div>
</div>
</template>

<style scoped>
.hero-container {
    background-color: #051221;
    min-height: 70vh;
    padding: 100px 0;
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

/* Botón Verde */
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

.text-navy {
    color: #003366;
}

.dot {
    width: 12px;
    height: 12px;
    background-color: #003366;
    border-radius: 50%;
}

.features-bar {
    border-bottom: 1px solid #eee;
}

@media (max-width: 768px) {
    .hero-title {
        font-size: 2.5rem;
    }

    .hero-container {
        text-align: center;
        padding: 60px 0;
    }

    .btn-action {
        width: 100%;
    }
}
</style>
