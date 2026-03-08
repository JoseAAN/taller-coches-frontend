<template>
  <Loader />
  <router-view></router-view>
</template>


<script>
import Loader from './components/web_src/shared/loader.vue';
import { cart } from '@/Cart.js';
export default {
  components: {
    Loader
  },

  mounted() {
    cart.loadUserCart();
  }
}
</script>

<style scoped>
</style>