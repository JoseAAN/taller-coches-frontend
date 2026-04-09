<template>
    <div class="modal fade" id="serviceModal" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered modal-lg">
            <div class="modal-content modal-content-custom shadow-lg">

                <div class="modal-header modal-header-custom border-0 pb-0">
                    <h5 class="modal-title d-flex align-items-center gap-2 fw-bold text-white">
                        <span class="material-symbols-outlined icon-modal"
                            :class="isEdit ? 'text-neon-teal' : 'text-neon-green'">
                            {{ isEdit ? 'edit_square' : 'add_circle' }}
                        </span>
                        {{ isEdit ? "Editar Servicio" : "Crear Servicio" }}
                    </h5>
                    <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"
                        aria-label="Cerrar"></button>
                </div>

                <div class="modal-body modal-body-custom pt-4">
                    <form @submit.prevent="submit">
                        <div class="row">
                            <div class="col-md-6 form-group mb-4">
                                <label class="form-label text-muted small text-uppercase fw-bold mb-2">Nombre del
                                    Servicio</label>
                                <div class="input-group-custom">
                                    <span class="material-symbols-outlined input-icon">design_services</span>
                                    <input v-model="form.name" class="form-control form-control-custom"
                                        placeholder="Ej. Cambio de bujias..." required />
                                </div>
                            </div>

                            <div class="col-md-6 form-group mb-4">
                                <label class="form-label text-muted small text-uppercase fw-bold mb-2">Tipo de
                                    Servicio</label>
                                <div class="input-group-custom">
                                    <span class="material-symbols-outlined input-icon">category</span>
                                    <select v-model="form.service_type_id"
                                        class="form-select form-control-custom select-custom" required>
                                        <option value="" disabled selected>Selecciona un tipo...</option>
                                        <option v-for="type in serviceTypes" :key="type.id" :value="type.id">
                                            {{ type.name }}
                                        </option>
                                    </select>
                                </div>
                            </div>

                            <div class="col-md-6 form-group mb-4">
                                <label class="form-label text-muted small text-uppercase fw-bold mb-2">Precio
                                    (EUR)</label>
                                <div class="input-group-custom">
                                    <span class="material-symbols-outlined input-icon">euro_symbol</span>
                                    <input type="number" step="0.01" min="0" v-model="form.price"
                                        class="form-control form-control-custom" placeholder="Ej. 150.00" required />
                                </div>
                            </div>

                            <div class="col-md-6 form-group mb-4">
                                <label class="form-label text-muted small text-uppercase fw-bold mb-2">Duracion aprox.
                                    (Minutos)</label>
                                <div class="input-group-custom">
                                    <span class="material-symbols-outlined input-icon">timer</span>
                                    <input type="number" min="0" v-model="form.average_duration"
                                        class="form-control form-control-custom" placeholder="Ej. 60" />
                                </div>
                            </div>

                            <div class="col-12 form-group mb-4">
                                <label
                                    class="form-label text-muted small text-uppercase fw-bold mb-2">Descripcion</label>
                                <div class="input-group-custom align-items-start pt-2">
                                    <span class="material-symbols-outlined input-icon text-area-icon">description</span>
                                    <textarea v-model="form.description" class="form-control form-control-custom"
                                        rows="3" placeholder="Detalles sobre el servicio..."></textarea>
                                </div>
                            </div>

                            <div class="col-12 form-group mb-4">
                                <label class="form-label text-muted small text-uppercase fw-bold mb-2">Imagen</label>
                                <div class="input-group-custom">
                                    <span class="material-symbols-outlined input-icon">image</span>
                                    <input v-model="form.image_url" class="form-control form-control-custom"
                                        placeholder="Ej. LavadoAManoBasico.png o https://..." />
                                </div>
                            </div>
                        </div>

                        <div class="modal-footer-custom px-0 border-0 pt-0 mt-2">
                            <button type="button" class="btn btn-secondary-neon" data-bs-dismiss="modal">
                                Cancelar
                            </button>
                            <button type="submit" class="btn"
                                :class="isEdit ? 'btn-edit-neon-filled' : 'btn-create-neon'">
                                {{ isEdit ? "Guardar Cambios" : "Crear Servicio" }}
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
import { useToast } from 'vue-toastification';

