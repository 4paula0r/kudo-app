import { after, before, test } from 'node:test'
import assert from 'node:assert/strict'

process.env.NODE_ENV = 'test'
process.env.JWT_SECRET ||= 'kudo-integration-test-secret-at-least-32-chars'

const { app, db } = await import('../src/index.js')
const server = app.listen(0)
const baseUrl = await new Promise<string>((resolve, reject) => {
  server.once('error', reject)
  server.once('listening', () => {
    const address = server.address()
    if (!address || typeof address === 'string') return reject(new Error('No se pudo iniciar el servidor de pruebas.'))
    resolve(`http://127.0.0.1:${address.port}/api`)
  })
})
const emailA = `test-${Date.now()}@kudo.local`
const emailB = `other-${Date.now()}@kudo.local`
let tokenA = ''
let tokenB = ''
let userA = ''
let userB = ''

async function call(path: string, options: RequestInit = {}, bearer?: string) {
  const response = await fetch(`${baseUrl}${path}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...(bearer ? { Authorization: `Bearer ${bearer}` } : {}), ...options.headers },
  })
  const body = response.status === 204 ? null : await response.json()
  return { response, body }
}

before(async () => {
  const createUser = async (email: string, name: string) => {
    const { response, body } = await call('/auth/register', { method: 'POST', body: JSON.stringify({ email, name, age: 20, currency: 'GTQ', expenseCategories: ['Comida'], password: 'test-password-123' }) })
    assert.equal(response.status, 201)
    return body as { token: string; user: { id: string } }
  }
  const a = await createUser(emailA, 'Usuario Prueba')
  const b = await createUser(emailB, 'Otra Persona')
  tokenA = a.token; userA = a.user.id
  tokenB = b.token; userB = b.user.id
})

after(async () => {
  await db.user.deleteMany({ where: { email: { in: [emailA, emailB] } } })
  await new Promise<void>((resolve, reject) => server.close(error => error ? reject(error) : resolve()))
  await db.$disconnect()
})

test('API: autenticación, movimientos y presupuestos con aislamiento por usuario', async t => {
  await t.test('rechaza consultas privadas sin sesión', async () => {
    const { response } = await call('/transactions')
    assert.equal(response.status, 401)
  })

  await t.test('inicia sesión con la contraseña correcta y rechaza una incorrecta', async () => {
    const valid = await call('/auth/login', { method: 'POST', body: JSON.stringify({ email: emailA, password: 'test-password-123' }) })
    assert.equal(valid.response.status, 200)
    assert.equal(typeof valid.body.token, 'string')
    const invalid = await call('/auth/login', { method: 'POST', body: JSON.stringify({ email: emailA, password: 'wrong-password' }) })
    assert.equal(invalid.response.status, 401)
  })

  const date = new Date()
  const month = `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, '0')}`
  const movementDate = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), 12)).toISOString()
  let transactionId = ''

  await t.test('crea, consulta y actualiza movimientos, y no permite editar el de otra persona', async () => {
    const { response, body } = await call('/transactions', { method: 'POST', body: JSON.stringify({ title: 'Café de prueba', category: 'Comida', type: 'EXPENSE', amount: 25, date: movementDate, paymentMethod: 'Efectivo' }) }, tokenA)
    assert.equal(response.status, 201)
    transactionId = body.transaction.id
    assert.equal(body.transaction.amount, 25)

    const denied = await call(`/transactions/${transactionId}`, { method: 'PATCH', body: JSON.stringify({ amount: 50 }) }, tokenB)
    assert.equal(denied.response.status, 404)

    const updated = await call(`/transactions/${transactionId}`, { method: 'PATCH', body: JSON.stringify({ title: 'Almuerzo', amount: 30, type: 'INCOME' }) }, tokenA)
    assert.equal(updated.response.status, 200)
    assert.equal(updated.body.transaction.title, 'Almuerzo')
    assert.equal(updated.body.transaction.amount, 30)

    const listed = await call('/transactions?limit=100', {}, tokenA)
    assert.equal(listed.response.status, 200)
    assert(listed.body.transactions.some((item: { id: string }) => item.id === transactionId))
    assert.equal(listed.body.transactions.some((item: { userId: string }) => item.userId === userB), false)
  })

  await t.test('guarda el límite del mes, suma gastos y mantiene aislamiento', async () => {
    const spend = await call('/transactions', { method: 'POST', body: JSON.stringify({ title: 'Compra de prueba', category: 'Comida', type: 'EXPENSE', amount: 30, date: movementDate }) }, tokenA)
    assert.equal(spend.response.status, 201)

    const saved = await call('/budgets', { method: 'POST', body: JSON.stringify({ category: 'Comida', monthlyLimit: 200, month }) }, tokenA)
    assert.equal(saved.response.status, 201)
    const budgets = await call(`/budgets?month=${month}`, {}, tokenA)
    const food = budgets.body.budgets.find((item: { category: string }) => item.category === 'Comida')
    assert.equal(food.monthlyLimit, 200)
    assert.equal(food.amountSpent, 30)
    assert.equal(food.percent, 15)

    const otherUser = await call(`/budgets?month=${month}`, {}, tokenB)
    assert.equal(otherUser.body.budgets.length, 0)
    const edited = await call(`/budgets/${saved.body.budget.id}`, { method: 'PATCH', body: JSON.stringify({ monthlyLimit: 250 }) }, tokenA)
    assert.equal(edited.body.budget.monthlyLimit, 250)
    const denied = await call(`/budgets/${saved.body.budget.id}`, { method: 'DELETE' }, tokenB)
    assert.equal(denied.response.status, 404)
  })

  await t.test('valida entradas incorrectas', async () => {
    const invalid = await call('/budgets', { method: 'POST', body: JSON.stringify({ category: 'Comida', monthlyLimit: -5, month }) }, tokenA)
    assert.equal(invalid.response.status, 400)
  })

  await t.test('crea metas, registra aportes y protege los recursos ajenos', async () => {
    const created = await call('/goals', { method: 'POST', body: JSON.stringify({ name: 'Meta de prueba', target: 500, deadline: new Date(Date.now() + 90 * 86400000).toISOString() }) }, tokenA)
    assert.equal(created.response.status, 201)
    const goalId = created.body.goal.id
    const denied = await call(`/goals/${goalId}/contributions`, { method: 'POST', body: JSON.stringify({ amount: 25 }) }, tokenB)
    assert.equal(denied.response.status, 404)
    const contribution = await call(`/goals/${goalId}/contributions`, { method: 'POST', body: JSON.stringify({ amount: 75, note: 'Aporte de prueba' }) }, tokenA)
    assert.equal(contribution.response.status, 201)
    assert.equal(contribution.body.goal.saved, 75)
    const history = await call(`/goals/${goalId}/contributions`, {}, tokenA)
    assert.equal(history.body.contributions.length, 1)
    assert.equal(history.body.contributions[0].amount, 75)
  })
})
