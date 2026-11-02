# Problema, justificación y alcance

## Problema

Estudiantes y jóvenes profesionales a menudo mezclan gastos cotidianos, no anotan compras pequeñas y pierden visibilidad de cuánto pueden ahorrar. Llevar las cuentas en una hoja de cálculo requiere constancia y puede ser incómodo desde el teléfono. Sin una vista clara de ingresos, egresos y metas, cuesta reconocer hábitos y planear gastos.

## Solución propuesta

KUDO es una aplicación web personal que reúne transacciones, presupuestos y metas de ahorro en una interfaz adaptable. El usuario podrá registrar movimientos en quetzales, categorizarlos y consultar resúmenes que expliquen cómo se distribuye su dinero. Las sugerencias de Kudo AI se presentarán como orientación basada en los datos registrados, no como hechos ni como asesoría profesional.

## Usuarios y necesidad

- **Usuario principal:** persona que desea organizar su presupuesto personal, especialmente estudiantes y jóvenes profesionales.
- **Necesidad:** registrar movimientos sin depender de una hoja de cálculo y entender el efecto de sus hábitos en el ahorro.
- **Contexto de uso:** navegador de escritorio o teléfono; idioma español; moneda de referencia GTQ (Q).

## Objetivo general

Diseñar e implementar una aplicación web segura y usable para registrar ingresos y gastos, revisar presupuestos por categoría y dar seguimiento a metas de ahorro.

## Objetivos específicos

- Permitir registro e inicio de sesión individual.
- Registrar y consultar transacciones con tipo, monto, categoría, fecha y descripción.
- Definir límites mensuales por categoría y mostrar el consumo.
- Crear metas de ahorro y registrar aportaciones.
- Resumir movimientos en un dashboard y ofrecer recomendaciones explicables.

## Alcance de la primera versión

**Incluye:** autenticación, CRUD de transacciones, categorías, presupuestos mensuales, metas y aportaciones, dashboard, filtros básicos y recomendaciones informativas.

**Fuera de alcance inicial:** conexión a bancos, pagos, transferencias, asesoría financiera profesional, sincronización automática bancaria y acceso real con Google, Apple o biometría. Esas opciones del prototipo visual no deben presentarse como funciones activas.

## Criterios de éxito

- Un usuario puede crear su cuenta y acceder a sus propios datos.
- Puede registrar un ingreso o gasto y verlo en su historial.
- El presupuesto muestra claramente cuánto se ha gastado y cuánto queda.
- El progreso de una meta cambia cuando se registra una aportación.
- La aplicación se puede navegar y leer en tamaños móviles y con teclado.