export default {
    name: "ServiceCrudModal",

    props: {
        selectedService: Object,
        isEdit: Boolean,
    },

    data() {
        return {
            toast: useToast(),
            form: {
                id: null,
                name: "",
                price: "",
                average_duration: "",
                description: "",
                service_type_id: "",
                image_url: ""
            },
            serviceTypes: []
        };
    },

    watch: {
        selectedService: {
            immediate: true,
            handler(newVal) {
                if (newVal) {
                    this.form = {
                        id: newVal.id,
                        name: newVal.name,
                        price: newVal.price,
                        average_duration: newVal.average_duration_mins != null ? newVal.average_duration_mins : "",
                        description: newVal.description || "",
                        service_type_id: newVal.type?.id || newVal.service_type_id || "",
                        image_url: newVal.image || ""
                    };
                } else {
                    this.resetForm();
                }
            },
        },
    },

    mounted() {
        this.fetchServiceTypes();
    },

    methods: {
        fetchServiceTypes() {
            fetch(`${this.$BASE_URL}/v1/serviceType`)
                .then(res => res.json())
                .then(data => {
                    this.serviceTypes = data.serviceType || [];
                })
                .catch(err => {
                    console.error("Error fetching service types:", err);
                });
        },

        submit() {
            loaderState.show();
            const token = localStorage.getItem("user");

            const url = this.isEdit
                ? `${this.$BASE_URL}/v1/services/${this.form.id}`
                : `${this.$BASE_URL}/v1/services`;

            const method = this.isEdit ? "PUT" : "POST";

            const payload = {
                name: this.form.name,
                price: parseFloat(this.form.price),
                service_type_id: this.form.service_type_id,
            };

            if (this.form.average_duration) payload.average_duration = parseInt(this.form.average_duration);
            if (this.form.description) payload.description = this.form.description;
            if (this.form.image_url !== "") payload.image_url = this.form.image_url;

            fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(payload),
            })
                .then(res => {
                    if (!res.ok) {
                        return res.json().then(error => { throw error; });
                    }
                    return res.json();
                })
                .then(() => {
                    this.$emit("refresh");
                    this.resetForm();

                    const btnClose = document.querySelector("#serviceModal .btn-close");
                    if (btnClose) btnClose.click();
                })
                .catch(err => {
                    this.toast.error(err.message || "Ocurrio un error al guardar el servicio.");
                    console.error(err);
                })
                .finally(() => {
                    loaderState.hide();
                });
        },

        resetForm() {
            this.form = {
                id: null,
                name: "",
                price: "",
                average_duration: "",
                description: "",
                service_type_id: "",
                image_url: ""
            };
        },
    },
};
</script>

<style scoped>
.text-area-icon {
    top: 14px;
}

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

.form-control-custom:-webkit-autofill,
.form-control-custom:-webkit-autofill:hover,
.form-control-custom:-webkit-autofill:focus,
.form-control-custom:-webkit-autofill:active {
    -webkit-box-shadow: 0 0 0 30px #1e293b inset !important;
    -webkit-text-fill-color: white !important;
    transition: background-color 5000s ease-in-out 0s;
}

.form-control-custom:focus {
    background: rgba(15, 23, 42, 0.8);
    border-color: #a3e635;
    box-shadow: 0 0 0 4px rgba(163, 230, 53, 0.1);
    outline: none;
    color: white;
}

.select-custom {
    color: #ffffff !important;
    appearance: none;
    -webkit-appearance: none;
    -moz-appearance: none;
    background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%2364748b' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
    background-repeat: no-repeat;
    background-position: right 1rem center;
    background-size: 1em;
}

.select-custom option {
    background-color: #1e293b;
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
    display: flex;
    align-items: center;
    gap: 8px;
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

textarea.form-control-custom {
    padding-top: 0.8rem;
    resize: vertical;
}
</style>
