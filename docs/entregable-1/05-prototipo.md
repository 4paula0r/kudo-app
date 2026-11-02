# Vistas y prototipo

Las cuatro páginas HTML originales del usuario están conservadas en `docs/referencia/html-prototipos/` y se sirven desde `frontend/public/prototypes/`. La app React las presenta mediante `PrototypeFrame`, preservando el diseño y el JavaScript de interacción. El Login sigue la referencia visual de `docs/referencia/login-referencia.png`.

## Login y registro

- Marca KUDO centrada, lema “Tu dinero, pero más fácil.” y tarjeta clara sobre fondo neutro.
- Selector entre “Iniciar Sesión” y “Crear Cuenta”.
- Correo y contraseña con iconos; acción para mostrar u ocultar la contraseña.
- Botón oscuro “Entrar a Kudo”, acceso con Face ID y botones de Google/Apple como affordances del prototipo.
- Mensajes legibles de error y confirmación; diseño de una columna adaptable.
- **Alcance implementado:** email y contraseña se conectan a los endpoints JWT. Recuperación de contraseña, Face ID y proveedores sociales muestran que están pendientes; no autentican todavía.

## Dashboard

El dashboard HTML conserva el resumen, gráfico, consejo y navegación originales. Sus tarjetas y el gráfico aún muestran valores de demostración; la lista de movimientos recientes se carga desde la API cuando hay sesión.

## Presupuestos

Vista por categoría con límite, monto consumido, saldo disponible y barra de progreso. La página HTML de presupuestos ya está incluida y accesible desde Finanzas; sus interacciones de modal son de prototipo y aún no guardan límites en la API o la base de datos.

## Transacción

La página HTML de transacciones conserva el selector ingreso/gasto, teclado numérico, categorías, concepto, métodos de pago y opción visual para comprobante. El botón Guardar envía el movimiento a la API autenticada. La fecha usa la fecha actual; adjuntar archivos aún es solo visual.

## Metas

Tarjetas con nombre, monto objetivo, progreso, monto ahorrado y fecha límite; permitir registrar aportaciones. El progreso debe persistir mediante la API.

## Finanzas e historial

Lista de movimientos con categoría, tipo, fecha y monto; filtros por periodo, tipo y categoría; opciones para ver, editar y eliminar con confirmación.

## Kudo AI

Conversación o sugerencias explicables basadas en los movimientos y presupuestos existentes. En la versión inicial se usarán reglas simples y texto informativo; no se promete un modelo generativo ni asesoría financiera profesional.

## Accesibilidad y estados

- Usar etiquetas vinculadas a campos, botones con nombres accesibles y foco visible.
- No comunicar ingreso/gasto solo por color: incluir texto o signo.
- Contemplar estados vacío, cargando, error y guardado.
- Verificar contraste y uso con teclado en tamaños móviles y escritorio.
