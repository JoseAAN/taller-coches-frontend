<template>
    <div class="about-page">

        <!-- HERO -->
        <section class="hero-section">
            <div class="hero-image-wrap">
                <div class="hero-img-placeholder">
                    <img src="@/assets/img-nosotros/clean.png" alt="AutoClean hero" />
                </div>
                <div class="hero-overlay"></div>
            </div>
            <div class="hero-content">
                <span class="hero-eyebrow">Polígono Industrial de Arinaga</span>
                <h1 class="hero-title">
                    Tu vehículo merece
                    <span class="hero-title-highlight">lo mejor.</span>
                    <br>Sin perder el tiempo.
                </h1>
                <p class="hero-subtitle">
                    Reserva tu cita online en segundos. Sin llamadas, sin esperas,
                    sin complicaciones. AutoClean al alcance de tu mano, 24/7.
                </p>
                <div class="hero-actions">
                    <router-link to="/appointments" class="btn-cta-primary">
                        <span class="material-symbols-outlined">calendar_month</span>
                        Reserva tu cita online
                    </router-link>
                    <router-link to="/services" class="btn-cta-secondary">
                        Ver servicios
                        <span class="material-symbols-outlined">arrow_forward</span>
                    </router-link>
                </div>
            </div>
        </section>

        <!-- BENEFICIOS -->
        <section class="benefits-section">
            <div class="benefits-intro">
                <span class="section-eyebrow">Por qué elegirnos</span>
                <h2 class="section-title">Comodidad tecnológica.<br>Calidad premium.</h2>
            </div>
            <div class="benefits-grid">
                <div class="benefit-card" v-for="benefit in benefits" :key="benefit.title">
                    <div class="benefit-icon-wrap">
                        <span class="material-symbols-outlined">{{ benefit.icon }}</span>
                    </div>
                    <h3 class="benefit-title">{{ benefit.title }}</h3>
                    <p class="benefit-desc">{{ benefit.desc }}</p>
                </div>
            </div>
        </section>

        <!-- HISTORIA / MISIÓN -->
        <section class="mission-section">
            <div class="mission-label">
                <span class="label-line"></span>
                <span class="label-text">Nuestra misión</span>
            </div>
            <div class="mission-grid">
                <div class="mission-visual">
                    <div class="mission-img-wrap">
                        <img src="@/assets/img-nosotros/Squad.png" alt="Equipo AutoClean" class="mission-img" />
                    </div>
                    <div class="mission-badge">
                        <span class="material-symbols-outlined badge-icon">verified</span>
                        <div>
                            <span class="badge-number">100%</span>
                            <span class="badge-label">Compromiso de calidad</span>
                        </div>
                    </div>
                </div>
                <div class="mission-text">
                    <h2 class="section-title">Nacimos para modernizar el cuidado del automóvil</h2>
                    <p class="mission-paragraph">
                        En AutoClean sabemos que tu tiempo es valioso. Cuidar de tu vehículo no debería
                        implicar perder la mañana en llamadas telefónicas ni esperar turnos interminables.
                    </p>
                    <p class="mission-paragraph">
                        Ubicados en el Polígono Industrial de Arinaga, hemos creado una plataforma digital
                        donde tú tienes el control absoluto: consulta servicios, adquiere productos de
                        mantenimiento y reserva tu hora exacta desde cualquier lugar y en cualquier momento.
                    </p>
                    <p class="mission-paragraph">
                        Nuestro compromiso es doble — un acabado <strong>premium</strong> para tu vehículo
                        y un uso <strong>responsable y sostenible</strong> de los recursos.
                    </p>
                    <div class="mission-pills">
                        <span class="pill">
                            <span class="material-symbols-outlined">eco</span>
                            Productos sostenibles
                        </span>
                        <span class="pill">
                            <span class="material-symbols-outlined">schedule</span>
                            Reservas 24/7
                        </span>
                        <span class="pill">
                            <span class="material-symbols-outlined">workspace_premium</span>
                            Acabado premium
                        </span>
                    </div>
                </div>
            </div>
        </section>

        <!-- ANTES / DESPUÉS -->
        <section class="gallery-section">
            <div class="gallery-header">
                <span class="section-eyebrow">Resultados reales</span>
                <h2 class="section-title centered">Antes y después</h2>
                <p class="gallery-subtitle">El resultado habla por sí solo. Deja que tu coche brille.</p>
            </div>
            <div class="gallery-grid">
                <div class="gallery-card" v-for="(item, i) in gallery" :key="i">
                    <div class="gallery-before">
                        <img :src="item.before" class="gallery-img" alt="Antes" />
                        <span class="gallery-badge before-badge">Antes</span>
                    </div>
                    <div class="gallery-arrow">
                        <span class="material-symbols-outlined">arrow_forward</span>
                    </div>
                    <div class="gallery-after">
                        <img :src="item.after" class="gallery-img" alt="Después" />
                        <span class="gallery-badge after-badge">Después</span>
                    </div>
                </div>
            </div>
        </section>

        <!-- EQUIPO -->
        <section class="team-section">
            <div class="team-header">
                <span class="section-eyebrow">Las personas</span>
                <h2 class="section-title centered">El equipo</h2>
                <p class="team-subtitle">
                    Desarrolladores enfocados en crear herramientas prácticas y escalables
                    aplicadas a un escenario real.
                </p>
            </div>
            <div class="team-grid">
                <div class="team-card" v-for="member in team" :key="member.name">
                    <div class="team-photo-wrap">
                        <img :src="member.img" :alt="member.name" class="team-photo-img"
                            :style="{ objectPosition: member.objectPosition || 'center top' }" />
                        <div class="team-photo-accent"></div>
                    </div>
                    <div class="team-info">
                        <h4 class="team-name">{{ member.name }}</h4>
                        <span class="team-role">{{ member.role }}</span>
                        <p class="team-bio">{{ member.bio }}</p>
                        <div class="team-stack">
                            <span class="stack-tag" v-for="tag in member.stack" :key="tag">{{ tag }}</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- CTA FINAL -->
        <section class="cta-section">
            <div class="cta-bg"></div>
            <div class="cta-content">
                <h2 class="cta-title">¿Tu coche listo para brillar?</h2>
                <p class="cta-desc">
                    Reserva en segundos. Sin llamadas. Sin esperas.
                    AutoClean disponible para ti las 24 horas del día.
                </p>
                <div class="cta-actions">
                    <router-link to="/appointments" class="btn-primary">
                        <span class="material-symbols-outlined">calendar_month</span>
                        Reservar cita ahora
                    </router-link>
                    <router-link to="/products" class="btn-secondary">
                        <span class="material-symbols-outlined">shopping_bag</span>
                        Ver productos
                    </router-link>
                </div>
            </div>
        </section>

    </div>
