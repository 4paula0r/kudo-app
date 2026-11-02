# Revisión del proyecto KUDO frente a la rúbrica final

**Revisión realizada el 2 de noviembre de 2026.** KUDO cuenta con una base funcional de React, Express, PostgreSQL y Prisma, pero todavía no cumple todos los requisitos de entrega final. Esta revisión separa lo que ya existe de lo pendiente para evitar presentar prototipos o datos de muestra como funciones terminadas.

| Criterio | Estado | Evidencia y trabajo pendiente |
|---|---|---|
| Análisis y diseño (3) | Parcial | `docs/entregable-1/` contiene problema, requerimientos, modelo, arquitectura y vistas. Completar integrantes, datos administrativos y evidencia de decisiones del equipo para la defensa. |
| Frontend React + TypeScript (5.5) | Parcial | La aplicación tiene rutas y componentes React/TypeScript. Login, dashboard y finanzas todavía se muestran como HTML prototipo en iframe; migrarlos a componentes React. Presupuestos sigue siendo principalmente prototipo. |
| Backend Express + TypeScript (4) | Parcial | API REST con registro, login, perfil, movimientos, metas, filtros y aportes. Se añadieron edición y eliminación de movimientos. Faltan presupuestos y terminar la integración de todas las pantallas con API. |
| PostgreSQL + Prisma (3) | Parcial | Prisma gestiona usuarios, movimientos, metas y aportes con migraciones. Las categorías se guardan como texto y aún no hay modelos de presupuesto ni cuenta financiera. |
| Seguridad (2) | Parcial | BCrypt, JWT, Zod, Helmet, CORS, límites de solicitudes y consultas privadas por propietario. Revisar almacenamiento del token en navegador, política de contraseñas y una lista OWASP de verificación antes de publicar. |
| Pruebas (1.5) | Pendiente | No hay suites automatizadas de frontend, API ni E2E. Añadir pruebas de validación, autorización, operaciones CRUD y flujos principales antes de la entrega. |
| Git/GitHub y colaboración (1.5) | Pendiente de evidencia | El repositorio local todavía no tiene commits ni remoto configurado. Crear commits por cambios, enlazar GitHub y documentar la contribución de cada integrante. |
| Docker + CI/CD (1.5) | Parcial | `docker-compose.yml` inicia PostgreSQL. Faltan contenedores para API y frontend, además de un flujo CI/CD que compile y ejecute pruebas. |
| Despliegue, accesibilidad y rendimiento (1.5) | Pendiente | Solo hay ejecución local. Falta despliegue público, revisión con teclado/lector de pantalla y métricas reproducibles de rendimiento. |
| Documentación y defensa (1.5) | Parcial | Existe README y documentación del Entregable 1. Añadir guía de despliegue, API, pruebas, decisiones de seguridad, capturas y evidencia para la presentación. |

## Funciones que aún se muestran como demostración

- El dashboard conserva cifras, gráficos y algunas fechas escritos como datos de ejemplo; no debe presentarse como cálculo real hasta conectarlo a consultas por usuario y período.
- El prototipo de presupuestos no persiste límites ni compara gastos reales con ellos.
- Las opciones Face ID, Google y Apple del login no tienen integración de autenticación.
- Las pantallas HTML cargan estilos y fuentes por CDN; sin conexión pueden perder su apariencia.

## Rediseño de identidad

La propuesta de mascota se dejó pendiente porque el equipo quiere enviar una referencia visual propia. El rediseño se retomará a partir de ese logo para mantener una identidad que sí represente al equipo.

## Condiciones de entrega

- El equipo debe estar formado por un máximo de cuatro integrantes; el repositorio todavía no documenta la composición del equipo ni los datos que deban aparecer en la portada.
- Todos los integrantes deben poder explicar y demostrar el funcionamiento de toda la solución durante la defensa.
- La entrega se presenta en el portal habilitado por el curso. El documento indica que no se aceptan entregas por correo u otros medios.
- La solución y sus recursos deben ser propios y el equipo debe poder explicar su autoría; no se permite copiar el proyecto ni usar plantillas de terceros.

## Orden recomendado para cerrar las brechas

1. Migrar dashboard, login y finanzas de los prototipos HTML a React y conectar sus datos.
2. Implementar el módulo de presupuestos con esquema Prisma, API y controles de interfaz.
3. Añadir pruebas de API y E2E para autenticación, movimientos, metas y presupuestos.
4. Crear Dockerfiles, completar Compose y configurar CI para compilar y probar cada cambio.
5. Desplegar la aplicación, revisar accesibilidad y registrar métricas de rendimiento.
6. Preparar commits de GitHub, documentación de instalación y material de defensa.
