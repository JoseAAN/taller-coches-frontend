import { onMounted } from 'vue';
<template>
    <div v-if="isOpen" class="modal-overlay" @click.self="isOpen = false">
        <div class="modal-content-custom shadow-2xl">
            <div class="modal-header-custom">
                <h3 class="h5 text-white m-0">
                    {{ serviceSelected.id ? 'Editar Módulo' : 'Nuevo Módulo' }}
                </h3>
                <button @click="closeModal()" class="close-btn">&times;</button>
            </div>
            <div class="modal-body-custom">
                <div class="row g-3">
                    <div class="col-12">
                        <label class="form-label-custom">Nombre del Módulo</label>
                        <input v-model="serviceSelected.label" type="text" class="form-input-custom"
                            placeholder="Ej: Configuración" value={{serviceSelected.label}}>
                    </div>

                    <div class="col-12">
                        <label class="form-label-custom">Pertenece a (Padre)</label>
                        <select v-model="serviceSelected.parent_id" class="form-input-custom">
                            <option :value="null">Ninguno (Es un módulo principal)</option>
                            <option v-for="p in services" :key="p.id" :value="p.id">
                                {{ p.label }}
                            </option>
                        </select>
                    </div>
                    <div class="col-md-6">
                        <label class="form-label-custom">Icono (Material)</label>
                        <input v-model="serviceSelected.icon" type="text" class="form-input-custom"
                            placeholder="settings">
                    </div>
                    <div class="col-md-6">
                        <label class="form-label-custom">Orden</label>
                        <input v-model="serviceSelected.order" type="number" class="form-input-custom">
                    </div>
                    <div class="col-12">
                        <label class="form-label-custom">Ruta (URL)</label>
                        <input v-model="serviceSelected.route" type="text" class="form-input-custom"
                            placeholder="/admin/dashboard"
                            :disabled="!serviceSelected.parent_id">
                    </div>
                    <div class="col-12 mt-4">
                        <div class="form-check-custom">
                            <input v-model="serviceSelected.is_active" type="checkbox" id="is_active">
                            <label for="is_active" class="ms-2">Módulo activo</label>
                        </div>
                    </div>
                </div>
            </div>
            <div class="modal-footer-custom">
                <button @click="closeModal()" class="btn-cancel">Cancelar</button>
                <!-- Aquí básicamente si tiene id -->
                <button @click="saveChanges()" class="btn-save">
                    {{ serviceSelected.id ? 'Actualizar' : 'Crear Módulo' }}
                </button>
            </div>
        </div>
    </div>
</template>

<script>

export default {
    name: 'SidebarConfigurationModal',
    props: ["service", "isOpen", "services"],
    computed: {
        serviceSelected() {
            return this.service ? { ...this.service } : {
                label: '',
                parent_id: null,
                icon: '',
                order: 0,
                route: '',
                is_active: false
            };
        }
    },
    methods: {
        saveChanges() {
            console.log('dentro de comp hijo ');
            console.log(this.serviceSelected);
            
            this.$emit('save', this.serviceSelected);
            this.closeModal();
        },
        closeModal() {
            this.$emit('close');
        }

    },
}
</script>


<style scoped>
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(2, 6, 23, 0.85);
    backdrop-filter: blur(8px);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999;
}

.modal-content-custom {
    background-color: #1e293b;
    width: 100%;
    max-width: 500px;
    border-radius: 16px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    overflow: hidden;
    animation: slideIn 0.3s ease-out;
}

.modal-header-custom {
    padding: 1.5rem;
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.close-btn {
    background: none;
    border: none;
    color: #64748b;
    font-size: 1.5rem;
    cursor: pointer;
}

.modal-body-custom {
    padding: 1.5rem;
}

.modal-footer-custom {
    padding: 1.2rem 1.5rem;
    background: rgba(15, 23, 42, 0.5);
    display: flex;
    justify-content: flex-end;
    gap: 10px;
}

.form-label-custom {
    display: block;
    color: #94a3b8;
    font-size: 0.8rem;
    font-weight: 700;
    text-transform: uppercase;
    margin-bottom: 0.5rem;
}

.form-input-custom {
    width: 100%;
    background: #0f172a;
    border: 1px solid #334155;
    border-radius: 8px;
    padding: 0.75rem;
    color: white;
    transition: border-color 0.2s;
}

.form-input-custom:focus {
    outline: none;
    border-color: #a3e635;
}

.form-check-custom {
    display: flex;
    align-items: center;
    color: #cbd5e1;
    font-weight: 600;
    cursor: pointer;
}

.btn-save {
    background: #a3e635;
    color: #0f172a;
    border: none;
    padding: 0.6rem 1.5rem;
    border-radius: 8px;
    font-weight: 700;
}

.btn-cancel {
    background: transparent;
    color: #94a3b8;
    border: 1px solid #334155;
    padding: 0.6rem 1.5rem;
    border-radius: 8px;
    font-weight: 700;
}

@keyframes pulse {
    0% {
        transform: scale(0.95);
        box-shadow: 0 0 0 0 rgba(163, 230, 53, 0.7);
    }

    70% {
        transform: scale(1);
        box-shadow: 0 0 0 10px rgba(163, 230, 53, 0);
    }

    100% {
        transform: scale(0.95);
        box-shadow: 0 0 0 0 rgba(163, 230, 53, 0);
    }
}

@keyframes slideIn {
    from {
        transform: translateY(20px);
        opacity: 0;
    }

    to {
        transform: translateY(0);
        opacity: 1;
    }
}
</style>