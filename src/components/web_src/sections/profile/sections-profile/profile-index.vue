<template>
  <!-- CARGANDO -->
  <div v-if="!infoUser?.User" class="text-center py-5 loading-state">
    <span class="material-symbols-outlined loading-icon">hourglass_empty</span>
    <p class="loading-text">Cargando perfil...</p>
  </div>

  <div v-else class="profile-wrapper">

    <!-- DATOS DEL USUARIO -->
    <div class="profile-card mb-4">
      <div class="profile-card-header">
        <div class="d-flex align-items-center gap-2">
          <span class="material-symbols-outlined">manage_accounts</span>
          Mi Perfil
        </div>
        <!-- BOTONES EDITAR / GUARDAR -->
        <div class="header-actions">
          <button v-if="!editing" @click="startEditing" class="btn-edit">
            <span class="material-symbols-outlined">edit</span>
            Editar
          </button>
          <div v-else class="d-flex gap-2">
            <button @click="cancelEditing" class="btn-cancel">
              <span class="material-symbols-outlined">close</span>
              Cancelar
            </button>
            <button @click="saveProfile" class="btn-save">
              <span class="material-symbols-outlined">check</span>
              Guardar
            </button>
          </div>
        </div>
      </div>

      <div class="profile-card-body d-flex align-items-start gap-4">
        <div class="avatar-circle">
          <span class="material-symbols-outlined">account_circle</span>
        </div>

        <div class="user-info">

          <!-- MODO VISTA -->
          <template v-if="!editing">
            <h4 class="user-name">{{ infoUser.User.name }}</h4>
            <p class="user-detail">
              <span class="material-symbols-outlined detail-icon">mail</span>
              {{ infoUser.User.email }}
            </p>
            <p class="user-detail">
              <span class="material-symbols-outlined detail-icon">badge</span>
              {{ infoUser.User.dni ?? 'Sin DNI/NIE' }}
            </p>
            <p class="user-detail">
              <span class="material-symbols-outlined detail-icon">phone</span>
              {{ infoUser.User.phone ?? 'Sin teléfono' }}
            </p>
            <p class="user-detail">
              <span class="material-symbols-outlined detail-icon">location_on</span>
              {{ infoUser.User.address ?? 'Sin dirección' }}
            </p>
            <span class="role-badge">{{ infoUser.Role.RolName }}</span>
          </template>

          <!-- MODO EDICIÓN -->
          <template v-else>
            <p class="error-message" v-if="errorMessage">
              <span class="material-symbols-outlined">error</span>
              {{ errorMessage }}
            </p>
            <div class="edit-field">
              <label class="edit-label">
                <span class="material-symbols-outlined detail-icon">person</span>
                Nombre
              </label>
              <input v-model="editForm.name" class="edit-input" type="text" placeholder="Tu nombre" />
            </div>
            <div class="edit-field">
              <label class="edit-label">
                <span class="material-symbols-outlined detail-icon">mail</span>
                Correo
              </label>
              <input v-model="editForm.email" class="edit-input" type="email" placeholder="Tu correo" />
            </div>
            <div class="edit-field">
              <label class="edit-label">
                <span class="material-symbols-outlined detail-icon">badge</span>
                DNI
              </label>
              <input v-model="editForm.dni" class="edit-input" type="text" placeholder="Tu DNI" />
            </div>
            <div class="edit-field">
              <label class="edit-label">
                <span class="material-symbols-outlined detail-icon">phone</span>
                Teléfono
              </label>
              <input v-model="editForm.phone" class="edit-input" type="tel" placeholder="Tu teléfono" />
            </div>
            <div class="edit-field">
              <label class="edit-label">
                <span class="material-symbols-outlined detail-icon">location_on</span>
                Dirección
              </label>
              <input v-model="editForm.address" class="edit-input" type="text" placeholder="Tu dirección" />
            </div>
          </template>

        </div>
      </div>
    </div>

    <!-- VEHÍCULOS -->
    <div class="profile-card mb-4">
      <div class="profile-card-header">
        <div class="d-flex align-items-center gap-2">
          <span class="material-symbols-outlined">directions_car</span>
          Mis Vehículos
        </div>
      </div>
      <div class="profile-card-body">
        <div v-if="!infoVehicles.vehicle?.length" class="empty-state">
          <span class="material-symbols-outlined">garage</span>
          <p>No tienes vehículos registrados.</p>
        </div>
        <div v-else class="vehicles-grid">
          <div
            v-for="(vehicle, index) in infoVehicles.vehicle"
            :key="index"
            class="vehicle-card"
          >
            <div class="vehicle-icon">
              <span class="material-symbols-outlined">directions_car</span>
            </div>
            <p class="vehicle-name">{{ vehicle.brand }} {{ vehicle.model }}</p>
            <div class="vehicle-details">
              <span class="vehicle-detail">
                <span class="material-symbols-outlined detail-icon">palette</span>
                {{ vehicle.color }}
              </span>
              <span class="vehicle-detail">
                <span class="material-symbols-outlined detail-icon">pin</span>
                {{ vehicle.license_plate }}
              </span>
            </div>
            <span class="vehicle-type-badge">
              {{ vehicle.vehicle_type.name }} — {{ vehicle.vehicle_type.dimensions }}
            </span>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default {
  props: {
    infoUser: { type: Object, default: () => ({}) },
    infoVehicles: { type: Object, default: () => ({}) }
  },
  data() {
    return {
      editing: false,
      editForm: {
        name: '',
        email: '',
        dni: '',
        phone: '',
        address: ''
      },
      errorMessage: ''
    }
  },
  methods: {
    startEditing() {
      // Copiamos los datos actuales al formulario
      this.editForm = {
        name: this.infoUser.User.name ?? '',
        email: this.infoUser.User.email ?? '',
        dni: this.infoUser.User.dni ?? '',
        phone: this.infoUser.User.phone ?? '',
        address: this.infoUser.User.address ?? ''
      };
      this.editing = true;
    },
    cancelEditing() {
      this.errorMessage = '';
      this.editing = false;
    },
    async saveProfile() {

      if(this.editForm.name.trim() === '' || this.editForm.email.trim() === '') {
        this.errorMessage = 'El nombre y el correo son obligatorios.';
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(this.editForm.email)) {
        this.errorMessage = 'Por favor, ingresa un correo electrónico válido.';
        return;
      }

      if (this.editForm.dni && this.editForm.dni.trim() !== '') {
      const dniNieRegex = /^([0-9]{8}|[XYZ][0-9]{7})[A-Za-z]$/;
      if (!dniNieRegex.test(this.editForm.dni)) {
        this.errorMessage = 'El DNI/NIE debe tener el formato correcto';
        return;
      }
    }

      try {
        const token = localStorage.getItem('user_token');
        const response = await fetch(`${BASE_URL}/v1/profile`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(this.editForm)
        });

        if (!response.ok){
          const errorData = await response.json();
          this.errorMessage = errorData.message || 'Error al actualizar el perfil.';
          return;
        };

        //Enviamos al padre los datos actualizados 
        this.$emit('infoUser-update', { ...this.editForm });
       
        this.editing = false;
        this.errorMessage = '';
      } catch (error) {
        this.errorMessage = 'Error de conexión. Por favor, intenta nuevamente.';
        console.error('Error al actualizar perfil:', error);
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.profile-wrapper {
  padding: 2rem 1.5rem;
  max-width: 960px;
  margin: 0 auto;
}

/* ── LOADING ── */
.loading-state { color: var(--nav-text); padding: 4rem 0; }
.loading-icon { font-size: 52px; color: #52b155; display: block; margin-bottom: 1rem; }
.loading-text { font-weight: 600; color: var(--nav-text); opacity: 0.6; }

/* ── CARD ── */
.profile-card {
  background-color: var(--nav-bg);
  border: 1px solid var(--nav-border, #ddd);
  border-radius: 12px;
  overflow: hidden;
  transition: background-color 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.profile-card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.5rem;
  font-weight: 700;
  font-size: 1rem;
  color: var(--nav-text);
  border-bottom: 1px solid var(--nav-border, #ddd);

  .material-symbols-outlined { font-size: 22px; color: #52b155; }
}

.profile-card-body { padding: 1.5rem; }

/* ── BOTONES HEADER ── */
.header-actions { display: flex; align-items: center; }

.btn-edit {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  border-radius: 8px;
  border: 2px solid var(--nav-text);
  background: transparent;
  color: var(--nav-text);
  font-weight: 600;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.2s ease;

  .material-symbols-outlined { font-size: 18px; }

  &:hover {
    background-color: var(--nav-text);
    color: var(--nav-bg);
  }
}

.btn-save {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  border-radius: 8px;
  border: 2px solid #52b155;
  background-color: #52b155;
  color: #fff;
  font-weight: 600;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.2s ease;

  .material-symbols-outlined { font-size: 18px; }

  &:hover { opacity: 0.85; }
}

.btn-cancel {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  border-radius: 8px;
  border: 2px solid var(--nav-border, #ddd);
  background: transparent;
  color: var(--nav-text);
  font-weight: 600;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.2s ease;

  .material-symbols-outlined { font-size: 18px; }

  &:hover { background-color: var(--nav-border, #f0f0f0); }
}

/* ── USUARIO ── */
.avatar-circle {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  background-color: #52b155;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  .material-symbols-outlined { font-size: 44px; color: #fff; }
}

.user-info { display: flex; flex-direction: column; gap: 4px; flex: 1; }

.user-name {
  font-size: 1.3rem;
  font-weight: 850;
  color: var(--nav-text);
  letter-spacing: -0.5px;
  margin: 0 0 4px 0;
}

.user-detail {
  display: flex;
  align-items: center;
  gap: 6px;
  color: var(--nav-text);
  opacity: 0.65;
  font-size: 0.9rem;
  margin: 0;
}

.detail-icon { font-size: 16px !important; color: #52b155; }

.role-badge {
  display: inline-block;
  margin-top: 6px;
  padding: 3px 12px;
  background-color: #52b155;
  color: #fff;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: capitalize;
}

/* ── EDICIÓN INLINE ── */
.edit-field {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-bottom: 10px;
}

.edit-label {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 0.78rem;
  font-weight: 700;
  color: var(--nav-text);
  opacity: 0.6;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.edit-input {
  background-color: var(--nav-bg);
  border: 1.5px solid var(--nav-border, #ddd);
  border-radius: 8px;
  padding: 8px 12px;
  color: var(--nav-text);
  font-size: 0.95rem;
  font-weight: 500;
  transition: border-color 0.2s ease;
  outline: none;
  width: 100%;
  max-width: 400px;

  &:focus { border-color: #52b155; }
}

/* ── VEHÍCULOS ── */
.vehicles-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 1rem;
}

.vehicle-card {
  border: 1px solid var(--nav-border, #ddd);
  border-radius: 10px;
  padding: 1.2rem;
  display: flex;
  flex-direction: column;
  gap: 6px;
  transition: all 0.3s ease;

  &:hover {
    border-color: #52b155;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(82, 177, 85, 0.15);
  }
}

.vehicle-icon .material-symbols-outlined { font-size: 32px; color: #52b155; }
.vehicle-name { font-weight: 700; font-size: 1rem; color: var(--nav-text); margin: 0; }
.vehicle-details { display: flex; flex-direction: column; gap: 4px; }

.vehicle-detail {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 0.85rem;
  color: var(--nav-text);
  opacity: 0.65;
}

.vehicle-type-badge {
  display: inline-block;
  margin-top: 4px;
  padding: 2px 10px;
  background-color: var(--nav-border, #f0f0f0);
  color: var(--nav-text);
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
}

/* ── EMPTY STATE ── */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
  color: var(--nav-text);
  opacity: 0.4;

  .material-symbols-outlined { font-size: 40px; margin-bottom: 8px; }
  p { margin: 0; font-size: 0.9rem; }
}

.error-message {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 14px;
  margin-bottom: 12px;
  background-color: #fee;
  border: 1.5px solid #dc3545;
  border-radius: 8px;
  color: #dc3545;
  font-size: 0.88rem;
  font-weight: 600;
  animation: slideIn 0.3s ease;

  .material-symbols-outlined {
    font-size: 20px;
    flex-shrink: 0;
  }
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (prefers-color-scheme: dark) {
  .error-message {
    background-color: rgba(220, 53, 69, 0.15);
    color: #ff6b7a;
    border-color: #ff6b7a;
  }
}

/* ── RESPONSIVE ── */
@media (max-width: 576px) {
  .profile-wrapper { padding: 1rem; }
  .profile-card-body { padding: 1rem; }
  .avatar-circle { width: 56px; height: 56px; .material-symbols-outlined { font-size: 34px; } }
  .user-name { font-size: 1.1rem; }
  .edit-input { max-width: 100%; }
}
</style>