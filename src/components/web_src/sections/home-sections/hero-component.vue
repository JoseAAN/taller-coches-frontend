<template>
    <div>
        <section class="hero-container">
            <div class="hero-noise"></div>
            <div class="hero-glow"></div>

            <div class="container px-md-5 hero-inner">
                <div class="row align-items-center">
                    <div class="col-lg-8 col-xl-7 content-wrapper">
                        <div class="eyebrow mb-4">
                            <span class="eyebrow-dot"></span>
                            <span class="eyebrow-text">Detailing Profesional · Gran Canaria</span>
                        </div>

                        <h1 class="hero-title mb-4">
                            Tu coche,<br>
                            <span class="title-accent">tan nuevo</span><br>
                            como el primer día.
                        </h1>

                        <p class="hero-subtitle mb-5">
                            Limpieza profesional a domicilio y en centro. Cuidamos cada
                            detalle con productos ecológicos y técnicas de vanguardia.
                        </p>

                        <div class="hero-actions">
                            <button class="btn-primary-hero" @click="$router.push('/services')">
                                <span>Ver Paquetes de Limpieza</span>
                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                    <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" stroke-width="1.5"
                                        stroke-linecap="round" stroke-linejoin="round" />
                                </svg>
                            </button>
                            <button class="btn-ghost-hero">
                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                    <circle cx="8" cy="8" r="6.5" stroke="currentColor" stroke-width="1.2" />
                                    <path d="M6.5 5.5l4 2.5-4 2.5V5.5z" fill="currentColor" />
                                </svg>
                                <span>Ver cómo trabajamos</span>
                            </button>
                        </div>
                    </div>

                    <div class="col-lg-5 d-none d-xxl-block position-relative">
                        <div class="car-wrapper">
                            <img src="@/assets/cartest2.webp" alt="Coche reluciente" class="car-image">
                            <div class="car-glow-effect"></div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="scroll-indicator">
                <div class="scroll-line"></div>
            </div>
        </section>

        <div class="features-strip">
            <div class="container px-md-5">
                <div class="features-inner">
                    <div class="feature-item">
                        <div class="feature-icon">
                            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                                <circle cx="9" cy="9" r="7.5" stroke="#52b155" stroke-width="1.3" />
                                <path d="M5.5 9l2.5 2.5 4.5-5" stroke="#52b155" stroke-width="1.4"
                                    stroke-linecap="round" stroke-linejoin="round" />
                            </svg>
                        </div>
                        <div class="feature-content">
                            <span class="feature-label">Rapidez garantizada</span>
                            <span class="feature-sub">Servicio en 60 min</span>
                        </div>
                    </div>
                    <div class="feature-divider"></div>
                    <div class="feature-item">
                        <div class="feature-icon">
                            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                                <path d="M9 2C5.13 2 2 5.13 2 9s3.13 7 7 7 7-3.13 7-7" stroke="#52b155"
                                    stroke-width="1.3" stroke-linecap="round" />
                                <path d="M14 2v4h-4" stroke="#52b155" stroke-width="1.3" stroke-linecap="round"
                                    stroke-linejoin="round" />
                            </svg>
                        </div>
                        <div class="feature-content">
                            <span class="feature-label">Sostenibilidad</span>
                            <span class="feature-sub">Productos Eco-Friendly</span>
                        </div>
                    </div>
                    <div class="feature-divider"></div>
                    <div class="feature-item">
                        <div class="feature-icon">
                            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                                <path d="M9 2.5L3 5v5c0 3.5 2.5 6 6 7 3.5-1 6-3.5 6-7V5L9 2.5z" stroke="#52b155"
                                    stroke-width="1.3" stroke-linejoin="round" />
                                <path d="M6.5 9l2 2 3.5-4" stroke="#52b155" stroke-width="1.3" stroke-linecap="round"
                                    stroke-linejoin="round" />
                            </svg>
                        </div>
                        <div class="feature-content">
                            <span class="feature-label">Cobertura total</span>
                            <span class="feature-sub">Seguro de Responsabilidad</span>
                        </div>
                    </div>
                    <div class="feature-divider"></div>
                    <div class="feature-item">
                        <div class="feature-icon">
                            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                                <path d="M2 9l4 4 10-8" stroke="#52b155" stroke-width="1.4" stroke-linecap="round"
                                    stroke-linejoin="round" />
                            </svg>
                        </div>
                        <div class="feature-content">
                            <span class="feature-label">Sin complicaciones</span>
                            <span class="feature-sub">Reserva online 24/7</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,300&display=swap');

.hero-container {
    position: relative;
    background: linear-gradient(160deg, #071A2E 0%, #0a1f33 55%, #0d2a3e 100%);
    min-height: 70vh;
    display: flex;
    align-items: center;
    padding: 90px 0 70px;
    overflow: hidden;
}

.hero-noise {
    position: absolute;
    inset: 0;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
    background-size: 200px 200px;
    opacity: 0.5;
    pointer-events: none;
}

.hero-glow {
    position: absolute;
    width: 700px;
    height: 700px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(82, 177, 85, 0.09) 0%, transparent 65%);
    top: -100px;
    right: -200px;
    pointer-events: none;
}

.hero-inner {
    position: relative;
    z-index: 2;
    width: 100%;
}

.eyebrow {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    background: rgba(82, 177, 85, 0.08);
    border: 1px solid rgba(82, 177, 85, 0.2);
    border-radius: 100px;
    padding: 6px 16px;
}

