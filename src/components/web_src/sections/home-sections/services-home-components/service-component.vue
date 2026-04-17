<template>
  <div class="services-section">
    <div class="services-inner">

    <div class="section-header">
      <div class="section-tag">
        <span class="tag-line"></span>
        <span>Nuestros Servicios</span>
      </div>
      <h2 class="section-title">Lo que hacemos,<br><em>excepcionalmente bien.</em></h2>
      <p class="section-desc">
        Cada servicio está diseñado para devolver a tu vehículo su mejor versión.
      </p>
    </div>

    <div class="services-grid">
      <article
        v-for="(service, index) in services"
        :key="service.id"
        class="service-card"
        @click="goToDetails(service.id)"
      >
        <div class="card-index">{{ String(index + 1).padStart(2, '0') }}</div>

        <div class="card-image-wrap">
          <img
            :src="getImageUrl(service.image)"
            :alt="service.name"
            class="card-image"
          >
          <div class="image-overlay"></div>
        </div>

        <div class="card-body">
          <div class="card-category">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <circle cx="6" cy="6" r="4.5" stroke="#52b155" stroke-width="1.2"/>
              <circle cx="6" cy="6" r="2" fill="#52b155"/>
            </svg>
            <span>Detailing</span>
          </div>

          <h3 class="card-title">{{ service.name }}</h3>
          <p class="card-desc">{{ service.description }}</p>

          <div class="card-footer-row">
            <div class="card-price">
              <span class="price-label">Desde</span>
              <span class="price-value">{{ parseInt(service.price) }}€</span>
            </div>
            <button class="card-cta" @click.stop="goToDetails(service.id)">
              <span>Reservar</span>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M2.5 7h9M8 3.5L11.5 7 8 10.5" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>
          </div>
        </div>

        <div class="card-accent-line"></div>
      </article>
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
    goToDetails(id) {
      this.$router.push({ name: 'ServiceDetails', params: { id } })
    },

    getServicesOnHome() {
      fetch(`${this.$BASE_URL}/v1/services/services-home`)
        .then(response => response.json())
        .then(data => {
          this.services = data.data;
        })
        .catch(error => {
          console.error('Error fetching services:', error);
        });
    },

    getImageUrl(imageName) {
      if (!imageName) {
        return 'https://via.placeholder.com/600x400?text=Servicio';
      }
      return new URL(`../../../../../assets/img-servicios/${imageName}`, import.meta.url).href;
    }
  },

  mounted() {
    this.getServicesOnHome();
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,300&display=swap');

/* === SECTION HEADER === */
.services-section {
  width: 100%;
  background: linear-gradient(160deg, #071A2E 0%, #0a1f33 55%, #0d2a3e 100%);
  padding: 50px 0 80px;
}

.services-inner {
  max-width: 1280px;
  margin: 0 auto;
  padding-left: 2rem;
  padding-right: 2rem;
}

.section-header {
  text-align: center;
  margin-bottom: 64px;
}

.section-tag {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  font-family: 'DM Sans', sans-serif;
  font-size: 0.78rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: #52b155;
  margin-bottom: 20px;
}

.tag-line {
  display: block;
  width: 28px;
  height: 1.5px;
  background: #52b155;
}

.section-title {
  font-family: 'Syne', sans-serif;
  font-weight: 800;
  font-size: clamp(1.5rem, 3vw, 2.2rem);
  line-height: 1.15;
  letter-spacing: -0.03em;
  color: #fff;
  margin: 0 0 16px;
  word-break: break-word;
  overflow-wrap: break-word;
}

.section-title em {
  font-style: italic;
  color: #52b155;
  display: inline-block;
}

.section-desc {
  font-family: 'DM Sans', sans-serif;
  font-size: 0.88rem;
  font-weight: 300;
  color: rgba(255,255,255,0.55);
  max-width: 440px;
  margin: 0 auto;
}

/* === GRID === */
.services-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
}

/* === CARD === */
.service-card {
  position: relative;
  background: var(--nav-bg, #fff);
  border: 1px solid var(--nav-border, rgba(0,0,0,0.08));
  border-radius: 20px;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94),
              box-shadow 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94),
              border-color 0.3s ease;
  display: flex;
  flex-direction: column;
}

