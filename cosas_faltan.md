# Cosas que faltan en el proyecto

# Auditoria rapida de errores

Fecha: 2026-04-05

## Criticos

1. Facturacion manipulable desde cliente
- Archivo: `taller-coches-backend/backend/app/Http/Controllers/InvoiceController.php`
- Lineas: 48-57
- Problema: `store()` acepta `total` directamente desde la request y crea la factura con ese valor sin recalcularlo a partir del carrito o de la cita real.
- Riesgo: cualquier cliente autenticado puede pagar menos enviando un `total` alterado.
- Recomendacion: ignorar el `total` recibido y recalcularlo en servidor desde `cart.items` o desde la entidad facturada.

2. Se puede facturar el carrito de otro usuario
- Archivo: `taller-coches-backend/backend/app/Http/Controllers/InvoiceController.php`
- Lineas: 50-80
- Problema: se valida que `cart_id` exista, pero no que pertenezca al usuario autenticado.
- Riesgo: un usuario podria generar factura sobre un carrito ajeno y además descontar stock de productos que no son suyos.
- Recomendacion: cargar el carrito y validar `cart.user_id === request()->user()->id`, salvo admin si el negocio lo permite.

3. Cualquier usuario autenticado puede ver facturas ajenas por ID
- Archivo: `taller-coches-backend/backend/app/Http/Controllers/InvoiceController.php`
- Lineas: 105-111
- Problema: `show()` no hace comprobacion de propiedad ni de rol.
- Riesgo: fuga de datos personales y comerciales.
- Recomendacion: aplicar la misma politica que en carrito/citas y bloquear acceso a facturas de otros usuarios.

4. El backend permite reservar citas usando vehiculos de otros usuarios
- Archivo: `taller-coches-backend/backend/app/Http/Controllers/AppointmentController.php`
- Lineas: 92-128 y 177-222
- Problema: en `store()` y en `update()` se acepta `vehicle_id` sin validar propiedad del vehiculo nuevo.
- Riesgo: un usuario puede crear o mover citas sobre coches ajenos.
- Recomendacion: validar que el vehiculo pertenece al usuario autenticado antes de crear o actualizar.

## Altos

5. La creacion de cita y el alta en carrito no son atomicas
- Archivo: `taller-coches-frontend/src/components/web_src/sections/appointment/inf/step-summary.vue`
- Lineas: 145-172
- Problema: primero se crea la cita y luego se llama a `cart.addToCart()`. Si el segundo paso falla, la cita queda creada pero fuera del carrito.
- Riesgo: citas huerfanas, huecos bloqueados en agenda y datos inconsistentes para el usuario.
- Recomendacion: mover el flujo a backend en una transaccion unica o compensar borrando la cita si falla la insercion en carrito.

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


## Nota

Esta auditoria es una pasada rapida orientada a errores funcionales y de seguridad evidentes. No sustituye una revision completa de permisos, validaciones, tests ni consistencia de datos.
