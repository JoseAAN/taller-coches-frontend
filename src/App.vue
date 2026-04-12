<template>
  <Loader />
  <router-view></router-view>
</template>


<script>
import Loader from './components/web_src/shared/loader.vue';
import { cart } from '@/JS/Cart.js';
import { authState, fetchUserData } from '@/JS/Auth.js';

export default {
  components: {
    Loader
  },

  async mounted() {
    if (!authState.user) {
      await fetchUserData();
    }
    cart.loadUserCart();
  }
}
</script>

<style scoped>
</style>