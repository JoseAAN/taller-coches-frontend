<template>
  <div class="page-wrapper">
    <header>
      <hero-component></hero-component>
    </header>

    <main>
      <section class="services-section mb-5">
        <div class="section-title-container">
          <h2 class="main-title">Te podría interesar</h2>
          <div class="title-underline"></div>
        </div>
        <service-component class="mt-4"></service-component>
      </section>

      <section class="comparison-section mt-5">
        <div class="section-title-container">
          <span class="subtitle text-uppercase">Resultados Reales</span>
          <h2 class="main-title">La diferencia está en los detalles</h2>
          <p class="section-description">Desliza la barra para comparar el estado de llegada frente a nuestro acabado
            profesional.</p>
        </div>

        <div class="comparator-wrapper">
          <slider-comparator :before="cochesucio" :after="cochelimpio" />
        </div>
      </section>

    </main>
  </div>
</template>

<script>
import HeroComponent from '../sections/home-sections/hero-component.vue';
import ServiceComponent from '../sections/home-sections/services-components/service-component.vue';
import SliderComparator from '../UI/slider-comparator.vue';
import FooterComponent from '../shared/main-footer.vue';

import cochelimpio from "@/assets/cochelimpio.jpeg";
import cochesucio from "@/assets/cochesucio.jpeg";

export default {
  components: {
    HeroComponent,
    ServiceComponent,
    SliderComparator,
    FooterComponent
  },
  data() {
    return {
      cochelimpio,
      cochesucio,
      user_verfied: false,
      user: {}
    }
  },
  methods: {
    checkUser() {
      const token = localStorage.getItem('user_token');
      if (token) {
        fetch(`${this.$BASE_URL}/user`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json'
          }
        })
          .then(response => {
            if (!response.ok) throw new Error();
            return response.json();
          })
          .then(data => {
            this.user_verfied = true;
            this.user = data;
          })
          .catch(() => {
            this.user_verfied = false;
            localStorage.removeItem('user_token');
          });
      }
    }
  },
  mounted() {
    this.checkUser();
  }
}
</script>

<style scoped>
.services-section {
  margin-bottom: 5rem;
}
.section-title-container {
  text-align: center;
  margin-top: 4rem;
  margin-bottom: 2rem;
  padding: 0 1.5rem;
}

.subtitle {
  display: block;
  font-size: 0.85rem;
  font-weight: 700;
  color: #52b155;
  letter-spacing: 2px;
  margin-bottom: 0.5rem;
}

.main-title {
  font-size: 2.5rem;
  font-weight: 850;
  color: var(--nav-text);
  margin: 0;
  line-height: 1.2;
}

.section-description {
  color: var(--nav-text);
  opacity: 0.8;
  max-width: 600px;
  margin: 1rem auto 0;
  font-size: 1.1rem;
}

.title-underline {
  width: 100px;
  height: 4px;
  background: #52b155;
  margin: 1.2rem auto 0;
  border-radius: 10px;
}

.comparator-wrapper {
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 1rem 5rem 1rem;
}

@media (max-width: 768px) {
  .main-title {
    font-size: 1.8rem;
  }

  .section-title-container {
    margin-top: 3rem;
  }

  .section-description {
    font-size: 1rem;
  }
}
</style>