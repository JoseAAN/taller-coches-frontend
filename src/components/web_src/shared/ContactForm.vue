<template>
  <section class="contact-section">
    <div class="contact-container">
      <div class="section-title-container">
        <span class="subtitle text-uppercase">¿Dudas o Sugerencias?</span>
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
.contact-section {
  padding-bottom: 5rem;
}

.contact-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

.section-title-container {
  text-align: center;
  margin-top: 4rem;
  margin-bottom: 2rem;
}

.subtitle {
  display: block;
  font-size: 0.85rem;
  font-weight: 700;
  color: #52b155;
  letter-spacing: 2px;
  margin-bottom: 0.5rem;
}

.main-title {
  font-size: 2.5rem;
  font-weight: 850;
  color: var(--nav-text, #333);
  margin: 0;
  line-height: 1.2;
}

.section-description {
  color: var(--nav-text, #555);
  opacity: 0.8;
  max-width: 600px;
  margin: 1rem auto 0;
  font-size: 1.1rem;
}

.title-underline {
  width: 100px;
  height: 4px;
  background: #52b155;
  margin: 1.2rem auto 0;
  border-radius: 10px;
}

.form-wrapper {
  background: color-mix(in srgb, var(--nav-bg) 75%, transparent);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border-radius:12px;
  padding: 2.5rem;
  border: 1px solid color-mix(in srgb, var(--nav-text) 15%, transparent);
  border-top: 1px solid color-mix(in srgb, var(--nav-text) 25%, transparent);
  border-left: 1px solid color-mix(in srgb, var(--nav-text) 25%, transparent);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06); /* Sombra mucho más reducida y sutil */
}

.form-label {
  color: var(--nav-text);
  text-shadow: 0 1px 3px color-mix(in srgb, var(--bg-color) 30%, transparent);
}

.form-control {
  border-radius: 8px;
  padding: 0.75rem 1rem;
  border: 1px solid color-mix(in srgb, var(--nav-text) 20%, transparent);
  background: color-mix(in srgb, var(--nav-text) 5%, transparent);
  color: var(--nav-text);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  transition: all 0.3s ease;
}

.form-control::placeholder {
  color: color-mix(in srgb, var(--nav-text) 50%, transparent);
}

.form-control:focus {
  border-color: #52b155;
  box-shadow: 0 0 0 3px rgba(82, 177, 85, 0.3);
  background: color-mix(in srgb, var(--nav-bg) 95%, transparent);
  color: var(--nav-text);
}

.btn-submit {
  background: rgba(82, 177, 85, 0.15);
  color: #52b155;
  padding: 0.8rem;
  border-radius: 8px;
  font-size: 1.1rem;
  border: 1px solid rgba(82, 177, 85, 0.3);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  transition: all 0.3s ease;
}

.btn-submit:hover:not(:disabled) {
  background: rgba(82, 177, 85, 0.25);
  color: #439a46;
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(82, 177, 85, 0.15);
  border-color: rgba(82, 177, 85, 0.5);
}

@media (max-width: 768px) {
  .main-title {
    font-size: 1.8rem;
  }
  .form-wrapper {
    padding: 1.5rem;
  }
}
</style>
