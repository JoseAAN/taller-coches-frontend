
<template>
  <header>
    <home-nav-component></home-nav-component>
    <hero-component></hero-component>
    <service-component class="mt-5"></service-component>
    <slider-comparator :before="cochesucio" :after="cochelimpio" />
  </header>
</template>

  <script>
  import HomeNavComponent from '../Home/home-nav-component.vue';
  import HeroComponent from '../Home/hero-component.vue';
  import ServiceComponent from '../Home/services-components/service-component.vue';
  import SliderComparator from '../UI/slider-comparator.vue';
  import cochelimpio from "@/assets/cochelimpio.jpeg";
  import cochesucio from "@/assets/cochesucio.jpeg";

  export default {
    components: {
      HomeNavComponent,
      HeroComponent,
      ServiceComponent,
      SliderComparator
    },
    data() {
      return {
        cochelimpio,
        cochesucio,
        user_verfied: false
      }
    },

    methods: {
      checkUser() {
        const token = localStorage.getItem('token');
        if (token) {
          fetch('http://api/user', {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Accept': 'application/json'
            }
          })
          .then(response => {
            if (response.ok) {
              alert('Usuario verificado');
              console.log(response++);
              
              this.user_verfied = true;
            } else {
              localStorage.removeItem('token');
            }
          })
          .catch(error => {
            console.error('Usuario inválido:', error);
            localStorage.removeItem('token');
          });
        } else {
          this.user_verfied = false;
        }
      }
    },
    mounted() {
      this.checkUser();
    }
  }
  </script>

<style scoped>
.btn {
  padding: 0.5rem 1rem;
  border-radius: 4px;
  text-decoration: none;
}

.btn-primary {
  background-color: #007bff;
  color: white;
}
</style>