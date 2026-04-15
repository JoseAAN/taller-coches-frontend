<template>
  <div class="terms-page">
    <div class="bg-texture" aria-hidden="true"></div>

    <div class="terms-wrapper">

      <!-- Header -->
      <header class="terms-header animate-item" style="--delay: 0s">
        <div class="eyebrow">
          <span class="eyebrow-line"></span>
          <span class="eyebrow-text">AutoClean · Documentación Legal</span>
          <span class="eyebrow-line"></span>
        </div>
        <h1 class="terms-title">Términos y<br><em>Condiciones</em></h1>
      </header>

      <!-- Metadata bar -->
      <div class="meta-bar animate-item" style="--delay: 0.15s" aria-label="Metadatos del documento">
        <div class="meta-item">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
          <span>Última actualización: <strong>Abril 2026</strong></span>
        </div>
        <div class="meta-divider" aria-hidden="true"></div>
        <div class="meta-item">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          <span>Lectura estimada: <strong>5 min</strong></span>
        </div>
      </div>

      <!-- Intro -->
      <main class="terms-content">
        <p class="lead animate-item" style="--delay: 0.25s">
          Bienvenido a AutoClean. Al utilizar nuestros servicios de detallado automotriz, reservar una cita o navegar por nuestro sitio web, aceptas íntegramente los presentes Términos y Condiciones. Te recomendamos leerlos con detenimiento.
        </p>

        <!-- 1. Responsable -->
        <section class="policy-section animate-item" style="--delay: 0.35s">
          <h3><span class="section-num">01</span>Responsable del Servicio</h3>
          <p>El titular y responsable de la prestación de los servicios ofrecidos bajo la marca <strong>AutoClean</strong> es:</p>
          <ul class="terms-list">
            <li><span class="list-label">Razón social:</span> AutoClean Detailing S.L.</li>
            <li><span class="list-label">NIF/CIF:</span> B-XXXXXXXX</li>
            <li><span class="list-label">Domicilio:</span> Calle Ejemplo 00, 28000 Madrid, España</li>
            <li><span class="list-label">Email de contacto:</span> legal@autoclean.com</li>
          </ul>
        </section>

        <!-- 2. Proceso de Reservas -->
        <section class="policy-section animate-item" style="--delay: 0.40s">
          <h3><span class="section-num">02</span>Proceso de Reservas</h3>
          <p>Al confirmar una cita a través de nuestra plataforma, el cliente acepta el horario seleccionado y se compromete a presentar el vehículo en el taller en la franja horaria acordada. AutoClean se compromete a reservar y mantener dicho hueco exclusivamente para tu vehículo.</p>
          <p>Las reservas podrán cancelarse o modificarse con un mínimo de <strong>24 horas de antelación</strong> sin cargo alguno. Cancelaciones realizadas con menos antelación podrán conllevar la pérdida del importe del depósito si este hubiera sido solicitado.</p>
        </section>

        <!-- 3. Precios y Pagos -->
        <section class="policy-section animate-item" style="--delay: 0.45s">
          <h3><span class="section-num">03</span>Precios y Pagos</h3>
          <p>Todos los precios publicados en nuestra web están expresados en euros (€) e incluyen el IVA aplicable según la legislación vigente. AutoClean se reserva el derecho a modificar sus tarifas en cualquier momento, sin que ello afecte a los servicios ya contratados y confirmados.</p>
          <p>Los pagos se gestionan a través de pasarelas seguras certificadas. AutoClean no almacena en ningún momento los datos de tus tarjetas de crédito o débito.</p>
        </section>

        <!-- 4. Obligaciones del Cliente -->
        <section class="policy-section animate-item" style="--delay: 0.50s">
          <h3><span class="section-num">04</span>Obligaciones del Cliente</h3>
          <p>El cliente se compromete a facilitar información veraz al realizar la reserva, a entregar el vehículo en el horario pactado y a recogerlo en el plazo acordado. AutoClean no se responsabiliza de objetos personales dejados en el interior del vehículo durante la prestación del servicio.</p>
        </section>

        <!-- 5. Responsabilidad del Servicio -->
        <section class="policy-section animate-item" style="--delay: 0.55s">
          <h3><span class="section-num">05</span>Responsabilidad del Servicio</h3>
          <p>AutoClean aplica los más altos estándares de calidad en cada trabajo. En el improbable caso de que se produzca algún daño como consecuencia directa de nuestros servicios, el cliente deberá notificarlo en el mismo momento de la recogida del vehículo. Reclamaciones posteriores a la entrega no podrán ser atendidas.</p>
          <p>Quedan excluidos de nuestra responsabilidad los daños preexistentes, la pintura deteriorada, piezas sueltas o cualquier anomalía no comunicada en el momento de la entrega del vehículo.</p>
        </section>

        <!-- 6. Protección de Datos -->
        <section class="policy-section animate-item" style="--delay: 0.60s">
          <h3><span class="section-num">06</span>Protección de Datos</h3>
          <p>El tratamiento de tus datos personales se rige por nuestra <router-link to="/privacidad" class="inline-link">Política de Privacidad</router-link>, disponible en este mismo sitio. Recabamos únicamente los datos imprescindibles para gestionar tu reserva, y jamás los cedemos a terceros con fines comerciales.</p>
        </section>

        <!-- 7. Propiedad Intelectual -->
        <section class="policy-section animate-item" style="--delay: 0.65s">
          <h3><span class="section-num">07</span>Propiedad Intelectual</h3>
          <p>Todos los contenidos del sitio web de AutoClean —incluyendo textos, imágenes, logotipos y código— son propiedad exclusiva de AutoClean o de sus respectivos licenciantes, y están protegidos por la legislación española e internacional de propiedad intelectual. Queda expresamente prohibida su reproducción total o parcial sin autorización escrita.</p>
        </section>

        <!-- 8. Modificaciones -->
        <section class="policy-section animate-item" style="--delay: 0.70s">
          <h3><span class="section-num">08</span>Modificaciones de los Términos</h3>
          <p>AutoClean se reserva el derecho de actualizar los presentes Términos y Condiciones para adaptarlos a cambios legislativos o evoluciones en nuestros servicios. Cualquier modificación sustancial será comunicada a través de esta misma página, indicando la fecha de la última revisión en el encabezado.</p>
        </section>

      </main>

      <!-- Footer -->
      <footer class="terms-footer animate-item" style="--delay: 0.78s">
        <div class="footer-separator" aria-hidden="true"></div>
        <router-link to="/" class="btn-back">
          <span class="btn-back-icon" aria-hidden="true">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
          </span>
          <span class="btn-back-label">Volver al inicio</span>
          <span class="btn-back-fill" aria-hidden="true"></span>
        </router-link>
      </footer>

    </div>
  </div>
