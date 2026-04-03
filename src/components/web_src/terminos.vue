<template>
  <div class="terms-page bg-dark min-vh-100 text-white">
    <div class="container py-5">
      <h1 class="mb-4">Términos y Condiciones</h1>
      <p>Bienvenido a AutoClean. Al utilizar nuestros servicios, aceptas estos términos y condiciones.</p>
      
      <h3 class="mt-4">Proceso de Reservas</h3>
      <p>Al reservar una cita nos comprometemos a mantener el hueco para tu vehículo.</p>

      <router-link to="/" class="btn btn-primary mt-4">Volver al inicio</router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TerminosPage'
}
</script>

<style scoped>
.terms-page {
  padding-top: 80px;
}
</style>
