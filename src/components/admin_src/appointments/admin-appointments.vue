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
                    <h2 class="text-white fw-bold h4 m-0">Gestión de Citas</h2>
                    <p class="text-white small mb-0 mt-1">Calendario y estado de las citas en el taller</p>
                </div>
                <button class="btn btn-success" @click="goToCreate" style="display:flex; align-items:center; gap:5px;">
                    <span class="material-symbols-outlined">add</span> Nueva Cita
                </button>
            </div>
        </div>

        <!-- Filtros -->
        <div class="d-flex flex-wrap gap-3 mb-4 p-3 rounded-3" style="background-color: #1e293b; border: 1px solid #334155;">
           <div class="d-flex align-items-center gap-2">
               <label class="text-light mb-0 small fw-bold">Fecha:</label>
               <input type="date" class="form-control form-control-sm bg-dark text-white border-secondary w-auto" v-model="filterDate" @change="fetchAppointments" />
           </div>
           
           <div class="d-flex align-items-center gap-2">
               <label class="text-light mb-0 small fw-bold">Estado:</label>
               <select class="form-select form-select-sm bg-dark text-white border-secondary w-auto" v-model="filterStatus" @change="fetchAppointments">
                   <option value="">Todas</option>
                   <option value="pending">Pendientes</option>
                   <option value="completed">Completadas</option>
                   <option value="cancelled">Canceladas</option>
               </select>
           </div>
           
           <button class="btn btn-sm btn-outline-secondary" @click="clearFilters">Limpiar Filtros</button>
        </div>

        <!-- Tabla -->
        <div v-if="loading" class="text-center text-white py-5">
            <div class="spinner-border text-light" role="status"></div>
            <div class="mt-2">Cargando citas...</div>
        </div>
        <div v-else class="table-responsive shadow-lg rounded-3">
             <table class="table table-dark align-middle m-0" style="background-color: #1e293b;">
                <thead style="border-bottom: 2px solid #334155;">
                    <tr>
                        <th>Fecha y Hora</th>
                        <th>Cliente y Vehículo</th>
                        <th>Servicio</th>
                        <th>Precio</th>
                        <th class="text-center">Estado</th>
                        <th class="text-end">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                   <tr v-if="appointments.length === 0">
                       <td colspan="6" class="text-center text-white-50 py-5">
                            <span class="material-symbols-outlined d-block mb-2 text-muted" style="font-size: 32px">event_busy</span>
                            No se encontraron citas.
                       </td>
                   </tr>
                   <tr v-for="app in appointments" :key="app.id" style="border-bottom: 1px solid #334155;" :class="{'opacity-50': app.status === 'cancelled'}">
                       <td class="text-white">
                           <div class="fw-bold">{{ formatDate(app.appointment_date) }}</div>
                           <div class="text-muted small">
                               <span class="material-symbols-outlined align-middle" style="font-size:14px">schedule</span>
                               {{ formatTime(app.appointment_date) }} - {{ formatTime(app.end_time) }}
                           </div>
                       </td>
                       <td class="text-white">
                           <div class="fw-medium">{{ app.vehicle?.user?.name || 'Cliente desconocido' }}</div>
                           <div class="text-muted small mt-1">
                               <span class="badge bg-secondary">{{ app.vehicle?.license_plate || '---' }}</span>
                           </div>
                       </td>
                       <td class="text-white fw-medium">{{ app.service?.name }}</td>
                       <td class="text-white text-end">{{ app.final_price }} €</td>
                       <td class="text-center">
                           <span :class="getStatusBadgeClass(app.status)">
                               {{ getStatusName(app.status) }}
                           </span>
                       </td>
                       <td class="text-end">
                           <div class="d-flex justify-content-end gap-1">
                               <button v-if="app.status === 'pending'" @click="updateStatus(app, 'completed')" class="btn btn-sm btn-outline-success" title="Marcar completada">
                                   <span class="material-symbols-outlined" style="font-size: 18px">check_circle</span>
                               </button>
                               <button v-if="app.status === 'pending'" @click="updateStatus(app, 'cancelled')" class="btn btn-sm btn-outline-warning" title="Cancelar cita">
                                   <span class="material-symbols-outlined" style="font-size: 18px">cancel</span>
                               </button>
                               <button v-if="app.status === 'pending'" class="btn btn-sm btn-outline-info" @click="openRescheduleModal(app)" title="Reagendar">
                                   <span class="material-symbols-outlined" style="font-size: 18px">edit_calendar</span>
                               </button>
                               <button class="btn btn-sm btn-outline-danger" @click="confirmDelete(app)" title="Eliminar definitivamente">
                                   <span class="material-symbols-outlined" style="font-size: 18px">delete</span>
                               </button>
                           </div>
                       </td>
                   </tr>
                </tbody>
             </table>
        </div>
        
        <!-- Modal Reagendar -->
        <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
             <div class="modal-card shadow-lg" style="background: #0f172a; padding: 2rem; border-radius: 12px; width: 100%; max-width: 500px; border: 1px solid #334155;">
                <div class="d-flex justify-content-between align-items-center mb-4">
                    <h4 class="text-white m-0">Reagendar Cita</h4>
                    <button class="btn btn-sm btn-outline-secondary border-0 text-white" @click="closeModal" style="background: transparent;">
                        <span class="material-symbols-outlined">close</span>
                    </button>
                </div>
                
                <form @submit.prevent="saveReschedule">
                    <div class="mb-3">
                        <label class="form-label text-light fw-bold small">Nueva Fecha</label>
                        <input v-model="form.date" type="date" class="form-control bg-dark text-white border-secondary" required />
                    </div>
                    <div class="mb-3">
                        <label class="form-label text-light fw-bold small">Nueva Hora de Inicio (HH:mm)</label>
                        <input v-model="form.start_time" type="time" class="form-control bg-dark text-white border-secondary" required />
                        <div class="text-muted small mt-1">El final de la cita se calculará automáticamente.</div>
                    </div>
                    <div class="d-flex justify-content-end mt-4 gap-2">
                        <button type="button" class="btn btn-secondary" @click="closeModal">Cancelar</button>
                        <button type="submit" class="btn btn-success" :disabled="saving">
                            <span v-if="saving" class="spinner-border spinner-border-sm me-1"></span>
                            {{ saving ? 'Guardando...' : 'Guardar Cambios' }}
                        </button>
                    </div>
                </form>
             </div>
        </div>
    </div>
