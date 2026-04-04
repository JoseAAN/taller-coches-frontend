<template>
  <div v-if="service" class="details-page">

    <!-- Orbes decorativos de fondo -->
    <div class="bg-orb bg-orb--1" aria-hidden="true"></div>
    <div class="bg-orb bg-orb--2" aria-hidden="true"></div>

    <div class="details-container">

      <!-- LEFT -->
      <div class="details-left">

        <div class="image-frame">
          <img :src="getImageUrl(service.image)" :alt="service.name" class="details-img">
          <div class="image-overlay"></div>

          <!-- Badge índice -->
          <div class="img-index">01</div>

          <!-- Badge categoría flotante en imagen -->
          <div class="img-category-badge">
            <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
              <circle cx="4" cy="4" r="3" stroke="#52b155" stroke-width="1.1"/>
              <circle cx="4" cy="4" r="1.4" fill="#52b155"/>
            </svg>
            Detailing
          </div>
        </div>

        <!-- Features pills -->
        <div class="features-wrap" v-if="service.features && service.features.length">
          <span v-for="feature in service.features" :key="feature" class="feature-pill">
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
              <circle cx="5" cy="5" r="4" stroke="#52b155" stroke-width="1"/>
              <circle cx="5" cy="5" r="1.8" fill="#52b155"/>
            </svg>
            {{ feature }}
          </span>
        </div>

      </div>

      <!-- RIGHT -->
      <div class="details-right">

        <h2 class="details-title">{{ service.name }}</h2>

        <!-- Precio con fondo oscuro destacado -->
        <div class="price-block">
          <span class="price-label">Desde</span>
          <span class="price-amount">{{ parseInt(service.price) }}<em>€</em></span>
        </div>

        <p class="details-desc">{{ service.description }}</p>

        <!-- Trust items en grid 3 columnas -->
        <div class="trust-grid">
          <div class="trust-card">
            <span class="trust-icon-wrap">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <circle cx="8" cy="8" r="6.5" stroke="#52b155" stroke-width="1.2"/>
                <path d="M5 8l2.5 2.5L11 5.5" stroke="#52b155" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </span>
            <span>Servicio garantizado</span>
          </div>
          <div class="trust-card">
            <span class="trust-icon-wrap">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M8 1.5L2 4v4c0 3.2 2.5 5.8 6 6.5 3.5-.7 6-3.3 6-6.5V4L8 1.5z" stroke="#52b155" stroke-width="1.2" stroke-linejoin="round"/>
              </svg>
            </span>
            <span>Seguro incluido</span>
          </div>
          <div class="trust-card">
            <span class="trust-icon-wrap">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M1.5 8C1.5 4.41 4.41 1.5 8 1.5S14.5 4.41 14.5 8" stroke="#52b155" stroke-width="1.2" stroke-linecap="round"/>
                <path d="M12 2v3.5H8.5" stroke="#52b155" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </span>
            <span>Eco-friendly</span>
          </div>
        </div>

        <div class="divider"></div>

        <!-- CTA -->
        <div class="cta-row">
          <button @click="bookService" class="btn-reserve">
            <span>Reservar ahora</span>
            <span class="btn-icon">
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                <path d="M2.5 7.5h10M8.5 4L12 7.5 8.5 11" stroke="currentColor" stroke-width="1.4"
                  stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </span>
          </button>
          <p class="cta-note">Sin coste de cancelación hasta 24h antes</p>
        </div>

      </div>
    </div>

  </div>

  <div v-else class="loading-state">
    <div class="loading-spinner"></div>
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
    }
  },
  methods: {
    getImageUrl(imageName) {
      if (!imageName) return 'https://placehold.co/800x600/0a1f33/52b155?text=Sin+Imagen';
      if (imageName.startsWith('http')) return imageName;
      try {
        return new URL(`../../../../../assets/img-servicios/${imageName}`, import.meta.url).href;
      } catch {
        return 'https://placehold.co/800x600/0a1f33/52b155?text=Error';
      }
    },
    getService() {
      fetch(`${this.$BASE_URL}/v1/services/${this.serviceId}`)
        .then(res => {
          if (!res.ok) throw new Error("Error al recoger los datos del servicio");
          return res.json();
        })
        .then(data => this.service = data.data)
        .catch(err => console.error('Error al cargar servicio:', err));
    },
    bookService() {
      this.$router.push({
        name: 'AppointmentCalendar',
        query: { service_id: this.serviceId }
      });
    }
  },
  mounted() {
    this.serviceId = this.$route.params.id;
    this.getService();
  },
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,300&display=swap');

