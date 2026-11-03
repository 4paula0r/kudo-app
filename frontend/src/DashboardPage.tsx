import { ArrowDownRight, ArrowUpRight } from 'lucide-react'
import { NavLink } from 'react-router-dom'

export type Movement = { id: string; title: string; category: string; type: 'INCOME' | 'EXPENSE'; amount: number; date: string }
export type SavingGoal = { id: string; name: string; target: number; saved: number; deadline: string }

const currency = (value: number, code: string) => new Intl.NumberFormat('es-GT', { style: 'currency', currency: code }).format(value)
const chartColors = ['#2874d7', '#4db99e', '#e7b15e', '#94a5bb']

export default function DashboardPage({ transactions, name, currencyCode }: { transactions: Movement[]; goals: SavingGoal[]; name: string; currencyCode: string }) {
  const income = transactions.filter(item => item.type === 'INCOME').reduce((sum, item) => sum + item.amount, 0)
  const expenses = transactions.filter(item => item.type === 'EXPENSE').reduce((sum, item) => sum + item.amount, 0)
  const balance = income - expenses
  const now = new Date()
  const currentMonth = transactions.filter(item => { const date = new Date(item.date); return date.getFullYear() === now.getFullYear() && date.getMonth() === now.getMonth() })
  const monthIncome = currentMonth.filter(item => item.type === 'INCOME').reduce((sum, item) => sum + item.amount, 0)
  const monthExpenses = currentMonth.filter(item => item.type === 'EXPENSE').reduce((sum, item) => sum + item.amount, 0)
  const chartDays = Math.max(1, now.getDate())
  const dailyNet = currentMonth.reduce<Record<number, number>>((result, item) => {
    const day = new Date(item.date).getDate()
    result[day] = (result[day] || 0) + (item.type === 'INCOME' ? item.amount : -item.amount)
    return result
  }, {})
  const chartValues: number[] = []
  let runningBalance = balance - monthIncome + monthExpenses
  for (let day = 1; day <= chartDays; day++) {
    runningBalance += dailyNet[day] || 0
    chartValues.push(runningBalance)
  }
  const chartMin = Math.min(...chartValues)
  const chartMax = Math.max(...chartValues)
  const chartRange = chartMax - chartMin || Math.max(Math.abs(chartMax) * .12, 1)
  const chartPoints = chartValues.map((value, index) => ({ x: chartValues.length === 1 ? 0 : index / (chartValues.length - 1) * 600, y: 112 - ((value - chartMin) / chartRange) * 92 }))
  const chartPath = chartPoints.reduce((path, point, index) => {
    if (index === 0) return `M ${point.x} ${point.y}`
    const previous = chartPoints[index - 1]
    const middleX = (previous.x + point.x) / 2
    const middleY = (previous.y + point.y) / 2
    return `${path} Q ${previous.x} ${previous.y} ${middleX} ${middleY}`
  }, '') + (chartPoints.length > 1 ? ` T ${chartPoints[chartPoints.length - 1].x} ${chartPoints[chartPoints.length - 1].y}` : ` L 600 ${chartPoints[0].y}`)
  const monthExpenseItems = currentMonth.filter(item => item.type === 'EXPENSE')
  const spendingByCategory = monthExpenseItems.reduce<Record<string, number>>((result, item) => { result[item.category] = (result[item.category] || 0) + item.amount; return result }, {})
  const rankedCategories = Object.entries(spendingByCategory).sort((a, b) => b[1] - a[1])
  const categories = rankedCategories.length > 4
    ? [...rankedCategories.slice(0, 3), ['Otros', rankedCategories.slice(3).reduce((sum, [, amount]) => sum + amount, 0)] as [string, number]]
    : rankedCategories
  let chartProgress = 0
  const donutStops = categories.map(([, amount], index) => { const start = chartProgress; chartProgress += monthExpenses ? amount / monthExpenses * 100 : 0; return `${chartColors[index % chartColors.length]} ${start}% ${chartProgress}%` }).join(', ')
  const recent = [...transactions].sort((a, b) => +new Date(b.date) - +new Date(a.date)).slice(0, 4)
  const firstName = name.trim().split(/\s+/)[0] || 'ahí'
  const monthName = new Intl.DateTimeFormat('es-GT', { month: 'long' }).format(now)

  return <div className="dashboard-v2">
    <header className="dashboard-v2-heading"><div><span className="eyebrow">TU RESUMEN</span><h1>Hola, {firstName} 👋</h1><p>Tu dinero, bajo control.</p></div></header>

    <section className="dashboard-v2-balance" aria-label="Balance disponible y evolución">
      <div className="dashboard-v2-balance-main"><span>Balance disponible</span><strong>{currency(balance, currencyCode)}</strong><small><ArrowUpRight size={13}/> Tu resumen financiero</small></div>
      <svg className="dashboard-v2-balance-chart" viewBox="0 0 600 140" preserveAspectRatio="none" role="img" aria-label={`Evolución diaria del balance en ${monthName}`}><path d={chartPath}/></svg>
    </section>

    <div className="dashboard-v2-monthly-stats" aria-label={`Ingresos y gastos de ${monthName}`}><article><span>Ingresos</span><b className="income-text">{currency(monthIncome, currencyCode)}</b></article><article><span>Gastos</span><b>{currency(monthExpenses, currencyCode)}</b></article></div>

    <div className="dashboard-v2-panels">
      <section className="dashboard-v2-panel" aria-labelledby="dashboard-spending-title">
        <div className="dashboard-v2-panel-heading"><div><h2 id="dashboard-spending-title">Gastos por categoría</h2><p>Registrados en {monthName}</p></div><NavLink to="/finanzas">Ver finanzas</NavLink></div>
        {categories.length ? <div className="dashboard-v2-chart-content"><div className="dashboard-v2-donut" role="img" aria-label={`Gráfica de gastos por categoría: ${categories.map(([category, amount]) => `${category}, ${currency(amount, currencyCode)}`).join('; ')}`} style={{ background: `conic-gradient(${donutStops})` }}><div><small>Gastado este mes</small><b>{currency(monthExpenses, currencyCode)}</b></div></div><div className="dashboard-v2-legend">{categories.map(([category, amount], index) => <div key={category}><i style={{ background: chartColors[index % chartColors.length] }}/><span>{category}<small>{currency(amount, currencyCode)}</small></span><b>{monthExpenses ? Math.round(amount / monthExpenses * 100) : 0}%</b></div>)}</div></div> : <div className="dashboard-v2-empty"><p>Aún no hay gastos registrados este mes.</p><NavLink to="/transaccion">Registrar un gasto</NavLink></div>}
      </section>

      <section className="dashboard-v2-panel" aria-labelledby="dashboard-recent-title">
        <div className="dashboard-v2-panel-heading"><div><h2 id="dashboard-recent-title">Movimientos recientes</h2><p>Lo último que registraste</p></div><NavLink to="/movimientos">Ver todos</NavLink></div>
        {recent.length ? <div className="dashboard-v2-recent-list">{recent.map(item => <article key={item.id}><span className={`dashboard-v2-movement-icon ${item.type === 'INCOME' ? 'income' : ''}`}>{item.type === 'INCOME' ? <ArrowDownRight size={15}/> : <ArrowUpRight size={15}/>}</span><div><b>{item.title}</b><small>{item.category} · {new Date(item.date).toLocaleDateString('es-GT', { day: 'numeric', month: 'short' })}</small></div><strong className={item.type === 'INCOME' ? 'income-text' : ''}>{item.type === 'INCOME' ? '+' : '−'}{currency(item.amount, currencyCode)}</strong></article>)}</div> : <div className="dashboard-v2-empty"><p>Aún no tienes movimientos.</p><NavLink to="/transaccion">Registrar movimiento</NavLink></div>}
      </section>
    </div>
  </div>
}