.eyebrow-dot {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: #52b155;
    display: inline-block;
    box-shadow: 0 0 8px rgba(82, 177, 85, 0.6);
    animation: pulse-dot 2.5s ease-in-out infinite;
}

@keyframes pulse-dot {

    0%,
    100% {
        box-shadow: 0 0 8px rgba(82, 177, 85, 0.6);
    }

    50% {
        box-shadow: 0 0 16px rgba(82, 177, 85, 1);
    }
}

.eyebrow-text {
    font-family: 'DM Sans', sans-serif;
    font-size: 0.78rem;
    font-weight: 400;
    color: rgba(255, 255, 255, 0.7);
    letter-spacing: 0.04em;
    text-transform: uppercase;
}

.hero-title {
    font-family: 'Syne', sans-serif;
    font-weight: 800;
    font-size: clamp(2rem, 4.5vw, 3.6rem);
    line-height: 1.0;
    letter-spacing: -0.03em;
    color: #fff;
    margin: 0;
}

.title-accent {
    background: linear-gradient(135deg, #52b155 0%, #7dd87f 50%, #52b155 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
}

.hero-subtitle {
    font-family: 'DM Sans', sans-serif;
    font-size: 0.95rem;
    font-weight: 300;
    color: rgba(255, 255, 255, 0.6);
    line-height: 1.7;
    max-width: 480px;
}

.hero-actions {
    display: flex;
    align-items: center;
    gap: 1.25rem;
    flex-wrap: wrap;
}

.btn-primary-hero {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    background: #52b155;
    color: #fff;
    border: none;
    border-radius: 12px;
    padding: 15px 28px;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.9rem;
    font-weight: 500;
    letter-spacing: 0.02em;
    cursor: pointer;
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;
}

.btn-primary-hero::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.12) 0%, transparent 60%);
    border-radius: inherit;
}

.btn-primary-hero:hover {
    background: #469c49;
    transform: translateY(-2px);
    box-shadow: 0 12px 32px rgba(82, 177, 85, 0.35);
}

.btn-ghost-hero {
    display: inline-flex;
    align-items: center;
    gap: 9px;
    background: transparent;
    color: rgba(255, 255, 255, 0.65);
    border: none;
    padding: 15px 8px;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.9rem;
    font-weight: 400;
    cursor: pointer;
    transition: all 0.25s ease;
}

.btn-ghost-hero:hover {
    color: #fff;
}

.car-wrapper {
    position: absolute;
    right: -60px;
    top: 50%;
    transform: translateY(-50%);
    width: 620px;
}

.car-image {
    width: 100%;
    filter: drop-shadow(0 30px 50px rgba(0, 0, 0, 0.6));
}

.scroll-indicator {
    position: absolute;
    bottom: 36px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;
    opacity: 0.35;
}

.scroll-line {
    width: 1px;
    height: 48px;
    background: linear-gradient(to bottom, transparent, rgba(255, 255, 255, 0.8));
    animation: scroll-anim 2s ease-in-out infinite;
}

@keyframes scroll-anim {

    0%,
    100% {
        transform: scaleY(0.6);
        opacity: 0.4;
    }

    50% {
        transform: scaleY(1);
        opacity: 1;
    }
}

/* === FEATURES STRIP === */
.features-strip {
    background-color: var(--nav-bg, #fff);
    border-bottom: 1px solid var(--nav-border, rgba(0, 0, 0, 0.08));
    padding: 0;
    transition: background-color 0.3s ease;
}

.features-inner {
    display: flex;
    align-items: stretch;
    justify-content: space-between;
}

.feature-item {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 28px 0;
    flex: 1;
}

.feature-icon {
    width: 40px;
    height: 40px;
    border-radius: 10px;
    background: rgba(82, 177, 85, 0.08);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    border: 1px solid rgba(82, 177, 85, 0.15);
}

.feature-content {
    display: flex;
    flex-direction: column;
    gap: 2px;
}

.feature-label {
    font-family: 'Syne', sans-serif;
    font-size: 0.82rem;
    font-weight: 600;
    color: var(--nav-text, #0a1f33);
    text-transform: uppercase;
    letter-spacing: 0.05em;
}

.feature-sub {
    font-family: 'DM Sans', sans-serif;
    font-size: 0.88rem;
    font-weight: 300;
    color: var(--nav-text, #555);
    opacity: 0.7;
}

.feature-divider {
    width: 1px;
    background: var(--nav-border, rgba(0, 0, 0, 0.08));
    margin: 16px 32px;
    align-self: stretch;
}

/* === RESPONSIVE === */
@media (max-width: 1399px) {
    .hero-container {
        text-align: center;
        padding: 90px 0 80px;
    }

    .eyebrow {
        margin: 0 auto 1.5rem;
    }

    .hero-subtitle {
        margin: 0 auto 3rem;
    }

    .hero-actions {
        justify-content: center;
    }

    .car-wrapper {
        display: none !important;
    }
}

@media (max-width: 900px) {
    .feature-divider {
        margin: 16px 16px;
    }

    .feature-label {
        font-size: 0.72rem;
    }
}

@media (max-width: 768px) {
    .features-inner {
        flex-direction: column;
        gap: 0;
    }

    .feature-item {
        padding: 18px 0;
        border-bottom: 1px solid var(--nav-border, rgba(0, 0, 0, 0.07));
    }

    .feature-item:last-child {
        border-bottom: none;
    }

    .feature-divider {
        display: none;
    }

    .hero-actions {
        flex-direction: column;
        align-items: center;
    }

    .btn-primary-hero {
        width: 100%;
        max-width: 360px;
        justify-content: center;
    }
}
</style>