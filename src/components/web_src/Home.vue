<script setup>
</script>

<template>
  <h1>HOLAAA</h1>
<header>
    <nav>
      <router-link :to="{ name: 'admin.home' }" class="btn btn-primary">
        Ir al Panel de Administración
      </router-link>
    </nav>
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