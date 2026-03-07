<template>
  <Loader />
  <router-view></router-view>
</template>


<script>
import Loader from './components/web_src/shared/loader.vue';
export default {
  components: {
    Loader
  }
}
</script>

<style scoped>
</style>