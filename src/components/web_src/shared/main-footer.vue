<template>
    <footer class="footer">
        <div class="footer-container">
            <div class="footer-column">
                <h2 class="footer-logo">AUTO<span>CLEAN</span></h2>
                <p class="footer-description">
                    Elevamos el estándar del cuidado automotriz. Especialistas en protección cerámica y restauración
                    estética.
                </p>
                <div class="social-links">
                    <a href="#"
                        class="btn btn-sm rounded-circle me-2 d-inline-flex align-items-center justify-content-center social-instagram">
                        <i class="bi bi-instagram"></i>
                    </a>

                    <a href="#"
                        class="btn btn-sm rounded-circle me-2 d-inline-flex align-items-center justify-content-center social-facebook">
                        <i class="bi bi-facebook"></i>
                    </a>

                    <a href="#"
                        class="btn btn-sm rounded-circle d-inline-flex align-items-center justify-content-center social-whatsapp">
                        <i class="bi bi-whatsapp"></i>
                    </a>
                </div>
            </div>

            <div class="footer-column">
                <h3>Explorar</h3>
                <ul>
                    <li><router-link to="/">Inicio</router-link></li>
                    <li><router-link to="/services">Servicios</router-link></li>
                    <li><router-link to="/products">Productos</router-link></li>
                    <li><router-link to="/about">Sobre nosotros</router-link></li>
                </ul>
            </div>

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

            <div class="footer-column">
                <h3>Horario</h3>
                <ul class="schedule">
                    <li><span>Lunes - Viernes:</span> 09:00 - 18:00</li>
                    <li><span>Sábado:</span> 09:00 - 14:00</li>
                    <li><span>Domingo:</span> Cerrado</li>
                </ul>
            </div>
        </div>

        <div class="footer-bottom">
            <p>&copy; 2026 AutoClean. Todos los derechos reservados.</p>
            <div class="legal-links">
                <a href="#">Privacidad</a>
                <a href="#">Términos</a>
            </div>
        </div>
    </footer>
</template>

<style scoped>
.footer {
    background-color: #1f1f1f;
    color: #ffffff;
    padding: 60px 20px 20px;
    font-family: 'Inter', sans-serif;
}

.footer-container {
    max-width: 1200px;
    margin: 0 auto;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 40px;
    margin-bottom: 50px;
}

.footer-logo {
    font-size: 1.5rem;
    font-weight: 800;
    margin-bottom: 20px;
}

.footer-logo span {
    color: #3b82f6;
}

.footer-description {
    color: #999;
    line-height: 1.6;
    margin-bottom: 20px;
}

.footer-column h3 {
    font-size: 1.1rem;
    margin-bottom: 25px;
    position: relative;
}

.footer-column h3::after {
    content: '';
    position: absolute;
    left: 0;
    bottom: -8px;
    width: 30px;
    height: 2px;
    background-color: #3b82f6;
}

.footer-column ul {
    list-style: none;
    padding: 0;
}

.footer-column ul li {
    margin-bottom: 15px;
}

.footer-column ul li a {
    color: #ccc;
    text-decoration: none;
    transition: color 0.3s;
}

.footer-column ul li a:hover {
    color: #52B155;
}

.contact-info li {
    display: flex;
    align-items: center;
    gap: 10px;
    color: #ccc;
}

.schedule li span {
    display: block;
    font-weight: bold;
    color: #fff;
}

.social-links a {
    width: 40px;
    height: 40px;
    padding: 2px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
}

.social-links i {
    color: #ffffff;
    font-size: 18px;
}

.social-links a:hover{
    transform: translateY(-1px);
    transition: 0.2s;
}
.social-instagram {
    background: linear-gradient(45deg, #f58529, #dd2a7b, #8134af);
}


.social-instagram i {
    background: #1a1a1a;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #ffffff;
}

.social-facebook {
    border: 2px solid #1877f2;
}

.social-whatsapp {
    border: 2px solid #25d366;
}

.footer-bottom {
    max-width: 1200px;
    margin: 0 auto;
    padding-top: 20px;
    border-top: 1px solid #333;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 20px;
    color: #666;
    font-size: 0.9rem;
}

.legal-links a {
    color: #666;
    margin-left: 20px;
    text-decoration: none;
}
</style>