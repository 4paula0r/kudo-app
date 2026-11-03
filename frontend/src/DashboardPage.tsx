import { useMemo, useState } from 'react'
import { ArrowDownRight, ArrowUpRight, CalendarDays, Flame, Target, Wallet } from 'lucide-react'
import { NavLink } from 'react-router-dom'

export type Movement = { id: string; title: string; category: string; type: 'INCOME' | 'EXPENSE'; amount: number; date: string }
export type SavingGoal = { id: string; name: string; target: number; saved: number; deadline: string }

const currency = (value: number, code: string) => new Intl.NumberFormat('es-GT', { style: 'currency', currency: code }).format(value)
const dateKey = (value: Date) => `${value.getFullYear()}-${value.getMonth()}-${value.getDate()}`

export default function DashboardPage({ transactions, goals, name, currencyCode }: { transactions: Movement[]; goals: SavingGoal[]; name: string; currencyCode: string }) {
  const [period, setPeriod] = useState<'month' | 'week' | 'year'>('month')
  const today = new Date()
  const range = useMemo(() => {
    const start = new Date(today.getFullYear(), today.getMonth(), 1)
    const end = new Date(today.getFullYear(), today.getMonth() + 1, 1)
    if (period === 'week') {
      start.setDate(today.getDate() - ((today.getDay() + 6) % 7))
      end.setTime(start.getTime()); end.setDate(end.getDate() + 7)
    } else if (period === 'year') {
      start.setMonth(0, 1); end.setFullYear(today.getFullYear() + 1, 0, 1)
    }
    return { start, end }
  }, [period, today.getFullYear(), today.getMonth(), today.getDate()])
  const entries = transactions.filter(item => { const date = new Date(item.date); return date >= range.start && date < range.end })
  const income = entries.filter(item => item.type === 'INCOME').reduce((sum, item) => sum + item.amount, 0)
  const expenses = entries.filter(item => item.type === 'EXPENSE').reduce((sum, item) => sum + item.amount, 0)
  const openingBalance = 4850
  const byCategory = entries.filter(item => item.type === 'EXPENSE').reduce<Record<string, number>>((result, item) => { result[item.category] = (result[item.category] || 0) + item.amount; return result }, {})
  const categories = Object.entries(byCategory).sort((a, b) => b[1] - a[1])
  const colors = ['#7555d9', '#51b99a', '#f3a35c', '#e87581', '#4e9ec9', '#a799ba']
  const gradient = categories.length ? (() => { let angle = 0; return categories.slice(0, 6).map(([, amount], index) => { const from = angle; angle += (amount / expenses) * 100; return `${colors[index]} ${from}% ${angle}%` }).join(', ') })() : '#eeeaf5 0 100%'
  const recent = [...transactions].sort((a, b) => +new Date(b.date) - +new Date(a.date)).slice(0, 5)
  const daySet = new Set(transactions.map(item => dateKey(new Date(item.date))))
  const cursor = new Date(today.getFullYear(), today.getMonth(), today.getDate())
  if (!daySet.has(dateKey(cursor))) cursor.setDate(cursor.getDate() - 1)
  let streak = 0
  while (daySet.has(dateKey(cursor))) { streak++; cursor.setDate(cursor.getDate() - 1) }
  const firstName = name.trim().split(/\s+/)[0] || 'ahí'

  return <div className="live-dashboard">
    <header className="live-dashboard-heading"><div><span className="eyebrow">TU RESUMEN</span><h1>Hola, {firstName} 👋</h1><p>Así se mueve tu dinero. Los datos se actualizan con tus registros.</p></div><label className="dashboard-period"><CalendarDays size={16}/><select value={period} onChange={event => setPeriod(event.target.value as typeof period)} aria-label="Período del resumen"><option value="month">Este mes</option><option value="week">Esta semana</option><option value="year">Este año</option></select></label></header>
    <section className="live-summary-grid">
      <article className="live-balance-card"><span>Balance inicial</span><b>{currency(openingBalance, currencyCode)}</b><small>Saldo de inicio de tu cuenta</small><div className="live-balance-pair"><span><ArrowDownRight size={16}/> Ingresos <b>{currency(income, currencyCode)}</b></span><span><ArrowUpRight size={16}/> Gastos <b>{currency(expenses, currencyCode)}</b></span></div></article>
      <article className="live-stat-card"><span><Wallet size={17}/> Movimientos</span><b>{entries.length}</b><small>en el período seleccionado</small></article>
      <article className="live-stat-card"><span><Target size={17}/> Metas de ahorro</span><b>{goals.length}</b><small>{currency(goals.reduce((sum, goal) => sum + goal.saved, 0), currencyCode)} ahorrados</small></article>
    </section>
    <div className="live-dashboard-grid">
      <section className="panel live-spending-card"><div className="panel-heading"><div><h2>¿A dónde van tus gastos?</h2><p>Distribución real por categoría</p></div><NavLink to="/finanzas" className="text-link">Ver finanzas</NavLink></div>
        {expenses > 0 ? <div className="live-spending-content"><div className="live-donut" style={{ background: `conic-gradient(${gradient})` }} role="img" aria-label={`Distribución de gastos, total ${currency(expenses, currencyCode)}`}><div><small>Total gastado</small><b>{currency(expenses, currencyCode)}</b></div></div><div className="live-legend">{categories.slice(0, 6).map(([category, amount], index) => <div key={category}><i style={{ backgroundColor: colors[index] }}/><span>{category}</span><b>{Math.round(amount / expenses * 100)}%</b><small>{currency(amount, currencyCode)}</small></div>)}</div></div> : <div className="live-empty"><p>Aún no hay gastos en este período.</p><NavLink className="primary-btn" to="/transaccion">Registrar movimiento</NavLink></div>}
      </section>
      <section className="panel live-recent-card"><div className="panel-heading"><div><h2>Movimientos recientes</h2><p>Últimos registros de tu cuenta</p></div><NavLink to="/movimientos" className="text-link">Ver todos</NavLink></div>
        {recent.length ? <div className="live-recent-list">{recent.map(item => <article key={item.id}><span className={`live-type-icon ${item.type === 'INCOME' ? 'income' : ''}`}>{item.type === 'INCOME' ? <ArrowDownRight size={16}/> : <ArrowUpRight size={16}/>}</span><div><b>{item.title}</b><small>{item.category} · {new Date(item.date).toLocaleDateString('es-GT', { day: 'numeric', month: 'short' })}</small></div><strong className={item.type === 'INCOME' ? 'green' : ''}>{item.type === 'INCOME' ? '+' : '−'}{currency(item.amount, currencyCode)}</strong></article>)}</div> : <div className="live-empty"><p>Cuando registres un movimiento aparecerá aquí.</p></div>}
      </section>
    </div>
    <section className="live-streak"><span className="live-streak-icon"><Flame size={25}/></span><div><span className="eyebrow">DISTINTIVO KUDO</span><h2>Tu racha de registro</h2><p>{streak ? `Llevas ${streak} ${streak === 1 ? 'día' : 'días'} seguidos registrando tus movimientos.` : 'Registra un movimiento hoy para iniciar tu racha.'}</p></div><strong><b>{streak}</b><small>{streak === 1 ? 'DÍA' : 'DÍAS'}</small></strong></section>
  </div>
}