</template>

<script>
import anibalImg from '@/assets/img-nosotros/Anibal.png';
import adexeImg from '@/assets/img-nosotros/Adexe.jpeg';
import danielImg from '@/assets/img-nosotros/Daniel.png';
import joseImg from '@/assets/img-nosotros/Jose.png';

import cochesucio1 from '@/assets/img-nosotros/cocheSucio1.png';
import cochesucio2 from '@/assets/img-nosotros/cocheSucio2.png';
import cochesucio3 from '@/assets/img-nosotros/cocheSucio3.png';

import cocheLimpio1 from '@/assets/img-nosotros/cocheLimpio1.png';
import cocheLimpio2 from '@/assets/img-nosotros/cocheLimpio2.png';
import cocheLimpio3 from '@/assets/img-nosotros/cocheLimpio3.png';

export default {
    name: 'AboutUs',
    data() {
        return {
            benefits: [
                {
                    icon: 'schedule',
                    title: 'Gestión de citas 24/7',
                    desc: 'Sin llamadas. Sin esperas. Reserva tu hora exacta desde cualquier dispositivo, en cualquier momento.'
                },
                {
                    icon: 'eco',
                    title: 'Productos sostenibles',
                    desc: 'Usamos productos eficientes y respetuosos con el medio ambiente. Calidad premium sin impacto innecesario.'
                },
                {
                    icon: 'location_on',
                    title: 'Tu centro en Arinaga',
                    desc: 'Ubicados estratégicamente en el Polígono Industrial de Arinaga, accesibles y listos para atenderte.'
                },
                {
                    icon: 'workspace_premium',
                    title: 'Acabado de detalle',
                    desc: 'Cada vehículo recibe un tratamiento minucioso. Tu coche sale de aquí como si fuera nuevo.'
                }
            ],
            gallery: [
                { before: cochesucio1, after: cocheLimpio1 },
                { before: cochesucio3, after: cocheLimpio3 },
                { before: cochesucio2, after: cocheLimpio2 }
            ],
            team: [
                {
                    name: 'Anibal Correa Santana',
                    role: 'Frontend Developer',
                    bio: 'Responsable de la interfaz de usuario y la experiencia del cliente.',
                    stack: ['Vue.js', 'SCSS', 'JavaScript'],
                    img: anibalImg,
                    objectPosition: 'center top'   // ajusta: 'center', 'top', '50% 20%', etc.
                },
                {
                    name: 'Jose Antonio Alonso Navarro',
                    role: 'Backend Developer',
                    bio: 'Arquitecto de la API REST y la lógica de negocio de la plataforma.',
                    stack: ['Node.js', 'REST API', 'SQL'],
                    img: joseImg,
                    objectPosition: 'center 15%'
                },
                {
                    name: 'Adexe Monzón Santana',
                    role: 'Full Stack Developer',
                    bio: 'Integración entre sistemas y despliegue de la infraestructura.',
                    stack: ['Vue.js', 'Node.js', 'Docker'],
                    img: adexeImg,
                    objectPosition: 'center 50%'
                },
                {
                    name: 'Daniel Monzón Santana',
                    role: 'Full Stack Developer',
                    bio: 'Arquitecto del sistema e integrador de la plataforma.',
                    stack: ['Vue.js', 'Node.js', 'AWS'],
                    img: danielImg,
                    objectPosition: 'center top'
                }
            ]
        }
    },
    mounted() {
        document.title = "Nosotros"
    }
}
</script>

