# Revisión de KUDO frente a la rúbrica final

**Actualizada el 2 de noviembre de 2026.** Esta revisión refleja el código de `prepare-kudo-proyecto1`. Antes de entregar, compara cada punto con la última versión de la consigna del curso.

| Criterio | Estado actual | Pendiente para cerrar |
|---|---|---|
| Análisis y diseño (3) | Parcial | Completar portada, integrantes, datos administrativos, decisiones finales y evidencias de participación. La documentación del Entregable 1 está en `docs/entregable-1/`. |
| Frontend React + TypeScript (5.5) | Mejorado, aún parcial | Login, dashboard y finanzas ya son pantallas React conectadas a la API; las páginas HTML quedan como referencia, no como iframes activos. Revisar todos los flujos visualmente, completar pruebas de interfaz y decidir si presupuestos satisface todas las vistas de la consigna. |
| Backend Express + TypeScript (4) | Parcial | La API incluye autenticación, perfil, movimientos, metas, aportes y presupuestos, con validación y aislamiento por propietario. Revisar los requisitos concretos de la rúbrica y documentar cada ruta. |
| PostgreSQL + Prisma (3) | Parcial | Prisma administra usuarios, movimientos, metas, aportes y límites mensuales. Las categorías siguen siendo texto libre y no hay cuentas bancarias reales. |
| Seguridad (2) | Parcial | Se usan BCrypt, JWT, Zod, Helmet, CORS, límites de solicitudes y filtros por propietario. El token vive en `localStorage`; para un servicio público se deben usar cookies `HttpOnly`, revisar recuperación de contraseña, vencimiento/revocación y completar una lista OWASP. |
| Pruebas (1.5) | Parcial | Hay pruebas API con PostgreSQL para autorización, registro, operaciones de movimientos y límites mensuales. Ampliar a login, metas/aportes, validaciones restantes y una prueba de flujo de navegador. |
| Git/GitHub y colaboración (1.5) | Parcial | El código está publicado en la rama `prepare-kudo-proyecto1`. Falta crear y revisar un pull request, integrar los cambios a `main` y dejar evidencia de commits y contribuciones de cada integrante. |
| Docker + CI/CD (1.5) | Implementación local y CI lista | Docker Compose puede iniciar PostgreSQL, API y frontend. GitHub Actions instala dependencias, migra, compila y prueba en push y pull request. Falta verificar el flujo en GitHub y, si se pide CD, definir una plataforma y secretos de despliegue. |
| Despliegue, accesibilidad y rendimiento (1.5) | Pendiente | No hay URL pública. Probar teclado, foco, contraste, etiquetas/lector de pantalla, tamaño móvil y medir rendimiento con evidencia. El despliegue requiere cuenta y configuración del equipo. |
| Documentación y defensa (1.5) | Parcial | README, API y arquitectura están documentados. Faltan integrantes/datos de portada, capturas recientes, resultados de pruebas, evidencia de accesibilidad y material de presentación/defensa. |

## Funciones no incluidas como servicios reales

- La cifra inicial de Inicio conserva Q 4,850 y se ajusta con los movimientos del período. Debe explicarse como saldo inicial configurado para la demostración; si la rúbrica exige saldo real por usuario, añadir un campo editable en el perfil antes de entregar.
- Face ID, Google y Apple no se ofrecen como botones porque no hay proveedores de autenticación configurados.
- Kudo AI es una guía local basada en movimientos registrados y reglas de texto, no un modelo generativo ni asesoría financiera.
- No hay conexión bancaria ni detección automática de Apple Pay.

## Pendientes para la entrega académica

- Confirmar en el PDF de la consigna el formato, datos y archivos que pide la entrega final. El PDF en `docs/referencia/` se conserva como fuente.
- Escribir portada con curso, sección, docente, fecha e integrantes, según corresponda.
- Reunir capturas de registro, ingresos, gastos, presupuestos, edición, metas y análisis.
- Ejecutar y guardar el resultado de `npm run build`, `npm test` y `docker compose up --build`.
- Revisar el pull request y la rama que se entregará; no entregar solo una rama sin explicar su estado.
- Preparar una demostración y comprobar que cada integrante pueda explicar frontend, API, modelo de datos, seguridad y límites conocidos.
- Subir los archivos al portal indicado por el curso; la documentación fuente indica que no se reciben por correo.

## Orden práctico sugerido

1. Completar datos administrativos y material de defensa.
2. Validar los flujos de la app en navegador y cerrar cualquier error de la rúbrica.
3. Ejecutar pruebas y Docker; guardar capturas/logs de resultados.
4. Revisar pull request y decidir si se integra a `main`.
5. Completar revisión de accesibilidad/rendimiento y publicar solo si el curso lo exige y el equipo tiene una cuenta de despliegue.
