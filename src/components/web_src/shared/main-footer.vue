<template>
    <footer class="footer">
        <div class="footer-container">
            <!-- Columna Brand -->
            <div class="footer-column footer-brand">
                <h2 class="footer-logo">AUTO<span>CLEAN</span></h2>
                <p class="footer-description">
                    Elevamos el estándar del cuidado automotriz. Especialistas en protección cerámica y restauración
                    estética.
                </p>
                <div class="social-links">
                    <a href="#"
                        class="btn btn-sm rounded-circle me-2 d-inline-flex align-items-center justify-content-center social-instagram"
                        aria-label="Instagram">
                        <i class="bi bi-instagram"></i>
                    </a>
                    <a href="#"
                        class="btn btn-sm rounded-circle me-2 d-inline-flex align-items-center justify-content-center social-facebook"
                        aria-label="Facebook">
                        <i class="bi bi-facebook"></i>
                    </a>
                    <a href="#"
                        class="btn btn-sm rounded-circle d-inline-flex align-items-center justify-content-center social-whatsapp"
                        aria-label="WhatsApp">
                        <i class="bi bi-whatsapp"></i>
                    </a>
                </div>
            </div>

            <!-- Columna Explorar -->
            <div class="footer-column">
                <h3>Explorar</h3>
                <ul>
                    <li><router-link to="/">Inicio</router-link></li>
                    <li><router-link to="/services">Servicios</router-link></li>
                    <li><router-link to="/products">Productos</router-link></li>
                    <li><router-link to="/about">Sobre nosotros</router-link></li>
                </ul>
            </div>

            <!-- Columna Contacto -->
            <div class="footer-column">
                <h3>Contacto</h3>
                <ul class="contact-info">
                    <li>
                        <span class="material-symbols-outlined">location_on</span>
                        Calle Ejemplo 123, Vecindario
                    </li>
                    <li>
                        <span class="material-symbols-outlined">call</span>
                        +34 000 000 000
                    </li>
                    <li>
                        <span class="material-symbols-outlined">mail</span>
                        info@autoclean.com
                    </li>
                </ul>
            </div>

            <!-- Columna Horario -->
            <div class="footer-column">
                <h3>Horario</h3>
                <ul class="schedule">
                    <li><span>Lunes – Viernes</span> 09:00 – 18:00</li>
                    <li><span>Sábado</span> 09:00 – 14:00</li>
                    <li><span>Domingo</span> Cerrado</li>
                </ul>
            </div>
        </div>

        <div class="footer-bottom">
            <p>&copy; 2026 AutoClean. Todos los derechos reservados.</p>
            <div class="legal-links">
                <router-link to="/privacidad">Privacidad</router-link>
                <router-link to="/terminos">Términos</router-link>
            </div>
        </div>
    </footer>
</template>

<style scoped>
/* ─── Tokens ──────────────────────────────────────────────── */
.footer {
    --bg-base:      #0e0f11;
    --bg-separator: rgba(255 255 255 / 0.07);
    --accent:       #52b155;
    --accent-dim:   rgba(82 177 85 / 0.18);
    --text-primary: #f0f0f0;
    --text-secondary: #888;
    --text-muted:   #555;
    --transition:   0.25s cubic-bezier(0.4, 0, 0.2, 1);

    background-color: var(--bg-base);
    /* Subtle noise texture for premium depth */
    background-image:
        radial-gradient(ellipse 80% 40% at 50% -10%, rgba(82,177,85,0.06) 0%, transparent 70%);
    color: var(--text-primary);
    padding: 72px 24px 28px;
    font-family: 'Inter', 'Helvetica Neue', sans-serif;
}

/* ─── Grid ────────────────────────────────────────────────── */
.footer-container {
    max-width: 1200px;
    margin: 0 auto 60px;
    display: grid;
    grid-template-columns: 1.6fr 1fr 1fr 1fr;
    gap: 48px 56px;
}

/* ─── Logo ────────────────────────────────────────────────── */
.footer-logo {
    font-size: 1.35rem;
    font-weight: 900;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    margin-bottom: 18px;
    color: var(--text-primary);
}

.footer-logo span {
    color: var(--accent);
}

/* ─── Brand description ───────────────────────────────────── */
.footer-description {
    color: var(--text-secondary);
    line-height: 1.75;
    font-size: 0.875rem;
    margin-bottom: 28px;
    max-width: 300px;
}

/* ─── Column headings ─────────────────────────────────────── */
.footer-column h3 {
    font-size: 0.7rem;
    font-weight: 600;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--text-secondary);
    margin-bottom: 28px;
    padding-bottom: 14px;
    position: relative;
}

.footer-column h3::after {
    content: '';
    position: absolute;
    left: 0;
    bottom: 0;
    width: 24px;
    height: 1.5px;
    background-color: var(--accent);
    border-radius: 2px;
}

/* ─── Nav links ───────────────────────────────────────────── */
.footer-column ul {
    list-style: none;
    padding: 0;
    margin: 0;
}