<style scoped>
/* ── BASE ── */
.about-page {
    color: var(--nav-text);
    overflow-x: hidden;
}

/* ── HERO ── */
.hero-section {
    position: relative;
    min-height: 88vh;
    display: flex;
    align-items: flex-end;
    overflow: hidden;
}

.hero-image-wrap {
    position: absolute;
    inset: 0;
    z-index: 0;
}

.hero-img-placeholder {
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
    position: relative;
    overflow: hidden;
}

.hero-img-placeholder img {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
}

.hero-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(to top,
            rgba(0, 0, 0, 0.85) 0%,
            rgba(0, 0, 0, 0.4) 50%,
            rgba(0, 0, 0, 0.1) 100%);
}

.hero-content {
    position: relative;
    z-index: 1;
    padding: 4rem;
    max-width: 760px;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
}

.hero-eyebrow {
    font-size: 0.78rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 3px;
    color: #52b155;
}

.hero-title {
    font-size: clamp(2.4rem, 5vw, 4rem);
    font-weight: 900;
    line-height: 1.05;
    letter-spacing: -2px;
    color: #fff;
    margin: 0;
}

.hero-title-highlight {
    color: #52b155;
}

.hero-subtitle {
    font-size: 1.1rem;
    line-height: 1.6;
    color: rgba(255, 255, 255, 0.7);
    max-width: 480px;
    margin: 0;
}

.hero-actions {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
    align-items: center;
    margin-top: 0.5rem;
}

.btn-cta-primary {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    padding: 14px 32px;
    background: #52b155;
    color: #fff;
    border-radius: 12px;
    font-weight: 800;
    font-size: 1rem;
    text-decoration: none;
    transition: all 0.25s ease;
    box-shadow: 0 8px 24px rgba(82, 177, 85, 0.4);
}

.btn-cta-primary:hover {
    background: #469c49;
    transform: translateY(-2px);
    box-shadow: 0 12px 30px rgba(82, 177, 85, 0.5);
}

.btn-cta-secondary {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 14px 24px;
    background: rgba(255, 255, 255, 0.12);
    color: #fff;
    border-radius: 12px;
    font-weight: 700;
    font-size: 0.95rem;
    text-decoration: none;
    border: 1px solid rgba(255, 255, 255, 0.2);
    backdrop-filter: blur(8px);
    transition: all 0.25s ease;
}

.btn-cta-secondary:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: translateY(-2px);
}

/* ── BENEFITS ── */
.benefits-section {
    padding: 5rem 4rem;
    border-bottom: 1px solid var(--nav-border, #ddd);
}

.benefits-intro {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    margin-bottom: 3rem;
}

.section-eyebrow {
    font-size: 0.78rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 3px;
    color: #52b155;
}

.section-title {
    font-size: clamp(1.6rem, 3vw, 2.4rem);
    font-weight: 900;
    letter-spacing: -1px;
    line-height: 1.15;
    margin: 0;
    color: var(--nav-text);
}

.section-title.centered {
    text-align: center;
}

.benefits-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 1.5rem;
}