</template>

<script>
import { useToast } from 'vue-toastification'

export default {
    name: 'AdminAppointments',
    setup() {
        const toast = useToast()
        return { toast }
    },
    data() {
        return {
            appointments: [],
            loading: true,
            filterDate: '',
            filterStatus: '',
            showModal: false,
            saving: false,
            form: {
                id: null,
                vehicle_id: null,
                service_id: null,
                date: '',
                start_time: ''
            }
        };
    },
    methods: {
        async fetchAppointments() {
            this.loading = true;
            const token = localStorage.getItem('user_token');
            let query = '?';
            if (this.filterDate) query += `date=${this.filterDate}&`;
            if (this.filterStatus) query += `status=${this.filterStatus}&`;
            
            try {
                const res = await fetch(`${this.$BASE_URL}/v1/appointments/all${query}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await res.json();
                if(data.data) {
                    this.appointments = data.data;
                }
            } catch (err) {
                console.error(err);
                this.toast.error("Error al cargar las citas");
            } finally {
                this.loading = false;
            }
        },
        clearFilters() {
            this.filterDate = '';
            this.filterStatus = '';
            this.fetchAppointments();
        },
        async updateStatus(app, status) {
            const verb = status === 'completed' ? 'completar' : 'cancelar';
            if(!confirm(`¿Seguro que deseas ${verb} esta cita?`)) return;
            
            const token = localStorage.getItem('user_token');
            try {
                const res = await fetch(`${this.$BASE_URL}/v1/appointments/${app.id}/status`, {
                    method: 'PATCH',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ status })
                });
                if(res.ok) {
                    app.status = status;
                    this.toast.success(`Cita marcada como ${this.getStatusName(status).toLowerCase()}`);
                } else {
                    const data = await res.json();
                    this.toast.error(data.message || 'Error al actualizar');
                }
            } catch (err) {
                console.error(err);
                this.toast.error("Error de red");
            }
        },
        async confirmDelete(app) {
            if(!confirm('¿Eliminar esta cita permanentemente? Esta acción no se puede deshacer.')) return;
            const token = localStorage.getItem('user_token');
            try {
                const res = await fetch(`${this.$BASE_URL}/v1/appointment/${app.id}`, {
                    method: 'DELETE',
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if(res.ok) {
                    this.toast.success('Cita eliminada correctamente');
                    this.fetchAppointments();
                } else {
                    const data = await res.json();
                    this.toast.error(data.message || 'Error eliminando cita');
                }
            } catch (err) {
                console.error(err);
                this.toast.error("Error de red");
            }
        },
        openRescheduleModal(app) {
            this.form.id = app.id;
            this.form.vehicle_id = app.vehicle_id;
            this.form.service_id = app.service_id;
            
            let dateStr = app.appointment_date;
            // The API returns 'YYYY-MM-DD HH:mm:ss' or ISO. We need 'YYYY-MM-DD' and 'HH:mm'
            try {
                // fallback to split if the api returns just a string space separated like 2026-03-28 15:00:00
                if(typeof dateStr === 'string' && dateStr.includes(' ')) {
                    this.form.date = dateStr.split(' ')[0];
                    this.form.start_time = dateStr.split(' ')[1].slice(0, 5);
                } else {
                    const d = new Date(dateStr);
                    // Locale trick to get exactly YYYY-MM-DD local
                    const offset = d.getTimezoneOffset();
                    const dLocal = new Date(d.getTime() - (offset*60*1000));
                    
                    this.form.date = dLocal.toISOString().split('T')[0];
                    this.form.start_time = dLocal.toISOString().split('T')[1].slice(0, 5);
                }
            } catch(e) {
                console.error(e);
            }

            this.showModal = true;
        },
        closeModal() {
            this.showModal = false;
        },
        async saveReschedule() {
            this.saving = true;
            const token = localStorage.getItem('user_token');
            try {
                const res = await fetch(`${this.$BASE_URL}/v1/appointment/${this.form.id}`, {
                    method: 'PUT',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        vehicle_id: this.form.vehicle_id,
                        service_id: this.form.service_id,
                        date: this.form.date,
                        start_time: this.form.start_time
                    })
                });
                
                const data = await res.json();
                
                if(res.ok) {
                    this.toast.success('Cita reagendada correctamente');
                    this.closeModal();
                    this.fetchAppointments();
                } else {
                    this.toast.warning(data.message || 'Error al reagendar, quizás horario ocupado');
                }
            } catch (err) {
                console.error(err);
                this.toast.error('Error de red');
            } finally {
                this.saving = false;
            }
        },
        goToCreate() {
            this.$router.push('/appointments');
        },
        formatDate(dateStr) {
            if (!dateStr) return '';
            const d = new Date(dateStr);
            return d.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });
        },
        formatTime(dateStr) {
            if (!dateStr) return '';
            // Si el backend devuelve date de Carbon, aveces se envía así
            if (typeof dateStr === 'string' && dateStr.includes(' ')) {
                return dateStr.split(' ')[1].substring(0, 5);
            }
            const d = new Date(dateStr);
            return d.toLocaleTimeString('es-ES', { hour: '2-digit', minute:'2-digit' });
        },
        getStatusName(status) {
            switch(status) {
                case 'completed': return 'Completada';
                case 'cancelled': return 'Cancelada';
                default: return 'Pendiente';
            }
        },
        getStatusBadgeClass(status) {
            let base = "badge px-3 py-2 rounded-pill ";
            switch(status) {
                case 'completed': return base + "bg-success bg-opacity-75";
                case 'cancelled': return base + "bg-danger bg-opacity-75";
                default: return base + "bg-warning text-dark border border-warning";
            }
        }
    },
    mounted() {
        this.fetchAppointments();
    }
}
</script>

<style scoped>
.admin-container {
    background-color: #0f172a;
    min-height: 100vh;
}
.btn-back {
    background: transparent;
    border: none;
    color: #94a3b8;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0;
    font-size: 0.9rem;
    cursor: pointer;
    transition: color 0.2s;
}
.btn-back:hover {
    color: #f1f5f9;
}
.modal-overlay {
    position: fixed;
    top: 0; left:0; width:100%; height:100%;
    background: rgba(0,0,0,0.7);
    backdrop-filter: blur(5px);
    z-index: 1050;
    display: flex;
    align-items: center;
    justify-content: center;
    animation: fadeIn 0.2s ease;
}

@keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
}

.table-dark {
    --bs-table-bg: #1e293b;
    border-color: rgba(255, 255, 255, 0.08);
}

.opacity-50 {
    opacity: 0.6;
}
</style>
