<template>
  <nav class="navbar navbar-expand-lg custom-nav shadow-sm px-md-4">
    <div class="container-fluid">
      <router-link class="navbar-brand d-flex flex-column m-0" to="/">
        <span class="logo-line">LOGO</span>
        <span class="logo-line">MARCA</span>
      </router-link>

      <div class="d-flex align-items-center gap-2">
        <ThemeSwitcher class="d-lg-none" />
        <button 
          class="navbar-toggler custom-toggler" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarTaller"
        >
          <span class="navbar-toggler-icon"></span>
        </button>
      </div>

      <div class="collapse navbar-collapse" id="navbarTaller">
        <ul class="navbar-nav mx-auto gap-lg-4 my-3 my-lg-0">
          <li class="nav-item">
            <router-link class="custom-link" to="/servicios">Servicios</router-link>
          </li>
          <li class="nav-item">
            <router-link class="custom-link" to="/nosotros">Nosotros</router-link>
          </li>
          <li class="nav-item">
            <router-link class="custom-link" to="/empresas">Empresas</router-link>
          </li>
        </ul>

        <div class="d-flex align-items-center justify-content-center ms-lg-auto gap-3">
          <ThemeSwitcher class="d-none d-lg-block" />
          <button class="btn btn-reserva fw-bold text-white">
            RESERVAR CITA
          </button>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import ThemeSwitcher from '../UI/theme-switcher.vue';
</script>

<style scoped>
.custom-nav {
  background-color: var(--nav-bg); 
  min-height: 110px;
  transition: background-color 0.3s ease;
}

.logo-line {
  color: var(--nav-text);
  font-weight: 850;
  font-size: 1.6rem;
  line-height: 0.85;
  letter-spacing: -1px;
}

.custom-link {
  text-decoration: none;
  color: var(--nav-text) !important;
  font-weight: 600;
  font-size: 1.1rem;
  position: relative;
  padding: 8px 0;
  transition: color 0.3s ease;
}

.custom-link::after {
  content: '';
  position: absolute;
  width: 0;
  height: 3px;
  bottom: 0;
  left: 50%;
  background-color: #52b155; 
  transition: all 0.3s ease-in-out;
  transform: translateX(-50%);
}

.custom-link:hover::after {
  width: 100%;
}

.custom-link.router-link-active::after {
  width: 100%;
}

.custom-link:hover {
  color: #52b155 !important;
}

.btn-reserva {
  background-color: #52b155;
  border: none;
  padding: 12px 28px;
  border-radius: 10px;
  font-size: 0.95rem;
  white-space: nowrap;
}

.btn-reserva:hover {
  background-color: #469c49;
}

.navbar-toggler-icon {
  filter: var(--nav-toggler-filter);
  transition: filter 0.3s ease;
}

@media (min-width: 992px) {
  .navbar-nav {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
  }
}

@media (max-width: 991px) {
  .navbar-nav {
    text-align: center;
    border-top: 1px solid var(--nav-border);
    padding-top: 1rem;
  }
  
  /* En móvil, la línea se expande igual pero centrada */
  .custom-link {
    display: inline-block;
    margin: 5px 0;
  }
  
  .ms-lg-auto {
    margin-top: 1rem;
    width: 100%;
  }
  
  .btn-reserva {
    width: 100%;
  }
}
</style>