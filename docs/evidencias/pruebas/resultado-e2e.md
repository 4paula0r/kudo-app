# Resultado de pruebas E2E

- **Fecha:** 3 de noviembre de 2026 (America/Guatemala).
- **Entorno:** Windows, PowerShell; Node.js v26.7.0, npm 11.19.0; Playwright 1.64.1 con Chromium 156.0.8078.4.
- **Base aislada:** PostgreSQL 16 temporal, base `kudo_test`; la configuración rechaza nombres de base distintos.
- **Comando:** `npm run test:e2e` desde la raíz, con `DATABASE_URL` apuntando a `kudo_test` y variables de prueba temporales no documentadas aquí.
- **Estado:** aprobado en la última ejecución.
- **Resultado:** 1 prueba Playwright aprobada, 0 fallidas, 0 omitidas (1 recorrido E2E con 12 pasos); 14.0 s reportados para la prueba (23.6 s incluyendo preparación y cierre de servidores).
- **Vista del navegador:** Chromium, 1440 × 1000.

El recorrido verificó:

1. Pantalla de bienvenida.
2. Bloqueo de Finanzas sin autenticación.
3. Registro de una cuenta con correo sintético.
4. Cierre de sesión e intento de acceso con contraseña incorrecta.
5. Inicio de sesión válido.
6. Creación de un ingreso de Q1,000.
7. Creación de un gasto de Q50 en Comida.
8. Consulta de ambos movimientos en Finanzas.
9. Actualización del balance del dashboard a Q950, con ingresos y gastos del mes visibles.
10. Creación de un presupuesto de Comida por Q200 y barra en Q50/Q200.
11. Creación de una meta por Q500 y aporte de Q100 (20%).
12. Cierre de sesión y redirección de una ruta privada al flujo de autenticación.

El test usa una sola cuenta y datos sintéticos dentro de la base temporal. Se generaron capturas reales en `capturas/` y un reporte HTML en `playwright-report/index.html`. Los intentos iniciales detectaron selectores ambiguos; se corrigió el test y la ejecución final aprobó.

El recorrido no cubre Kudo AI. Las dos primeras ejecuciones de CI pasaron instalación, migraciones, compilación y `npm test`, pero detectaron diferencias reales entre el marcado de autenticación y de la barra de presupuesto de la rama remota y los selectores originales. El test ahora abre `/login` explícitamente tras cerrar sesión y verifica el progreso del límite mediante los atributos accesibles si existen o mediante el ancho real de la barra (`25%`) en el marcado actual. La nueva ejecución remota aún está pendiente.
