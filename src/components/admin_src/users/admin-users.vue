<template>
    <div class="admin-container p-4">

        <!-- Cabecera -->
        <div class="mb-4">
            <button class="btn-back mb-3" @click="$router.push('/admin')">
                <span class="material-symbols-outlined">arrow_back</span>
                Panel de administración
            </button>
            <div class="d-flex justify-content-between align-items-center">
                <div>
                    <h2 class="text-white fw-bold h4 m-0">Gestión de Usuarios</h2>
                    <p class="text-white small mb-0 mt-1">Listado completo de usuarios registrados en la plataforma</p>
                </div>
                <span class="badge-status">
                    <span class="material-symbols-outlined" style="font-size:16px;vertical-align:middle;margin-right:4px;">group</span>
                    {{ users.length }} usuarios
                </span>
            </div>
        </div>

        <!-- Buscador -->
        <div class="search-wrapper mb-4">
            <span class="material-symbols-outlined search-icon">search</span>
            <input
                v-model="search"
                type="text"
                class="search-input"
                placeholder="Buscar por nombre, email o rol..."
            />
        </div>

        <!-- Skeleton loading -->
        <div v-if="loading" class="table-responsive shadow-lg rounded-3">
            <table class="table table-dark align-middle m-0">
                <thead>
                    <tr>
                        <th>Usuario</th>
                        <th>Email</th>
                        <th class="text-center">Rol</th>
                        <th class="text-end">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="i in 5" :key="i">
                        <td><div class="skeleton-line" style="width:160px"></div></td>
                        <td><div class="skeleton-line" style="width:200px"></div></td>
                        <td class="text-center"><div class="skeleton-line mx-auto" style="width:70px;height:24px;border-radius:20px"></div></td>
                        <td class="text-end"><div class="skeleton-line ms-auto" style="width:80px;height:30px;border-radius:8px"></div></td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- Tabla de usuarios -->
        <div v-else class="table-responsive shadow-lg rounded-3">
            <table class="table table-dark align-middle m-0">
                <thead>
                    <tr>
                        <th>Usuario</th>
                        <th>Email</th>
                        <th class="text-center">Rol</th>
                        <th class="text-center">Estado</th>
                        <th class="text-end">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-if="filteredUsers.length === 0">
                        <td colspan="5" class="text-center text-muted py-5">
                            <span class="material-symbols-outlined d-block mb-2" style="font-size:40px;opacity:0.3">manage_search</span>
                            No se encontraron usuarios
                        </td>
                    </tr>
                    <tr v-for="user in filteredUsers" :key="user.id" :class="['user-row', { 'user-blocked': user.blocked }]">
                        <td>
                            <div class="d-flex align-items-center gap-3">
                                <div :class="['avatar', { 'avatar-blocked': user.blocked }]">{{ getInitials(user.name) }}</div>
                                <span class="fw-semibold text-white">{{ user.name }}</span>
                            </div>
                        </td>
                        <td class="text-muted">{{ user.email }}</td>
                        <td class="text-center">
                            <span :class="getRoleBadgeClass(user.role)">
                                {{ user.role ? user.role.name : 'Sin rol' }}
                            </span>
                        </td>
                        <td class="text-center">
                            <span :class="user.blocked ? 'status-badge status-blocked' : 'status-badge status-active'">
                                <span class="dot-status"></span>
                                {{ user.blocked ? 'Bloqueado' : 'Activo' }}
                            </span>
                        </td>
                        <td class="text-end">
                            <div class="d-flex justify-content-end gap-2">
                                <button
                                    class="btn-icon btn-view"
                                    title="Ver detalles"
                                    @click="openDetail(user)"
                                >
                                    <span class="material-symbols-outlined">visibility</span>
                                </button>
                                <button
                                    :class="['btn-icon', user.blocked ? 'btn-unblock' : 'btn-block']"
                                    :title="user.blocked ? 'Desbloquear usuario' : 'Bloquear usuario'"
                                    @click="confirmToggleBlock(user)"
                                >
                                    <span class="material-symbols-outlined">{{ user.blocked ? 'lock_open' : 'lock' }}</span>
                                </button>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- Modal: Ver / Editar detalles -->
        <div v-if="selectedUser" class="modal-overlay" @click.self="closeDetail">
            <div class="modal-card">
                <div class="modal-header-custom">
                    <div class="d-flex align-items-center gap-3">
                        <div class="avatar avatar-lg">{{ getInitials(selectedUser.name) }}</div>
                        <div>
                            <h5 class="text-white mb-0 fw-bold">{{ selectedUser.name }}</h5>
                            <small class="text-muted">ID #{{ selectedUser.id }}</small>
                        </div>
                    </div>
                    <button class="btn-close-modal" @click="closeDetail">
                        <span class="material-symbols-outlined">close</span>
                    </button>
                </div>

                <div class="modal-body-custom">
                    <div class="detail-row">
                        <span class="detail-label">
                            <span class="material-symbols-outlined detail-icon">email</span>Email
                        </span>
                        <span class="detail-value">{{ selectedUser.email }}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">
                            <span class="material-symbols-outlined detail-icon">badge</span>Rol
                        </span>
                        <span :class="getRoleBadgeClass(selectedUser.role)">
                            {{ selectedUser.role ? selectedUser.role.name : 'Sin rol' }}
                        </span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">
                            <span class="material-symbols-outlined detail-icon">calendar_today</span>Registrado
                        </span>
                        <span class="detail-value">{{ formatDate(selectedUser.created_at) }}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">
                            <span class="material-symbols-outlined detail-icon">security</span>Estado
                        </span>
                        <span :class="selectedUser.blocked ? 'status-badge status-blocked' : 'status-badge status-active'">
                            <span class="dot-status"></span>
                            {{ selectedUser.blocked ? 'Bloqueado' : 'Activo' }}
                        </span>
                    </div>
                </div>

                <div class="modal-footer-custom">
                    <button
                        :class="['btn', selectedUser.blocked ? 'btn-success-outline' : 'btn-danger-outline']"
                        @click="confirmToggleBlock(selectedUser); closeDetail()"
                    >
                        <span class="material-symbols-outlined" style="font-size:16px">{{ selectedUser.blocked ? 'lock_open' : 'lock' }}</span>
                        {{ selectedUser.blocked ? 'Desbloquear usuario' : 'Bloquear usuario' }}
                    </button>
                    <button class="btn btn-secondary-outline" @click="closeDetail">
                        Cerrar
                    </button>
                </div>
            </div>
        </div>

        <!-- Modal: Confirmar bloqueo / desbloqueo -->
        <div v-if="userToToggle" class="modal-overlay" @click.self="cancelToggle">
            <div class="modal-card modal-sm">
                <div class="modal-header-custom">
                    <h5 class="text-white fw-bold m-0">
                        {{ userToToggle.blocked ? 'Desbloquear usuario' : 'Bloquear usuario' }}
                    </h5>
                    <button class="btn-close-modal" @click="cancelToggle">
                        <span class="material-symbols-outlined">close</span>
                    </button>
                </div>
                <div class="modal-body-custom">
                    <p class="text-muted mb-0" v-if="!userToToggle.blocked">
                        ¿Quieres bloquear a <strong class="text-white">{{ userToToggle.name }}</strong>?
                        No podrá acceder a la plataforma hasta que lo desbloquees.
                    </p>
                    <p class="text-muted mb-0" v-else>
                        ¿Quieres desbloquear a <strong class="text-white">{{ userToToggle.name }}</strong>?
                        Volverá a tener acceso a la plataforma.
                    </p>
                </div>
                <div class="modal-footer-custom">
                    <button class="btn btn-secondary-outline" @click="cancelToggle">Cancelar</button>
                    <button
                        :class="['btn', userToToggle.is_blocked ? 'btn-success-solid' : 'btn-danger-solid']"
                        @click="doToggleBlock"
                        :disabled="toggling"
                    >
                        <span v-if="toggling" class="spinner-border spinner-border-sm me-1"></span>
                        {{ userToToggle.is_blocked ? 'Desbloquear' : 'Bloquear' }}
                    </button>
                </div>
            </div>
        </div>

        <!-- Toast de feedback -->
        <transition name="toast-fade">
            <div v-if="toast.show" :class="['toast-msg', toast.type]">
                <span class="material-symbols-outlined">{{ toast.type === 'success' ? 'check_circle' : 'error' }}</span>
                {{ toast.message }}
            </div>
        </transition>

    </div>
