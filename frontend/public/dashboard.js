(() => {
  const byId = (id) => document.getElementById(id)
  const token = localStorage.getItem('kudo-token')
  let transactions = []

  function localDateKey(date) {
    const d = new Date(date)
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
  }

  function closeMenus() {
    for (const [buttonId, panelId] of [['notification-toggle', 'notification-panel'], ['profile-toggle', 'profile-menu']]) {
      byId(panelId)?.classList.add('hidden')
      byId(buttonId)?.setAttribute('aria-expanded', 'false')
    }
  }

  function setupMenu(buttonId, panelId) {
    const button = byId(buttonId)
    const panel = byId(panelId)
    if (!button || !panel) return
    button.addEventListener('click', (event) => {
      event.stopPropagation()
      const opening = panel.classList.contains('hidden')
      closeMenus()
      panel.classList.toggle('hidden', !opening)
      button.setAttribute('aria-expanded', String(opening))
      if (opening && buttonId === 'notification-toggle') {
        byId('notification-dot')?.classList.add('hidden')
        localStorage.setItem('kudo-notifications-read', 'true')
      }
    })
    panel.addEventListener('click', (event) => event.stopPropagation())
  }

  function setProfile() {
    let user = null
    try { user = JSON.parse(localStorage.getItem('kudo-user') || 'null') } catch {}
    const name = user?.name?.trim() || 'Mi cuenta'
    const email = user?.email || 'Cuenta personal'
    const rawFirstName = name.split(/\s+/)[0]
    const firstName = rawFirstName.charAt(0).toLocaleUpperCase('es') + rawFirstName.slice(1)
    const initial = firstName.charAt(0).toUpperCase() || 'A'
    if (byId('welcome-name')) byId('welcome-name').textContent = firstName
    if (byId('profile-name')) byId('profile-name').textContent = name
    if (byId('profile-email')) byId('profile-email').textContent = email
    if (byId('profile-initial')) byId('profile-initial').textContent = initial
  }

  function showNotifications(items) {
    const list = byId('notification-list')
    if (!list) return
    list.replaceChildren()
    if (!items.length) items.push({ title: 'Todo al día', message: 'No hay novedades por ahora.', icon: 'check_circle' })
    for (const item of items) {
      const row = document.createElement('div')
      row.className = 'flex items-start gap-3 rounded-xl bg-surface-container-low p-3'
      const icon = document.createElement('span')
      icon.className = 'material-symbols-outlined mt-0.5 text-secondary'
      icon.textContent = item.icon
      const copy = document.createElement('div')
      const title = document.createElement('b')
      title.className = 'block font-label-md text-label-md text-text-primary'
      title.textContent = item.title
      const message = document.createElement('p')
      message.className = 'mt-0.5 font-caption text-caption text-text-secondary'
      message.textContent = item.message
      copy.append(title, message)
      row.append(icon, copy)
      list.append(row)
    }
  }

  function calculateStreak() {
    const days = new Set(transactions.map((tx) => localDateKey(tx.date)))
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const todayKey = localDateKey(today)
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)
    const start = days.has(todayKey) ? today : days.has(localDateKey(yesterday)) ? yesterday : null
    if (!start) return 0
    let count = 0
    const cursor = new Date(start)
    while (days.has(localDateKey(cursor))) {
      count += 1
      cursor.setDate(cursor.getDate() - 1)
    }
    return count
  }

  async function loadDashboardData() {
    if (!token) {
      showNotifications([{ title: 'Inicia sesión', message: 'Accede a tu cuenta para consultar tus novedades.', icon: 'login' }])
      return
    }
    try {
      const response = await fetch('/api/transactions?limit=100', { headers: { Authorization: `Bearer ${token}` } })
      const data = await response.json()
      if (!response.ok) throw new Error(data.message || 'No se pudieron consultar tus movimientos.')
      transactions = Array.isArray(data.transactions) ? data.transactions : []

      const streak = calculateStreak()
      const countElement = byId('streak-count')
      const messageElement = byId('streak-message')
      if (countElement) countElement.textContent = String(streak)
      if (messageElement) {
        messageElement.textContent = streak
          ? `¡Vas ${streak} ${streak === 1 ? 'día' : 'días'} registrando tus movimientos! Sigue así.`
          : 'Registra un movimiento hoy para iniciar tu racha.'
      }

      const now = new Date()
      const thisMonth = transactions.filter((tx) => {
        const date = new Date(tx.date)
        return date.getFullYear() === now.getFullYear() && date.getMonth() === now.getMonth()
      }).length
      const items = transactions.length
        ? [{ title: 'Tus movimientos están al día', message: `Tienes ${thisMonth} ${thisMonth === 1 ? 'movimiento' : 'movimientos'} registrados este mes.`, icon: 'receipt_long' }]
        : [{ title: 'Empieza con un pequeño paso', message: 'Registra tu primer gasto o ingreso para ver tu actividad aquí.', icon: 'add_circle' }]
      if (streak) items.push({ title: `Racha KUDO: ${streak} ${streak === 1 ? 'día' : 'días'}`, message: 'Un registro al día te ayuda a entender mejor tus hábitos.', icon: 'local_fire_department' })
      showNotifications(items)
    } catch (error) {
      showNotifications([{ title: 'No pudimos cargar tus novedades', message: error instanceof Error ? error.message : 'Intenta de nuevo más tarde.', icon: 'info' }])
    }
  }

  setProfile()
  setupMenu('notification-toggle', 'notification-panel')
  setupMenu('profile-toggle', 'profile-menu')
  byId('notification-close')?.addEventListener('click', closeMenus)
  byId('logout-button')?.addEventListener('click', () => {
    localStorage.removeItem('kudo-token')
    localStorage.removeItem('kudo-user')
    window.top.location.href = '/login'
  })
  document.addEventListener('click', closeMenus)
  document.addEventListener('keydown', (event) => { if (event.key === 'Escape') closeMenus() })
  loadDashboardData()
})()
