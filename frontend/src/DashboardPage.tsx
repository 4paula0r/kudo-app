import { ArrowDownRight, ArrowUpRight, CalendarDays, ChevronLeft, ChevronRight, TrendingUp } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { useState } from 'react'
import Mascot from './Mascot'
import './dashboard.css'

export type Movement = { id: string; title: string; category: string; type: 'INCOME' | 'EXPENSE'; amount: number; date: string }
export type SavingGoal = { id: string; name: string; target: number; saved: number; deadline: string }

const currency = (value: number, code: string) => new Intl.NumberFormat('es-GT', { style: 'currency', currency: code }).format(value)
const monthKey = (date: Date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
const movementDateParts = (value: string) => {
  const isoDate = value.match(/^(\d{4})-(\d{2})-(\d{2})/)
  if (isoDate) return { month: `${isoDate[1]}-${isoDate[2]}`, day: Number(isoDate[3]) }
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? { month: '', day: 0 } : { month: monthKey(date), day: date.getDate() }
}
const amountValue = (value: number) => Number(value) || 0

export default function DashboardPage({ transactions, name, currencyCode }: { transactions: Movement[]; goals: SavingGoal[]; name: string; currencyCode: string }) {
  const [selectedMonth, setSelectedMonth] = useState(() => monthKey(new Date()))
  const currentMonth = monthKey(new Date())
  const [year, monthNumber] = selectedMonth.split('-').map(Number)
  const selectedMonthDate = new Date(year, monthNumber - 1, 1)
  const monthTransactions = transactions.filter(item => movementDateParts(item.date).month === selectedMonth)
  const transactionsThroughSelectedMonth = transactions.filter(item => {
    const transactionMonth = movementDateParts(item.date).month
    return transactionMonth !== '' && transactionMonth <= selectedMonth
  })
  const balance = transactionsThroughSelectedMonth.reduce((total, item) => {
    const amount = amountValue(item.amount)
    return total + (item.type === 'INCOME' ? amount : -amount)
  }, 0)
  const monthIncome = monthTransactions.filter(item => item.type === 'INCOME').reduce((sum, item) => sum + amountValue(item.amount), 0)
  const monthExpenses = monthTransactions.filter(item => item.type === 'EXPENSE').reduce((sum, item) => sum + amountValue(item.amount), 0)
  const monthLabel = new Intl.DateTimeFormat('es-GT', { month: 'long', year: 'numeric' }).format(selectedMonthDate)
  const previousMonthKey = monthKey(new Date(year, monthNumber - 2, 1))
  const previousMonthTransactions = transactions.filter(item => movementDateParts(item.date).month === previousMonthKey)
  const previousMonthNet = previousMonthTransactions.reduce((total, item) => total + (item.type === 'INCOME' ? 1 : -1) * amountValue(item.amount), 0)
  const monthNet = monthIncome - monthExpenses
  const monthlyVariation = monthTransactions.length > 0 && previousMonthTransactions.length > 0 && previousMonthNet !== 0
    ? ((monthNet - previousMonthNet) / Math.abs(previousMonthNet)) * 100
    : null
  const recent = [...monthTransactions].sort((a, b) => +new Date(b.date) - +new Date(a.date)).slice(0, 3)
  const shiftMonth = (offset: number) => {
    const nextMonth = new Date(year, monthNumber - 1 + offset, 1)
    const key = monthKey(nextMonth)
    if (key <= currentMonth) setSelectedMonth(key)
  }
  const rankedCategories = Object.entries(monthTransactions.filter(item => item.type === 'EXPENSE').reduce<Record<string, number>>((acc, item) => {
    acc[item.category] = (acc[item.category] || 0) + item.amount
    return acc
  }, {})).sort((a, b) => b[1] - a[1])
  const categories: [string, number][] = rankedCategories.length > 4
    ? [...rankedCategories.slice(0, 3), ['Otros', rankedCategories.slice(3).reduce((sum, [, value]) => sum + value, 0)]]
    : rankedCategories
  const firstName = name.trim().split(/\s+/)[0] || 'ahí'

  return <div className="live-dashboard kudo-dashboard-v2">
    <header className="live-dashboard-heading"><div><h1>Hola, {firstName} 👋</h1><p>Un vistazo rápido a tus finanzas</p></div><div className="dashboard-month-picker" aria-label="Elegir mes del resumen"><button type="button" onClick={()=>shiftMonth(-1)} aria-label="Ver mes anterior"><ChevronLeft size={17}/></button><label><CalendarDays size={16}/><input type="month" aria-label="Mes del resumen" value={selectedMonth} max={currentMonth} onChange={event=>event.target.value&&event.target.value<=currentMonth&&setSelectedMonth(event.target.value)}/></label><button type="button" onClick={()=>shiftMonth(1)} disabled={selectedMonth>=currentMonth} aria-label="Ver mes siguiente"><ChevronRight size={17}/></button></div></header>
    <div className="kudo-overview-grid">
      <section className="panel kudo-hero" aria-label="Balance disponible">
        <div className="kudo-hero-top"><div className="kudo-hero-copy"><span>Balance disponible</span><strong>{currency(balance, currencyCode)}</strong><small>Saldo acumulado hasta {monthLabel}</small>{monthlyVariation !== null && Number.isFinite(monthlyVariation) && <span className={`dashboard-variation ${monthlyVariation < 0 ? 'down' : ''}`}><TrendingUp size={15}/>{monthlyVariation > 0 ? '+' : ''}{new Intl.NumberFormat('es-GT', { maximumFractionDigits: 0 }).format(monthlyVariation)}% vs. mes anterior</span>}</div><div className="dashboard-owl-frame"><Mascot variant="ai" className="mascot-dashboard-hero"/></div></div>
      </section>
      <section className="panel kudo-month-summary" aria-label={`Resumen de ${monthLabel}`}>
        <div className="dashboard-month-heading"><div><span>RESUMEN</span><h2>{selectedMonth === currentMonth ? 'Este mes' : monthLabel}</h2></div><CalendarDays size={20}/></div>
        <div className="dashboard-month-row income"><span className="dashboard-month-icon"><ArrowDownRight size={18}/></span><span>Ingresos</span><b>{currency(monthIncome,currencyCode)}</b></div>
        <div className="dashboard-month-row expense"><span className="dashboard-month-icon"><ArrowUpRight size={18}/></span><span>Gastos</span><b>{currency(monthExpenses,currencyCode)}</b></div>
        <div className="dashboard-month-row savings"><span className="dashboard-month-icon"><TrendingUp size={18}/></span><span>Ahorro</span><b>{currency(monthNet,currencyCode)}</b></div>
      </section>
    </div>
    <div className="kudo-overview-grid kudo-bottom-grid">
      <section className="panel kudo-category-card">
        <div className="panel-heading"><div><h2>Gastos por categoría</h2><p>Durante {monthLabel}</p></div></div>
        {monthExpenses > 0 ? <div className="kudo-category-content">
          <div className="kudo-donut" style={{background:`conic-gradient(${categories.map(([_,value],i)=>`var(--kudo-chart-${i+1}) ${categories.slice(0,i).reduce((a,[,v])=>a+v,0)/monthExpenses*100}% ${(categories.slice(0,i).reduce((a,[,v])=>a+v,0)+value)/monthExpenses*100}%`).join(', ')}, #e6edf8 ${categories.reduce((a,[,v])=>a+v,0)/monthExpenses*100}% 100%)`}}><div><b>{currency(monthExpenses,currencyCode)}</b><small>{monthLabel}</small></div></div>
          <div className="kudo-category-legend">{categories.map(([category,value],i)=><div key={category}><i style={{background:`var(--kudo-chart-${i+1})`}}/><span>{category}</span><b>{Math.round(value/monthExpenses*100)}%</b></div>)}</div>
        </div> : <p className="kudo-no-data">No hay gastos registrados para {monthLabel}.</p>}
      </section>
      <section className="panel live-recent-card kudo-recent-card">
        <div className="panel-heading"><h2>Movimientos recientes</h2><NavLink to="/finanzas" className="text-link">Ver todos</NavLink></div>
        {recent.length ? <div className="live-recent-list">{recent.map(item => <article key={item.id}>
          <span className={`live-type-icon ${item.type === 'INCOME' ? 'income' : ''}`}>{item.type === 'INCOME' ? <ArrowDownRight size={16}/> : <ArrowUpRight size={16}/>}</span>
          <div><b>{item.title}</b><small>{item.category} · {new Date(item.date).toLocaleDateString('es-GT', {day:'numeric',month:'short'})}</small></div>
          <strong className={item.type === 'INCOME' ? 'green' : ''}>{item.type === 'INCOME' ? '+' : '−'}{currency(item.amount,currencyCode)}</strong>
        </article>)}</div> : <div className="live-empty"><Mascot variant="sleep" className="mascot-sleep"/><p>Aún no tienes movimientos para {monthLabel}.</p><NavLink className="primary-btn" to="/transaccion">Registrar movimiento</NavLink></div>}
      </section>
    </div>
  </div>
}

