# Evidencia de respuestas de la API

**Fecha:** 3 de noviembre de 2026 (America/Guatemala).  
**Código verificado:** rama `prepare-kudo-proyecto1`.  
**Prueba:** ejecución real de `probar-api.ps1`, corrida `b91652a82aef`. El backend respondió en el puerto configurado `4000` con HTTP 200 y `{"ok":true}`. Para las solicitudes que crean datos se inició otra instancia temporal en `127.0.0.1:4002`, conectada exclusivamente a `kudo_test`; así no se escribieron registros en la base del `.env` local ni se alteraron cuentas existentes.

El script genera una cuenta aleatoria con correo `evidencia-<runId>@kudo.local`, una contraseña aleatoria en memoria y registros sintéticos. Los cuerpos que siguen son las respuestas JSON capturadas en esa ejecución. Se ocultaron tokens, correo e identificadores. No se almacenan credenciales en el reporte ni en el script.

## Resumen de estados

| Método | URL | Esperado | Obtenido | Resultado |
|---|---|---:|---:|---|
| GET | `http://127.0.0.1:4002/api/health` | 200 | 200 | Aprobado |
| POST | `http://127.0.0.1:4002/api/auth/register` | 201 | 201 | Aprobado |
| POST | `http://127.0.0.1:4002/api/auth/login` | 200 | 200 | Aprobado |
| GET | `http://127.0.0.1:4002/api/auth/me` | 200 | 200 | Aprobado |
| POST | `http://127.0.0.1:4002/api/transactions` | 201 | 201 | Aprobado |
| GET | `http://127.0.0.1:4002/api/transactions?limit=100` | 200 | 200 | Aprobado |
| POST | `http://127.0.0.1:4002/api/budgets` | 201 | 201 | Aprobado |
| GET | `http://127.0.0.1:4002/api/budgets?month=2026-11` | 200 | 200 | Aprobado |
| POST | `http://127.0.0.1:4002/api/goals` | 201 | 201 | Aprobado |
| GET | `http://127.0.0.1:4002/api/goals` | 200 | 200 | Aprobado |

La ruta de salud también se comprobó en el puerto configurado `4000`: `GET http://127.0.0.1:4000/api/health` devolvió HTTP 200 y `{"ok":true}`. Las llamadas mutantes de esta evidencia se hicieron en el puerto aislado `4002`.

## Cuerpos JSON obtenidos

### GET `/api/health` — HTTP 200

```json
{"ok":true}
```

### POST `/api/auth/register` — HTTP 201

```json
{
  "token": "[OCULTO]",
  "user": {
    "id": "[ID_OCULTO]",
    "name": "Cuenta Evidencia b91652a82aef",
    "email": "[OCULTO]",
    "age": 25,
    "currency": "GTQ",
    "expenseCategories": ["Comida", "Pruebas"]
  }
}
```

### POST `/api/auth/login` — HTTP 200

```json
{
  "token": "[OCULTO]",
  "user": {
    "id": "[ID_OCULTO]",
    "name": "Cuenta Evidencia b91652a82aef",
    "email": "[OCULTO]",
    "age": 25,
    "currency": "GTQ",
    "expenseCategories": ["Comida", "Pruebas"]
  }
}
```

### GET `/api/auth/me` — HTTP 200

```json
{
  "user": {
    "id": "[ID_OCULTO]",
    "name": "Cuenta Evidencia b91652a82aef",
    "firstName": null,
    "secondName": null,
    "firstSurname": null,
    "secondSurname": null,
    "dateOfBirth": null,
    "countryOfResidence": null,
    "age": 25,
    "currency": "GTQ",
    "expenseCategories": ["Comida", "Pruebas"],
    "email": "[OCULTO]"
  }
}
```

### POST `/api/transactions` — HTTP 201

```json
{
  "transaction": {
    "id": "[ID_OCULTO]",
    "title": "Gasto temporal b91652a82aef",
    "category": "Pruebas",
    "type": "EXPENSE",
    "amount": 1.25,
    "date": "2026-11-03T19:43:28.306Z",
    "paymentMethod": "Efectivo",
    "userId": "[ID_OCULTO]",
    "createdAt": "2026-11-03T19:43:28.319Z"
  }
}
```

### GET `/api/transactions?limit=100` — HTTP 200

```json
{
  "transactions": [
    {
      "id": "[ID_OCULTO]",
      "title": "Gasto temporal b91652a82aef",
      "category": "Pruebas",
      "type": "EXPENSE",
      "amount": 1.25,
      "date": "2026-11-03T19:43:28.306Z",
      "paymentMethod": "Efectivo",
      "userId": "[ID_OCULTO]",
      "createdAt": "2026-11-03T19:43:28.319Z"
    }
  ],
  "pagination": {"page": 1, "limit": 100, "total": 1, "pages": 1}
}
```

### POST `/api/budgets` — HTTP 201

```json
{
  "budget": {
    "id": "[ID_OCULTO]",
    "category": "Pruebas",
    "monthlyLimit": 100,
    "month": "2026-11-01T00:00:00Z",
    "userId": "[ID_OCULTO]",
    "createdAt": "2026-11-03T19:43:28.371Z"
  }
}
```

### GET `/api/budgets?month=2026-11` — HTTP 200

```json
{
  "month": "2026-11",
  "budgets": [
    {
      "id": "[ID_OCULTO]",
      "category": "Pruebas",
      "monthlyLimit": 100,
      "amountSpent": 1.25,
      "remaining": 98.75,
      "percent": 1,
      "month": "2026-11-01T00:00:00Z"
    }
  ]
}
```

### POST `/api/goals` — HTTP 201

```json
{
  "goal": {
    "id": "[ID_OCULTO]",
    "name": "Meta Evidencia b91652a82aef",
    "target": 250,
    "saved": 0,
    "deadline": "2027-02-01T19:43:28.396Z",
    "userId": "[ID_OCULTO]",
    "createdAt": "2026-11-03T19:43:28.408Z"
  }
}
```

### GET `/api/goals` — HTTP 200

```json
{
  "goals": [
    {
      "id": "[ID_OCULTO]",
      "name": "Meta Evidencia b91652a82aef",
      "target": 250,
      "saved": 0,
      "deadline": "2027-02-01T19:43:28.396Z",
      "userId": "[ID_OCULTO]",
      "createdAt": "2026-11-03T19:43:28.408Z"
    }
  ]
}
```

## Resultado

**10 de 10 endpoints aprobados** en la instancia temporal conectada a `kudo_test`. La respuesta de presupuesto también confirmó el cálculo real: Q 1.25 gastados de Q 100.00, 1% utilizado y Q 98.75 restantes. Los registros se crearon con el identificador de corrida `b91652a82aef` y no pertenecen a cuentas reales.
