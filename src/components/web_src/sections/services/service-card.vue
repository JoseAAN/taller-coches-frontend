<template>
  <div class="service-card" @click="goToDetails(service.id)">

    <div class="card-image-wrap">
      <img :src="getImageUrl(service.image)" :alt="service.name" class="card-img">
      <div class="card-img-overlay"></div>
      <div class="card-badge">Detailing</div>
    </div>

    <div class="card-body">
      <h5 class="card-title">{{ service.name }}</h5>

      <p class="card-desc">{{ service.description }}</p>

      <div class="card-footer-row">
        <div class="card-price-block">
          <span class="price-from">Desde</span>
          <BasePrice :amount="service.price" :locale="locale" :currency="currency" size="md" />
        </div>
        <button class="btn-book" @click.stop="bookService">
          <span>Reservar</span>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M2.5 7h9M8 3.5L11.5 7 8 10.5" stroke="currentColor" stroke-width="1.4"
              stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      </div>
    </div>

    <div class="card-accent"></div>
  </div>
</template>

<script>
import BasePrice from '../../UI/global-price.vue'

export default {
  name: 'ServiceCard',
  components: { BasePrice },
  props: {
    service: { type: Object, required: true },
    locale: { type: String, default: 'es' },
    currency: { type: String, default: 'EUR' }
  },
  methods: {
    getImageUrl(imageName) {
      if (!imageName) return 'https://placehold.co/600x400/e2e8f0/475569?text=Sin+Imagen';
      if (imageName.startsWith('http')) return imageName;
      try {
        return new URL(`../../../../assets/img-servicios/${imageName}`, import.meta.url).href;
      } catch (error) {
        console.error("Error cargando la imagen local:", error);
        return 'https://placehold.co/600x400/e2e8f0/475569?text=Error';
      }
    },
    bookService() {
      this.$router.push({
        name: 'AppointmentCalendar',
        query: { service_id: this.service.id }
      });
    },
    goToDetails(serviceId) {
      this.$router.push({ name: 'ServiceDetails', params: { id: serviceId } });
    }
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,300&display=swap');

.service-card {
  position: relative;
  background: var(--nav-bg, #fff);
  border: 1px solid var(--nav-border, rgba(0,0,0,0.08));
  border-radius: 20px;
  overflow: hidden;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  transition: transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94),
              box-shadow 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94),
              border-color 0.3s ease;
}

.service-card:hover {
  transform: translateY(-7px);
  box-shadow: 0 24px 56px rgba(0,0,0,0.13);
  border-color: rgba(82, 177, 85, 0.3);
}

.service-card:hover .card-img {
  transform: scale(1.06);
}

.service-card:hover .card-accent {
  transform: scaleX(1);
}

.service-card:hover .btn-book {
  background: #52b155;
  color: #fff;
  border-color: #52b155;
}

/* Image */
.card-image-wrap {
  position: relative;
  width: 100%;
  height: 180px;
  overflow: hidden;
  flex-shrink: 0;
  background: #e8edf2;
}

.card-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  transition: transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.card-img-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to bottom, transparent 45%, rgba(0,0,0,0.22) 100%);
  pointer-events: none;
}

.card-badge {
  position: absolute;
  top: 14px;
  left: 14px;
  font-family: 'DM Sans', sans-serif;
  font-size: 0.65rem;
  font-weight: 500;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: rgba(255,255,255,0.92);
  background: rgba(0,0,0,0.28);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255,255,255,0.15);
  border-radius: 100px;
  padding: 4px 10px;
}

/* Body */
.card-body {
  padding: 18px 18px 16px;
  display: flex;
  flex-direction: column;
  flex: 1;
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
  font-size: 0.82rem;
  font-weight: 300;
  line-height: 1.6;
  color: var(--nav-text, #444);
  opacity: 0.65;
  margin: 0 0 16px;
  flex: 1;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Footer */
.card-footer-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 14px;
  border-top: 1px solid var(--nav-border, rgba(0,0,0,0.07));
  margin-top: auto;
}

.card-price-block {
  display: flex;
  flex-direction: column;
  gap: 1px;
}

.price-from {
  font-family: 'DM Sans', sans-serif;
  font-size: 0.65rem;
  font-weight: 400;
  text-transform: uppercase;
  letter-spacing: 0.07em;
  color: var(--nav-text, #888);
  opacity: 0.55;
}

.btn-book {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 9px 16px;
  border: 1.5px solid var(--nav-border, rgba(0,0,0,0.12));
  border-radius: 100px;
  background: transparent;
  color: var(--nav-text, #0a1f33);
  font-family: 'DM Sans', sans-serif;
  font-size: 0.78rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.25s ease;
}

/* Accent line bottom */
.card-accent {
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

/* Dark mode */
[data-theme="dark"] .card-image-wrap {
  background-color: #0f172a;
}

[data-theme="dark"] .service-card:hover {
  box-shadow: 0 24px 56px rgba(0,0,0,0.45);
}
</style>