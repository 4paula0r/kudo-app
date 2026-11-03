import { FormEvent, useMemo, useState } from 'react'
import { Send, Sparkles } from 'lucide-react'

type Tx = { id: string; title: string; category: string; type: 'INCOME' | 'EXPENSE'; amount: number; date: string }
type Message = { role: 'ai' | 'user'; text: string }
const formatMoney = (amount: number, code: string) => new Intl.NumberFormat('es-GT', { style: 'currency', currency: code }).format(amount)
const normalize = (text: string) => text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()

export default function KudoAI({ tx, name, currencyCode }: { tx: Tx[]; name: string; currencyCode: string }) {
  const [input, setInput] = useState('')
  const [pendingPurchase, setPendingPurchase] = useState(false)
  const [messages, setMessages] = useState<Message[]>([{ role: 'ai', text: `¡Hola, ${name}! 👋 Puedo revisar tu balance registrado, proyectar su tendencia y ayudarte a evaluar una compra con tus datos.` }])
  const money = (value: number) => formatMoney(value, currencyCode)
  const stats = useMemo(() => {
    const income = tx.filter(item => item.type === 'INCOME').reduce((sum, item) => sum + item.amount, 0)
    const expenses = tx.filter(item => item.type === 'EXPENSE').reduce((sum, item) => sum + item.amount, 0)
    const now = new Date()
    const thisMonth = tx.filter(item => { const date = new Date(item.date); return date.getFullYear() === now.getFullYear() && date.getMonth() === now.getMonth() })
    const monthlyExpenses = thisMonth.filter(item => item.type === 'EXPENSE').reduce((sum, item) => sum + item.amount, 0)
    const byCategory = thisMonth.filter(item => item.type === 'EXPENSE').reduce<Record<string, number>>((result, item) => { result[item.category] = (result[item.category] || 0) + item.amount; return result }, {})
    const categories = Object.entries(byCategory).sort((a, b) => b[1] - a[1])
    const months = Array.from({ length: 3 }, (_, index) => new Date(now.getFullYear(), now.getMonth() - 2 + index, 1))
      .map(month => {
        const records = tx.filter(item => { const date = new Date(item.date); return date.getFullYear() === month.getFullYear() && date.getMonth() === month.getMonth() })
        return { records: records.length, net: records.filter(item => item.type === 'INCOME').reduce((sum, item) => sum + item.amount, 0) - records.filter(item => item.type === 'EXPENSE').reduce((sum, item) => sum + item.amount, 0) }
      }).filter(month => month.records > 0)
    const monthlyAverage = months.length ? months.reduce((sum, month) => sum + month.net, 0) / months.length : 0
    return { income, expenses, balance: income - expenses, thisMonth, monthlyExpenses, categories, months, monthlyAverage }
  }, [tx])

  const purchaseAmount = (text: string) => {
    const match = text.match(/(?:q\.?\s*|quetzales?\s*|\$\s*|usd\s*|€\s*|eur\s*)?([0-9][0-9,]*(?:\.[0-9]{1,2})?)/i)
    if (!match) return null
    const amount = Number(match[1].replace(/,/g, ''))
    return Number.isFinite(amount) && amount > 0 ? amount : null
  }

  const evaluatePurchase = (amount: number) => {
    if (stats.balance <= 0) return `Con tus movimientos registrados, tu balance es ${money(stats.balance)}. No recomendaría hacer la compra basándome solo en estos datos; revisa primero tus otros fondos y pagos pendientes.`
    const remaining = stats.balance - amount
    if (remaining < 0) return `La compra de ${money(amount)} supera tu balance registrado de ${money(stats.balance)}. Yo la pospondría o buscaría una opción más económica; te faltarían ${money(Math.abs(remaining))}.`
    if (stats.months.length && stats.monthlyAverage < 0) return `Puedes cubrir ${money(amount)} con tu balance registrado, pero tus movimientos recientes muestran un promedio neto mensual de ${money(stats.monthlyAverage)}. Sería más prudente esperar o reducir el gasto; después de comprar te quedarían ${money(remaining)}.`
    if (amount > stats.balance * 0.4) return `La compra cabe en tu balance registrado, pero usaría cerca de ${Math.round(amount / stats.balance * 100)}% y te quedarían ${money(remaining)}. Considera si ese margen cubre tus gastos próximos antes de decidir.`
    return `Según los movimientos que has registrado, la compra de ${money(amount)} cabe en tu balance y te quedarían ${money(remaining)}. Revisa también tus pagos próximos y prioridades antes de decidir.`
  }

  const answer = (question: string) => {
    const q = normalize(question)
    const category = stats.categories.find(([name]) => q.includes(normalize(name)))
    if (/proyect|proyeccion|futuro|tres meses|3 meses|trimestre/.test(q)) {
      if (!stats.months.length) return 'Aún no tengo movimientos para proyectar tu balance. Registra ingresos y gastos para calcular una tendencia de tres meses.'
      const projected = stats.balance + stats.monthlyAverage * 3
      return `Tu balance registrado ahora es ${money(stats.balance)}. En los últimos ${stats.months.length} ${stats.months.length === 1 ? 'mes con registros' : 'meses con registros'}, tu promedio neto fue ${money(stats.monthlyAverage)} al mes. Si mantienes ese ritmo, en tres meses podría rondar ${money(projected)}. Es una estimación basada en lo que registraste, no incluye gastos futuros que aún no conocemos.`
    }
    if (/compra|comprar|adquirir|me aconsejas|me conviene/.test(q)) {
      const amount = purchaseAmount(question)
      return amount ? evaluatePurchase(amount) : `Puedo compararla con tu balance de ${money(stats.balance)}. ¿Cuánto cuesta aproximadamente?`
    }
    if (/ahorr|guardar|apartar|meta/.test(q)) {
      if (!stats.thisMonth.length) return 'Todavía no hay movimientos este mes. Cuando registres ingresos y gastos, puedo sugerirte cuánto podrías apartar sin excederte.'
      const top = stats.categories[0]
      const suggestion = Math.max(0, stats.balance) * 0.1
      return `${top ? `Tu categoría con más gasto este mes es ${top[0]} (${money(top[1])}). ` : ''}Tu balance registrado es ${money(stats.balance)}. Como primer paso, podrías probar apartando ${money(suggestion)} y ajustar según tus pagos próximos.`
    }
    if (/saldo|balance|disponible/.test(q)) return `Tu balance según los movimientos que has registrado es ${money(stats.balance)}: ${money(stats.income)} en ingresos menos ${money(stats.expenses)} en gastos.`
    if (/categoria|gasto|gast|analiz|donde|presupuest|limite|cuanto|comida|transporte|compras|hogar|salud|viaje|ocio/.test(q)) {
      if (!stats.categories.length) return 'Aún no tienes gastos registrados este mes para comparar categorías. Cuando agregues algunos, te diré dónde se concentra el gasto.'
      const focus = category || stats.categories[0]
      const percent = stats.monthlyExpenses ? Math.round(focus[1] / stats.monthlyExpenses * 100) : 0
      return `${category ? `En ${focus[0]}` : `Tu categoría más alta es ${focus[0]}`}: ${money(focus[1])}, ${percent}% de tus gastos este mes. En total registraste ${money(stats.monthlyExpenses)} en gastos.`
    }
    return `Puedo ayudarte con una proyección a tres meses, evaluar una compra, revisar tu balance o comparar tus gastos. ${stats.thisMonth.length ? `Este mes registraste ${money(stats.monthlyExpenses)} en gastos.` : 'Aún no hay movimientos este mes.'}`
  }

  const send = (event: FormEvent) => {
    event.preventDefault()
    const question = input.trim()
    if (!question) return
    const amount = pendingPurchase ? purchaseAmount(question) : null
    const response = amount ? evaluatePurchase(amount) : answer(question)
    setPendingPurchase(!amount && /compra|comprar|adquirir|me aconsejas|me conviene/.test(normalize(question)) && !purchaseAmount(question))
    setMessages(current => [...current, { role: 'user', text: question }, { role: 'ai', text: response }])
    setInput('')
  }

  return <><header className="finance-page-heading"><div><span className="eyebrow">TU COMPAÑERO FINANCIERO</span><h1>Kudo AI ✨</h1><p>Ideas claras según tus movimientos.</p></div></header><div className="privacy-note" role="note">🔒 Protegemos tus datos y cuidamos tu privacidad.</div><div className="ai-layout ai-layout-single"><section className="panel chat-panel"><div className="chat-head"><div className="spark-badge"><Sparkles size={19}/></div><div><b>Tu espacio con Kudo</b><small><i/> Listo para ayudarte</small></div></div><div className="chat-messages" aria-live="polite">{messages.map((message, index) => <div className={`message ${message.role}`} key={index}><div className="message-avatar">{message.role === 'ai' ? '✦' : name.charAt(0).toUpperCase()}</div><p>{message.text}</p></div>)}</div><div className="suggestions">{['Proyecta mi balance en 3 meses','¿Me aconsejas esta compra?','¿Dónde gasto más?'].map(suggestion => <button type="button" onClick={() => setInput(suggestion)} key={suggestion}>{suggestion}</button>)}</div><form className="chat-input" onSubmit={send}><input placeholder="Escribe tu pregunta..." value={input} onChange={event => setInput(event.target.value)}/><button aria-label="Enviar"><Send size={17}/></button></form><small className="ai-disclaimer">Las proyecciones son estimaciones basadas en tus movimientos registrados.</small></section></div></>
}