/* === PAGE === */
.details-page {
  min-height: 100vh;
  padding: 70px 2rem 90px;
  background: linear-gradient(160deg, #071A2E 0%, #0a1f33 55%, #0d2a3e 100%);
  position: relative;
  overflow: hidden;
}

/* Orbes decorativos de luz difusa, igual que el resto de secciones */
.bg-orb {
  position: absolute;
  border-radius: 50%;
  pointer-events: none;
  filter: blur(80px);
}

.bg-orb--1 {
  width: 500px;
  height: 500px;
  background: rgba(82, 177, 85, 0.06);
  top: -100px;
  right: -80px;
}

.bg-orb--2 {
  width: 400px;
  height: 400px;
  background: rgba(82, 177, 85, 0.04);
  bottom: 50px;
  left: -100px;
}

/* === CONTAINER === */
.details-container {
  max-width: 1080px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 1.15fr;
  gap: 4.5rem;
  align-items: start;
  position: relative;
  z-index: 1;
}

/* === LEFT === */
.details-left {
  position: sticky;
  top: 100px;
}

.image-frame {
  position: relative;
  border-radius: 20px;
  overflow: hidden;
  border: 1px solid rgba(255,255,255,0.07);
  box-shadow:
    0 0 0 1px rgba(82,177,85,0.08),
    0 32px 64px rgba(0,0,0,0.4);
}

.details-img {
  width: 100%;
  aspect-ratio: 16/10;
  object-fit: cover;
  display: block;
  transition: transform 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.image-frame:hover .details-img {
  transform: scale(1.05);
}

.image-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    160deg,
    rgba(7,26,46,0.1) 0%,
    transparent 40%,
    rgba(0,0,0,0.35) 100%
  );
  pointer-events: none;
}

/* Badge índice */
.img-index {
  position: absolute;
  top: 14px;
  right: 14px;
  font-family: 'Syne', sans-serif;
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  color: rgba(255,255,255,0.88);
  background: rgba(0,0,0,0.32);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255,255,255,0.14);
  border-radius: 100px;
  padding: 4px 10px;
}

/* Badge categoría en imagen */
.img-category-badge {
  position: absolute;
  bottom: 14px;
  left: 14px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-family: 'DM Sans', sans-serif;
  font-size: 0.7rem;
  font-weight: 500;
  letter-spacing: 0.09em;
  text-transform: uppercase;
  color: rgba(255,255,255,0.85);
  background: rgba(0,0,0,0.32);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255,255,255,0.14);
  border-radius: 100px;
  padding: 5px 12px;
}

/* Features pills */
.features-wrap {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 20px;
}

.feature-pill {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-family: 'DM Sans', sans-serif;
  font-size: 0.75rem;
  font-weight: 400;
  color: rgba(255,255,255,0.65);
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.09);
  border-radius: 100px;
  padding: 6px 13px;
  transition: border-color 0.2s ease, background 0.2s ease, color 0.2s ease;
  cursor: default;
}

.feature-pill:hover {
  border-color: rgba(82,177,85,0.45);
  background: rgba(82,177,85,0.06);
  color: rgba(255,255,255,0.85);
}

/* === RIGHT === */
.details-right {
  padding-top: 6px;
  display: flex;
  flex-direction: column;
}

/* Título */
.details-title {
  font-family: 'Syne', sans-serif;
  font-weight: 800;
  font-size: clamp(2rem, 4vw, 2.9rem);
  line-height: 1.08;
  letter-spacing: -0.03em;
  color: #fff;
  margin: 0 0 28px;
}

/* Bloque precio: panel oscuro con borde verde sutil */
.price-block {
  display: flex;
  align-items: baseline;
  gap: 10px;
  background: rgba(0,0,0,0.25);
  border: 1px solid rgba(82,177,85,0.2);
  border-radius: 16px;
  padding: 18px 22px;
  margin-bottom: 28px;
  position: relative;
  overflow: hidden;
}

