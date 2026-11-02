# Revisión integral del PDF proporcionado

Se revisaron las 10 páginas del PDF original, incluidas las páginas visuales del prototipo.

| Páginas | Contenido observado | Acción para KUDO |
|---|---|---|
| 1 | Portada, curso, docente e integrantes | Se conserva en el PDF fuente; no se duplican nombres ni carnés en el código. |
| 2–3 | Problema, solución, RF/RNF, modelo relacional | Se reorganizan y amplían en los documentos 01–03. La solución y los requisitos de presupuestos se conservan. |
| 2–3 y 6 | Backend Java/Spring Boot, Spring Security, JPA y SQL Server | Se reemplazan en la arquitectura de este proyecto por Express/TypeScript, JWT, Prisma y PostgreSQL, conforme a la rúbrica. |
| 3–5 | Tablas User, Category, Transaction, Budget y SavingsGoal, con SQL Server DDL | Se transforma a un diseño relacional independiente del proveedor y se añade historial de aportaciones a metas. |
| 6 | Diagrama React + Spring Boot + SQL Server y Docker/CI | Se sustituye por React + Express + PostgreSQL; Docker y CI se describen como objetivo de entrega final. |
| 7 | Login/registro con Face ID, Google y Apple | Se usa la composición visual de referencia. Solo email/contraseña tienen backend; las otras opciones se muestran como pendientes. |
| 8 | Dashboard con tarjetas, gráfico y movimientos | Se especifica, señalando que los importes actuales de la app son de demostración. |
| 9 | Módulo de presupuestos con barras por categoría | Se conserva la página HTML y su modal de prototipo; falta guardar y calcular presupuestos con API y base de datos. |
| 10 | Modal de transacción con categoría, fecha, pago y teclado numérico | Se conserva la página HTML original; el teclado y la selección funcionan en el prototipo, y falta integrar adjuntos. |

Además, el usuario proporcionó cuatro archivos HTML independientes (Login, Dashboard, Transacciones y Presupuestos). Se conservaron sin cambios en `docs/referencia/html-prototipos/`, y sus versiones activas quedaron en `frontend/public/prototypes/`. React carga estas páginas con un iframe de ruta; se mantienen así su composición y sus interacciones originales. El Login y el guardado de transacciones ya llaman a la API; los presupuestos, acceso social/biométrico, reset de contraseña y métricas del dashboard aún no tienen persistencia completa.

## Correcciones importantes antes de entregar

1. No entregar el mismo informe con tecnologías contradictorias: el texto del PDF dice Spring/SQL Server y la rúbrica califica Express/PostgreSQL/Prisma.
2. Incorporar la vista y entidad de presupuestos si se mantiene RF-03.
3. Cambiar promesas de funciones por su estado real: OAuth, Face ID, recuperación de contraseña, CRUD completo, cálculos reales del dashboard y persistencia de aportaciones están pendientes.
4. Completar la portada, integrantes, docente y detalles de formato en el documento oficial del equipo. El código y esta revisión no sustituyen los datos administrativos requeridos por el curso.

El PDF original se conserva sin modificar en `docs/referencia/` para trazabilidad; este resumen es la especificación alineada al proyecto y a la rúbrica.
