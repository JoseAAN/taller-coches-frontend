# Cosas que faltan en el proyecto

## Bugs encontrados:
Al reservar cita las horas no aparecen ordenadas. las 8 y 9 am aparecen despues de las 20
Algun problema relacionado con la asignacion de carritos cuando un usuario completa una compra. No se le asigna un nuevo carrito

## Hallazgos

[P0] Un cliente puede crear o reasignar citas sobre vehículos ajenos. En AppointmentController.php (line 90), store() acepta cualquier vehicle_id y nunca comprueba que pertenezca al usuario autenticado. En AppointmentController.php (line 175), update() valida que el usuario sea dueño de la cita actual, pero luego permite cambiar vehicle_id a otro vehículo cualquiera. Esto es un IDOR serio y debería bloquearse como hiciste con carritos.

[P0] Las facturas siguen expuestas a acceso indebido y manipulación de stock. En InvoiceController.php (line 46), store() permite facturar cualquier cart_id existente sin comprobar propiedad, y además descuenta stock de los productos de ese carrito. En InvoiceController.php (line 105), show() devuelve cualquier factura autenticada sin verificar si es del usuario o de un admin. Es otra brecha clara de autorización.

[P1] Los tokens de acceso se guardan y validan en texto plano. En AuthController.php (line 75) y UserController.php (line 47) se genera un token aleatorio y se persiste directamente en users.api_token; luego el middleware lo compara tal cual en EnsureTokenIsValid.php (line 20). Si alguien accede a la base de datos, puede reutilizar sesiones activas inmediatamente. Aquí conviene migrar a Sanctum o, como mínimo, almacenar hashes de token.

[P1] El proyecto está versionando una clave de aplicación real en el ejemplo de entorno. En .env.example (line 3) hay un APP_KEY concreto en lugar de dejarlo vacío. Aunque sea “example”, es mala práctica porque normaliza compartir secretos y puede llevar a despliegues repetidos con la misma clave.

[P2] Varias respuestas de error filtran detalles internos al cliente. En VehicleController.php (line 32), VehicleController.php (line 75), VehicleController.php (line 147) y otros puntos se devuelve $e->getMessage() en JSON. Eso puede exponer estructura de BD, nombres de columnas o validaciones internas.