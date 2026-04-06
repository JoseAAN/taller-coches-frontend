# Cosas que faltan en el proyecto

# Auditoria rapida de errores

Fecha: 2026-04-05

## Altos

6. El borrado de servicios desde carrito puede dejar items huerfanos
- Archivo: `taller-coches-frontend/src/JS/Cart.js`
- Lineas: 137-160
- Problema: para servicios se borra primero la cita y luego el item del carrito en otra request distinta.
- Riesgo: si la segunda request falla, queda un `item` sin `item_appointment`, y el carrito puede devolver lineas sin `details`.
- Recomendacion: exponer un endpoint backend unico para "eliminar servicio del carrito" y ejecutar todo en transaccion.

7. El backend admite `appointment_id` en factura, pero ni la tabla ni el modelo lo soportan
- Archivos:
- `taller-coches-backend/backend/app/Http/Controllers/InvoiceController.php`
- `taller-coches-backend/backend/app/Models/Invoice.php`
- `taller-coches-backend/backend/database/migrations/2026_03_17_152008_create_unified_invoices_table.php`
- Lineas: controller 48-52, modelo 14-19, migracion 14-20
- Problema: se valida `appointment_id`, pero no existe columna ni `fillable` para persistirlo.
- Riesgo: falsa sensacion de soporte para facturacion de citas directas; el dato se pierde silenciosamente.
- Recomendacion: o bien eliminar ese input de la API, o bien añadir columna, relacion y logica completa.

11. Cancelar cita desde perfil no elimina correctamente el item del carrito
- Archivo: `taller-coches-frontend/src/components/web_src/sections/profile/sections-profile/profile-appointments.vue`
- Problema: al pedir `/v1/user-cart` se usa `cartData.items?.find(...)`, pero esa API devuelve los items dentro de `cartData.data.items`.
- Impacto: el item del carrito no se encuentra nunca, así que la cita puede borrarse sin limpiar su linea del carrito. Con el estado actual del backend eso facilita dejar items huerfanos.

12. El calendario de citas del admin pide filtro por mes que el backend no usa
- Archivo: `taller-coches-frontend/src/components/admin_src/appointments/admin-appointments.vue`
- Problema: `cargarCitas()` llama a `/v1/appointments/all?month=YYYY-MM`, pero el backend solo filtra por `date` y `status`.
- Impacto: el calendario puede pintar citas de otros meses y el contador por dia deja de representar el mes visible de forma fiable.



## Nota

Esta auditoria es una pasada rapida orientada a errores funcionales y de seguridad evidentes. No sustituye una revision completa de permisos, validaciones, tests ni consistencia de datos.
