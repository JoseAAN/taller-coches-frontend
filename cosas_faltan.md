
## ~~URL de API hardcodeada~~ (RESUELTO)

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

## ~~Validación de contraseña inconsistente~~ (RESUELTO)

En `login-component.vue` (línea 149-151):
```javascript
if (this.form.password.length < 4) {
    checkErrors.password = ['La contraseña debe tener al menos 8 caracteres'];
}
```
La validación comprueba si la contraseña tiene menos de **4 caracteres**, pero el mensaje dice **8 caracteres**. Uno de los dos valores es incorrecto.

---

## ~~Rutas sin protección (route guards)~~ (RESUELTO)

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

Falta implementar las principales interfaces de administración para poder gestionar el negocio:

### 1. Gestión Principal del Taller
- **Gestión de Citas (Appointments):** Vista de calendario o tabla diaria para ver, cancelar, completar o reagendar citas (Faltan endpoints admin en backend).
- **Gestión de Servicios (CRUD):** Vista para Crear, Editar (precio, duración) y Eliminar servicios.
- **Gestión de Vehículos:** Vista para ver todos los coches registrados y a quién pertenecen.

### 2. Gestión de Tienda / E-commerce
- **Gestión de Productos (CRUD):** Añadir stock, cambiar precios y subir fotos de productos.
- **Gestión de Categorías (CRUD):** Crear y agrupar productos/servicios en categorías.
- **Gestión de Pedidos / Carritos (Carts):** Ver los pedidos realizados y su estado.
- **Facturación (Invoices):** Revisar, imprimir en PDF o anular facturas.

### 3. Mejoras del Dashboard (`home.vue`)
- **Estadísticas e Indicadores (Analytics):** Tarjetas resumen y gráficos mostrando ingresos, citas de hoy, nuevos usuarios o productos sin stock.

*Actualmente solo existen la gestión de Usuarios, la selección de servicios en la home y la configuración del sidebar.*

---

## ~~Endpoint de perfil no existe en el backend~~ (RESUELTO)

`Profile.js` y `profile-index.vue` hacen peticiones a:
- `GET /api/v1/profile` (para cargar datos del perfil)
- `PUT /api/v1/profile` (para actualizar el perfil)

Sin embargo, estas rutas **no existen** en `api.php` del backend. No hay ningún endpoint `/v1/profile`.

---

## ~~Comprobación de rol incorrecta en login~~ (RESUELTO)

En `login-component.vue` (línea 116):
```javascript
if (data.user.role === 'admin') {
```
Pero la API devuelve el rol como un **objeto**: `data.user.role = { id: 1, name: "admin" }`. La comprobación correcta sería:
```javascript
if (data.user.role.name === 'admin') {
```

---

## ~~Archivos huérfanos en la raíz~~ (RESUELTO)

Existen dos archivos en la raíz del proyecto frontend que no parecen pertenecer al proyecto:

| Archivo | Tamaño |
|---------|--------|
| `cache=true` | 16 KB |
| `dasdasd` | 928 bytes |

Probablemente son archivos de prueba que se pueden eliminar.

---

## ~~Import no utilizado~~ (RESUELTO)

En `Profile.js` (línea 1):
```javascript
import ProductCard from "./components/web_src/sections/products/product-card.vue";
```
Se importa `ProductCard` pero no se usa en ninguna parte del archivo.
