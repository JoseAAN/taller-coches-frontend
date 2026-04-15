<template>
  <section class="contact-section">
    <div class="contact-container">
      <div class="section-title-container">
      
        <h2 class="main-title">Contacta con nosotros</h2>
        <p class="section-description">Si tienes alguna pregunta, has encontrado un fallo en la web o necesitas ayuda, escríbenos y te responderemos lo antes posible.</p>
        <div class="title-underline"></div>
      </div>

      <div class="form-wrapper">
        <div v-if="status === 'success'" class="alert alert-success text-center">
          <span class="material-symbols-outlined align-middle me-1">check_circle</span>
          {{ responseMessage }}
        </div>
        
        <div v-else-if="status === 'error'" class="alert alert-danger text-center">
          <span class="material-symbols-outlined align-middle me-1">error</span>
          {{ responseMessage }}
        </div>

        <form @submit.prevent="submitForm">
          <div class="mb-3">
            <label for="name" class="form-label fw-bold">Nombre completo</label>
            <input type="text" class="form-control" id="name" v-model="form.name" required placeholder="Ej: Laura Pérez">
          </div>
          <div class="mb-3">
            <label for="email" class="form-label fw-bold">Correo Electrónico</label>
            <input type="email" class="form-control" id="email" v-model="form.email" required placeholder="tu@email.com">
          </div>
          <div class="mb-4">
            <label for="message" class="form-label fw-bold">Mensaje</label>
            <textarea class="form-control" id="message" rows="4" v-model="form.message" required placeholder="Escribe aquí tu duda, sugerencia o detalle del fallo..."></textarea>
          </div>
          <button type="submit" class="btn btn-submit w-100 fw-bold" :disabled="loading">
            <span v-if="loading" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
            {{ loading ? 'Enviando...' : 'Enviar Reporte' }}
          </button>
        </form>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  data() {
    return {
      form: {
        name: "",
        email: "",
        message: ""
      },
      loading: false,
      status: null,
      responseMessage: ""
    }
  },
  methods: {
    submitForm() {
      this.loading = true;
      this.status = null;
      this.responseMessage = "";

      fetch(`${this.$BASE_URL}/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(this.form)
      })
      .then(res => {
        if(!res.ok) {
          return res.json().then(data => { throw data; });
        }
        return res.json();
      })
      .then(data => {
        this.status = 'success';
        this.responseMessage = data.message || "Tu mensaje se envió correctamente.";
        this.form = { name: "", email: "", message: "" };
      })
      .catch(err => {
        this.status = 'error';
        this.responseMessage = err.message || "Ocurrió un error inesperado al enviar el mensaje.";
        console.error("Error sending contact form:", err);
      })
      .finally(() => {
        this.loading = false;
      });
    }
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,300&display=swap');

/* === SECTION === */
.contact-section {
  padding-top: 3rem;
  padding-bottom: 5rem;
  background: linear-gradient(160deg, #071A2E 0%, #0a1f33 55%, #0d2a3e 100%);
  font-family: 'DM Sans', sans-serif;
}

.contact-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

/* === HEADER === */
.section-title-container {
  text-align: center;
  margin-top: 4rem;
  margin-bottom: 2.5rem;
}

.subtitle {
  display: block;
  font-family: 'DM Sans', sans-serif;
  font-size: 0.75rem;
  font-weight: 500;
  color: #52b155;
  letter-spacing: 0.12em;
  margin-bottom: 0.75rem;
}

.main-title {
  font-family: 'Syne', sans-serif;
  font-size: clamp(1.8rem, 4vw, 2.6rem);
  font-weight: 800;
  color: #fff;
  margin: 0;
  line-height: 1.1;
  letter-spacing: -0.03em;
}

.section-description {
  font-family: 'DM Sans', sans-serif;
  font-weight: 300;
  color: rgba(255, 255, 255, 0.5);
  max-width: 560px;
  margin: 1rem auto 0;
  font-size: 0.97rem;
  line-height: 1.7;
}

.title-underline {
  width: 36px;
  height: 3px;
  background: #52b155;
  margin: 1.25rem auto 0;
  border-radius: 10px;
}

/* === FORM WRAPPER === */
.form-wrapper {
  background: rgba(255, 255, 255, 0.04);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-radius: 20px;
  padding: 2.5rem;
  border: 1px solid rgba(255, 255, 255, 0.07);
  border-top-color: rgba(255, 255, 255, 0.13);
  border-left-color: rgba(255, 255, 255, 0.11);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.25);
}

/* === LABELS === */
.form-label {
  font-family: 'DM Sans', sans-serif;
  font-size: 0.82rem;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.75);
  letter-spacing: 0.02em;
  margin-bottom: 8px;
}

/* === INPUTS === */
.form-control {
  font-family: 'DM Sans', sans-serif;
  font-size: 0.92rem;
  font-weight: 300;
  border-radius: 12px !important;
  padding: 14px 16px !important;
  border: 1px solid rgba(255, 255, 255, 0.1) !important;
  background: rgba(255, 255, 255, 0.05) !important;
  color: #fff !important;
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  transition: border-color 0.3s ease, box-shadow 0.3s ease, background 0.3s ease;
  box-shadow: none !important;
}

.form-control::placeholder {
  color: rgba(255, 255, 255, 0.25);
  font-weight: 300;
}

.form-control:focus {
  border-color: #52b155 !important;
  box-shadow: 0 0 0 3px rgba(82, 177, 85, 0.2) !important;
  background: rgba(255, 255, 255, 0.07) !important;
  color: #fff !important;
  outline: none;
}

/* Autofill override */
.form-control:-webkit-autofill,
.form-control:-webkit-autofill:focus {
  -webkit-box-shadow: 0 0 0 1000px #0d2440 inset !important;
  -webkit-text-fill-color: #fff !important;
  caret-color: #fff;
}

/* === BUTTON === */
.btn-submit {
  font-family: 'DM Sans', sans-serif;
  font-size: 0.9rem;
  font-weight: 500;
  letter-spacing: 0.03em;
  background: #52b155;
  color: #fff;
  border: none !important;
  border-radius: 100px !important;
  padding: 14px 28px;
  transition: transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94),
              box-shadow 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94),
              background 0.25s ease;
  position: relative;
  overflow: hidden;
}

.btn-submit::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(255,255,255,0.12) 0%, transparent 60%);
  border-radius: inherit;
  pointer-events: none;
}

.btn-submit:hover:not(:disabled) {
  background: #469c49;
  color: #fff;
  transform: translateY(-2px);
  box-shadow: 0 12px 28px rgba(82, 177, 85, 0.35);
}

.btn-submit:disabled {
  opacity: 0.65;
  cursor: not-allowed;
}

/* === ALERTS === */
.alert {
  font-family: 'DM Sans', sans-serif;
  font-size: 0.88rem;
  font-weight: 400;
  border-radius: 12px !important;
  padding: 14px 18px;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border: 1px solid;
}

.alert-success {
  background: rgba(82, 177, 85, 0.08) !important;
  border-color: rgba(82, 177, 85, 0.25) !important;
  color: #52b155 !important;
}

.alert-danger {
  background: rgba(239, 68, 68, 0.08) !important;
  border-color: rgba(239, 68, 68, 0.25) !important;
  color: #ef4444 !important;
}

/* === RESPONSIVE === */
@media (max-width: 768px) {
  .form-wrapper {
    padding: 1.5rem;
  }
}
</style>