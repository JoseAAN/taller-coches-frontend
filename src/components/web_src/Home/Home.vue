<script setup>
import HomeNavComponent from '../Home/home-nav-component.vue';
import HeroComponent from '../Home/hero-component.vue';
import ServiceComponent from '../Home/services-components/service-component.vue';
</script>

<template>
<header>
    <home-nav-component></home-nav-component>
    <hero-component></hero-component>
    <service-component class="mt-5"></service-component>
  </header>
</template>

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