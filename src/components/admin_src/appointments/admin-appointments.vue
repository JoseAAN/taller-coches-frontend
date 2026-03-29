<template>
    <div class="admin-container p-4">

        <!-- CABECERA -->
        <div class="mb-4">
            <button class="btn-back mb-3" @click="$router.push('/admin')">
                <span class="material-symbols-outlined">arrow_back</span>
                Panel de administración
            </button>
            <div class="d-flex justify-content-between align-items-center">
                <div>
                    <h2 class="text-white fw-bold h4 m-0">Gestión de Citas</h2>
                    <p class="text-white-50 small mb-0 mt-1">Calendario y estado de las citas en el taller</p>
                </div>
                <button class="btn btn-success d-flex align-items-center gap-2" @click="$router.push('/appointments')">
                    <span class="material-symbols-outlined" style="font-size:18px">add</span> Nueva Cita
                </button>
            </div>
        </div>

        <!-- LAYOUT: Calendario a la izquierda, lista a la derecha -->
        <div class="main-layout">

            <!-- ========== CALENDARIO ========== -->
            <div class="calendar-shell">

                <!-- Fila con mes actual y botones para cambiar de mes -->
                <div class="d-flex justify-content-between align-items-center mb-3">
                    <button class="cal-nav-btn" @click="cambiarMes(-1)">
                        <span class="material-symbols-outlined">chevron_left</span>
                    </button>
                    <span class="cal-month-label">{{ mesLabel }}</span>
                    <button class="cal-nav-btn" @click="cambiarMes(1)">
                        <span class="material-symbols-outlined">chevron_right</span>
                    </button>
                </div>

                <!-- Nombres de los días de la semana -->
                <div class="cal-weekdays">
                    <span v-for="dia in ['Lun','Mar','Mié','Jue','Vie','Sáb','Dom']" :key="dia">{{ dia }}</span>
                </div>

                <!-- Cuadrícula de días -->
                <div class="cal-grid">
                    <div
                        v-for="(celda, i) in celdasDelMes"
                        :key="i"
                        class="cal-cell"
                        :class="{
                            'cal-cell--vacia':        !celda.dia,
                            'cal-cell--hoy':          celda.esHoy,
                            'cal-cell--seleccionado': celda.dia && diaSeleccionado === celda.fecha,
                            'cal-cell--con-citas':    celda.dia && citasPorDia[celda.fecha]?.length > 0
                        }"
                        @click="celda.dia && seleccionarDia(celda.fecha)"
                    >
                        <span v-if="celda.dia" class="cal-day-number">{{ celda.dia }}</span>
                        <!-- Bolita verde con el número de citas que tiene ese día -->
                        <span v-if="celda.dia && citasPorDia[celda.fecha]?.length > 0" class="cal-dot-count">
                            {{ citasPorDia[celda.fecha].length }}
                        </span>
                    </div>
                </div>

            </div>
            <!-- FIN CALENDARIO -->


            <!-- ========== PANEL DE CITAS DEL DÍA ========== -->
            <div class="day-panel">

                <!-- Título del panel: muestra el día seleccionado o un texto por defecto -->
                <div class="d-flex justify-content-between align-items-center mb-3">
                    <div>
                        <h5 class="text-white fw-bold m-0">
                            <span class="material-symbols-outlined align-middle me-1" style="font-size:20px">calendar_today</span>
                            {{ diaSeleccionado ? formatearFechaLarga(diaSeleccionado) : 'Selecciona un día' }}
                        </h5>
                        <span class="text-white-50 small" v-if="diaSeleccionado">
                            {{ citasDelDia.length }} cita{{ citasDelDia.length !== 1 ? 's' : '' }}
                        </span>
                    </div>

                    <!-- Filtro de estado (solo se muestra si hay un día seleccionado) -->
                    <select
                        v-if="diaSeleccionado"
                        class="form-select form-select-sm bg-dark text-white border-secondary w-auto"
                        v-model="filtroEstado"
                    >
                        <option value="">Todas</option>
                        <option value="pending">Pendientes</option>
                        <option value="completed">Completadas</option>
                        <option value="cancelled">Canceladas</option>
                    </select>
                </div>

                <!-- ESTADO 1: Cargando -->
                <div v-if="cargando" class="text-center text-white py-5">
                    <div class="spinner-border text-light" role="status"></div>
                    <div class="mt-2 small text-white-50">Cargando citas...</div>
                </div>

                <!-- ESTADO 2: Ningún día seleccionado todavía -->
                <div v-else-if="!diaSeleccionado" class="empty-state py-5 text-center">
                    <span class="material-symbols-outlined text-muted d-block mb-2" style="font-size:48px">touch_app</span>
                    <p class="text-white-50 mb-0">Haz clic en un día del calendario para ver sus citas</p>
                </div>

                <!-- ESTADO 3: Día seleccionado pero sin citas -->
                <div v-else-if="citasDelDia.length === 0" class="empty-state py-5 text-center">
                    <span class="material-symbols-outlined text-muted d-block mb-2" style="font-size:48px">event_busy</span>
                    <p class="text-white-50 mb-0">No hay citas para este día</p>
                </div>

                <!-- ESTADO 4: Lista de citas -->
                <div v-else class="appointments-list">
                    <div
                        v-for="cita in citasDelDia"
                        :key="cita.id"
                        class="appointment-card"
                        :class="{
                            'appointment-card--completed': cita.status === 'completed',
                            'appointment-card--cancelled': cita.status === 'cancelled'
                        }"
                    >
                        <!-- Hora de inicio y fin a la izquierda -->
                        <div class="appt-time-bar">
                            <span class="appt-time-start">{{ formatearHora(cita.appointment_date) }}</span>
                            <div class="appt-time-line"></div>
                            <span class="appt-time-end">{{ formatearHora(cita.end_time) }}</span>
                        </div>

                        <!-- Datos de la cita -->
                        <div class="appt-body flex-grow-1">
                            <div class="d-flex justify-content-between align-items-start">
                                <div>
                                    <div class="fw-bold text-white">{{ cita.service?.name }}</div>
                                    <div class="text-white-50 small mt-1">
                                        <span class="material-symbols-outlined align-middle" style="font-size:14px">person</span>
                                        {{ cita.vehicle?.user?.name || 'Cliente desconocido' }}
                                    </div>
                                    <div class="mt-1">
                                        <span class="badge bg-secondary small">{{ cita.vehicle?.license_plate || '---' }}</span>
                                    </div>
                                </div>
                                <div class="text-end">
                                    <span :class="claseBadgeEstado(cita.status)" class="mb-2 d-block">
                                        {{ nombreEstado(cita.status) }}
                                    </span>
                                    <div class="text-white fw-bold">{{ cita.final_price }} €</div>
                                </div>
                            </div>

                            <!-- Botones de acción -->
                            <div class="d-flex gap-2 mt-3 flex-wrap">
                                <!-- Solo se muestran estos botones si la cita está pendiente -->
                                <template v-if="cita.status === 'pending'">
                                    <button @click="cambiarEstado(cita, 'completed')" class="btn btn-sm btn-outline-success d-flex align-items-center gap-1">
                                        <span class="material-symbols-outlined" style="font-size:16px">check_circle</span> Completar
                                    </button>
                                    <button @click="cambiarEstado(cita, 'cancelled')" class="btn btn-sm btn-outline-warning d-flex align-items-center gap-1">
                                        <span class="material-symbols-outlined" style="font-size:16px">cancel</span> Cancelar
                                    </button>
                                    <button @click="abrirModalReagendar(cita)" class="btn btn-sm btn-outline-info d-flex align-items-center gap-1">
                                        <span class="material-symbols-outlined" style="font-size:16px">edit_calendar</span> Reagendar
                                    </button>
                                </template>
                                <button @click="eliminarCita(cita)" class="btn btn-sm btn-outline-danger ms-auto d-flex align-items-center gap-1">
                                    <span class="material-symbols-outlined" style="font-size:16px">delete</span> Eliminar
                                </button>
                            </div>
                        </div>

                    </div>
                </div>
                <!-- FIN lista de citas -->

            </div>
            <!-- FIN PANEL -->

        </div>
        <!-- FIN LAYOUT -->


        <!-- MODAL REAGENDAR -->
        <div v-if="mostrarModal" class="modal-overlay" @click.self="mostrarModal = false">
            <div class="modal-card">
                <div class="d-flex justify-content-between align-items-center mb-4">
                    <h4 class="text-white m-0">Reagendar Cita</h4>
                    <button class="btn btn-sm text-white" @click="mostrarModal = false" style="background:transparent; border:none;">
                        <span class="material-symbols-outlined">close</span>
                    </button>
                </div>
                <form @submit.prevent="guardarReagenda">
                    <div class="mb-3">
                        <label class="form-label text-light fw-bold small">Nueva Fecha</label>
                        <input v-model="formulario.fecha" type="date" class="form-control bg-dark text-white border-secondary" required />
                    </div>
                    <div class="mb-3">
                        <label class="form-label text-light fw-bold small">Nueva Hora de Inicio</label>
                        <input v-model="formulario.hora" type="time" class="form-control bg-dark text-white border-secondary" required />
                        <div class="text-muted small mt-1">El final se calculará automáticamente.</div>
                    </div>
                    <div class="d-flex justify-content-end gap-2 mt-4">
                        <button type="button" class="btn btn-secondary" @click="mostrarModal = false">Cancelar</button>
                        <button type="submit" class="btn btn-success" :disabled="guardando">
                            <span v-if="guardando" class="spinner-border spinner-border-sm me-1"></span>
                            {{ guardando ? 'Guardando...' : 'Guardar Cambios' }}
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
        const hoy = new Date()
        return {
            // --- Estado del calendario ---
            anio: hoy.getFullYear(),
            mes: hoy.getMonth(),        // 0 = enero, 11 = diciembre
            diaSeleccionado: null,       // string 'YYYY-MM-DD' o null

            // --- Datos de la API ---
            todasLasCitas: [],           // citas del mes completo
            cargando: false,
            filtroEstado: '',            // '' | 'pending' | 'completed' | 'cancelled'

            // --- Modal reagendar ---
            mostrarModal: false,
            guardando: false,
            formulario: {
                id:          null,
                vehiculo_id: null,
                servicio_id: null,
                fecha:       '',
                hora:        ''
            }
        }
    },

    computed: {
        // Texto del mes que se muestra en el calendario, ej: "Marzo 2026"
        mesLabel() {
            return new Date(this.anio, this.mes, 1)
                .toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })
                .replace(/^\w/, c => c.toUpperCase())
        },

        // Genera las celdas del calendario (días + huecos vacíos al inicio)
        celdasDelMes() {
            const primerDia       = new Date(this.anio, this.mes, 1).getDay()  // 0=Dom
            const huecosIniciales = (primerDia + 6) % 7                        // convertir a Lun=0
            const diasEnElMes     = new Date(this.anio, this.mes + 1, 0).getDate()
            const hoyStr          = this.aYMD(new Date())
            const celdas          = []

            // Huecos vacíos antes del día 1
            for (let i = 0; i < huecosIniciales; i++) {
                celdas.push({ dia: null })
            }

            // Un objeto por cada día del mes
            for (let d = 1; d <= diasEnElMes; d++) {
                const fecha = `${this.anio}-${String(this.mes + 1).padStart(2,'0')}-${String(d).padStart(2,'0')}`
                celdas.push({ dia: d, fecha, esHoy: fecha === hoyStr })
            }

            return celdas
        },

        // Agrupa las citas por día: { 'YYYY-MM-DD': [cita, cita, ...] }
        citasPorDia() {
            const mapa = {}
            for (const cita of this.todasLasCitas) {
                const clave = this.extraerFecha(cita.appointment_date)
                if (!mapa[clave]) mapa[clave] = []
                mapa[clave].push(cita)
            }
            return mapa
        },

        // Citas del día seleccionado, aplicando el filtro de estado si lo hay
        citasDelDia() {
            if (!this.diaSeleccionado) return []
            const lista = this.citasPorDia[this.diaSeleccionado] || []
            if (!this.filtroEstado) return lista
            return lista.filter(c => c.status === this.filtroEstado)
        }
    },

    methods: {

        // -----------------------------------------------
        // CALENDARIO
        // -----------------------------------------------

        // Avanza o retrocede el mes. delta = 1 (siguiente) o -1 (anterior)
        cambiarMes(delta) {
            this.mes += delta
            if (this.mes > 11) { this.mes = 0;  this.anio++ }
            if (this.mes < 0)  { this.mes = 11; this.anio-- }
            this.diaSeleccionado = null
            this.cargarCitas()
        },

        // Guarda el día en el que hizo clic el usuario
        seleccionarDia(fecha) {
            this.diaSeleccionado = fecha
            this.filtroEstado    = ''
        },

        // -----------------------------------------------
        // API
        // -----------------------------------------------

        async cargarCitas() {
            this.cargando = true
            const token   = localStorage.getItem('user_token')
            const mesStr  = `${this.anio}-${String(this.mes + 1).padStart(2, '0')}`

            try {
                const res  = await fetch(`${this.$BASE_URL}/v1/appointments/all?month=${mesStr}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                })
                const data = await res.json()
                if (data.data) this.todasLasCitas = data.data
            } catch (err) {
                console.error(err)
                this.toast.error('Error al cargar las citas')
            } finally {
                this.cargando = false
            }
        },

        async cambiarEstado(cita, nuevoEstado) {
            const verbo = nuevoEstado === 'completed' ? 'completar' : 'cancelar'
            if (!confirm(`¿Seguro que deseas ${verbo} esta cita?`)) return

            const token = localStorage.getItem('user_token')
            try {
                const res = await fetch(`${this.$BASE_URL}/v1/appointments/${cita.id}/status`, {
                    method:  'PATCH',
                    headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
                    body:    JSON.stringify({ status: nuevoEstado })
                })
                if (res.ok) {
                    cita.status = nuevoEstado   // actualizamos en local sin recargar
                    this.toast.success(`Cita marcada como ${this.nombreEstado(nuevoEstado).toLowerCase()}`)
                } else {
                    const data = await res.json()
                    this.toast.error(data.message || 'Error al actualizar')
                }
            } catch (err) {
                console.error(err)
                this.toast.error('Error de red')
            }
        },

        async eliminarCita(cita) {
            if (!confirm('¿Eliminar esta cita permanentemente?')) return

            const token = localStorage.getItem('user_token')
            try {
                const res = await fetch(`${this.$BASE_URL}/v1/appointment/${cita.id}`, {
                    method:  'DELETE',
                    headers: { 'Authorization': `Bearer ${token}` }
                })
                if (res.ok) {
                    // La quitamos del array local para no tener que recargar todo
                    this.todasLasCitas = this.todasLasCitas.filter(c => c.id !== cita.id)
                    this.toast.success('Cita eliminada correctamente')
                } else {
                    const data = await res.json()
                    this.toast.error(data.message || 'Error al eliminar')
                }
            } catch (err) {
                console.error(err)
                this.toast.error('Error de red')
            }
        },

        // -----------------------------------------------
        // MODAL REAGENDAR
        // -----------------------------------------------

        abrirModalReagendar(cita) {
            // Rellenamos el formulario con los datos actuales de la cita
            this.formulario.id          = cita.id
            this.formulario.vehiculo_id = cita.vehicle_id
            this.formulario.servicio_id = cita.service_id

            // Separamos la fecha y la hora del campo appointment_date
            const fechaStr = cita.appointment_date
            if (typeof fechaStr === 'string' && fechaStr.includes(' ')) {
                // Formato "YYYY-MM-DD HH:mm:ss"
                this.formulario.fecha = fechaStr.split(' ')[0]
                this.formulario.hora  = fechaStr.split(' ')[1].slice(0, 5)
            } else {
                // Formato ISO "YYYY-MM-DDTHH:mm:ss"
                const d      = new Date(fechaStr)
                const offset = d.getTimezoneOffset()
                const local  = new Date(d.getTime() - offset * 60000)
                this.formulario.fecha = local.toISOString().split('T')[0]
                this.formulario.hora  = local.toISOString().split('T')[1].slice(0, 5)
            }

            this.mostrarModal = true
        },

        async guardarReagenda() {
            this.guardando = true
            const token    = localStorage.getItem('user_token')

            try {
                const res  = await fetch(`${this.$BASE_URL}/v1/appointment/${this.formulario.id}`, {
                    method:  'PUT',
                    headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        vehicle_id: this.formulario.vehiculo_id,
                        service_id: this.formulario.servicio_id,
                        date:       this.formulario.fecha,
                        start_time: this.formulario.hora
                    })
                })
                const data = await res.json()

                if (res.ok) {
                    this.toast.success('Cita reagendada correctamente')
                    this.mostrarModal = false
                    this.cargarCitas()   // recargamos para ver el cambio en el calendario
                } else {
                    this.toast.warning(data.message || 'Error al reagendar')
                }
            } catch (err) {
                console.error(err)
                this.toast.error('Error de red')
            } finally {
                this.guardando = false
            }
        },

        // -----------------------------------------------
        // HELPERS (funciones de apoyo pequeñas)
        // -----------------------------------------------

        // Convierte un objeto Date a string 'YYYY-MM-DD'
        aYMD(date) {
            const y = date.getFullYear()
            const m = String(date.getMonth() + 1).padStart(2, '0')
            const d = String(date.getDate()).padStart(2, '0')
            return `${y}-${m}-${d}`
        },

        // Extrae solo la parte de la fecha de un string como '2026-03-29 10:00:00'
        extraerFecha(str) {
            if (!str) return ''
            if (typeof str === 'string' && str.includes(' ')) return str.split(' ')[0]
            return str.split('T')[0]
        },

        // Devuelve la fecha en formato largo: "Domingo, 29 de marzo de 2026"
        formatearFechaLarga(str) {
            if (!str) return ''
            const [y, m, d] = str.split('-').map(Number)
            return new Date(y, m - 1, d)
                .toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
                .replace(/^\w/, c => c.toUpperCase())
        },

        // Devuelve solo la hora '10:30' de un string de fecha
        formatearHora(str) {
            if (!str) return ''
            if (typeof str === 'string' && str.includes(' ')) return str.split(' ')[1].substring(0, 5)
            return new Date(str).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
        },

        // Texto del estado para mostrar al usuario
        nombreEstado(status) {
            const nombres = { completed: 'Completada', cancelled: 'Cancelada', pending: 'Pendiente' }
            return nombres[status] || 'Pendiente'
        },

        // Clase CSS del badge según el estado
        claseBadgeEstado(status) {
            const base   = 'badge px-2 py-1 rounded-pill '
            const clases = {
                completed: base + 'bg-success bg-opacity-75',
                cancelled: base + 'bg-danger bg-opacity-75',
                pending:   base + 'bg-warning text-dark'
            }
            return clases[status] || clases.pending
        }
    },

    // Al montar el componente, cargamos las citas del mes actual
    mounted() {
        this.cargarCitas()
    }
}
</script>

<style scoped>
/* Fondo general de la página */
.admin-container {
    background-color: #0f172a;
    min-height: 100vh;
}

/* Botón "volver" sin estilo de botón */
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
.btn-back:hover { color: #f1f5f9; }

/* Contenedor principal: pone el calendario y el panel uno al lado del otro */
.main-layout {
    display: flex;
    gap: 1.25rem;
    align-items: flex-start;
}

/* ====== CALENDARIO ====== */
.calendar-shell {
    background: #1e293b;
    border: 1px solid #334155;
    border-radius: 14px;
    padding: 1rem 1.25rem;
    width: 340px;
    flex-shrink: 0; /* no se encoge aunque haya poco espacio */
}

.cal-month-label {
    color: #f1f5f9;
    font-size: 0.9rem;
    font-weight: 700;
    text-transform: capitalize;
}

.cal-nav-btn {
    background: #0f172a;
    border: 1px solid #334155;
    border-radius: 7px;
    color: #94a3b8;
    width: 28px;
    height: 28px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.15s;
}
.cal-nav-btn:hover { background: #334155; color: #f1f5f9; }
.cal-nav-btn .material-symbols-outlined { font-size: 18px; }

/* Fila de "Lun Mar Mié..." */
.cal-weekdays {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    margin-bottom: 0.25rem;
}
.cal-weekdays span {
    text-align: center;
    font-size: 0.65rem;
    font-weight: 700;
    color: #64748b;
    text-transform: uppercase;
    padding: 0.2rem 0;
}

/* Cuadrícula de días */
.cal-grid {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 3px;
}

.cal-cell {
    aspect-ratio: 1;
    border-radius: 8px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    border: 1px solid transparent;
    transition: all 0.15s ease;
}
.cal-cell--vacia                                        { cursor: default; }
.cal-cell:not(.cal-cell--vacia):hover                   { background: #334155; border-color: #475569; }
.cal-cell--hoy                                          { border-color: #3b82f6 !important; background: rgba(59,130,246,0.08); }
.cal-cell--seleccionado                                 { background: #3b82f6 !important; border-color: #3b82f6 !important; }
.cal-cell--con-citas:not(.cal-cell--seleccionado)       { background: rgba(34,197,94,0.06); }
.cal-cell--seleccionado .cal-day-number                 { color: #fff !important; }
.cal-cell--seleccionado .cal-dot-count                  { background: rgba(255,255,255,0.3) !important; color: #fff !important; }

.cal-day-number {
    font-size: 0.75rem;
    font-weight: 600;
    color: #e2e8f0;
    line-height: 1;
}
.cal-cell--hoy:not(.cal-cell--seleccionado) .cal-day-number { color: #60a5fa; }

/* Bolita verde con el número de citas */
.cal-dot-count {
    margin-top: 2px;
    background: #22c55e;
    color: #fff;
    font-size: 0.55rem;
    font-weight: 800;
    border-radius: 999px;
    padding: 0 4px;
    min-width: 14px;
    text-align: center;
    line-height: 1.4;
}

/* ====== PANEL DE CITAS ====== */
.day-panel {
    background: #1e293b;
    border: 1px solid #334155;
    border-radius: 14px;
    padding: 1.5rem;
    flex: 1;       /* ocupa todo el espacio que sobra */
    min-width: 0;  /* evita que desborde */
}

.empty-state { opacity: 0.7; }

/* Lista de tarjetas de cita */
.appointments-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.appointment-card {
    display: flex;
    gap: 16px;
    background: #0f172a;
    border: 1px solid #334155;
    border-radius: 12px;
    padding: 1rem 1.25rem;
    transition: border-color 0.2s, transform 0.15s;
}
.appointment-card:hover      { border-color: #475569; transform: translateY(-1px); }
.appointment-card--completed { border-left: 3px solid #22c55e; opacity: 0.85; }
.appointment-card--cancelled { border-left: 3px solid #ef4444; opacity: 0.55; }

/* Columna de hora a la izquierda de cada tarjeta */
.appt-time-bar {
    display: flex;
    flex-direction: column;
    align-items: center;
    min-width: 44px;
}
.appt-time-start, .appt-time-end {
    font-size: 0.7rem;
    font-weight: 700;
    color: #94a3b8;
    white-space: nowrap;
}
.appt-time-line {
    flex: 1;
    width: 2px;
    background: #334155;
    border-radius: 2px;
    margin: 4px 0;
    min-height: 20px;
}

/* ====== MODAL ====== */
.modal-overlay {
    position: fixed;
    inset: 0;  /* cubre toda la pantalla */
    background: rgba(0, 0, 0, 0.75);
    backdrop-filter: blur(6px);
    z-index: 1050;
    display: flex;
    align-items: center;
    justify-content: center;
    animation: aparecer 0.2s ease;
}

.modal-card {
    background: #0f172a;
    padding: 2rem;
    border-radius: 14px;
    width: 100%;
    max-width: 480px;
    border: 1px solid #334155;
}

@keyframes aparecer {
    from { opacity: 0; transform: scale(0.97); }
    to   { opacity: 1; transform: scale(1); }
}
</style>