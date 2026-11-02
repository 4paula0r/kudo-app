(() => {
  const root = document.getElementById('finance-overview')
  const monthInput = document.getElementById('finance-month')
  const totalNode = document.getElementById('finance-total')
  const countNode = document.getElementById('finance-count')
  const chartNode = document.getElementById('finance-donut')
  const listNode = document.getElementById('finance-categories')
  const statusNode = document.getElementById('finance-status')
  if (!root || !monthInput || !totalNode || !countNode || !chartNode || !listNode || !statusNode) return

  const token = localStorage.getItem('kudo-token')
  const profile = (() => { try { return JSON.parse(localStorage.getItem('kudo-user') || 'null') } catch { return null } })()
  const currency = profile?.currency || localStorage.getItem('kudo-currency') || 'GTQ'
  const colors = ['#7052d8', '#f07a6f', '#4e9ec9', '#54bd9d', '#f2bb55', '#9aa5b5']
  const money = new Intl.NumberFormat('es-GT', { style: 'currency', currency, maximumFractionDigits: 2 })
  const now = new Date()
  monthInput.value = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`

  async function fetchTransactions() {
    if (!token) throw new Error('Inicia sesión para consultar tus movimientos.')
    const all = []
    let page = 1
    let pages = 1
    do {
      const response = await fetch(`/api/transactions?page=${page}&limit=100`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.message || 'No se pudieron cargar tus movimientos.')
      all.push(...(data.transactions || []))
      pages = data.pagination?.pages || 1
      page += 1
    } while (page <= pages)
    return all
  }

  function render(transactions) {
    const [year, month] = monthInput.value.split('-').map(Number)
    const expenses = transactions.filter(item => {
      const date = new Date(item.date)
      return item.type === 'EXPENSE' && date.getFullYear() === year && date.getMonth() + 1 === month
    })
    const totals = expenses.reduce((result, item) => {
      const category = item.category?.trim() || 'Otros'
      result[category] = (result[category] || 0) + Number(item.amount || 0)
      return result
    }, {})
    const allCategories = Object.entries(totals).sort((a, b) => b[1] - a[1])
    const sum = expenses.reduce((total, item) => total + Number(item.amount || 0), 0)
    const visible = allCategories.slice(0, 5).map(([name, amount], index) => ({ name, amount, color: colors[index] }))
    const otherTotal = allCategories.slice(5).reduce((total, [, amount]) => total + amount, 0)
    if (otherTotal > 0) visible.push({ name: 'Otras categorías', amount: otherTotal, color: colors[5] })

    totalNode.textContent = money.format(sum)
    countNode.textContent = `${expenses.length} ${expenses.length === 1 ? 'movimiento' : 'movimientos'} · ${allCategories.length} ${allCategories.length === 1 ? 'categoría' : 'categorías'}`
    listNode.replaceChildren()

    if (!sum) {
      chartNode.style.background = '#eeeaf5'
      chartNode.setAttribute('aria-label', 'Sin gastos registrados en este período')
      statusNode.textContent = 'Aún no hay gastos en este mes. Usa “Registrar movimiento” para empezar.'
      return
    }

    let currentAngle = 0
    const slices = visible.map(item => {
      const start = currentAngle
      currentAngle += (item.amount / sum) * 100
      return `${item.color} ${start}% ${currentAngle}%`
    })
    chartNode.style.background = `conic-gradient(${slices.join(', ')})`
    chartNode.setAttribute('aria-label', `Gastos por categoría, total ${money.format(sum)}`)
    statusNode.textContent = 'Distribución de tus gastos por categoría.'

    for (const item of visible) {
      const row = document.createElement('div')
      row.className = 'finance-category'
      const dot = document.createElement('span')
      dot.className = 'finance-dot'
      dot.style.backgroundColor = item.color
      const label = document.createElement('span')
      label.className = 'finance-category-name'
      label.textContent = item.name
      const value = document.createElement('strong')
      value.textContent = money.format(item.amount)
      const percent = document.createElement('small')
      percent.textContent = `${Math.round((item.amount / sum) * 100)}%`
      row.append(dot, label, value, percent)
      listNode.append(row)
    }
  }

  statusNode.textContent = 'Cargando tus movimientos…'
  fetchTransactions()
    .then(transactions => {
      render(transactions)
      monthInput.addEventListener('change', () => render(transactions))
    })
    .catch(error => { statusNode.textContent = error.message || 'No se pudieron cargar tus movimientos.' })
})()