.service-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 24px 60px rgba(0,0,0,0.12);
  border-color: rgba(82, 177, 85, 0.25);
}

.service-card:hover .card-accent-line {
  transform: scaleX(1);
}

.service-card:hover .card-image {
  transform: scale(1.06);
}

.service-card:hover .card-cta {
  background: #52b155;
  color: #fff;
  border-color: #52b155;
}

/* Index number */
.card-index {
  position: absolute;
  top: 18px;
  right: 18px;
  font-family: 'Syne', sans-serif;
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  color: rgba(255,255,255,0.9);
  background: rgba(0,0,0,0.3);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255,255,255,0.15);
  border-radius: 100px;
  padding: 4px 10px;
  z-index: 3;
}

/* Image */
.card-image-wrap {
  position: relative;
  width: 100%;
  height: 230px;
  overflow: hidden;
  flex-shrink: 0;
}

.card-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  transition: transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.image-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to bottom,
    transparent 50%,
    rgba(0,0,0,0.25) 100%
  );
  pointer-events: none;
}

/* Body */
.card-body {
  padding: 16px;
  display: flex;
  flex-direction: column;
  flex: 1;
}

.card-category {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-family: 'DM Sans', sans-serif;
  font-size: 0.72rem;
  font-weight: 500;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #52b155;
  margin-bottom: 10px;
}

.card-title {
  font-family: 'Syne', sans-serif;
  font-weight: 700;
  font-size: 1rem;
  line-height: 1.2;
  letter-spacing: -0.02em;
  color: var(--nav-text, #0a1f33);
  margin: 0 0 10px;
}

.card-desc {
  font-family: 'DM Sans', sans-serif;
  font-size: 0.88rem;
  font-weight: 300;
  line-height: 1.6;
  color: var(--nav-text, #444);
  opacity: 0.65;
  margin: 0 0 12px;
  flex: 1;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Footer row */
.card-footer-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: auto;
  padding-top: 12px;
  border-top: 1px solid var(--nav-border, rgba(0,0,0,0.07));
}

.card-price {
  display: flex;
  flex-direction: column;
  gap: 1px;
}

.price-label {
  font-family: 'DM Sans', sans-serif;
  font-size: 0.7rem;
  font-weight: 400;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--nav-text, #888);
  opacity: 0.6;
}

.price-value {
  font-family: 'Syne', sans-serif;
  font-weight: 700;
  font-size: 1.15rem;
  letter-spacing: -0.02em;
  color: var(--nav-text, #0a1f33);
}

/* CTA button */
.card-cta {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 18px;
  border: 1.5px solid var(--nav-border, rgba(0,0,0,0.12));
  border-radius: 100px;
  background: transparent;
  color: var(--nav-text, #0a1f33);
  font-family: 'DM Sans', sans-serif;
  font-size: 0.82rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.25s ease;
}

/* Accent bottom line */
.card-accent-line {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, #52b155, #7dd87f);
  transform: scaleX(0);
  transform-origin: left center;
  transition: transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

/* === DARK MODE === */
[data-theme="dark"] .card-image-wrap {
  background-color: #0f172a;
}

[data-theme="dark"] .service-card:hover {
  box-shadow: 0 24px 60px rgba(0,0,0,0.4);
}

/* === RESPONSIVE === */
@media (max-width: 1100px) {
  .services-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 640px) {
  .services-section {
    padding: 60px 1.25rem;
  }
  .services-grid {
    grid-template-columns: 1fr;
    gap: 1.25rem;
  }
  .section-title {
    font-size: clamp(1.4rem, 8vw, 1.8rem);
  }
}
</style>