import { FormEvent, useState } from 'react'
import { ArrowLeft, ArrowRight, Check, Eye, EyeOff, LockKeyhole, Mail, Sparkles, UserRound } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { request } from './api'

type AuthUser = { id: string; name: string; email: string; age?: number; currency?: string; expenseCategories?: string[] }
const starterCategories = ['Comida', 'Ahorros', 'Suscripciones', 'Gastos personales', 'Transporte', 'Hogar', 'Salud', 'Viajes']

export default function LoginPage({ onLogin }: { onLogin: (user: AuthUser) => void }) {
  const navigate = useNavigate()
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [step, setStep] = useState(0)
  const [name, setName] = useState('')
  const [age, setAge] = useState('')
  const [currency, setCurrency] = useState('GTQ')
  const [selected, setSelected] = useState<string[]>(['Comida', 'Ahorros', 'Gastos personales'])
  const [customCategory, setCustomCategory] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  const changeMode = (value: 'login' | 'register') => { setMode(value); setStep(0); setError('') }
  const toggleCategory = (value: string) => setSelected(current => current.includes(value) ? current.filter(item => item !== value) : [...current, value])
  const goNext = () => {
    setError('')
    if (step === 0 && name.trim().length < 2) return setError('Escribe tu nombre para continuar.')
    if (step === 1 && (!Number.isInteger(Number(age)) || Number(age) < 13 || Number(age) > 120)) return setError('Ingresa una edad válida, entre 13 y 120 años.')
    if (step === 3 && selected.length === 0) return setError('Selecciona al menos una categoría.')
    setStep(current => Math.min(4, current + 1))
  }
  const submit = async (event: FormEvent) => {
    event.preventDefault(); setError('')
    if (mode === 'register' && step < 4) { goNext(); return }
    if (mode === 'register' && password !== confirm) { setError('Las contraseñas no coinciden.'); return }
    if (mode === 'register' && password.length < 8) { setError('La contraseña debe contener mínimo 8 caracteres.'); return }
    setBusy(true)
    try {
      const data = await request<{ token: string; user: AuthUser }>(`/auth/${mode === 'register' ? 'register' : 'login'}`, {
        method: 'POST',
        body: JSON.stringify(mode === 'register'
          ? { name: name.trim(), age: Number(age), currency, expenseCategories: selected, email: email.trim(), password }
          : { email: email.trim(), password }),
      })
      localStorage.setItem('kudo-token', data.token)
      localStorage.setItem('kudo-user', JSON.stringify(data.user))
      localStorage.setItem('kudo-currency', data.user.currency || currency)
      onLogin(data.user)
      navigate('/', { replace: true })
    } catch (err) { setError(err instanceof Error ? err.message : 'No se pudo completar el acceso. Intenta de nuevo.') }
    finally { setBusy(false) }
  }

  return <main className="auth-page"><div className="auth-shell">
    <header className="auth-brand"><div className="auth-logo"><span>k</span><b/></div><h1>KUDO APP</h1><p>Registra tus gastos y entiende mejor tu dinero.</p></header>
    <section className="auth-card"><div className="auth-tabs"><button type="button" className={mode === 'login' ? 'selected' : ''} onClick={() => changeMode('login')}>Ingresar</button><button type="button" className={mode === 'register' ? 'selected' : ''} onClick={() => changeMode('register')}>Crear cuenta</button></div>
      {mode === 'register' && <div className="auth-progress" aria-label={`Paso ${step + 1} de 5`}><i style={{ width: `${(step + 1) * 20}%` }}/></div>}
      <form onSubmit={submit}>
        {mode === 'register' && step === 0 && <div className="auth-step"><span className="auth-step-icon"><UserRound size={20}/></span><h2>Hola, ¿cómo te llamas?</h2><p>Usaremos tu nombre para personalizar tu espacio.</p><label className="auth-field"><span>Tu nombre</span><span className="auth-input"><UserRound size={16}/><input autoFocus value={name} onChange={event => setName(event.target.value)} placeholder="Escribe tu nombre" required minLength={2} maxLength={80}/></span></label></div>}
        {mode === 'register' && step === 1 && <div className="auth-step"><span className="auth-step-icon"><span>🎂</span></span><h2>¿Cuántos años tienes?</h2><p>Esto nos ayuda a adaptar tu experiencia.</p><label className="auth-field"><span>Edad</span><span className="auth-input"><input autoFocus type="number" min="13" max="120" value={age} onChange={event => setAge(event.target.value)} placeholder="Tu edad" required/></span></label></div>}
        {mode === 'register' && step === 2 && <div className="auth-step"><span className="auth-step-icon"><span>{currency === 'GTQ' ? 'Q' : currency === 'USD' ? '$' : '€'}</span></span><h2>¿Qué moneda utilizarás?</h2><p>Podrás registrar tus movimientos en esta moneda.</p><label className="auth-field"><span>Moneda</span><select className="auth-input auth-select" value={currency} onChange={event => setCurrency(event.target.value)}><option value="GTQ">Quetzal guatemalteco (GTQ)</option><option value="USD">Dólar estadounidense (USD)</option><option value="EUR">Euro (EUR)</option></select></label></div>}
        {mode === 'register' && step === 3 && <div className="auth-step"><span className="auth-step-icon"><Sparkles size={20}/></span><h2>¿En qué categorías gastas?</h2><p>Elige las que quieras. Después podrás agregar otras.</p><div className="auth-category-picks">{starterCategories.map(item => <button type="button" className={selected.includes(item) ? 'chosen' : ''} onClick={() => toggleCategory(item)} key={item}>{selected.includes(item) && <Check size={14}/>} {item}</button>)}</div><div className="auth-custom-category"><input aria-label="Nueva categoría" placeholder="Agregar otra categoría" value={customCategory} onChange={event => setCustomCategory(event.target.value)} maxLength={40}/><button type="button" disabled={customCategory.trim().length < 2} onClick={() => { const value = customCategory.trim(); if (value && !selected.includes(value)) setSelected(current => [...current, value]); setCustomCategory('') }}>Agregar</button></div></div>}
        {(mode === 'login' || step === 4) && <div className="auth-step auth-credentials"><h2>{mode === 'login' ? 'Qué bueno verte de nuevo' : 'Crea tus datos de acceso'}</h2><p>{mode === 'login' ? 'Ingresa a tu espacio financiero.' : 'Ya casi está listo tu espacio.'}</p><label className="auth-field"><span>Correo electrónico</span><span className="auth-input"><Mail size={16}/><input autoFocus={mode === 'login'} type="email" autoComplete="email" value={email} onChange={event => setEmail(event.target.value)} placeholder="tu@correo.com" required maxLength={200}/></span></label><label className="auth-field"><span>Contraseña</span><span className="auth-input"><LockKeyhole size={16}/><input type={showPassword ? 'text' : 'password'} autoComplete={mode === 'login' ? 'current-password' : 'new-password'} value={password} onChange={event => setPassword(event.target.value)} placeholder="Mínimo 8 caracteres" minLength={8} maxLength={100} required/><button className="password-toggle" type="button" aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'} onClick={() => setShowPassword(value => !value)}>{showPassword ? <EyeOff size={16}/> : <Eye size={16}/>}</button></span></label>{mode === 'register' && <label className="auth-field"><span>Confirmar contraseña</span><span className="auth-input"><LockKeyhole size={16}/><input type={showPassword ? 'text' : 'password'} autoComplete="new-password" value={confirm} onChange={event => setConfirm(event.target.value)} placeholder="Escribe de nuevo tu contraseña" minLength={8} maxLength={100} required/></span></label>}</div>}
        {error && <p className="auth-message error" role="alert">{error}</p>}
        {mode === 'register' && step < 4 ? <div className="auth-step-controls"><button type="button" onClick={() => { setError(''); setStep(current => Math.max(0, current - 1)) }} disabled={step === 0}><ArrowLeft size={15}/> Atrás</button><span>Paso {step + 1} de 5</span><button className="auth-continue" type="submit">Siguiente <ArrowRight size={15}/></button></div> : <button className="auth-submit" type="submit" disabled={busy}>{busy ? 'Un momento…' : mode === 'login' ? 'Ingresar a KUDO' : 'Crear cuenta'} <ArrowRight size={16}/></button>}
      </form>
      <p className="auth-security"><span>✓</span> Protegemos tus datos personales.</p>
    </section>
  </div></main>
}
