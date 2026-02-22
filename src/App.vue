<template>
  <Loader />
  <router-view></router-view>
  <link rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Material+Icons">
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