</template>

<script>
export default {
  name: 'TerminosPage',
    mounted(){
    document.title = "Terminos y condiciones | AutoClean"
  }
}
</script>

<style scoped>
/* ================================================
   DESIGN TOKENS — idénticos a PrivacidadPage
   ================================================ */
.terms-page {
  --ac-green:        #52b155;
  --ac-green-dim:    rgba(82, 177, 85, 0.12);
  --ac-green-glow:   rgba(82, 177, 85, 0.35);
  --bg-deep:         #111111;
  --bg-card:         #181818;
  --bg-line:         rgba(255, 255, 255, 0.07);
  --text-body:       #D1D5DB;
  --text-muted:      #6B7280;
  --text-strong:     #F3F4F6;
  --text-heading:    #FFFFFF;
  --font-display:    'Georgia', 'Times New Roman', serif;
  --font-body:       'Segoe UI', system-ui, -apple-system, sans-serif;
  --max-w:           700px;
  --lh-body:         1.8;

  position: relative;
  min-height: 100vh;
  background-color: var(--bg-deep);
  color: var(--text-body);
  font-family: var(--font-body);
  padding: 80px 24px 80px;
  overflow-x: hidden;
}

/* Texture / glow */
.bg-texture {
  pointer-events: none;
  position: fixed;
  inset: 0;
  z-index: 0;
  background-image:
    radial-gradient(ellipse 80% 60% at 50% -10%, rgba(82, 177, 85, 0.06) 0%, transparent 60%),
    url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E");
  background-size: auto, 200px 200px;
}

/* ================================================
   WRAPPER
   ================================================ */
.terms-wrapper {
  position: relative;
  z-index: 1;
  max-width: var(--max-w);
  margin: 0 auto;
}

/* ================================================
   HEADER
   ================================================ */
.eyebrow {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 28px;
}
.eyebrow-line {
  flex: 1;
  height: 1px;
  background: var(--bg-line);
}
.eyebrow-text {
  font-size: 0.7rem;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--text-muted);
  white-space: nowrap;
}

.terms-title {
  font-family: var(--font-display);
  font-size: clamp(2.4rem, 6vw, 3.6rem);
  font-weight: 400;
  line-height: 1.15;
  letter-spacing: -0.02em;
  color: var(--text-heading);
  margin: 0 0 32px;
}
.terms-title em {
  font-style: italic;
  color: var(--ac-green);
}

/* ================================================
   METADATA BAR
   ================================================ */
