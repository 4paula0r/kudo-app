# Requerimientos y criterios de aceptación

## Requerimientos funcionales

| ID | Requerimiento | Criterio de aceptación |
|---|---|---|
| RF-01 | Registro e inicio de sesión | El usuario se registra con nombre, correo y contraseña; las credenciales inválidas se rechazan y las rutas privadas requieren JWT válido. |
| RF-02 | Gestión de transacciones | El usuario crea, consulta, edita y elimina sus ingresos y gastos; cada movimiento guarda monto positivo, tipo, fecha, categoría y descripción opcional. |
| RF-03 | Presupuestos por categoría | El usuario define un límite para una categoría y un mes; puede consultar monto usado, restante y porcentaje. |
| RF-04 | Metas de ahorro | El usuario crea una meta con nombre, monto objetivo y fecha límite; registra aportaciones y ve el progreso actualizado. |
| RF-05 | Dashboard | El panel resume balance, ingresos, gastos, presupuestos y distribución de movimientos usando datos del usuario y del periodo seleccionado. |
| RF-06 | Filtros e historial | El usuario filtra movimientos por periodo, tipo y categoría; los resultados respetan su cuenta. |
| RF-07 | Recomendaciones Kudo AI | El sistema presenta sugerencias claramente identificadas como orientación y basadas en los movimientos disponibles. |

## Requerimientos no funcionales

- **RNF-01 Seguridad:** contraseñas con hash BCrypt; JWT en rutas protegidas; autorización por propietario; validación de entradas; secretos en variables de entorno; limitación de intentos en autenticación y encabezados de seguridad.
- **RNF-02 Arquitectura:** frontend React + TypeScript; API REST en Express + TypeScript; PostgreSQL mediante Prisma ORM.
- **RNF-03 Usabilidad y accesibilidad:** diseño responsive, contraste legible, foco visible, controles con etiquetas y navegación por teclado.
- **RNF-04 Calidad:** pruebas unitarias e integración para la API y componentes relevantes; escenarios E2E para registro, transacciones y metas.
- **RNF-05 Despliegue:** servicios reproducibles con Docker y publicación de frontend, API y base de datos en un entorno cloud.
- **RNF-06 Privacidad:** un usuario solo puede consultar y modificar sus propios registros; no se solicitan credenciales bancarias.

## Reglas de negocio

- Los montos son mayores que cero; el tipo determina si se contabiliza como ingreso o egreso.
- Una categoría puede ser predefinida o personal, pero su uso debe respetar el tipo de movimiento.
- El presupuesto es único por usuario, categoría, mes y año.
- Las aportaciones no pueden ser negativas; el avance visible se limita a 100%, conservando el monto real aportado.
- El balance se calcula a partir de movimientos persistidos: suma de ingresos menos suma de gastos para el periodo definido.

## Estado de implementación

Al 2 de noviembre de 2026, la API implementa registro e inicio de sesión JWT, perfil, creación/listado/edición/eliminación de movimientos, filtros y paginación; también permite crear y consultar metas y guardar aportaciones persistidas. El frontend permite crear movimientos, metas y aportaciones. Las pantallas principales de login, dashboard y finanzas aún se sirven como prototipos HTML; presupuestos, dashboard con datos reales y la interfaz para editar/eliminar movimientos siguen pendientes. Las pruebas automatizadas, el despliegue y el CI/CD también están pendientes.
