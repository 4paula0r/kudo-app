# API y arquitectura

## Componentes

- **Frontend:** React, TypeScript, Vite y React Router.
- **API:** Express y TypeScript, con validación Zod y sesiones JWT.
- **Datos:** PostgreSQL y Prisma; las cuentas financieras son privadas por usuario.
- **Ejecución local:** Docker Compose levanta PostgreSQL, API y frontend. Nginx sirve la aplicación y reenvía `/api` a Express.

## Recursos REST

Todas las rutas, salvo salud e ingreso/registro, requieren `Authorization: Bearer <token>`.

| Método y ruta | Uso |
|---|---|
| `GET /api/health` | Verifica que la API responda. |
| `POST /api/auth/register`, `POST /api/auth/login` | Crea una cuenta o inicia sesión. |
| `GET /api/auth/me`, `PATCH /api/auth/me` | Consulta o actualiza el perfil autenticado. |
| `GET /api/transactions` | Lista movimientos; admite `page`, `limit`, `type`, `category`, `from` y `to`. |
| `POST /api/transactions`, `PATCH /api/transactions/:id`, `DELETE /api/transactions/:id` | Operaciones de movimientos limitadas a su propietario. |
| `GET /api/goals`, `POST /api/goals` | Consulta o crea metas de ahorro. |
| `GET /api/goals/:id/contributions`, `POST /api/goals/:id/contributions` | Consulta o agrega aportes a una meta. |
| `GET /api/budgets?month=AAAA-MM` | Lista límites del mes y calcula gasto real, restante y porcentaje. |
| `POST /api/budgets` | Crea o reemplaza el límite de una categoría para un mes. |
| `PATCH /api/budgets/:id`, `DELETE /api/budgets/:id` | Actualiza o elimina un límite propio. |

Los errores de validación responden con estado `400`, las sesiones inválidas con `401`, los recursos ajenos o inexistentes con `404` y los conflictos únicos con `409`. Los montos de API se serializan como números.

## Modelo de datos

`User` tiene movimientos, metas, aportes y límites. `Budget` identifica de forma única a cada pareja de usuario, categoría y mes. Sus gastos se obtienen de las transacciones de tipo `EXPENSE` del mismo usuario y mes; el total no se almacena duplicado.

Las migraciones están en `backend/prisma/migrations/`. En producción, `docker compose` ejecuta `prisma migrate deploy` antes de iniciar la API.

## Seguridad implementada y pendientes

La API aplica BCrypt para contraseñas, JWT de siete días, validación Zod, Helmet, CORS de origen configurado, límite de solicitudes y filtros de propietario en operaciones privadas. El frontend guarda el token en `localStorage`, una decisión apropiada solo para esta entrega local; una versión pública debería migrar a cookies `HttpOnly`, revisar recuperación de contraseña y rotación/revocación de sesiones. No se habilitaron proveedores falsos de Apple, Google ni biometría.
