<template>
  <nav class="navbar navbar-expand-lg custom-nav shadow-sm px-md-4">
    <div class="container-fluid position-relative">

      <router-link class="navbar-brand" to="/">
        <div class="logo-container"></div>
      </router-link>

      <div class="d-flex align-items-center gap-2 ms-auto d-lg-none">

        <router-link to="/cart"
          class="btn btn-icon-action position-relative d-flex align-items-center justify-content-center p-1 rounded-circle">
          <span class="material-symbols-outlined" style="font-size: 26px;">shopping_cart</span>
          <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
            style="font-size: 0.6rem; padding: 0.3em 0.4em;">
            {{ cart.quantity }}
          </span>
        </router-link>

        <a v-if="!user" href="/login"
          class="btn btn-icon-action d-flex align-items-center justify-content-center p-1 rounded-circle">
          <span class="material-symbols-outlined" style="font-size: 26px;">login</span>
        </a>

        <div v-else class="dropdown">
          <button
            class="btn btn-icon-action d-flex align-items-center justify-content-center p-1 rounded-circle dropdown-toggle"
            type="button" data-bs-toggle="dropdown" aria-expanded="false">
            <span class="material-symbols-outlined" style="font-size: 26px;">account_circle</span>
          </button>
          <ul class="dropdown-menu dropdown-menu-end shadow-sm custom-dropdown position-absolute">
            <li>
              <button @click="goToProfile" class="dropdown-item d-flex align-items-center gap-2">
                <span class="material-symbols-outlined" style="font-size: 20px;">manage_accounts</span>
                Mi cuenta
              </button>
            </li>
            <li>
              <hr class="dropdown-divider">
            </li>
            <li>
              <button @click="logout" class="dropdown-item text-danger d-flex align-items-center gap-2">
                <span class="material-symbols-outlined" style="font-size: 20px;">logout</span>
                Cerrar sesión
              </button>
            </li>
          </ul>
        </div>

        <ThemeSwitcher />

        <button class="navbar-toggler custom-toggler ms-1" type="button" data-bs-toggle="collapse"
          data-bs-target="#navbarTaller">
          <span class="navbar-toggler-icon"></span>
        </button>
      </div>

      <div class="collapse navbar-collapse w-100" id="navbarTaller">
        <ul class="navbar-nav gap-lg-4 my-3 my-lg-0">
          <li class="nav-item">
            <router-link class="custom-link d-flex flex-column align-items-center" to="/services">
              <span class="material-symbols-outlined">local_car_wash</span>
              <span>Servicios</span>
            </router-link>
          </li>
          <li class="nav-item">
            <router-link class="custom-link d-flex flex-column align-items-center" to="/about">
              <span class="material-symbols-outlined">groups</span>
              <span>Nosotros</span>
            </router-link>
          </li>
         
          <li class="nav-item">
            <router-link class="custom-link d-flex flex-column align-items-center" to="/products">
              <span class="material-symbols-outlined">fragrance</span>
              <span>Productos</span>
            </router-link>
          </li>
          <li class="nav-item">
            <router-link class="custom-link d-flex flex-column align-items-center" to="/appointments">
              <span class="material-symbols-outlined">calendar_month</span>
              <span>Agendar Cita</span>
            </router-link>
          </li>
        </ul>

        <div class="d-none d-lg-flex align-items-center justify-content-center ms-auto gap-3 right-actions">
          <ThemeSwitcher />

          <router-link to="/cart"
            class="btn btn-icon-action position-relative d-flex align-items-center justify-content-center p-2 rounded-circle"
            title="Carrito">
            <span class="material-symbols-outlined">shopping_cart</span>
            <span v-if="this.user" class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
              style="font-size: 0.65rem; padding: 0.35em 0.5em;">
              {{ cart.quantity }}
            </span>
          </router-link>

          <a v-if="!user" href="/login" class="btn btn-auth fw-bold">
            Iniciar Sesión
          </a>

          <div v-else class="dropdown">
            <button
              class="btn btn-profile d-flex align-items-center justify-content-center p-2 rounded-circle dropdown-toggle"
              type="button" id="userDropdownDesktop" data-bs-toggle="dropdown" aria-expanded="false"
              title="Opciones de cuenta">
              <span class="material-symbols-outlined">person</span>
            </button>
            <ul class="dropdown-menu dropdown-menu-end shadow-sm custom-dropdown" aria-labelledby="userDropdownDesktop">
              <li>
                <button @click="goToProfile" class="dropdown-item d-flex align-items-center gap-2">
                  <span class="material-symbols-outlined" style="font-size: 20px;">manage_accounts</span>
                  Mi cuenta
                </button>
              </li>
              <li v-if="this.user.role.id == 1">
                <button @click="goToAdmin" class="dropdown-item d-flex align-items-center gap-2">
                  <span class="material-symbols-outlined" style="font-size: 20px;">shield_person</span>
                  Admin Panel
                </button>
              </li>
              <li>
                <hr class="dropdown-divider">
              </li>
              <li>
                <button @click="logout" class="dropdown-item text-danger d-flex align-items-center gap-2">
                  <span class="material-symbols-outlined" style="font-size: 20px;">logout</span>
                  Cerrar sesión
                </button>
              </li>
            </ul>
          </div>

        </div>
      </div>
    </div>
  </nav>
