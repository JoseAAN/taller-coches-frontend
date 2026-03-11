
## URL de API hardcodeada

En `login-component.vue` (línea 100) la URL de la API está escrita directamente en el código:
```javascript
fetch('http://127.0.0.1:8000/api/login', { ... })
```
Sin embargo, en otros componentes como `profile-index.vue` y `Profile.js` sí se usa la variable de entorno:
```javascript
const BASE_URL = import.meta.env.VITE_API_BASE_URL;
```
Se debería usar `VITE_API_BASE_URL` en todos los componentes.

---

## Validación de contraseña inconsistente

En `login-component.vue` (línea 149-151):
```javascript
if (this.form.password.length < 4) {
    checkErrors.password = ['La contraseña debe tener al menos 8 caracteres'];
}
```
La validación comprueba si la contraseña tiene menos de **4 caracteres**, pero el mensaje dice **8 caracteres**. Uno de los dos valores es incorrecto.

---

## Rutas sin protección (route guards)

No hay ningún middleware/guard para proteger rutas en el frontend:

| Ruta | Problema |
|------|----------|
| `/profile` | Cualquiera puede acceder sin estar logueado. |
| `/admin` | Cualquiera puede acceder sin ser admin. |

Se debería comprobar `localStorage.getItem('user_token')` y el rol del usuario antes de permitir la navegación.

---

## Enlaces del navbar sin ruta definida

En `nav-component.vue` (líneas 65-74), hay enlaces a rutas que no existen en `routes/index.js`:

| Enlace | Ruta |
|--------|------|
| Nosotros | `/nosotros` |
| Empresas | `/empresas` |
| Carrito | `/cart` |

Estas rutas no están definidas en el router, por lo que al hacer clic no cargan ninguna página.

---

## Panel de admin incompleto

El `admin/home.vue` solo contiene un texto de prueba:
```html
<h1>HOLA, este es el Home Admin</h1>
```
Falta implementar las interfaces de administración para:
- Gestión de productos (CRUD)
- Gestión de servicios (CRUD)
- Gestión de usuarios
- Gestión de citas
- Gestión de facturas
- Gestión de vehículos y tipos
- Gestión de categorías

Actualmente solo existen:
- Edición de servicios en la home (`service-home-edit-component.vue`)
- Configuración del sidebar (`sidebar-configuration.vue`)

---

## Endpoint de perfil no existe en el backend

`Profile.js` y `profile-index.vue` hacen peticiones a:
- `GET /api/v1/profile` (para cargar datos del perfil)
- `PUT /api/v1/profile` (para actualizar el perfil)

Sin embargo, estas rutas **no existen** en `api.php` del backend. No hay ningún endpoint `/v1/profile`.

---

## Comprobación de rol incorrecta en login

En `login-component.vue` (línea 116):
```javascript
if (data.user.role === 'admin') {
```
Pero la API devuelve el rol como un **objeto**: `data.user.role = { id: 1, name: "admin" }`. La comprobación correcta sería:
```javascript
if (data.user.role.name === 'admin') {
```

---

## Archivos huérfanos en la raíz

Existen dos archivos en la raíz del proyecto frontend que no parecen pertenecer al proyecto:

| Archivo | Tamaño |
|---------|--------|
| `cache=true` | 16 KB |
| `dasdasd` | 928 bytes |

Probablemente son archivos de prueba que se pueden eliminar.

---

## Import no utilizado

En `Profile.js` (línea 1):
```javascript
import ProductCard from "./components/web_src/sections/products/product-card.vue";
```
Se importa `ProductCard` pero no se usa en ninguna parte del archivo.
