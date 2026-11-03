# KUDO · Finanzas personales

KUDO es una aplicación web en español para registrar ingresos y gastos, revisar hábitos por categoría, definir límites mensuales y seguir metas de ahorro. La interfaz principal está hecha con React y TypeScript; la API usa Express, Prisma y PostgreSQL.

## Requisitos

- Node.js 20 o superior y npm
- Docker Desktop para la opción de ejecución con contenedores

## Ejecutar toda la aplicación con Docker

Desde la raíz del proyecto:

```powershell
$env:JWT_SECRET = 'pon-aqui-una-clave-privada-de-al-menos-32-caracteres'
docker compose up --build
```

Abre <http://localhost:8080>. Docker inicia PostgreSQL, aplica las migraciones, levanta la API y sirve el frontend. La API también está disponible en <http://localhost:4001/api/health>. La base de desarrollo publica el puerto `5433` y usa `kudo` / `12345` solo en esta configuración local. Para detener la aplicación, presiona `Ctrl+C` y ejecuta `docker compose down`; los datos se conservan en el volumen `kudo_data`.

## Ejecutar en modo desarrollo

1. Copia `backend/.env.example` a `backend/.env` y reemplaza `JWT_SECRET` por una clave privada de al menos 32 caracteres.
2. Ejecuta `npm install`, `npm --prefix frontend install` y `npm --prefix backend install`.
3. Inicia PostgreSQL con `docker compose up -d db`.
4. Ejecuta `npm run db:generate` y `npm run db:migrate`.
5. Ejecuta `npm run dev` y abre <http://localhost:5173>.

En desarrollo, Vite reenvía `/api` a `http://localhost:4000`; el contenedor PostgreSQL publica su puerto en `5433`. Registra una cuenta desde `/login`.

## Verificación

```powershell
npm run build
npm test
```

Las pruebas de API requieren que PostgreSQL esté iniciado, que la migración esté aplicada y que las variables de `backend/.env` apunten a esa base. Las pruebas crean y eliminan cuentas temporales con direcciones `@kudo.local`.

GitHub Actions ejecuta instalaciones limpias, migraciones, compilación y pruebas de API en cada push a `main` o `prepare-kudo-proyecto1` y en pull requests a `main`.

## Documentación

- [API, entidades y decisiones técnicas](docs/api-y-arquitectura.md)
- [Entregable 1](docs/entregable-1/README.md)
- [Revisión frente a la rúbrica final](docs/revision-rubrica-final.md)

La asistencia financiera de KUDO ofrece orientación general a partir de movimientos registrados; no es asesoría financiera profesional. Los prototipos HTML originales se conservan como referencia en `docs/referencia/html-prototipos/` y `frontend/public/prototypes/`; el login, el dashboard y finanzas ya no se montan en iframes.
