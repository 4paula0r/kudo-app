import {FormEvent, useState} from 'react'
import {useNavigate} from 'react-router-dom'
import {ArrowRight,AtSign,Eye,EyeOff,Fingerprint,LockKeyhole} from 'lucide-react'
import {request} from './api'

type Props={onAuth:()=>void}
export default function LoginPage({onAuth}:Props){
  const [mode,setMode]=useState<'login'|'register'>('login')
  const [email,setEmail]=useState('')
  const [password,setPassword]=useState('')
  const [name,setName]=useState('')
  const [showPassword,setShowPassword]=useState(false)
  const [error,setError]=useState('')
  const [notice,setNotice]=useState('')
  const navigate=useNavigate()

  async function submit(event:FormEvent){
    event.preventDefault();setError('');setNotice('')
    try{
      const data=await request<{token:string}>(`/auth/${mode}`,{method:'POST',body:JSON.stringify({email,password,...(mode==='register'?{name}:{})})})
      localStorage.setItem('kudo-token',data.token);onAuth();navigate('/')
    }catch(reason){setError(reason instanceof Error?reason.message:'No se pudo conectar. Revisa que la API y PostgreSQL estén iniciados.')}
  }
  const comingSoon=(feature:string)=>setNotice(`${feature} estará disponible en una siguiente versión.`)

  return <main className="auth-page"><section className="auth-shell" aria-label="Acceso a KUDO">
    <header className="auth-brand"><div className="auth-logo" aria-hidden="true"><span>K</span><i/><b/></div><h1>KUDO</h1><p>Tu dinero, pero más fácil.</p></header>
    <section className="auth-card">
      <div className="auth-tabs" role="tablist" aria-label="Acceso o registro">
        <button role="tab" aria-selected={mode==='login'} className={mode==='login'?'selected':''} onClick={()=>{setMode('login');setError('');setNotice('')}}>Iniciar Sesión</button>
        <button role="tab" aria-selected={mode==='register'} className={mode==='register'?'selected':''} onClick={()=>{setMode('register');setError('');setNotice('')}}>Crear Cuenta</button>
      </div>
      <form onSubmit={submit}>
        {mode==='register'&&<label className="auth-field"><span>Nombre completo</span><div className="auth-input"><input autoComplete="name" value={name} onChange={e=>setName(e.target.value)} placeholder="Tu nombre" required minLength={2}/></div></label>}
        <label className="auth-field"><span>Correo electrónico</span><div className="auth-input"><AtSign size={16}/><input type="email" autoComplete="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="tu@correo.com" required/></div></label>
        <label className="auth-field"><span>Contraseña{mode==='login'&&<button type="button" className="forgot-link" onClick={()=>comingSoon('La recuperación de contraseña')}>¿Olvidaste tu contraseña?</button>}</span><div className="auth-input"><LockKeyhole size={16}/><input type={showPassword?'text':'password'} autoComplete={mode==='login'?'current-password':'new-password'} value={password} onChange={e=>setPassword(e.target.value)} placeholder="••••••••" required minLength={8}/><button className="password-toggle" type="button" aria-label={showPassword?'Ocultar contraseña':'Mostrar contraseña'} onClick={()=>setShowPassword(v=>!v)}>{showPassword?<EyeOff size={17}/>:<Eye size={17}/>}</button></div></label>
        {error&&<p role="alert" className="auth-message error">{error}</p>}{notice&&<p role="status" className="auth-message">{notice}</p>}
        <button className="auth-submit" type="submit">{mode==='login'?'Entrar a Kudo':'Crear mi cuenta'} <ArrowRight size={17}/></button>
      </form>
      {mode==='login'&&<>
        <button type="button" className="auth-biometric" onClick={()=>comingSoon('El acceso con Face ID')}><Fingerprint size={17}/>Acceso rápido con Face ID</button>
        <div className="auth-divider"><span>o continúa con</span></div>
        <div className="auth-social"><button type="button" onClick={()=>comingSoon('El acceso con Google')}><b className="google-mark">G</b>Google</button><button type="button" onClick={()=>comingSoon('El acceso con Apple')}><b className="apple-mark">●</b>Apple</button></div>
      </>}
    </section>
    <p className="auth-security"><span>●</span> Acceso protegido · Tu privacidad importa</p>
  </section></main>
}
