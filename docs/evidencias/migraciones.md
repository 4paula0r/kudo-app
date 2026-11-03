# Evidencia de esquema y migraciones Prisma

**Verificación:** 3 de noviembre de 2026 (zona horaria America/Guatemala).  
**Rama fuente:** `prepare-kudo-proyecto1`. El `schema.prisma`, `backend/src/index.ts` y `backend/package.json` locales se compararon mediante el hash Git de blob y coinciden con los archivos de esa rama.  
**Base objetivo de esta comprobación:** `kudo_test`, aislada de la base indicada por el `.env` local.

## Variables de entorno

Desde `backend`, `dotenv/config` cargó el `.env` local: `DATABASE_URL` estaba presente, `JWT_SECRET` cumplía la longitud mínima de 32 caracteres y `PORT` estaba configurado en `4000`. No se imprimieron ni guardaron los valores. Para las operaciones Prisma de esta evidencia, `DATABASE_URL` se sustituyó solo en el proceso por una URL hacia `kudo_test`; no se consultó ni modificó el esquema de la base configurada originalmente en `.env`.

## Comandos y resultados

| Comando ejecutado desde `backend` | Resultado real |
|---|---|
| `npx prisma validate` | **Aprobado**, código de salida 0. El esquema Prisma es válido. |
| `npx prisma migrate status` | **Aprobado**, código de salida 0. Encontró 6 migraciones; informó que la base `kudo_test` está actualizada. |
| `npx prisma migrate diff --from-migrations prisma/migrations --to-schema-datasource prisma/schema.prisma --shadow-database-url <URL de shadow nueva> --exit-code` | **Aprobado en el segundo intento**, código de salida 0; salida `No difference detected.` |

El primer intento de `migrate diff` usó una URL shadow con `?schema=public` y Prisma respondió `P1003` (nombre de base interpretado incorrectamente). No tocó la base objetivo. Se repitió con una base shadow recién creada y una URL sin parámetro de esquema. La base shadow usada fue `kudo_shadow_evidence_faaa9469fd`; Prisma encontró coincidencia entre la historia de migraciones y el esquema actual.

## Migraciones detectadas

Las seis migraciones están aplicadas en `kudo_test`, en este orden:

1. `20261021050314_init_schema`
2. `20261028000000_goal_contributions`
3. `20261102000000_user_personal_information`
4. `20261102010000_user_age_currency`
5. `20261102020000_user_expense_categories`
6. `20261102030000_budgets`

**Diferencias:** ninguna entre las migraciones y el esquema de Prisma según `migrate diff`.  
**Operaciones destructivas:** no se ejecutaron `migrate reset`, `db push --force-reset` ni comandos de borrado. La base de desarrollo no fue modificada.
