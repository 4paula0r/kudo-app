import { ArrowDownRight, ArrowUpRight, CarFront, Heart, House, MoreHorizontal, Plane, ShoppingBag, Utensils, Wallet } from 'lucide-react'
import { NavLink } from 'react-router-dom'

export type Movement = { id: string; title: string; category: string; type: 'INCOME' | 'EXPENSE'; amount: number; date: string }
export type SavingGoal = { id: string; name: string; target: number; saved: number; deadline: string }

const currency = (value: number, code: string) => new Intl.NumberFormat('es-GT', { style: 'currency', currency: code }).format(value)
const categoryIcons: Record<string, typeof Utensils> = { Comida: Utensils, Transporte: CarFront, Hogar: House, Salud: Heart, Compras: ShoppingBag, Viajes: Plane, Ahorros: Wallet }
const categoryColors = ['blue', 'mint', 'amber', 'rose']

export default function DashboardPage({ transactions, name, currencyCode }: { transactions: Movement[]; goals: SavingGoal[]; name: string; currencyCode: string }) {
  const income = transactions.filter(item => item.type === 'INCOME').reduce((sum, item) => sum + item.amount, 0)
  const expenses = transactions.filter(item => item.type === 'EXPENSE').reduce((sum, item) => sum + item.amount, 0)
  const balance = income - expenses
  const now = new Date()
  const currentMonth = transactions.filter(item => { const date = new Date(item.date); return date.getFullYear() === now.getFullYear() && date.getMonth() === now.getMonth() })
  const monthIncome = currentMonth.filter(item => item.type === 'INCOME').reduce((sum, item) => sum + item.amount, 0)
  const monthExpenses = currentMonth.filter(item => item.type === 'EXPENSE').reduce((sum, item) => sum + item.amount, 0)
  const monthExpenseItems = currentMonth.filter(item => item.type === 'EXPENSE')
  const spendingByCategory = monthExpenseItems.reduce<Record<string, number>>((result, item) => { result[item.category] = (result[item.category] || 0) + item.amount; return result }, {})
  const categories = Object.entries(spendingByCategory).sort((a, b) => b[1] - a[1]).slice(0, 4)
  const maxCategory = Math.max(1, ...categories.map(([, amount]) => amount))
  const recent = [...transactions].sort((a, b) => +new Date(b.date) - +new Date(a.date)).slice(0, 4)
  const firstName = name.trim().split(/\s+/)[0] || 'ahí'
  const monthName = new Intl.DateTimeFormat('es-GT', { month: 'long' }).format(now)

  return <div className="dashboard-v2">
    <header className="dashboard-v2-heading"><div><span className="eyebrow">TU RESUMEN</span><h1>Hola, {firstName} 👋</h1><p>Un vistazo claro a cómo va tu dinero.</p></div></header>

    <section className="dashboard-v2-balance" aria-label="Resumen de balance">
      <div className="dashboard-v2-balance-main"><span>Balance disponible</span><strong>{currency(balance, currencyCode)}</strong><small>Según tus movimientos registrados</small></div>
      <div className="dashboard-v2-month"><span className="dashboard-v2-period">Este mes · {monthName}</span><div><span><i className="income-dot"><ArrowDownRight size={14}/></i>Ingresos</span><b className="income-text">{currency(monthIncome, currencyCode)}</b></div><div><span><i className="expense-dot"><ArrowUpRight size={14}/></i>Gastos</span><b>{currency(monthExpenses, currencyCode)}</b></div></div>
    </section>

    <div className="dashboard-v2-panels">
      <section className="dashboard-v2-panel" aria-labelledby="dashboard-spending-title">
        <div className="dashboard-v2-panel-heading"><div><h2 id="dashboard-spending-title">Gastos por categoría</h2><p>Registrados en {monthName}</p></div><NavLink to="/finanzas">Ver finanzas</NavLink></div>
        {categories.length ? <div className="dashboard-v2-category-list">{categories.map(([category, amount], index) => { const Icon = categoryIcons[category] || MoreHorizontal; return <article className="dashboard-v2-category" key={category}><span className={`dashboard-v2-category-icon ${categoryColors[index]}`}><Icon size={15}/></span><div className="dashboard-v2-category-detail"><div><b>{category}</b><span>{currency(amount, currencyCode)}</span></div><div className="dashboard-v2-track"><i className={categoryColors[index]} style={{ width: `${Math.max(3, amount / maxCategory * 100)}%` }}/></div></div></article> })}</div> : <div className="dashboard-v2-empty"><p>Aún no hay gastos registrados este mes.</p><NavLink to="/transaccion">Registrar un gasto</NavLink></div>}
      </section>

      <section className="dashboard-v2-panel" aria-labelledby="dashboard-recent-title">
        <div className="dashboard-v2-panel-heading"><div><h2 id="dashboard-recent-title">Movimientos recientes</h2><p>Lo último que registraste</p></div><NavLink to="/movimientos">Ver todos</NavLink></div>
        {recent.length ? <div className="dashboard-v2-recent-list">{recent.map(item => <article key={item.id}><span className={`dashboard-v2-movement-icon ${item.type === 'INCOME' ? 'income' : ''}`}>{item.type === 'INCOME' ? <ArrowDownRight size={15}/> : <ArrowUpRight size={15}/>}</span><div><b>{item.title}</b><small>{item.category} · {new Date(item.date).toLocaleDateString('es-GT', { day: 'numeric', month: 'short' })}</small></div><strong className={item.type === 'INCOME' ? 'income-text' : ''}>{item.type === 'INCOME' ? '+' : '−'}{currency(item.amount, currencyCode)}</strong></article>)}</div> : <div className="dashboard-v2-empty"><p>Aún no tienes movimientos.</p><NavLink to="/transaccion">Registrar movimiento</NavLink></div>}
      </section>
    </div>
  </div>
}