.meta-bar {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 14px 20px;
  background: var(--bg-card);
  border: 1px solid var(--bg-line);
  border-left: 3px solid var(--ac-green);
  border-radius: 4px;
  margin-bottom: 44px;
}
.meta-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.8rem;
  color: var(--text-muted);
  line-height: 1;
}
.meta-item svg {
  color: var(--ac-green);
  flex-shrink: 0;
  opacity: 0.8;
}
.meta-item strong {
  color: var(--text-body);
  font-weight: 500;
}
.meta-divider {
  width: 1px;
  height: 20px;
  background: var(--bg-line);
  flex-shrink: 0;
}

/* ================================================
   CONTENT
   ================================================ */
.terms-content {
  font-size: 1rem;
  line-height: var(--lh-body);
  color: var(--text-body);
}

.lead {
  font-size: 1.08rem;
  line-height: 1.75;
  color: #B0B8C4;
  margin-bottom: 44px;
  padding-bottom: 44px;
  border-bottom: 1px solid var(--bg-line);
}

/* ================================================
   POLICY SECTIONS
   ================================================ */
.policy-section {
  margin-top: 40px;
  padding-top: 40px;
  border-top: 1px solid var(--bg-line);
}

.policy-section h3 {
  font-family: var(--font-display);
  font-size: 1.1rem;
  font-weight: 400;
  letter-spacing: 0.01em;
  color: var(--text-strong);
  margin: 0 0 18px;
  display: flex;
  align-items: baseline;
  gap: 14px;
}

.section-num {
  font-family: var(--font-body);
  font-size: 0.65rem;
  font-weight: 500;
  letter-spacing: 0.12em;
  color: var(--ac-green);
  opacity: 0.8;
  flex-shrink: 0;
}

.policy-section p {
  margin: 0 0 14px;
  color: var(--text-body);
}
.policy-section p:last-child {
  margin-bottom: 0;
}

.policy-section strong {
  color: var(--text-strong);
  font-weight: 500;
}

/* List */
.terms-list {
  list-style: none;
  padding: 0;
  margin: 16px 0 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.terms-list li {
  display: flex;
  align-items: baseline;
  gap: 10px;
  font-size: 0.9rem;
  color: var(--text-body);
  padding-left: 14px;
  position: relative;
}
.terms-list li::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0.55em;
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: var(--ac-green);
  opacity: 0.7;
  flex-shrink: 0;
}
.list-label {
  color: var(--text-muted);
  font-size: 0.78rem;
  letter-spacing: 0.04em;
  white-space: nowrap;
}

/* Inline link */
.inline-link {
  color: var(--ac-green);
  text-decoration: none;
  border-bottom: 1px solid rgba(82, 177, 85, 0.35);
  transition: border-color 0.2s ease, opacity 0.2s ease;
}
.inline-link:hover {
  border-color: var(--ac-green);
  opacity: 0.85;
}

/* ================================================
   FOOTER
   ================================================ */
.terms-footer {
  margin-top: 64px;
}
.footer-separator {
  height: 1px;
  background: var(--bg-line);
  margin-bottom: 40px;
}

/* ================================================
   BACK BUTTON
   ================================================ */
.btn-back {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 12px 28px;
  border: 1px solid var(--ac-green);
  border-radius: 4px;
  color: var(--ac-green);
  font-family: var(--font-body);
  font-size: 0.85rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  text-decoration: none;
  overflow: hidden;
  transition: color 0.3s ease;
}
.btn-back-fill {
  position: absolute;
  inset: 0;
  background: var(--ac-green);
  transform: scaleX(0);
  transform-origin: left center;
  transition: transform 0.35s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 0;
}
.btn-back-icon,
.btn-back-label {
  position: relative;
  z-index: 1;
  transition: color 0.3s ease, transform 0.3s ease;
}
.btn-back:hover .btn-back-icon {
  transform: translateX(-4px);
}
.btn-back:hover .btn-back-fill {
  transform: scaleX(1);
}
.btn-back:hover {
  color: #0d1a0d;
}
.btn-back:focus-visible {
  outline: 2px solid var(--ac-green);
  outline-offset: 3px;
}

/* ================================================
   STAGGERED ANIMATION
   ================================================ */
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(22px); }
  to   { opacity: 1; transform: translateY(0); }
}
.animate-item {
  opacity: 0;
  animation: fadeInUp 0.65s cubic-bezier(0.22, 1, 0.36, 1) forwards;
  animation-delay: var(--delay, 0s);
}

/* ================================================
   RESPONSIVE
   ================================================ */
@media (max-width: 600px) {
  .terms-page {
    padding: 60px 20px 60px;
  }
  .meta-bar {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
  .meta-divider { display: none; }
  .terms-list li {
    flex-direction: column;
    gap: 2px;
  }
}
</style>