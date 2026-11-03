import { FormEvent, useEffect, useMemo, useState } from 'react'
import { ArrowDownRight, ArrowUpRight, Pencil, Plus, Trash2 } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { request } from './api'
import type { Movement } from './DashboardPage'

type Budget = { id: string; category: string; monthlyLimit: number; amountSpent: number; remaining: number; percent: number }
const categories = ['Comida', 'Transporte', 'Hogar', 'Ocio', 'Compras', 'Salud', 'Viajes', 'Ahorros', 'Suscripciones', 'Gastos personales', 'Otros']
const focusCategories = ['Comida', 'Salud', 'Ahorros', 'Compras']
const money = (value: number, code: string) => new Intl.NumberFormat('es-GT', { style: 'currency', currency: code }).format(value)
const monthKey = (date: Date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`

export default function FinancePage({ transactions, currencyCode }: { transactions: Movement[]; currencyCode: string }) {
  const [month, setMonth] = useState(monthKey(new Date()))
  const [budgets, setBudgets] = useState<Budget[]>([])
  const [category, setCategory] = useState(categories[0])
  const [limit, setLimit] = useState('')
  const [editing, setEditing] = useState<Budget | null>(null)
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [year, monthNumber] = month.split('-').map(Number)
  const expenses = transactions.filter(item => { const date = new Date(item.date); return item.type === 'EXPENSE' && date.getFullYear() === year && date.getMonth() + 1 === monthNumber })
  const income = transactions.filter(item => { const date = new Date(item.date); return item.type === 'INCOME' && date.getFullYear() === year && date.getMonth() + 1 === monthNumber }).reduce((sum, item) => sum + item.amount, 0)
  const totalExpenses = expenses.reduce((sum, item) => sum + item.amount, 0)
  const byCategory = useMemo(() => expenses.reduce<Record<string, number>>((result, item) => { result[item.category] = (result[item.category] || 0) + item.amount; return result }, {}), [expenses])
  const ranked = Object.entries(byCategory).sort((a, b) => b[1] - a[1])
  const allCategories = [...new Set([...categories, ...Object.keys(byCategory)])]

  const loadBudgets = async () => {
    setLoading(true); setError('')
    try { const data = await request<{ budgets: Budget[] }>(`/budgets?month=${month}`); setBudgets(data.budgets) }
    catch (err) { setError(err instanceof Error ? err.message : 'No se pudieron cargar tus límites.') }
    finally { setLoading(false) }
  }
  useEffect(() => { void loadBudgets() }, [month])

  const saveBudget = async (event: FormEvent) => {
    event.preventDefault(); setBusy(true); setError(''); setNotice('')
    try {
      await request(editing ? `/budgets/${editing.id}` : '/budgets', { method: editing ? 'PATCH' : 'POST', body: JSON.stringify(editing ? { monthlyLimit: Number(limit) } : { category, monthlyLimit: Number(limit), month }) })
      setLimit(''); setEditing(null); setNotice('Límite mensual guardado.'); await loadBudgets()
    } catch (err) { setError(err instanceof Error ? err.message : 'No se pudo guardar el límite.') }
    finally { setBusy(false) }
  }
  const beginEdit = (budget: Budget) => { setEditing(budget); setCategory(budget.category); setLimit(String(budget.monthlyLimit)); setError(''); setNotice('') }
  const chooseFocusCategory = (name: string) => { const existing = budgets.find(budget => budget.category.toLocaleLowerCase() === name.toLocaleLowerCase()); if (existing) beginEdit(existing); else { setEditing(null); setCategory(name); setLimit(''); setError(''); setNotice('') } }
  const removeBudget = async (budget: Budget) => {
    if (!window.confirm(`¿Eliminar el límite de ${budget.category}?`)) return
    try { await request(`/budgets/${budget.id}`, { method: 'DELETE' }); setNotice('Límite eliminado.'); await loadBudgets() }
    catch (err) { setError(err instanceof Error ? err.message : 'No se pudo eliminar el límite.') }
  }
  const fmtMonth = new Intl.DateTimeFormat('es-GT', { month: 'long', year: 'numeric' }).format(new Date(year, monthNumber - 1, 1))

  return <div className="finance-page">
    <header className="finance-page-heading"><div><span className="eyebrow">TUS FINANZAS</span><h1>Tu dinero, claro y en orden</h1><p>Consulta tus gastos, ingresos y límites desde un solo lugar.</p><NavLink to="/movimientos" className="text-link finance-history-link">Ver y editar movimientos</NavLink></div><label className="finance-month">Período<input aria-label="Mes de consulta" type="month" value={month} onChange={event => setMonth(event.target.value)}/></label></header>
    <section className="finance-kpis"><article><span>Balance del mes</span><b>{money(income - totalExpenses, currencyCode)}</b><small>Ingresos menos gastos</small></article><article><span><ArrowDownRight size={15}/> Ingresos</span><b className="green">{money(income, currencyCode)}</b><small>{fmtMonth}</small></article><article><span><ArrowUpRight size={15}/> Gastos</span><b>{money(totalExpenses, currencyCode)}</b><small>{expenses.length} movimientos</small></article></section>
    <div className="finance-panels">
      <section className="panel finance-breakdown"><div className="panel-heading"><div><h2>Distribución de gastos</h2><p>Por categoría · {fmtMonth}</p></div></div>
        {ranked.length ? <div className="finance-category-list">{ranked.map(([name, amount], index) => <div className="finance-category-row" key={name}><div><span className={`finance-category-dot color-${index % 6}`}/><b>{name}</b><strong>{money(amount, currencyCode)}</strong></div><div className="finance-category-track"><i className={`color-${index % 6}`} style={{ width: `${Math.max(3, amount / totalExpenses * 100)}%` }}/></div><small>{Math.round(amount / totalExpenses * 100)}% del total</small></div>)}</div> : <div className="finance-empty"><p>No hay gastos registrados para {fmtMonth}.</p><a href="/transaccion">Registrar movimiento</a></div>}
      </section>
      <section className="panel finance-budget-panel"><div className="panel-heading"><div><h2>Límites por categoría</h2><p>Define cuánto quieres gastar este mes.</p></div></div>
        <div className="budget-shortcuts" aria-label="Categorías frecuentes"><span>Configura rápido:</span>{focusCategories.map(name=>{const existing=budgets.find(budget=>budget.category.toLocaleLowerCase()===name.toLocaleLowerCase());return <button type="button" key={name} className={category===name?'selected':''} onClick={()=>chooseFocusCategory(name)}>{name}{existing&&<small>{money(existing.monthlyLimit,currencyCode)}</small>}</button>})}</div>
        <form className="budget-form" onSubmit={saveBudget}><label>Categoría<select value={category} disabled={!!editing} onChange={event => setCategory(event.target.value)}>{allCategories.map(item => <option key={item}>{item}</option>)}</select></label><label>Límite mensual<input type="number" min="0.01" step="0.01" value={limit} onChange={event => setLimit(event.target.value)} placeholder="0.00" required/></label><button className="primary-btn" disabled={busy}><Plus size={16}/>{busy ? 'Guardando…' : editing ? 'Actualizar límite' : 'Guardar límite'}</button>{editing && <button type="button" className="budget-cancel" onClick={() => { setEditing(null); setLimit('') }}>Cancelar</button>}</form>
        {error && <p className="account-error" role="alert">{error}</p>}{notice && <p className="account-notice" role="status">{notice}</p>}
        {loading ? <p className="finance-loading" role="status">Cargando límites…</p> : budgets.length ? <div className="budget-list">{budgets.map(budget => { const percent = Math.round(budget.amountSpent / budget.monthlyLimit * 100); return <article key={budget.id} className="budget-row"><div className="budget-row-head"><div><b>{budget.category}</b><small>{money(budget.amountSpent, currencyCode)} gastados de {money(budget.monthlyLimit, currencyCode)}</small></div><div className="budget-actions"><button type="button" onClick={() => beginEdit(budget)} aria-label={`Editar límite de ${budget.category}`}><Pencil size={15}/></button><button type="button" onClick={() => void removeBudget(budget)} aria-label={`Eliminar límite de ${budget.category}`}><Trash2 size={15}/></button></div></div><div className="budget-track"><i className={percent >= 100 ? 'over' : percent >= 80 ? 'near' : ''} style={{ width: `${Math.min(100, percent)}%` }}/></div><small className={percent >= 100 ? 'budget-over' : ''}>{percent >= 100 ? `Excediste el límite por ${money(budget.amountSpent - budget.monthlyLimit, currencyCode)}` : `Te quedan ${money(budget.remaining, currencyCode)}`}</small></article> })}</div> : <div className="finance-empty"><p>Aún no hay límites para este mes.</p><small>Configura uno para comparar tus gastos con lo que planeas gastar.</small></div>}
      </section>
    </div>
  </div>
}