.benefit-card {
    padding: 2rem 1.5rem;
    border-radius: 16px;
    border: 1px solid var(--nav-border, #ddd);
    background: var(--nav-bg);
    display: flex;
    flex-direction: column;
    gap: 12px;
    transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;
}

.benefit-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 32px rgba(82, 177, 85, 0.1);
    border-color: rgba(82, 177, 85, 0.35);
}

.benefit-icon-wrap {
    width: 48px;
    height: 48px;
    border-radius: 12px;
    background: rgba(82, 177, 85, 0.1);
    display: flex;
    align-items: center;
    justify-content: center;
}

.benefit-icon-wrap .material-symbols-outlined {
    font-size: 24px;
    color: #52b155;
}

.benefit-title {
    font-size: 1rem;
    font-weight: 800;
    letter-spacing: -0.3px;
    margin: 0;
    color: var(--nav-text);
}

.benefit-desc {
    font-size: 0.88rem;
    line-height: 1.6;
    opacity: 0.6;
    margin: 0;
}

/* ── MISSION ── */
.mission-section {
    padding: 5rem 4rem;
    border-bottom: 1px solid var(--nav-border, #ddd);
}

.mission-label {
    display: flex;
    align-items: center;
    gap: 16px;
    margin-bottom: 3rem;
}

.label-line {
    width: 40px;
    height: 2px;
    background: #52b155;
    flex-shrink: 0;
}

.label-text {
    font-size: 0.78rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 3px;
    color: #52b155;
}

.mission-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 4rem;
    align-items: center;
}

.mission-visual {
    position: relative;
}

.mission-img-wrap {
    aspect-ratio: 4/3;
    border-radius: 20px;
    overflow: hidden;
    border: 1px solid var(--nav-border, #ddd);
}

.mission-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center top;
    display: block;
}

.mission-badge {
    position: absolute;
    bottom: -16px;
    right: -16px;
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 14px 18px;
    background: var(--nav-bg);
    border: 1px solid var(--nav-border, #ddd);
    border-radius: 14px;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
}

.badge-icon {
    font-size: 28px;
    color: #52b155;
}

.badge-number {
    display: block;
    font-size: 1.2rem;
    font-weight: 900;
    color: #52b155;
    line-height: 1;
    letter-spacing: -1px;
}

.badge-label {
    display: block;
    font-size: 0.72rem;
    font-weight: 600;
    opacity: 0.5;
    text-transform: uppercase;
    letter-spacing: 1px;
}

.mission-paragraph {
    font-size: 1rem;
    line-height: 1.8;
    opacity: 0.65;
    margin: 0 0 1rem 0;
}

.mission-paragraph strong {
    color: var(--nav-text);
    opacity: 1;
    font-weight: 800;
}

.mission-pills {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-top: 0.5rem;
}

.pill {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 6px 14px;
    border-radius: 20px;
    background: rgba(82, 177, 85, 0.08);
    border: 1px solid rgba(82, 177, 85, 0.2);
    color: #52b155;
    font-size: 0.82rem;
    font-weight: 700;
}

.pill .material-symbols-outlined {
    font-size: 16px;
}

/* ── GALLERY ── */
.gallery-section {
    padding: 5rem 4rem;
    background: rgba(82, 177, 85, 0.02);
    border-bottom: 1px solid var(--nav-border, #ddd);
}

.gallery-header {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.75rem;
    margin-bottom: 3rem;
    text-align: center;
}

.gallery-subtitle {
    font-size: 1rem;
    opacity: 0.55;
    margin: 0;
}

.gallery-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1.5rem;
}

.gallery-card {
    display: flex;
    align-items: center;
    gap: 0.75rem;
}

.gallery-before,
.gallery-after {
    flex: 1;
    position: relative;
    min-width: 0;
}

.gallery-img {
    width: 100%;
    aspect-ratio: 4/3;
    object-fit: cover;
    border-radius: 14px;
    display: block;
}

.gallery-badge {
    position: absolute;
    top: 8px;
    left: 8px;
    font-size: 0.68rem;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 1px;
    padding: 3px 10px;
    border-radius: 20px;
}

.before-badge {
    background: rgba(0, 0, 0, 0.5);
    color: #fff;
}

.after-badge {
    background: #52b155;
    color: #fff;
}

.gallery-arrow {
    flex-shrink: 0;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: #52b155;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
}

.gallery-arrow .material-symbols-outlined {
    font-size: 16px;
}

/* ── TEAM ── */
.team-section {
    padding: 5rem 4rem;
}

.team-header {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    margin-bottom: 4rem;
    text-align: center;
}

.team-subtitle {
    font-size: 1rem;
    line-height: 1.7;
    opacity: 0.6;
    max-width: 560px;
    margin: 0;
}

.team-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 1.5rem;
}

