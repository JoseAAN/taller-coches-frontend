# Cosas que faltan en el proyecto

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

Falta implementar interfaces de administración para poder gestionar el negocio:

### 1. Gestión Principal del Taller
- **Gestión de Citas (Appointments):** Vista de calendario o tabla diaria para ver, cancelar, completar o reagendar citas (Faltan endpoints admin en backend).
- **Gestión de Servicios (CRUD):** Vista para Crear, Editar (precio, duración) y Eliminar servicios.

### 2. Gestión de Tienda / E-commerce
- **Gestión de Productos (CRUD):** Añadir stock, cambiar precios y subir fotos de productos.
- **Gestión de Categorías (CRUD):** Crear y agrupar productos/servicios en categorías.
- **Gestión de Pedidos / Carritos (Carts):** Ver los pedidos realizados y su estado.
- **Facturación (Invoices):** Revisar, imprimir en PDF o anular facturas.

---

## Traspaso o Liberación de vehículos entre usuarios

Actualmente la matrícula de un coche es única. Si un usuario (ej. Carlos) vende un coche a oro (ej. Juan) sin borrarlo de su cuenta, el nuevo propietario será bloqueado al intentar registrarlo por error de duplicidad. 

Opciones a implementar para evitar que dependa del administrador:
1. **Sistema de Traspaso:** Botón "Transferir Vehículo" donde introducen el email del nuevo comprador y el coche cambia de dueño automáticamente arrastrando el historial.
2. **Liberación ("Desvincular"):** Botón "Quitar de mi garaje" que en lugar de eliminar, pone el `user_id = null` liberando el coche para ser reclamado.
3. **Reclamar con VIN:** Permitir reclamar una matrícula duplicada introduciendo Número de Bastidor.


## Bugs encontrados:
Al reservar cita las horas no aparecen ordenadas. las 8 y 9 am aparecen despues de las 20
Algun problema relacionado con la asignacion de carritos cuando un usuario completa una compra. No se le asigna un nuevo carrito