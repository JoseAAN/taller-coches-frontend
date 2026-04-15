<template>
  <div class="page-wrapper">
    <header>
      <hero-component></hero-component>
    </header>

    <main>
      <section class="services-section mb-5">
        <div class="section-title-container">
          <h2 class="main-title">Nuestros productos estrella</h2>
          <div class="title-underline"></div>
          <products-home-component></products-home-component>
        </div>
      </section>

      <service-component class="mt-4"></service-component>

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

      <contact-form />

    </main>
  </div>
</template>

<script>
import HeroComponent from '../sections/home-sections/hero-component.vue';
import ServiceComponent from '../sections/home-sections/services-home-components/service-component.vue';
import ProductsHomeComponent from '../sections/home-sections/products-best-sellers-components/products-home-component.vue';
import SliderComparator from '../UI/slider-comparator.vue';
import FooterComponent from '../shared/main-footer.vue';
import ContactForm from '../shared/ContactForm.vue';

import cochelimpio from "@/assets/cochelimpio.jpeg";
import cochesucio from "@/assets/cochesucio.jpeg";

export default {
  components: {
    HeroComponent,
    ServiceComponent,
    SliderComparator,
    FooterComponent,
    ContactForm,
    ProductsHomeComponent
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
      const token = localStorage.getItem('user');
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
            localStorage.removeItem('user');
          });
      }
    }
  },
  mounted() {
    this.checkUser();
    document.title = "Inicio"
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:ital,wght@0,400;0,500;0,700;1,400&display=swap');

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
  font-family: 'DM Sans', sans-serif;
  font-size: 0.8rem;
  font-weight: 700;
  color: #52b155;
  letter-spacing: 0.18em;
  margin-bottom: 0.6rem;
  text-transform: uppercase;
}

.main-title {
  font-family: 'Syne', sans-serif;
  font-weight: 800;
  font-size: 2.6rem;
  color: var(--nav-text);
  margin: 0;
  line-height: 1.15;
  letter-spacing: -0.02em;
}

.section-description {
  font-family: 'DM Sans', sans-serif;
  color: var(--nav-text);
  opacity: 0.75;
  max-width: 580px;
  margin: 1.1rem auto 0;
  font-size: 1.05rem;
  line-height: 1.65;
  font-weight: 400;
}

.title-underline {
  width: 80px;
  height: 3px;
  background: linear-gradient(90deg, #52b155 0%, rgba(82, 177, 85, 0.3) 70%, transparent 100%);
  margin: 1.1rem auto 0;
  border-radius: 99px;
}

.comparator-wrapper {
  max-width: 1100px;
  margin: 2.5rem auto 0;
  padding: 0 1rem 5rem 1rem;
}

@media (max-width: 768px) {
  .main-title {
    font-size: 1.85rem;
    letter-spacing: -0.01em;
  }

  .section-title-container {
    margin-top: 3rem;
  }

  .section-description {
    font-size: 0.975rem;
  }

  .comparator-wrapper {
    margin-top: 1.5rem;
  }
}
</style>