</template>

<script>
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default {
    name: 'AdminUsers',
    data() {
        return {
            users: [],
            loading: true,
            search: '',
            selectedUser: null,
            userToToggle: null,
            toggling: false,
            toast: { show: false, message: '', type: 'success' }
        }
    },
    computed: {
        filteredUsers() {
            const q = this.search.toLowerCase().trim();
            if (!q) return this.users;
            return this.users.filter(u =>
                u.name?.toLowerCase().includes(q) ||
                u.email?.toLowerCase().includes(q) ||
                u.role?.name?.toLowerCase().includes(q)
            );
        }
    },
    methods: {
        fetchUsers() {
            this.loading = true;
            fetch(`${BASE_URL}/v1/users`)
                .then(res => res.json())
                .then(res => {
                    this.users = res.data;
                })
                .catch(err => {
                    console.error(err);
                    this.showToast('Error al cargar los usuarios', 'error');
                })
                .finally(() => {
                    this.loading = false;
                });
        },

        openDetail(user) {
            this.selectedUser = user;
        },

        closeDetail() {
            this.selectedUser = null;
        },

        confirmToggleBlock(user) {
            this.userToToggle = user;
        },

        cancelToggle() {
            this.userToToggle = null;
        },

        doToggleBlock() {
            if (!this.userToToggle) return;
            this.toggling = true;
            const token = localStorage.getItem('user_token');
            fetch(`${BASE_URL}/v1/users/${this.userToToggle.id}/toggle-block`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` }
            })
            .then(res => {
                if (!res.ok) throw new Error('Error al cambiar estado');
                return res.json();
            })
            .then(res => {
                const updated = res.data;
                const idx = this.users.findIndex(u => u.id === updated.id);
                if (idx !== -1) this.users[idx] = updated;
                const accion = updated.blocked ? 'bloqueado' : 'desbloqueado';
                this.showToast(`Usuario "${updated.name}" ${accion} correctamente`, 'success');
                this.userToToggle = null;
            })
            .catch(err => {
                console.error(err);
                this.showToast('No se pudo cambiar el estado del usuario', 'error');
            })
            .finally(() => {
                this.toggling = false;
            });
        },

        getInitials(name) {
            if (!name) return '?';
            return name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();
        },

        getRoleBadgeClass(role) {
            if (!role) return 'role-badge role-unknown';
            const name = role.name?.toLowerCase();
            if (name === 'admin') return 'role-badge role-admin';
            if (name === 'client') return 'role-badge role-client';
            return 'role-badge role-unknown';
        },

        formatDate(dateStr) {
            if (!dateStr) return '—';
            const d = new Date(dateStr);
            return d.toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' });
        },

        showToast(message, type = 'success') {
            this.toast = { show: true, message, type };
            setTimeout(() => { this.toast.show = false; }, 3500);
        }
    },
    mounted() {
        this.fetchUsers();
    }
}
</script>

<style scoped>
.admin-container {
    background-color: #0f172a;
    min-height: 100vh;
}

/* Botón volver */
.btn-back {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: transparent;
    border: none;
    color: #64748b;
    font-size: 0.82rem;
    font-weight: 600;
    cursor: pointer;
    padding: 0;
    transition: color 0.2s;
    letter-spacing: 0.2px;
}
.btn-back:hover { color: #a3e635; }
.btn-back .material-symbols-outlined { font-size: 17px; }

/* Search */
.search-wrapper {
    position: relative;
    max-width: 420px;
}

.search-icon {
    position: absolute;
    left: 14px;
    top: 50%;
    transform: translateY(-50%);
    color: #64748b;
    font-size: 20px;
}

.search-input {
    width: 100%;
    background: #1e293b;
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 10px;
    padding: 0.65rem 1rem 0.65rem 2.8rem;
    color: #f1f5f9;
    font-size: 0.9rem;
    transition: border-color 0.2s;
    outline: none;
}

.search-input::placeholder { color: #475569; }
.search-input:focus { border-color: rgba(163, 230, 53, 0.4); }

/* Badge cabecera */
.badge-status {
    background: rgba(163, 230, 53, 0.1);
    color: #a3e635;
    border: 1px solid rgba(163, 230, 53, 0.3);
    padding: 0.6rem 1.2rem;
    border-radius: 10px;
    font-weight: 700;
    display: flex;
    align-items: center;
}

/* Table */
.table-dark {
    --bs-table-bg: #1e293b;
    border-color: rgba(255, 255, 255, 0.08);
}

.user-row {
    transition: background 0.15s;
}
.user-row:hover {
    background: rgba(163, 230, 53, 0.04) !important;
}
.user-blocked {
    opacity: 0.55;
}
.user-blocked:hover {
    background: rgba(239, 68, 68, 0.04) !important;
    opacity: 0.75;
}

/* Avatar */
.avatar {
    width: 38px;
    height: 38px;
    min-width: 38px;
    border-radius: 50%;
    background: linear-gradient(135deg, #334155, #1e293b);
    border: 1.5px solid rgba(163, 230, 53, 0.25);
    color: #a3e635;
    font-weight: 700;
    font-size: 0.8rem;
    display: flex;
    align-items: center;
    justify-content: center;
}

.avatar-lg {
    width: 52px;
    height: 52px;
    min-width: 52px;
    font-size: 1rem;
}

.avatar-blocked {
    border-color: rgba(239, 68, 68, 0.3);
    color: #f87171;
    background: linear-gradient(135deg, #2a1a1a, #1e293b);
}

/* Status badges */
.status-badge {
    display: inline-flex;
    align-items: center;
    padding: 0.25rem 0.75rem;
    border-radius: 20px;
    font-size: 0.78rem;
    font-weight: 700;
}

.status-active {
    background: rgba(163, 230, 53, 0.1);
    color: #a3e635;
    border: 1px solid rgba(163, 230, 53, 0.25);
}
.status-active .dot-status {
    background: #a3e635;
}

.status-blocked {
    background: rgba(239, 68, 68, 0.1);
    color: #f87171;
    border: 1px solid rgba(239, 68, 68, 0.25);
}
.status-blocked .dot-status {
    background: #f87171;
}

.dot-status {
    display: inline-block;
    width: 7px;
    height: 7px;
    border-radius: 50%;
    margin-right: 6px;
    flex-shrink: 0;
}

/* Botones de éxito (desbloquear) en modales */
.btn-success-outline {
    background: rgba(163, 230, 53, 0.08);
    border: 1px solid rgba(163, 230, 53, 0.3);
    color: #a3e635;
    padding: 0.5rem 1.2rem;
    border-radius: 8px;
    font-size: 0.875rem;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 6px;
    transition: all 0.2s;
}
.btn-success-outline:hover { background: rgba(163, 230, 53, 0.18); }

.btn-success-solid {
    background: #a3e635;
    border: none;
    color: #0f172a;
    padding: 0.5rem 1.4rem;
    border-radius: 8px;
    font-size: 0.875rem;
    font-weight: 700;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 6px;
    transition: all 0.2s;
}
.btn-success-solid:hover:not(:disabled) { background: #bef264; }
.btn-success-solid:disabled { opacity: 0.6; cursor: not-allowed; }

/* Role badges */
.role-badge {
    display: inline-block;
    padding: 0.28rem 0.8rem;
    border-radius: 20px;
    font-size: 0.78rem;
    font-weight: 700;
    text-transform: capitalize;
    letter-spacing: 0.3px;
}

.role-admin {
    background: rgba(163, 230, 53, 0.12);
    color: #a3e635;
    border: 1px solid rgba(163, 230, 53, 0.3);
}

.role-client {
    background: rgba(99, 179, 237, 0.12);
    color: #63b3ed;
    border: 1px solid rgba(99, 179, 237, 0.3);
}

.role-unknown {
    background: rgba(100, 116, 139, 0.15);
    color: #94a3b8;
    border: 1px solid rgba(100, 116, 139, 0.25);
}

/* Icon buttons */
.btn-icon {
    width: 34px;
    height: 34px;
    border-radius: 8px;
    border: none;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s ease;
}

.btn-icon .material-symbols-outlined { font-size: 18px; }

.btn-view {
    background: rgba(99, 179, 237, 0.1);
    color: #63b3ed;
    border: 1px solid rgba(99, 179, 237, 0.25);
}
.btn-view:hover {
    background: rgba(99, 179, 237, 0.25);
}

.btn-block {
    background: rgba(239, 68, 68, 0.1);
    color: #f87171;
    border: 1px solid rgba(239, 68, 68, 0.25);
}
.btn-block:hover {
    background: rgba(239, 68, 68, 0.25);
}

.btn-unblock {
    background: rgba(163, 230, 53, 0.1);
    color: #a3e635;
    border: 1px solid rgba(163, 230, 53, 0.25);
}
.btn-unblock:hover {
    background: rgba(163, 230, 53, 0.25);
}

/* Skeleton */
.skeleton-line {
    height: 14px;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 4px;
    position: relative;
    overflow: hidden;
}
.skeleton-line::after {
    content: "";
    position: absolute;
    inset: 0;
    transform: translateX(-100%);
    background-image: linear-gradient(90deg, rgba(255,255,255,0) 0, rgba(255,255,255,0.04) 20%, rgba(255,255,255,0.07) 60%, rgba(255,255,255,0));
    animation: shimmer 2s infinite;
}
@keyframes shimmer { 100% { transform: translateX(100%); } }

/* Modal overlay */
.modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.65);
    backdrop-filter: blur(6px);
    z-index: 2000;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1rem;
}

.modal-card {
    background: #1e293b;
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 16px;
    width: 100%;
    max-width: 480px;
    box-shadow: 0 25px 60px rgba(0, 0, 0, 0.5);
    animation: slideUp 0.25s ease;
}

.modal-sm { max-width: 380px; }

@keyframes slideUp {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0); }
}

.modal-header-custom {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1.4rem 1.5rem 1rem;
    border-bottom: 1px solid rgba(255,255,255,0.07);
}

.modal-body-custom {
    padding: 1.4rem 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.modal-footer-custom {
    display: flex;
    justify-content: flex-end;
    gap: 0.75rem;
    padding: 1rem 1.5rem 1.4rem;
    border-top: 1px solid rgba(255,255,255,0.07);
}

.btn-close-modal {
    background: transparent;
    border: none;
    color: #64748b;
    cursor: pointer;
    padding: 4px;
    border-radius: 6px;
    display: flex;
    transition: color 0.2s;
}
.btn-close-modal:hover { color: #f1f5f9; }

/* Detail rows */
.detail-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
}
.detail-label {
    display: flex;
    align-items: center;
    gap: 6px;
    color: #64748b;
    font-size: 0.875rem;
    white-space: nowrap;
}
.detail-icon { font-size: 16px; }
.detail-value { color: #cbd5e1; font-size: 0.9rem; }

/* Buttons inside modal */
.btn-secondary-outline {
    background: transparent;
    border: 1px solid rgba(255,255,255,0.12);
    color: #94a3b8;
    padding: 0.5rem 1.2rem;
    border-radius: 8px;
    font-size: 0.875rem;
    cursor: pointer;
    transition: all 0.2s;
}
.btn-secondary-outline:hover { border-color: rgba(255,255,255,0.25); color: #f1f5f9; }

.btn-danger-outline {
    background: rgba(239, 68, 68, 0.08);
    border: 1px solid rgba(239, 68, 68, 0.25);
    color: #f87171;
    padding: 0.5rem 1.2rem;
    border-radius: 8px;
    font-size: 0.875rem;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 6px;
    transition: all 0.2s;
}
.btn-danger-outline:hover { background: rgba(239, 68, 68, 0.18); }

.btn-danger-solid {
    background: #ef4444;
    border: none;
    color: #fff;
    padding: 0.5rem 1.4rem;
    border-radius: 8px;
    font-size: 0.875rem;
    font-weight: 600;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 6px;
    transition: all 0.2s;
}
.btn-danger-solid:hover:not(:disabled) { background: #dc2626; }
.btn-danger-solid:disabled { opacity: 0.6; cursor: not-allowed; }

/* Toast */
.toast-msg {
    position: fixed;
    bottom: 2rem;
    right: 2rem;
    z-index: 9999;
    padding: 0.85rem 1.4rem;
    border-radius: 12px;
    font-size: 0.875rem;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 10px;
    box-shadow: 0 8px 24px rgba(0,0,0,0.35);
}
.toast-msg.success {
    background: rgba(163, 230, 53, 0.12);
    border: 1px solid rgba(163, 230, 53, 0.3);
    color: #a3e635;
}
.toast-msg.error {
    background: rgba(239, 68, 68, 0.12);
    border: 1px solid rgba(239, 68, 68, 0.3);
    color: #f87171;
}

.toast-fade-enter-active,
.toast-fade-leave-active { transition: all 0.35s ease; }
.toast-fade-enter-from,
.toast-fade-leave-to { opacity: 0; transform: translateY(12px); }
</style>
