import 'dotenv/config'
import express, { NextFunction, Request, Response } from 'express'
import cors from 'cors'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { Prisma, PrismaClient, TxType } from '@prisma/client'
import { z } from 'zod'

const app = express()
const db = new PrismaClient()
const port = Number(process.env.PORT || 4000)
const secret = process.env.JWT_SECRET

if (!secret || secret.length < 32) {
  throw new Error('JWT_SECRET debe configurarse con al menos 32 caracteres en backend/.env')
}

app.disable('x-powered-by')
app.use(helmet())
app.use(cors({ origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173' }))
app.use(express.json({ limit: '1mb' }))
app.use('/api', rateLimit({ windowMs: 15 * 60 * 1000, limit: 300, standardHeaders: true, legacyHeaders: false }))
app.use('/api/auth', rateLimit({ windowMs: 15 * 60 * 1000, limit: 30, standardHeaders: true, legacyHeaders: false }))

type AuthedRequest = Request & { userId?: string }
type AsyncHandler = (req: AuthedRequest, res: Response) => Promise<unknown>

const route = (handler: AsyncHandler) => (req: Request, res: Response, next: NextFunction) => {
  Promise.resolve(handler(req as AuthedRequest, res)).catch(next)
}

function auth(req: AuthedRequest, res: Response, next: NextFunction) {
  const raw = req.headers.authorization?.replace(/^Bearer\s+/i, '')
  if (!raw) return res.status(401).json({ message: 'Inicia sesión para continuar.' })
  try {
    const payload = jwt.verify(raw, secret!)
    if (typeof payload === 'string' || typeof payload.sub !== 'string') throw new Error('Invalid token subject')
    req.userId = payload.sub
    return next()
  } catch {
    return res.status(401).json({ message: 'Tu sesión venció. Inicia sesión de nuevo.' })
  }
}

const credentials = z.object({
  email: z.string().trim().email().max(200),
  password: z.string().min(8, 'La contraseña debe contener mínimo 8 caracteres.').max(100),
})
const transactionSchema = z.object({
  title: z.string().trim().min(1).max(100),
  category: z.string().trim().min(1).max(40),
  type: z.nativeEnum(TxType),
  amount: z.number().positive().max(999999999),
  date: z.string().datetime(),
  paymentMethod: z.string().trim().max(30).optional().nullable(),
})
const goalSchema = z.object({
  name: z.string().trim().min(2).max(80),
  target: z.number().positive().max(999999999),
  deadline: z.string().datetime(),
})
const contributionSchema = z.object({
  amount: z.number().positive().max(999999999),
  note: z.string().trim().max(120).optional(),
  date: z.string().datetime().optional(),
})

const transactionJson = <T extends { amount: Prisma.Decimal | number }>(item: T) => ({ ...item, amount: Number(item.amount) })
const goalJson = <T extends { target: Prisma.Decimal | number; saved: Prisma.Decimal | number }>(item: T) => ({
  ...item,
  target: Number(item.target),
  saved: Number(item.saved),
})

app.get('/api/health', (_req, res) => res.json({ ok: true }))

app.post('/api/auth/register', route(async (_req, res) => {
  const d = credentials.extend({ name: z.string().trim().min(2).max(80), age: z.number().int().min(13).max(120), currency: z.enum(['GTQ', 'USD', 'EUR']), expenseCategories: z.array(z.string().trim().min(2).max(40)).min(1).max(20) }).parse(_req.body)
  const email = d.email.toLowerCase()
  const user = await db.user.create({ data: { email, name: d.name, age: d.age, currency: d.currency, expenseCategories: d.expenseCategories, passwordHash: await bcrypt.hash(d.password, 12) } })
  return res.status(201).json({ token: jwt.sign({}, secret!, { subject: user.id, expiresIn: '7d' }), user: { id: user.id, name: user.name, email: user.email, age: user.age, currency: user.currency, expenseCategories: user.expenseCategories } })
}))

app.post('/api/auth/login', route(async (req, res) => {
  const d = credentials.parse(req.body)
  const user = await db.user.findUnique({ where: { email: d.email.toLowerCase() } })
  if (!user || !await bcrypt.compare(d.password, user.passwordHash)) return res.status(401).json({ message: 'Correo o contraseña incorrectos.' })
  return res.json({ token: jwt.sign({}, secret!, { subject: user.id, expiresIn: '7d' }), user: { id: user.id, name: user.name, email: user.email, age: user.age, currency: user.currency, expenseCategories: user.expenseCategories } })
}))

app.get('/api/auth/me', auth, route(async (req, res) => {
  const user = await db.user.findUnique({ where: { id: req.userId }, select: { id: true, name: true, firstName: true, secondName: true, firstSurname: true, secondSurname: true, dateOfBirth: true, countryOfResidence: true, age: true, currency: true, expenseCategories: true, email: true } })
  if (!user) return res.status(404).json({ message: 'No se encontró la cuenta.' })
  return res.json({ user })
}))

app.patch('/api/auth/me', auth, route(async (req, res) => {
  const optionalNamePart = z.string().trim().max(60).optional().nullable().transform(value => value || null)
  const d = z.object({
    firstName: z.string().trim().min(1, 'El primer nombre es obligatorio.').max(60),
    secondName: optionalNamePart,
    firstSurname: z.string().trim().min(1, 'El primer apellido es obligatorio.').max(60),
    secondSurname: optionalNamePart,
    dateOfBirth: z.string().date().optional().nullable(),
    countryOfResidence: z.string().trim().max(100).optional().nullable().transform(value => value || null),
    email: z.string().trim().email().max(200),
  }).parse(req.body)
  const email = d.email.toLowerCase()
  const name = [d.firstName, d.secondName, d.firstSurname, d.secondSurname].filter(Boolean).join(' ')
  const user = await db.user.update({ where: { id: req.userId }, data: {
    name, firstName: d.firstName, secondName: d.secondName, firstSurname: d.firstSurname, secondSurname: d.secondSurname,
    dateOfBirth: d.dateOfBirth ? new Date(`${d.dateOfBirth}T00:00:00.000Z`) : null,
    countryOfResidence: d.countryOfResidence, email,
  }, select: { id: true, name: true, firstName: true, secondName: true, firstSurname: true, secondSurname: true, dateOfBirth: true, countryOfResidence: true, age: true, currency: true, expenseCategories: true, email: true } })
  return res.json({ user })
}))

app.get('/api/transactions', auth, route(async (req, res) => {
  const query = z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(100),
    type: z.nativeEnum(TxType).optional(),
    category: z.string().trim().min(1).max(40).optional(),
    from: z.string().datetime().optional(),
    to: z.string().datetime().optional(),
  }).parse(req.query)
  if (query.from && query.to && query.from > query.to) return res.status(400).json({ message: 'El inicio del período debe ser anterior al final.' })
  const where: Prisma.TransactionWhereInput = {
    userId: req.userId,
    ...(query.type ? { type: query.type } : {}),
    ...(query.category ? { category: query.category } : {}),
    ...(query.from || query.to ? { date: { ...(query.from ? { gte: new Date(query.from) } : {}), ...(query.to ? { lte: new Date(query.to) } : {}) } } : {}),
  }
  const [items, total] = await db.$transaction([
    db.transaction.findMany({ where, orderBy: [{ date: 'desc' }, { createdAt: 'desc' }], skip: (query.page - 1) * query.limit, take: query.limit }),
    db.transaction.count({ where }),
  ])
  return res.json({ transactions: items.map(transactionJson), pagination: { page: query.page, limit: query.limit, total, pages: Math.ceil(total / query.limit) } })
}))

app.post('/api/transactions', auth, route(async (req, res) => {
  const d = transactionSchema.parse(req.body)
  const transaction = await db.transaction.create({ data: { ...d, amount: d.amount, date: new Date(d.date), userId: req.userId! } })
  return res.status(201).json({ transaction: transactionJson(transaction) })
}))

app.patch('/api/transactions/:id', auth, route(async (req, res) => {
  const id = z.string().min(1).parse(req.params.id)
  const d = transactionSchema.partial().refine(value => Object.keys(value).length > 0, 'Indica al menos un campo para actualizar.').parse(req.body)
  const result = await db.transaction.updateMany({
    where: { id, userId: req.userId },
    data: { ...d, ...(d.date ? { date: new Date(d.date) } : {}) },
  })
  if (!result.count) return res.status(404).json({ message: 'No se encontró el movimiento.' })
  const transaction = await db.transaction.findFirst({ where: { id, userId: req.userId } })
  return res.json({ transaction: transactionJson(transaction!) })
}))

app.delete('/api/transactions/:id', auth, route(async (req, res) => {
  const id = z.string().min(1).parse(req.params.id)
  const result = await db.transaction.deleteMany({ where: { id, userId: req.userId } })
  if (!result.count) return res.status(404).json({ message: 'No se encontró el movimiento.' })
  return res.status(204).end()
}))

app.get('/api/goals', auth, route(async (req, res) => {
  const goals = await db.goal.findMany({ where: { userId: req.userId }, orderBy: { createdAt: 'desc' } })
  return res.json({ goals: goals.map(goalJson) })
}))

app.post('/api/goals', auth, route(async (req, res) => {
  const d = goalSchema.parse(req.body)
  const goal = await db.goal.create({ data: { ...d, deadline: new Date(d.deadline), userId: req.userId! } })
  return res.status(201).json({ goal: goalJson(goal) })
}))

app.get('/api/goals/:id/contributions', auth, route(async (req, res) => {
  const id = z.string().min(1).parse(req.params.id)
  const goal = await db.goal.findFirst({ where: { id, userId: req.userId }, select: { id: true } })
  if (!goal) return res.status(404).json({ message: 'No se encontró la meta.' })
  const contributions = await db.goalContribution.findMany({ where: { goalId: goal.id, userId: req.userId }, orderBy: { date: 'desc' }, take: 100 })
  return res.json({ contributions: contributions.map(item => ({ ...item, amount: Number(item.amount) })) })
}))

app.post('/api/goals/:id/contributions', auth, route(async (req, res) => {
  const id = z.string().min(1).parse(req.params.id)
  const d = contributionSchema.parse(req.body)
  const goal = await db.goal.findFirst({ where: { id, userId: req.userId } })
  if (!goal) return res.status(404).json({ message: 'No se encontró la meta.' })
  const result = await db.$transaction(async tx => {
    const contribution = await tx.goalContribution.create({ data: { amount: d.amount, note: d.note, date: d.date ? new Date(d.date) : new Date(), goalId: goal.id, userId: req.userId! } })
    const updatedGoal = await tx.goal.update({ where: { id: goal.id }, data: { saved: { increment: d.amount } } })
    return { contribution, goal: updatedGoal }
  })
  return res.status(201).json({ contribution: { ...result.contribution, amount: Number(result.contribution.amount) }, goal: goalJson(result.goal) })
}))

app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  if (err instanceof z.ZodError) return res.status(400).json({ message: err.issues[0]?.message || 'Revisa los datos ingresados.', code: 'VALIDATION_ERROR' })
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === 'P2002') return res.status(409).json({ message: 'Ya existe un registro con esos datos.', code: 'CONFLICT' })
    if (err.code === 'P2025') return res.status(404).json({ message: 'No se encontró el registro solicitado.', code: 'NOT_FOUND' })
  }
  console.error(err)
  return res.status(500).json({ message: 'Ocurrió un error interno. Intenta de nuevo.', code: 'INTERNAL_ERROR' })
})

const server = app.listen(port, () => console.log(`KUDO API disponible en http://localhost:${port}`))
async function shutdown() {
  server.close(async () => {
    await db.$disconnect()
    process.exit(0)
  })
}
process.on('SIGINT', shutdown)
process.on('SIGTERM', shutdown)
