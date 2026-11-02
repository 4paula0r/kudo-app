# Entregable 1 · Análisis, diseño y prototipo de KUDO

Esta carpeta contiene la versión de trabajo del Entregable 1, organizada para revisión y para commits pequeños. KUDO busca ayudar a estudiantes y jóvenes profesionales a registrar sus movimientos, planificar gastos y avanzar hacia metas de ahorro.

## Documentos

1. [Problema, justificación y alcance](01-problema-y-alcance.md)
2. [Requerimientos y criterios de aceptación](02-requerimientos.md)
3. [Modelo de datos](03-modelo-de-datos.md)
4. [Arquitectura propuesta](04-arquitectura.md)
5. [Vistas y prototipo](05-prototipo.md)
6. [Revisión del PDF proporcionado](06-revision-del-documento-fuente.md)

El PDF original y la captura de referencia del Login están en `docs/referencia/`. Se conservan como fuente; los archivos Markdown de arriba explican las decisiones corregidas para que el informe concuerde con la rúbrica del curso.

## Decisión de tecnología

La arquitectura para el proyecto será React + TypeScript + Vite, Node.js + Express + TypeScript, PostgreSQL + Prisma y JWT. La consigna del curso y su rúbrica especifican Express y PostgreSQL; por eso esta propuesta reemplaza Spring Boot y SQL Server, que aparecen en el documento de referencia.

## Secuencia sugerida de commits

```text
docs: define problema, usuarios y alcance de KUDO
docs: agrega requerimientos y criterios de aceptación
docs: documenta modelo de datos y arquitectura
design: agrega especificación de vistas y referencias del prototipo
```

Los estados de implementación se indican en los documentos. Una pantalla de muestra o un requisito descrito no se considera funcional hasta que use datos persistidos y pase sus pruebas.
