<template>
    <div v-if="show" class="modal-overlay" @click.self="$emit('close')">
        <div class="modal-box">

        
            <div class="modal-header-custom">
                <h5 class="modal-title">
                    <span class="material-symbols-outlined icon-title me-2">
                        {{ isEdit ? 'edit' : 'add_circle' }}
                    </span>
                    {{ isEdit ? 'Editar Categoría' : 'Nueva Categoría' }}
                </h5>
                <button class="btn-close-custom" @click="$emit('close')">
                    <span class="material-symbols-outlined">close</span>
                </button>
            </div>

            <div class="modal-body-custom">
                <div class="mb-3">
                    <label class="form-label-custom">Nombre de la categoría</label>
                    <input
                        v-model="form.name"
                        type="text"
                        class="input-custom"
                        placeholder="Ej: Limpieza, Suspension, Frenos..."
                    />
                    <span v-if="errors.name" class="error-text">{{ errors.name }}</span>
                </div>
            </div>

          
            <div class="modal-footer-custom">
                <button class="btn-cancel" @click="$emit('close')">
                    Cancelar
                </button>
                <button class="btn-save" @click="save" :disabled="loading">
                    <span v-if="loading" class="material-symbols-outlined spinning">progress_activity</span>
                    <span v-else class="material-symbols-outlined">save</span>
                    {{ loading ? 'Guardando...' : 'Guardar' }}
                </button>
            </div>

        </div>
    </div>
</template>

<script>
export default {
    props: {
        category: {
            type: Object,
            default: null,
        },
        isEdit: {
            type: Boolean,
            default: false,
        },
        show: {
            type: Boolean,
            default: false,
        },
    },
    emits: ['refresh', 'close'],
    data() {
        return {
            form: { name: '' },
            errors: { name: '' },
            loading: false,
        };
    },

    watch: {
        show(visible) {
            if (visible) {
                this.form.name = this.category ? this.category.name : '';
                this.errors.name = '';
            }
        },
    },

    methods: {
        //Validamos que al menos introduzca un nombre
        validate() {
            this.errors.name = '';
            if (!this.form.name.trim()) {
                this.errors.name = 'El nombre es obligatorio.';
                return false;
            }
            return true;
        },
        // Identificamos si el usuario quiere crear o actualizar
        async save() {
            if (!this.validate()) return;

            if (this.isEdit) {
                await this.update();
            } else {
                await this.create();
            }
        },

        async create() {
            const token = localStorage.getItem('user_token');
            this.loading = true;

            try {
                const response = await fetch(`${this.$BASE_URL}/v1/categories`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Accept: 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(this.form),
                });

                if (!response.ok) {
                    console.error('Error al crear la categoría');
                    return;
                }

                //Una vez se complete el fetch actualizamos las categorias y cerramos la modal
                this.$emit('refresh'); 
                this.$emit('close');   

            } catch (error) {
                console.error('Error al crear categoría:', error);
            } finally {
                this.loading = false;
            }
        },
        async update() {

            const token = localStorage.getItem('user_token');
            this.loading = true;

            try {
                const response = await fetch(`${this.$BASE_URL}/v1/categories/${this.category.id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        Accept: 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(this.form),
                });

                if (!response.ok) {
                    console.error('Error al actualizar la categoría');
                    return;
                }

                //Una vez se complete el fetch actualizamos las categorias y cerramos la modal
                this.$emit('refresh');
                this.$emit('close');

            } catch (error) {
                console.error('Error al actualizar categoría:', error);
            } finally {
                this.loading = false;
            }
        },
    },
};
</script>

<style scoped>
/* ── Fondo oscuro detrás del modal ───────────────── */
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.6);
    backdrop-filter: blur(4px);
    z-index: 1050;
    display: flex;
    align-items: center;
    justify-content: center;
}

/* ── Caja del modal ──────────────────────────────── */
.modal-box {
    width: 100%;
    max-width: 480px;
    background-color: #1e293b;
    border: 1px solid rgba(255, 255, 255, 0.07);
    border-radius: 20px;
    color: #cbd5e1;
    box-shadow: 0 25px 60px rgba(0, 0, 0, 0.5);
    overflow: hidden;
}

/* ── Cabecera ────────────────────────────────────── */
.modal-header-custom {
    border-bottom: 1px solid rgba(255, 255, 255, 0.06);
    padding: 1.5rem 1.8rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.modal-title {
    color: #f8fafc;
    font-weight: 800;
    font-size: 1.1rem;
    display: flex;
    align-items: center;
    margin: 0;
}

.icon-title {
    color: #a3e635;
    filter: drop-shadow(0 0 6px rgba(163, 230, 53, 0.4));
}

.btn-close-custom {
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 8px;
    color: #94a3b8;
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s;
}

.btn-close-custom:hover {
    background: rgba(239, 68, 68, 0.15);
    border-color: rgba(239, 68, 68, 0.3);
    color: #ef4444;
}

/* ── Cuerpo ──────────────────────────────────────── */
.modal-body-custom {
    padding: 1.5rem 1.8rem;
}

.form-label-custom {
    color: #94a3b8;
    font-size: 0.85rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-bottom: 0.5rem;
    display: block;
}

.input-custom {
    width: 100%;
    background: rgba(15, 23, 42, 0.6);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 12px;
    padding: 0.75rem 1rem;
    color: #f1f5f9;
    font-size: 0.95rem;
    transition: all 0.3s;
    outline: none;
}

.input-custom:focus {
    border-color: rgba(163, 230, 53, 0.5);
    box-shadow: 0 0 0 3px rgba(163, 230, 53, 0.1);
    background: rgba(15, 23, 42, 0.8);
}

.input-custom::placeholder {
    color: #475569;
}

.error-text {
    color: #f87171;
    font-size: 0.8rem;
    margin-top: 0.4rem;
    display: block;
}

/* ── Pie ─────────────────────────────────────────── */
.modal-footer-custom {
    border-top: 1px solid rgba(255, 255, 255, 0.06);
    padding: 1.2rem 1.8rem;
    display: flex;
    justify-content: flex-end;
    gap: 12px;
}

.btn-cancel {
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    color: #94a3b8;
    padding: 0.6rem 1.2rem;
    border-radius: 10px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
}

.btn-cancel:hover {
    background: rgba(255, 255, 255, 0.1);
    color: #f1f5f9;
}

.btn-save {
    background: linear-gradient(135deg, rgba(163, 230, 53, 0.25), rgba(163, 230, 53, 0.1));
    border: 1px solid rgba(163, 230, 53, 0.5);
    color: #a3e635;
    padding: 0.6rem 1.4rem;
    border-radius: 10px;
    font-weight: 700;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 6px;
    transition: all 0.3s;
}

.btn-save:hover:not(:disabled) {
    background: #a3e635;
    color: #0f172a;
    box-shadow: 0 0 20px rgba(163, 230, 53, 0.4);
}

.btn-save:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

/* Spinner de carga */
.spinning {
    animation: spin 1s linear infinite;
}

@keyframes spin {
    from { transform: rotate(0deg); }
    to   { transform: rotate(360deg); }
}
</style>