.footer-column ul li {
    margin-bottom: 13px;
}

.footer-column ul li a {
    color: var(--text-secondary);
    text-decoration: none;
    font-size: 0.9rem;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    transition: color var(--transition), transform var(--transition);
    will-change: transform;
}

.footer-column ul li a::before {
    content: '';
    display: inline-block;
    width: 0;
    height: 1px;
    background: var(--accent);
    transition: width var(--transition);
    vertical-align: middle;
}

.footer-column ul li a:hover {
    color: var(--text-primary);
    transform: translateX(4px);
}

.footer-column ul li a:hover::before {
    width: 10px;
}

/* ─── Contact info ────────────────────────────────────────── */
.contact-info li {
    display: flex;
    align-items: flex-start;
    gap: 10px;
    color: var(--text-secondary);
    font-size: 0.875rem;
    line-height: 1.55;
    margin-bottom: 14px;
}

.contact-info .material-symbols-outlined {
    font-size: 1.05rem;
    color: var(--accent);
    opacity: 0.85;
    flex-shrink: 0;
    margin-top: 1px;
}

/* ─── Schedule ────────────────────────────────────────────── */
.schedule li {
    display: flex;
    flex-direction: column;
    gap: 2px;
    margin-bottom: 16px;
    font-size: 0.875rem;
    color: var(--text-secondary);
}

.schedule li span {
    font-weight: 600;
    font-size: 0.775rem;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: var(--text-primary);
}

/* ─── Social icons ────────────────────────────────────────── */
.social-links {
    display: flex;
    gap: 10px;
}

.social-links a {
    width: 38px;
    height: 38px;
    padding: 2px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    text-decoration: none;
    transition: transform var(--transition), opacity var(--transition), box-shadow var(--transition);
    will-change: transform;
}

.social-links i {
    color: #fff;
    font-size: 16px;
    pointer-events: none;
}

.social-links a:hover {
    transform: translateY(-3px);
    opacity: 0.9;
    box-shadow: 0 6px 20px rgba(0 0 0 / 0.4);
}

/* Instagram gradient ring */
.social-instagram {
    background: linear-gradient(45deg, #f58529, #dd2a7b, #8134af);
    padding: 2px;
}

.social-instagram i {
    background: var(--bg-base);
    width: 100%;
    height: 100%;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
}

/* Facebook */
.social-facebook {
    border: 1.5px solid rgba(24, 119, 242, 0.55);
    background: rgba(24, 119, 242, 0.08);
}

.social-facebook:hover {
    border-color: #1877f2;
    background: rgba(24, 119, 242, 0.16);
}

/* WhatsApp */
.social-whatsapp {
    border: 1.5px solid rgba(37, 211, 102, 0.45);
    background: rgba(37, 211, 102, 0.07);
}

.social-whatsapp:hover {
    border-color: #25d366;
    background: rgba(37, 211, 102, 0.15);
}

/* ─── Footer bottom bar ───────────────────────────────────── */
.footer-bottom {
    max-width: 1200px;
    margin: 0 auto;
    padding-top: 24px;
    border-top: 1px solid var(--bg-separator);
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 16px;
    color: var(--text-muted);
    font-size: 0.78rem;
    letter-spacing: 0.03em;
    flex-wrap: wrap;
}

.legal-links {
    display: flex;
    gap: 24px;
}

.legal-links a {
    color: var(--text-muted);
    text-decoration: none;
    transition: color var(--transition);
    letter-spacing: 0.03em;
}

.legal-links a:hover {
    color: var(--accent);
}

/* ─── Responsive ──────────────────────────────────────────── */

/* Tablet: 2-column layout */
@media (max-width: 1024px) {
    .footer-container {
        grid-template-columns: 1fr 1fr;
        gap: 40px 48px;
    }

    .footer-brand {
        grid-column: 1 / -1;
    }

    .footer-description {
        max-width: 480px;
    }
}

/* Mobile: single column, centrado */
@media (max-width: 640px) {
    .footer {
        padding: 56px 20px 24px;
    }

    .footer-container {
        grid-template-columns: 1fr;
        gap: 36px;
        margin-bottom: 44px;
        text-align: center;
    }

    .footer-brand {
        grid-column: unset;
    }

    .footer-description {
        max-width: 100%;
        margin-left: auto;
        margin-right: auto;
    }

    .footer-column h3::after {
        left: 50%;
        transform: translateX(-50%);
    }

    .footer-column ul li a::before {
        display: none;
    }

    .footer-column ul li a:hover {
        transform: none;
    }

    .contact-info li {
        justify-content: center;
        text-align: left;
    }

    .schedule li {
        align-items: center;
    }

    .social-links {
        justify-content: center;
    }

    .footer-bottom {
        flex-direction: column;
        align-items: center;
        text-align: center;
        gap: 12px;
    }

    .legal-links {
        gap: 20px;
    }
}
</style>