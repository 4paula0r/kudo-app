# Resultado de `npm test`

- **Fecha:** 3 de noviembre de 2026 (America/Guatemala).
- **Entorno:** Windows, PowerShell; Node.js v26.7.0, npm 11.19.0; PostgreSQL 16 en un contenedor temporal aislado.
- **Base de datos:** `kudo_test`, mapeada temporalmente a `127.0.0.1:55432`. Se aplicaron allí las 6 migraciones Prisma. No se conectó a la base `kudo`.
- **Comando:** `npm test` desde la raíz del proyecto.
- **Estado:** aprobado.
- **Resultado:** 7 pruebas aprobadas, 0 fallidas, 0 omitidas; duración informada por Node: 5.56 s.

La suite existente usa Node.js Test Runner con `tsx`. Cubre autenticación válida e inválida, rutas privadas, creación/consulta/edición de movimientos, presupuestos, validación de entradas, metas, aportes y separación entre usuarios. Los usuarios de prueba se generan con correo sintético y se eliminan al terminar.

La suite no prueba Kudo AI. El test incorpora una guarda para rechazar cualquier `DATABASE_URL` cuyo nombre no sea `kudo_test`.

**Comando de preparación ejecutado en `backend/`:** `prisma migrate deploy --schema prisma/schema.prisma`. Se aplicaron:
- `20261021050314_init_schema`
- `20261028000000_goal_contributions`
- `20261102000000_user_personal_information`
- `20261102010000_user_age_currency`
- `20261102020000_user_expense_categories`
- `20261102030000_budgets`

La URL y la contraseña de la base temporal, así como el secreto de prueba de JWT, se omiten de esta evidencia.