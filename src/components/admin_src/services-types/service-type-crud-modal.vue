<template>
    <div class="modal fade" id="serviceTypeModal" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content modal-content-custom shadow-lg">

                <div class="modal-header modal-header-custom border-0 pb-0">
                    <h5 class="modal-title d-flex align-items-center gap-2 fw-bold text-white">
                        <span class="material-symbols-outlined icon-modal"
                            :class="isEdit ? 'text-neon-teal' : 'text-neon-green'">
                            {{ isEdit ? 'edit_square' : 'add_circle' }}
                        </span>
                        {{ isEdit ? "Editar Tipo de Servicio" : "Crear Tipo de Servicio" }}
                    </h5>
                    <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"
                        aria-label="Cerrar"></button>
                </div>

                <div class="modal-body modal-body-custom pt-4">
                    <form @submit.prevent="submit">

                        <div class="form-group mb-4">
                            <label class="form-label text-muted small text-uppercase fw-bold mb-2">Nombre del
                                Tipo</label>
                            <div class="input-group-custom">
                                <span class="material-symbols-outlined input-icon">badge</span>
                                <input v-model="form.name" class="form-control form-control-custom"
                                    placeholder="Ej. Cambio de Aceite..." required />
                            </div>
                        </div>

                        <div class="modal-footer-custom px-0 border-0 pt-0">
                            <button type="button" class="btn btn-secondary-neon" data-bs-dismiss="modal">
                                Cancelar
                            </button>
                            <button type="submit" class="btn"
                                :class="isEdit ? 'btn-edit-neon-filled' : 'btn-create-neon'">
                                {{ isEdit ? "Guardar Cambios" : "Crear Tipo" }}
                            </button>
                        </div>

                    </form>
                </div>

            </div>
        </div>
    </div>
</template>

<script>
import { loaderState } from '@/loaderState';

export default {
    name: "ServiceTypeModal",

    props: {
        serviceType: Object,
        isEdit: Boolean,
    },

    data() {
        return {
            form: { id: null, name: "" },
        };
    },

    watch: {
        serviceType: {
            immediate: true,
            handler(newVal) {
                if (newVal) {
                    this.form = { id: newVal.id, name: newVal.name };
                } else {
                    this.resetForm();
                }
            },
        },
    },

    methods: {
        async submit() {
            try {
                loaderState.show();
                const token = localStorage.getItem("user");
                // esto simplemente comprueba si estamos editando o creando para saber que uri usar
                const url = this.isEdit
                    ? `${this.$BASE_URL}/v1/serviceType/${this.form.id}`
                    : `${this.$BASE_URL}/v1/serviceType`;

                const method = this.isEdit ? "PUT" : "POST";

                const res = await fetch(url, {
                    method,
                    headers: {
                        "Content-Type": "application/json",
                        Accept: "application/json",
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify({ name: this.form.name }),
                });

                if (!res.ok) {
                    const error = await res.json();
                    console.error(error.message);
                    return;
                }

                this.$emit("refresh");
                this.resetForm();

                const btnClose = document.querySelector("#serviceTypeModal .btn-close");
                if (btnClose) btnClose.click();

            } catch (err) {
                console.error(err);
            } finally {
                loaderState.hide();
            }
        },

        resetForm() {
            this.form = { id: null, name: "" };
        },
    },
};
</script>

<style scoped>
.modal-content-custom {
    background-color: #1e293b;
    border-radius: 20px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    font-family: 'Inter', system-ui, -apple-system, sans-serif;
    color: #cbd5e1;
}

.modal-header-custom {
    padding: 1.5rem 2rem 1rem;
}

.modal-body-custom .text-muted {
    color: #cbd5e1 !important;
    letter-spacing: 0.5px;
}

.modal-footer-custom {
    padding: 1rem 0 0;
    display: flex;
    justify-content: flex-end;
    gap: 12px;
}

.text-neon-green {
    color: #a3e635;
}

.text-neon-teal {
    color: #2dd4bf;
}

.input-group-custom {
    position: relative;
    display: flex;
    align-items: center;
}

.input-icon {
    position: absolute;
    left: 1rem;
    color: #64748b;
    font-size: 1.2rem;
    pointer-events: none;
    transition: color 0.3s;
    z-index: 10;
}

.form-control-custom {
    background: rgba(15, 23, 42, 0.5);
    border: 1px solid rgba(255, 255, 255, 0.1);
    color: #ffffff !important;
    padding: 0.8rem 1rem 0.8rem 3rem;
    border-radius: 12px;
    width: 100%;
    transition: all 0.3s;
}

.form-control-custom:focus {
    background: rgba(15, 23, 42, 0.8);
    border-color: #a3e635;
    box-shadow: 0 0 0 4px rgba(163, 230, 53, 0.1);
    outline: none;
    color: white;
}

.input-group-custom:focus-within .input-icon {
    color: #a3e635;
}

.form-control-custom::placeholder {
    color: #94a3b8 !important;
    opacity: 0.8;
}

.btn-create-neon {
    background: linear-gradient(135deg, rgba(163, 230, 53, 0.2), rgba(163, 230, 53, 0.05));
    color: #a3e635;
    border: 1px solid rgba(163, 230, 53, 0.4);
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 0.6rem 1.2rem;
    border-radius: 12px;
    font-weight: 700;
    transition: all 0.3s;
}

.btn-create-neon:hover:not(:disabled) {
    background: #a3e635;
    color: #0f172a;
    box-shadow: 0 0 20px rgba(163, 230, 53, 0.4);
    transform: translateY(-2px);
}

.btn-edit-neon-filled {
    background: linear-gradient(135deg, rgba(45, 212, 191, 0.2), rgba(45, 212, 191, 0.05));
    color: #2dd4bf;
    border: 1px solid rgba(45, 212, 191, 0.4);
    padding: 0.6rem 1.2rem;
    border-radius: 12px;
    font-weight: 700;
    transition: all 0.3s;
}

.btn-edit-neon-filled:hover:not(:disabled) {
    background: #2dd4bf;
    color: #0f172a;
    box-shadow: 0 0 20px rgba(45, 212, 191, 0.4);
    transform: translateY(-2px);
}

.btn-secondary-neon {
    background: rgba(100, 116, 139, 0.1);
    color: #94a3b8;
    border: 1px solid rgba(100, 116, 139, 0.3);
    padding: 0.6rem 1.2rem;
    border-radius: 12px;
    font-weight: 600;
    transition: all 0.3s;
}

.btn-secondary-neon:hover {
    background: rgba(100, 116, 139, 0.2);
    color: #f8fafc;
}

button:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none !important;
}
</style>
