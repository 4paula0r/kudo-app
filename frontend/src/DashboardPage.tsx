import { ArrowDownRight, ArrowUpRight, Wallet } from 'lucide-react'
import { NavLink } from 'react-router-dom'

export type Movement = { id: string; title: string; category: string; type: 'INCOME' | 'EXPENSE'; amount: number; date: string }
export type SavingGoal = { id: string; name: string; target: number; saved: number; deadline: string }

const currency = (value: number, code: string) => new Intl.NumberFormat('es-GT', { style: 'currency', currency: code }).format(value)

export default function DashboardPage({ transactions, name, currencyCode }: { transactions: Movement[]; goals: SavingGoal[]; name: string; currencyCode: string }) {
  const income = transactions.filter(item => item.type === 'INCOME').reduce((sum, item) => sum + item.amount, 0)
  const expenses = transactions.filter(item => item.type === 'EXPENSE').reduce((sum, item) => sum + item.amount, 0)
  const balance = income - expenses
  const recent = [...transactions].sort((a, b) => +new Date(b.date) - +new Date(a.date)).slice(0, 5)
  const firstName = name.trim().split(/\s+/)[0] || 'ahí'

  return <div className="live-dashboard live-dashboard-simple">
    <header className="live-dashboard-heading"><div><h1>Hola, {firstName} 👋</h1></div></header>
    <section className="live-balance-card live-balance-simple" aria-label="Balance actual">
      <div className="balance-top"><span>DINERO DISPONIBLE</span><span className="balance-icon"><Wallet size={19}/></span></div>
      <b>{currency(balance, currencyCode)}</b>
      <div className="balance-foot"><span><i/>Balance según tus movimientos</span></div>
      <div className="balance-pattern"/>
    </section>
    <section className="panel live-recent-card live-recent-simple">
      <div className="panel-heading"><div><h2>Movimientos recientes</h2></div><NavLink to="/movimientos" className="text-link">Ver todos</NavLink></div>
      {recent.length ? <div className="live-recent-list">{recent.map(item => <article key={item.id}>
        <span className={`live-type-icon ${item.type === 'INCOME' ? 'income' : ''}`}>{item.type === 'INCOME' ? <ArrowDownRight size={16}/> : <ArrowUpRight size={16}/>}</span>
        <div><b>{item.title}</b><small>{item.category} · {new Date(item.date).toLocaleDateString('es-GT', { day: 'numeric', month: 'short' })}</small></div>
        <strong className={item.type === 'INCOME' ? 'green' : ''}>{item.type === 'INCOME' ? '+' : '−'}{currency(item.amount, currencyCode)}</strong>
      </article>)}</div> : <div className="live-empty"><p>Aún no tienes movimientos.</p><NavLink className="primary-btn" to="/transaccion">Registrar movimiento</NavLink></div>}
    </section>
  </div>
}