.team-card {
    display: flex;
    flex-direction: column;
    gap: 1.2rem;
    padding: 2rem;
    border-radius: 20px;
    border: 1px solid var(--nav-border, #ddd);
    background: var(--nav-bg);
    transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;
}

.team-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 16px 40px rgba(82, 177, 85, 0.1);
    border-color: rgba(82, 177, 85, 0.4);
}

.team-photo-wrap {
    position: relative;
    width: 72px;
    height: 72px;
}

.team-photo-img {
    width: 72px;
    height: 72px;
    border-radius: 18px;
    object-fit: cover;
    object-position: center top;
    display: block;
    position: relative;
    z-index: 1;
    border: 2px solid rgba(82, 177, 85, 0.25);
}

.team-photo-accent {
    position: absolute;
    bottom: -4px;
    right: -4px;
    width: 20px;
    height: 20px;
    border-radius: 5px;
    background: #52b155;
    z-index: 0;
}

.team-info {
    display: flex;
    flex-direction: column;
    gap: 5px;
}

.team-name {
    font-size: 0.95rem;
    font-weight: 800;
    letter-spacing: -0.3px;
    margin: 0;
    color: var(--nav-text);
}

.team-role {
    font-size: 0.7rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 1.5px;
    color: #52b155;
}

.team-bio {
    font-size: 0.83rem;
    line-height: 1.6;
    opacity: 0.6;
    margin: 4px 0 0 0;
}

.team-stack {
    display: flex;
    flex-wrap: wrap;
    gap: 5px;
    margin-top: 4px;
}

.stack-tag {
    font-size: 0.68rem;
    font-weight: 700;
    padding: 2px 8px;
    border-radius: 20px;
    background: var(--nav-border, #f0f0f0);
    color: var(--nav-text);
    opacity: 0.7;
}

/* ── CTA ── */
.cta-section {
    position: relative;
    padding: 6rem 4rem;
    overflow: hidden;
    border-top: 1px solid var(--nav-border, #ddd);
}

.cta-bg {
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, rgba(82, 177, 85, 0.07) 0%, transparent 60%);
    pointer-events: none;
}

.cta-content {
    position: relative;
    z-index: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 1.5rem;
    max-width: 560px;
    margin: 0 auto;
}

.cta-title {
    font-size: clamp(2rem, 3.5vw, 3rem);
    font-weight: 900;
    letter-spacing: -1.5px;
    margin: 0;
    color: var(--nav-text);
}

.cta-desc {
    font-size: 1.05rem;
    line-height: 1.7;
    opacity: 0.6;
    margin: 0;
}

.cta-actions {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
    justify-content: center;
}

.btn-primary {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 13px 28px;
    background: #52b155;
    color: #fff;
    border-radius: 12px;
    font-weight: 700;
    font-size: 0.95rem;
    text-decoration: none;
    transition: all 0.2s ease;
}

.btn-primary:hover {
    background: #469c49;
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(82, 177, 85, 0.3);
}

.btn-secondary {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 13px 28px;
    background: transparent;
    color: var(--nav-text);
    border-radius: 12px;
    border: 2px solid var(--nav-border, #ddd);
    font-weight: 700;
    font-size: 0.95rem;
    text-decoration: none;
    transition: all 0.2s ease;
}

.btn-secondary:hover {
    background: var(--nav-border, #f0f0f0);
    transform: translateY(-2px);
}

/* ── RESPONSIVE ── */
@media (max-width: 1100px) {
    .benefits-grid {
        grid-template-columns: repeat(2, 1fr);
    }

    .team-grid {
        grid-template-columns: repeat(2, 1fr);
    }
}

@media (max-width: 900px) {
    .hero-content {
        padding: 3rem 2rem;
    }

    .benefits-section,
    .mission-section,
    .gallery-section,
    .team-section,
    .cta-section {
        padding: 3rem 2rem;
    }

    .mission-grid {
        grid-template-columns: 1fr;
        gap: 3rem;
    }

    .mission-badge {
        bottom: -12px;
        right: 12px;
    }

    .gallery-grid {
        grid-template-columns: 1fr;
    }
}

@media (max-width: 600px) {

    .benefits-grid,
    .team-grid {
        grid-template-columns: 1fr;
    }

    .hero-title {
        letter-spacing: -1px;
    }

    .hero-actions {
        flex-direction: column;
        align-items: flex-start;
    }
}
</style>