</template>

<script>
import ThemeSwitcher from '../UI/theme-switcher.vue';
import { cart } from '@/JS/Cart.js';
import { authState, fetchUserData, logout } from '@/JS/Auth.js';

export default {
  name: 'nav-component',
  components: { ThemeSwitcher },
  data() {
    return {}
  },
  computed: {
    cart() {
      return cart;
    },
    user() {
      return authState.user;
    },
  },
  methods: {
    goToProfile() {
      setTimeout(() => {
        this.$router.push('/profile');
      }, 150);
    },
    goToAdmin() {
      setTimeout(() => {
        this.$router.push('/admin');
      }, 150);
    },
    logout() {
      logout();
      this.$router.push('/login');
    },
  },
  mounted() {
  },
}
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
  gap: 4px;
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

.custom-link:hover::after,
.custom-link.router-link-active::after {
  width: 100%;
}

.custom-link:hover {
  color: #52b155 !important;
}

.btn-icon-action {
  color: var(--nav-text);
  background-color: transparent;
  transition: all 0.3s ease;
  border: none;
}

.btn-icon-action:hover {
  color: #52b155;
  transform: scale(1.05);
}

.btn-auth {
  color: var(--nav-text);
  border: 2px solid var(--nav-text);
  background-color: transparent;
  padding: 8px 20px;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.btn-auth:hover {
  background-color: var(--nav-text);
  color: var(--nav-bg);
}

.btn-profile {
  background-color: var(--nav-text);
  color: var(--nav-bg);
  transition: all 0.3s ease;
  border: 2px solid var(--nav-text);
}

.btn-profile:hover {
  opacity: 0.8;
  color: var(--nav-bg);
}

.btn-appointment {
  background-color: #52b155;
  color: #fff;
  border: 2px solid #52b155;
  padding: 8px 20px;
  border-radius: 8px;
  text-decoration: none;
  transition: all 0.3s ease;
  font-size: 0.95rem;
}

.btn-appointment:hover {
  background-color: transparent;
  color: #52b155;
}

.dropdown-toggle::after {
  display: none;
}

.custom-dropdown {
  background-color: var(--nav-bg);
  border: 1px solid var(--nav-border, #ddd);
}

.dropdown-item {
  color: var(--nav-text);
  transition: background-color 0.2s ease;
}

.dropdown-item:hover {
  background-color: var(--nav-border, #f8f9fa);
  color: var(--nav-text);
}

.navbar-toggler-icon {
  filter: var(--nav-toggler-filter);
  transition: filter 0.3s ease;
}

.material-symbols-outlined {
  font-size: 30px;
  line-height: 1;
}

.custom-link span:last-child {
  font-size: 0.9rem;
}

@media (min-width: 992px) {
  .navbar-nav {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    flex-direction: row;
  }
}

@media (max-width: 991px) {
  .navbar-nav {
    text-align: center;
    border-top: 1px solid var(--nav-border, #ddd);
    padding-top: 1rem;
  }

  .custom-link {
    display: inline-block;
    margin: 5px 0;
  }

  .custom-dropdown.position-absolute {
    position: absolute !important;
    right: 0;
    top: 100%;
    z-index: 1050;
  }
}

.logo-container {
  width: 150px;
  height: 100px;
  background-image: url('@/assets/LogoModoClaro.png');
  background-size: contain;
  background-repeat: no-repeat;
  transition: transform 0.3s ease;
}

[data-theme="dark"] .logo-container {
  background-image: url('@/assets/LogoModoOscuro.png');
}

.navbar-brand:hover .logo-container {
  transform: scale(1.05);
}
</style>