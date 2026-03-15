# Taller Coches - Frontend

Aplicación frontend construida con **Vue 3** y **Vite** para un sistema de gestión de servicios de taller/auto lavado. Incluye vistas públicas, autenticación, carrito de compras y panel de administración.

---

## 🧩 Tecnologías principales

- **Vue 3** (Composition API / Options API)
- **Vite** (bundler rápido)
- **PrimeVue** + **PrimeFlex** (componentes UI)
- **Bootstrap 5** + **Bootstrap Icons**
- **Tailwind CSS** (estilos utilitarios)
- **Vue Router** (ruteo)
- **Vue Toastification** (notificaciones)
- **Google reCAPTCHA v2** (protección formularios)

---

## 🚀 Comenzando

### 1) Instalar dependencias

```bash
npm install
```

### 2) Correr servidor de desarrollo

```bash
npm run dev
```

Abre `http://localhost:5173` (u otra URL que indique Vite).

### 3) Generar build de producción

```bash
npm run build
```

### 4) Previsualizar build

```bash
npm run preview
```

---

## 🧱 Estructura del proyecto

- `src/` - código fuente (componentes, rutas, assets)
  - `components/` - componentes Vue (públicos, admin, UI)
  - `routes/` - definición de rutas de la app
  - `assets/` - estilos globales, imágenes, animaciones
  - `main.js` - inicializa Vue + plugins

---

## 🔐 Autenticación

El login se realiza contra un backend (URL base definida en `import.meta.env.VITE_API_BASE_URL`).

- El token recibido se guarda en `localStorage` como `user_token`.
- Se utiliza reCAPTCHA en el formulario de acceso.

---

## 🧪 Notas útiles

- El proyecto usa `primevue` para formularios y componentes UI.
- Si quieres cambiar el idioma / textos, revisa los componentes en `src/components/web_src/`.
- Para estilos globales, revisa `src/assets/main.css`.

---

## 🤝 Contribuir

1. Crea un branch a partir de `main`.
2. Haz tus cambios.
3. Abre un Pull Request explicando qué soluciona o agrega.

---

## 📌 Contacto

Si necesitas ayuda con el frontend o las rutas, escríbeme en el canal del equipo o abre un issue en el repositorio.
