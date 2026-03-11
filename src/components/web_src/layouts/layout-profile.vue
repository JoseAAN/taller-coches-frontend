<template>
  <div class="profile-layout">
    <profileNavComponent />

    <main class="profile-content">
      <router-view
        v-if="profileData"
        :infoUser="profileData.infoUser"
        :infoVehicles="profileData.infoVehicles"
        :infoCartInvoices="profileData.infoCartInvoices"
        :infoServiceInvoices="profileData.infoServiceInvoices"
     
        @infoUser-update="actualizarDatosUsuario"
      />
    
      <div v-else class="text-center py-5">
        <span class="material-symbols-outlined" style="font-size: 48px;">hourglass_empty</span>
        <p>Cargando...</p>
      </div>
    </main>
  </div>
</template>

<script>
import profileNavComponent from '../sections/profile/profileNavComponent.vue';
import { fetchProfile } from '@/Profile';

export default {
  components: { profileNavComponent },
  data() {
    return {
      profileData: null
    }
  },
  async mounted() {
    try {
      const data = await fetchProfile();
      this.profileData = data;
    } catch (error) {
      console.error("Fallo al inicializar:", error);
      this.$router.push('/');
    }
  },
  methods: {
    actualizarDatosUsuario(nuevosDatos) {
    Object.assign(this.profileData.infoUser.User, nuevosDatos);
  }
  }
}
</script>

<style scoped>
/* ✅ Solo esto necesita el padre */
.profile-layout {
  display: flex;
  min-height: 100vh;
}

.profile-content {
  margin-left: 260px; /* mismo ancho que el sidebar */
  flex: 1;
  padding: 2rem;
}

@media (max-width: 991px) {
  .profile-content {
    margin-left: 0;
  }
}
</style>