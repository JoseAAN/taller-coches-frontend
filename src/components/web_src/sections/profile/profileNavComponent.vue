<template>
  <aside class="sidebar" :class="{ 'sidebar-open': menuOpen }">

    <div class="sidebar-brand" @click="goHome">
    <div class="logo-container">
    </div>
</div>

    <div class="sidebar-user" v-if="infoUser?.User">
      <div class="sidebar-avatar">
        <span class="material-symbols-outlined">account_circle</span>
      </div>
      <div class="sidebar-user-info">
        <p class="sidebar-user-name">{{ infoUser.User.name }}</p>
        <span class="sidebar-user-role">{{ infoUser.Role.RolName }}</span>
      </div>
    </div>

    <nav class="sidebar-nav">
      <router-link class="sidebar-link" to="/profile" @click="$emit('close-menu')">
        <span class="material-symbols-outlined">manage_accounts</span>
        <span>Mi Perfil</span>
      </router-link>
      <router-link class="sidebar-link" to="/profile/vehicles" @click="$emit('close-menu')">
        <span class="material-symbols-outlined">directions_car</span>
        <span>Vehículos</span>
      </router-link>
      <router-link class="sidebar-link" to="/profile/invoices" @click="$emit('close-menu')">
        <span class="material-symbols-outlined">shopping_bag</span>
        <span>Mis compras</span>
      </router-link>
      <router-link class="sidebar-link" to="/profile/appointments" @click="$emit('close-menu')">
        <span class="material-symbols-outlined">calendar_month</span>
        <span>Mis citas</span>
      </router-link>
    </nav>

    <div class="sidebar-footer">
      <ThemeSwitcher />
      <button @click="goHome" class="btn-sidebar-home">
        <span class="material-symbols-outlined">home</span>
        <span>Volver al inicio</span>
    </button>
      <button @click="$emit('logout')" class="btn-sidebar-logout">
        <span class="material-symbols-outlined">logout</span>
        <span>Cerrar sesión</span>
      </button>
    </div>

  </aside>
</template>

<script>
import ThemeSwitcher from '../../UI/theme-switcher.vue';

export default {
  components: { ThemeSwitcher },
  props: {
    infoUser: { type: Object, default: () => ({}) },
    menuOpen: { type: Boolean, default: false }
  },
  emits: ['toggle-menu', 'close-menu', 'logout'],
  methods: {
    goHome() {
      this.$router.push('/');
    }
  }
}
</script>

<style scoped>
.sidebar {
  width: 260px;
  min-height: 100vh;
  background-color: var(--nav-bg);
  border-right: 1px solid var(--nav-border, #ddd);
  display: flex;
  flex-direction: column;
  padding: 1rem; 
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  z-index: 100;
  transition: transform 0.3s ease, background-color 0.3s ease;
}

.sidebar-brand {
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  margin-bottom: 1.5rem; 
  padding: 0.5rem 0; 
}

.logo-container {
  width: 180px; 
  height: 150px; 
  background-image: url('@/assets/LogoModoClaro.png');
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  transition: transform 0.3s ease;
}

[data-theme="dark"] .logo-container {
  background-image: url('@/assets/LogoModoOscuro.png');
}

.sidebar-brand:hover .logo-container {
  transform: scale(1.20);
}

.sidebar-user {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 1rem;
  background-color: var(--nav-border, #f5f5f5);
  border-radius: 12px;
  margin-bottom: 1.5rem;
}

.sidebar-avatar .material-symbols-outlined {
  font-size: 40px;
  color: #52b155;
}

.sidebar-user-name {
  font-weight: 700;
  font-size: 0.95rem;
  color: var(--nav-text);
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 140px;
}

.sidebar-user-role {
  font-size: 0.75rem;
  color: #52b155;
  font-weight: 600;
  text-transform: capitalize;
}

.sidebar-nav {
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
}

.sidebar-link {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 14px;
  border-radius: 10px;
  text-decoration: none;
  color: var(--nav-text);
  font-weight: 600;
  font-size: 0.95rem;
  transition: all 0.2s ease;
}

.sidebar-link .material-symbols-outlined {
  font-size: 22px;
  opacity: 0.6;
  transition: all 0.2s ease;
}

.sidebar-link:hover {
  background-color: var(--nav-border, #f0f0f0);
  color: #52b155;
}

.sidebar-link:hover .material-symbols-outlined {
  color: #52b155;
  opacity: 1;
}

.sidebar-link.router-link-exact-active {
  background-color: #52b155;
  color: #fff;
}

.sidebar-link.router-link-exact-active .material-symbols-outlined {
  color: #fff;
  opacity: 1;
}

.sidebar-footer {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding-top: 1rem;
  border-top: 1px solid var(--nav-border, #ddd);
}

.btn-sidebar-home {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 14px;
  border-radius: 10px;
  border: none;
  background: transparent;
  color: var(--nav-text);
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.2s ease;
  width: 100%;
}

.btn-sidebar-home .material-symbols-outlined {
  font-size: 22px;
  opacity: 0.6;
}

.btn-sidebar-home:hover {
  background-color: var(--nav-border, #f0f0f0);
  color: #52b155;
}

.btn-sidebar-home:hover .material-symbols-outlined {
  opacity: 1;
  color: #52b155;
}

.btn-sidebar-logout {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 14px;
  border-radius: 10px;
  border: none;
  background: transparent;
  color: #dc3545;
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.2s ease;
  width: 100%;
}

.btn-sidebar-logout .material-symbols-outlined {
  font-size: 22px;
}

.btn-sidebar-logout:hover {
  background-color: rgba(220, 53, 69, 0.1);
}

@media (max-width: 991px) {
  .sidebar {
    transform: translateX(-100%);
  }

  .sidebar.sidebar-open {
    transform: translateX(0);
    box-shadow: 4px 0 20px rgba(0, 0, 0, 0.15);
  }
}
</style>