/* Brillo sutil en esquina superior del bloque precio */
.price-block::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(82,177,85,0.35), transparent);
}

.price-label {
  font-family: 'DM Sans', sans-serif;
  font-size: 0.72rem;
  font-weight: 400;
  text-transform: uppercase;
  letter-spacing: 0.09em;
  color: rgba(255,255,255,0.3);
}

.price-amount {
  font-family: 'Syne', sans-serif;
  font-weight: 800;
  font-size: 2.4rem;
  letter-spacing: -0.04em;
  color: #52b155;
  line-height: 1;
}

.price-amount em {
  font-style: normal;
  font-size: 1.2rem;
  margin-left: 2px;
  opacity: 0.7;
}

/* Descripción */
.details-desc {
  font-family: 'DM Sans', sans-serif;
  font-size: 0.93rem;
  font-weight: 300;
  line-height: 1.8;
  color: rgba(255,255,255,0.5);
  margin: 0 0 28px;
}

/* Trust grid 3 columnas */
.trust-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  margin-bottom: 28px;
}

.trust-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 9px;
  padding: 14px 10px;
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.07);
  border-radius: 14px;
  font-family: 'DM Sans', sans-serif;
  font-size: 0.72rem;
  font-weight: 400;
  color: rgba(255,255,255,0.45);
  text-align: center;
  line-height: 1.3;
  transition: border-color 0.2s ease, background 0.2s ease;
}

.trust-card:hover {
  border-color: rgba(82,177,85,0.25);
  background: rgba(82,177,85,0.04);
}

.trust-icon-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Divisor */
.divider {
  width: 100%;
  height: 1px;
  background: rgba(255,255,255,0.07);
  margin-bottom: 28px;
}

/* CTA */
.cta-row {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.btn-reserve {
  display: inline-flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  background: #52b155;
  color: #fff;
  border: none;
  border-radius: 14px;
  padding: 16px 24px;
  font-family: 'DM Sans', sans-serif;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.25s ease, transform 0.25s ease, box-shadow 0.25s ease;
  width: 100%;
  position: relative;
  overflow: hidden;
}

/* Brillo interno sutil en el botón */
.btn-reserve::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: rgba(255,255,255,0.25);
}

.btn-reserve:hover {
  background: #469c49;
  transform: translateY(-2px);
  box-shadow: 0 14px 36px rgba(82,177,85,0.32);
}

.btn-reserve:active {
  transform: translateY(0);
}

.btn-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: rgba(255,255,255,0.15);
  border-radius: 8px;
  flex-shrink: 0;
  transition: background 0.2s ease;
}

.btn-reserve:hover .btn-icon {
  background: rgba(255,255,255,0.22);
}

.cta-note {
  font-family: 'DM Sans', sans-serif;
  font-size: 0.75rem;
  font-weight: 300;
  color: rgba(255,255,255,0.28);
  text-align: center;
  margin: 0;
  letter-spacing: 0.01em;
}

/* === LOADING === */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  gap: 16px;
  background: linear-gradient(160deg, #071A2E 0%, #0a1f33 100%);
}

.loading-spinner {
  width: 28px;
  height: 28px;
  border: 1.5px solid rgba(82,177,85,0.18);
  border-top-color: #52b155;
  border-radius: 50%;
  animation: spin 0.85s linear infinite;
}

.loading-state p {
  font-family: 'DM Sans', sans-serif;
  font-size: 0.8rem;
  color: rgba(255,255,255,0.3);
  letter-spacing: 0.04em;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* === RESPONSIVE === */
@media (max-width: 900px) {
  .details-container {
    grid-template-columns: 1fr;
    gap: 2.5rem;
  }

  .details-left {
    position: static;
  }

  .details-img {
    aspect-ratio: 16/9;  }

  .details-title {
    font-size: clamp(1.7rem, 6vw, 2.2rem);
  }

  .trust-grid {
    grid-template-columns: repeat(3, 1fr);
  }

  .details-page {
    padding: 44px 1.25rem 64px;
  }
}

@media (max-width: 480px) {
  .trust-grid {
    grid-template-columns: 1fr;
  }

  .trust-card {
    flex-direction: row;
    justify-content: flex-start;
    text-align: left;
  }
}
</style>