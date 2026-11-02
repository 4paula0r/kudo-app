# KUDO

Aplicación de finanzas personales en español, con React + TypeScript, API Express y PostgreSQL mediante Prisma. Incluye inicio de sesión y registro, resumen, finanzas, transacciones, metas y asistente Kudo AI. La interfaz usa quetzales y presenta los valores originales como datos demostrativos.

La documentación del **Entregable 1** (problema, requerimientos, modelo de datos, arquitectura, vistas y revisión del documento fuente) está en [`docs/entregable-1/`](docs/entregable-1/README.md).

Las páginas HTML originales de Login, Dashboard, Transacciones y Presupuestos están en `frontend/public/prototypes/`; sus copias originales están en `docs/referencia/html-prototipos/`. React las abre en las rutas principales para conservar tu trabajo. El login y el registro, así como el guardado de transacciones y la lista reciente, usan la API; las opciones Face ID/Google/Apple y los presupuestos todavía son prototipos. Las páginas usan Tailwind y fuentes por CDN, así que necesitan internet para cargar su apariencia completa.

## Requisitos

- Node.js 20 o superior y npm
- Docker Desktop para iniciar PostgreSQL (o una instancia PostgreSQL propia)

## Inicio local

1. Copia `backend/.env.example` como `backend/.env` y cambia `JWT_SECRET` por una clave privada.
2. En la raíz ejecuta `npm install` y `npm --prefix frontend install` y `npm --prefix backend install`.
3. Ejecuta `docker compose up -d db`.
4. Ejecuta `npm run db:generate` y `npm run db:migrate`.
5. Ejecuta `npm run dev` y abre `http://localhost:5173`.

La API queda en `http://localhost:4000`; Vite reenvía `/api` a ese servidor. Registra una cuenta desde `/login`. No se incluyen cuentas ni secretos reales. La asistencia financiera es una guía informativa local, no asesoramiento profesional.

## Estructura

- `frontend/`: aplicación web y seis vistas.
- `backend/`: API REST, validación, sesiones JWT y esquema Prisma.
- `docker-compose.yml`: PostgreSQL para desarrollo local.

## Rutas

`/login`, `/` (Inicio), `/finanzas`, `/transaccion`, `/metas`, `/kudo-ai`.
