import React,{useEffect,useState,FormEvent} from 'react'
import {NavLink,Routes,Route,Navigate,useLocation} from 'react-router-dom'
import {Home,ChartNoAxesCombined,Plus,Target,Sparkles,Bell,ArrowUpRight,ArrowDownRight,Utensils,Car,ShoppingBag,House,Heart,Plane,MoreHorizontal,Wallet,CalendarDays,Paperclip,Send,LogOut,Menu,X,TrendingUp,Pencil} from 'lucide-react'
import {request,token} from './api'
import Account from './Account'
import LoginPage from './LoginPage'
import DashboardPage from './DashboardPage'
import FinancePage from './FinancePage'

type Tx={id:string,title:string,category:string,type:'INCOME'|'EXPENSE',amount:number,date:string,paymentMethod?:string}
type Goal={id:string,name:string,target:number,saved:number,deadline:string}
type Profile={id?:string,name:string,email:string,firstName?:string|null,secondName?:string|null,firstSurname?:string|null,secondSurname?:string|null,dateOfBirth?:string|null,countryOfResidence?:string|null,age?:number|null,currency?:string,expenseCategories?:string[]}
const savedProfile=():Profile|null=>{try{return JSON.parse(localStorage.getItem('kudo-user')||'null') as Profile|null}catch{return null}}
const money=(n:number)=>new Intl.NumberFormat('es-GT',{style:'currency',currency:localStorage.getItem('kudo-currency')||'GTQ'}).format(n)
const currencyCode=()=>localStorage.getItem('kudo-currency')||'GTQ'
const currencySymbol=()=>({GTQ:'Q',USD:'$',EUR:'€'}[currencyCode()]||'Q')

const nav=[['/','Inicio',Home],['/finanzas','Finanzas',ChartNoAxesCombined],['/transaccion','Añadir',Plus],['/metas','Metas',Target],['/kudo-ai','Kudo AI',Sparkles]] as const
function App(){
  const location=useLocation()
  const [logged,setLogged]=useState(!!token())
  const [user,setUser]=useState<Profile|null>(()=>savedProfile())
  const [tx,setTx]=useState<Tx[]>([])
  const [goals,setGoals]=useState<Goal[]>([])
  const [menu,setMenu]=useState(false)

  useEffect(()=>{
    if(!token()) return
    const loadTransactions=async()=>{const all:Tx[]=[];let page=1;let pages=1;do{const d=await request<{transactions:Tx[],pagination:{pages:number}}>(`/transactions?page=${page}&limit=100`);all.push(...d.transactions);pages=d.pagination.pages;page+=1}while(page<=pages);setTx(all)}
    loadTransactions().catch(()=>{})
    request<{goals:Goal[]}>('/goals').then(d=>setGoals(d.goals)).catch(()=>{})
    if(location.pathname==='/cuenta') request<{user:Profile}>('/auth/me').then(d=>{setUser(d.user);localStorage.setItem('kudo-user',JSON.stringify(d.user));localStorage.setItem('kudo-currency',d.user.currency||'GTQ')}).catch(()=>{})
  },[logged,location.pathname])

  useEffect(()=>{
    const syncProfile=()=>{setUser(savedProfile());setLogged(!!token())}
    const onAuthMessage=(event:MessageEvent)=>{if(event.origin!==window.location.origin||event.data?.type!=='kudo-auth')return;const profile=event.data.user as Profile|undefined;if(profile?.name){setUser(profile);setLogged(true)}}
    window.addEventListener('storage',syncProfile);window.addEventListener('message',onAuthMessage)
    return()=>{window.removeEventListener('storage',syncProfile);window.removeEventListener('message',onAuthMessage)}
  },[])

  const addTx=async(item:Omit<Tx,'id'>)=>{const d=await request<{transaction:Tx}>('/transactions',{method:'POST',body:JSON.stringify(item)});setTx(v=>[d.transaction,...v])}
  const updateTx=async(id:string,item:Partial<Omit<Tx,'id'>>)=>{const d=await request<{transaction:Tx}>(`/transactions/${id}`,{method:'PATCH',body:JSON.stringify(item)});setTx(v=>v.map(t=>t.id===id?d.transaction:t));return d.transaction}
  const addGoal=async(name:string,target:number)=>{const d=await request<{goal:Goal}>('/goals',{method:'POST',body:JSON.stringify({name,target,deadline:new Date(Date.now()+180*864e5).toISOString()})});setGoals(v=>[d.goal,...v])}
  const contribute=async(id:string,amount:number)=>{const d=await request<{goal:Goal}>(`/goals/${id}/contributions`,{method:'POST',body:JSON.stringify({amount})});setGoals(v=>v.map(g=>g.id===id?d.goal:g))}

  return <Routes>
    <Route path="/login" element={<LoginPage onLogin={profile=>{setUser(profile);setLogged(true)}}/>}/>
    <Route path="/*" element={logged?<div className={`shell ${menu?'menu-open':''}`}>
      <aside className={`sidebar ${menu?'open':''}`}>
        <div className="brand"><div className="brand-mark">k</div><span>KUDO<small>FINANZAS PERSONALES</small></span><button className="close-menu" onClick={()=>setMenu(false)}><X/></button></div>
        <div className="nav-label">MENÚ PRINCIPAL</div>
        <nav>{nav.map(([to,label,Icon])=><NavLink end={to==='/'} onClick={()=>setMenu(false)} className={({isActive})=>`nav-link ${isActive?'active':''}`} to={to} key={to}><Icon size={19}/><span>{label}</span>{to==='/transaccion'&&<b className="nav-plus">+</b>}</NavLink>)}</nav>
        <div className="sidebar-bottom"><div className="help-card"><Sparkles size={18}/><b>Un pequeño paso<br/>hace la diferencia.</b><span>Vas por buen camino ✨</span></div>
          <div className="user-row"><NavLink to="/cuenta" className="user-profile"><div className="avatar">{(user?.name||'A').charAt(0).toUpperCase()}</div><span><b>{user?.name||'Mi cuenta'}</b><small>Mi cuenta</small></span></NavLink>
            <button className="logout-button" aria-label="Cerrar sesión" title="Cerrar sesión" onClick={()=>{localStorage.removeItem('kudo-token');localStorage.removeItem('kudo-user');localStorage.removeItem('kudo-currency');setUser(null);setLogged(false)}}><LogOut size={17}/></button>
          </div>
        </div>
      </aside>
      {menu&&<button className="scrim" onClick={()=>setMenu(false)}/>}
      <main className="main"><header className="topbar"><button className="mobile-menu" onClick={()=>setMenu(true)}><Menu/></button><div className="crumb">Mi espacio <span>/</span> <b>{location.pathname==='/cuenta'?'Mi cuenta':nav.find(n=>n[0]===location.pathname)?.[1]||'Inicio'}</b></div><div className="top-actions"><button className="icon-btn notification" aria-label="Notificaciones"><Bell size={19}/><i/></button><NavLink to="/cuenta" className="profile-mini account-link" aria-label="Abrir mi cuenta"><div className="avatar">{(user?.name||'A').charAt(0).toUpperCase()}</div><span><b>{user?.name||'Mi cuenta'}</b><small>Mi cuenta</small></span></NavLink></div></header>
        <div className="content"><Routes>
          <Route path="/" element={<DashboardPage transactions={tx} goals={goals} name={user?.name||'ahí'} currencyCode={user?.currency||currencyCode()}/>}/>
          <Route path="/finanzas" element={<FinancePage transactions={tx} currencyCode={user?.currency||currencyCode()}/>}/>
          <Route path="/transaccion" element={<NewTransaction addTx={addTx}/>}/>
          <Route path="/movimientos" element={<Finances tx={tx} updateTx={updateTx}/>}/>
          <Route path="/metas" element={<Goals goals={goals} addGoal={addGoal} contribute={id=>contribute(id,100)}/>}/>
          <Route path="/cuenta" element={<Account user={user} onSave={async(profile)=>{const d=await request<{user:Profile}>('/auth/me',{method:'PATCH',body:JSON.stringify(profile)});setUser(d.user);localStorage.setItem('kudo-user',JSON.stringify(d.user));return d.user}}/>}/>
          <Route path="/kudo-ai" element={<KudoAI tx={tx} name={user?.name?.trim().split(/\s+/)[0]||'ahí'}/>}/>
        </Routes></div><footer>Una plataforma para ayudarte a registrar tus gastos</footer>
      </main>
      <NavLink to="/transaccion" className="global-fab" aria-label="Registrar nuevo movimiento" title="Registrar nuevo movimiento"><Plus size={21}/><span>Nuevo movimiento</span></NavLink>
    </div>:<Navigate to="/login" replace/>}/>
  </Routes>
}

function PageTitle({eyebrow,title,sub,action}:{eyebrow:string,title:string,sub:string,action?:React.ReactNode}){return <div className="page-title"><div><div className="eyebrow">{eyebrow}</div><h1>{title}</h1><p>{sub}</p></div>{action}</div>}
function TransactionList({tx}:{tx:Tx[]}){const icons:Record<string,any>={Comida:Utensils,Transporte:Car,Compras:ShoppingBag,Hogar:House,Salud:Heart,Viajes:Plane};return <div className="tx-list">{tx.slice(0,8).map(t=>{const Icon=icons[t.category]||MoreHorizontal;return <article className="tx-row" key={t.id}><div className={`tx-icon ${t.type==='INCOME'?'income':''}`}><Icon size={18}/></div><div className="tx-name"><b>{t.title}</b><span>{t.category} · {new Date(t.date).toLocaleDateString('es-GT',{day:'numeric',month:'short'})}</span></div><strong className={t.type==='INCOME'?'green':'amount'}>{t.type==='INCOME'?'+':'−'}{money(t.amount)}</strong></article>})}{tx.length===0&&<div className="empty">Aún no hay movimientos. ¡Registra el primero!</div>}</div>}
function Dashboard({tx}:{tx:Tx[]}){const [period,setPeriod]=useState('Este mes');const income=tx.filter(t=>t.type==='INCOME').reduce((a,t)=>a+t.amount,2500),expenses=tx.filter(t=>t.type==='EXPENSE').reduce((a,t)=>a+t.amount,0)+1460;return <><PageTitle eyebrow="MARTES, 20 DE OCTUBRE" title="Buenos días, Andrea 👋" sub="Un vistazo claro a cómo va tu dinero." action={<select className="period" value={period} onChange={e=>setPeriod(e.target.value)}><option>Este mes</option><option>Esta semana</option><option>Este año</option></select>}/><section className="summary-grid"><div className="balance-card"><div className="balance-top"><span>DINERO DISPONIBLE</span><span className="balance-icon"><Wallet size={19}/></span></div><h2>{money(4850)}</h2><div className="balance-foot"><span><i/>Tu balance está al día</span><span>•••• 2480</span></div><div className="balance-pattern"/></div><div className="metric-card"><div className="metric-heading"><span>Ingresos del mes</span><span className="metric-icon green-bg"><ArrowDownRight size={18}/></span></div><b>{money(income)}</b><small className="positive"><TrendingUp size={13}/> Buen ritmo este mes</small><div className="sparkline greenline"><i/><i/><i/><i/><i/><i/><i/></div></div><div className="metric-card"><div className="metric-heading"><span>Gastos del mes</span><span className="metric-icon coral-bg"><ArrowUpRight size={18}/></span></div><b>{money(expenses)}</b><small className="neutral">de tu presupuesto mensual</small><div className="progress"><i style={{width:'64%'}}/></div><small className="progress-note">64% utilizado</small></div><div className="mini-metric"><span className="metric-icon lilac-bg"><Target size={18}/></span><div><small>Ahorro acumulado</small><b>Q 650.00</b></div><span className="tiny-trend">↗</span></div></section><section className="insight-banner"><div className="spark-badge"><Sparkles size={20}/></div><div><span className="insight-label">TU RESUMEN KUDO AI</span><h3>¡Vas muy bien, Andrea!</h3><p>Comida representa el 42% de tus gastos. Cocinar en casa un día extra podría ayudarte a ahorrar esta semana.</p></div><NavLink to="/kudo-ai">Ver análisis <ArrowUpRight size={15}/></NavLink></section><div className="dashboard-grid"><section className="panel spending-panel"><div className="panel-heading"><div><h3>¿A dónde va tu dinero?</h3><p>Distribución de gastos por categoría</p></div><button className="dots">···</button></div><div className="spending-body"><div className="donut"><div><b>Q 1,850</b><small>Total gastado</small></div></div><div className="legend"><div><i className="dot purple"/><span>Comida</span><b>42%</b></div><div><i className="dot blue"/><span>Transporte</span><b>26%</b></div><div><i className="dot orange"/><span>Entretenimiento</span><b>18%</b></div><div><i className="dot pink"/><span>Hogar</span><b>14%</b></div></div></div></section><section className="panel recent-panel"><div className="panel-heading"><div><h3>Movimientos recientes</h3><p>Lo último que ha pasado</p></div><NavLink className="text-link" to="/finanzas">Ver todos <ArrowUpRight size={14}/></NavLink></div><TransactionList tx={tx}/></section></div><div className="streak"><div className="streak-icon">✦</div><div><b>Tu constancia cuenta</b><span>Has revisado tus finanzas hoy. ¡Sigue así!</span></div><div className="streak-days"><b>3</b><span>días seguidos</span></div><div className="fire">🔥</div></div></>}

function Finances({tx,updateTx}:{tx:Tx[],updateTx:(id:string,item:Partial<Omit<Tx,'id'>>)=>Promise<Tx>}){
  const[filter,setFilter]=useState('Todos')
  const now=new Date()
  const monthTx=tx.filter(t=>{const d=new Date(t.date);return d.getFullYear()===now.getFullYear()&&d.getMonth()===now.getMonth()})
  const income=monthTx.filter(t=>t.type==='INCOME').reduce((sum,t)=>sum+t.amount,0)
  const expenses=monthTx.filter(t=>t.type==='EXPENSE').reduce((sum,t)=>sum+t.amount,0)
  const visible=tx.filter(t=>filter==='Todos'||(filter==='Ingresos'?t.type==='INCOME':t.type==='EXPENSE'))
  return <><PageTitle eyebrow="TU HISTORIAL" title="Mis finanzas" sub="Consulta y corrige tus movimientos." action={<NavLink to="/transaccion" className="primary-btn"><Plus size={17}/> Nuevo movimiento</NavLink>}/><section className="stats-row"><div className="stat-card"><span>Balance del mes</span><b>{money(income-expenses)}</b><small>Ingresos menos gastos</small></div><div className="stat-card"><span>Ingresos</span><b className="green">{money(income)}</b><small>Este mes</small></div><div className="stat-card"><span>Gastos</span><b>{money(expenses)}</b><small>Este mes</small></div></section><section className="panel history-panel"><div className="panel-heading"><div><h3>Todos tus movimientos</h3><p>Toca “Editar” si necesitas corregir un dato.</p></div><select className="period" aria-label="Filtrar por mes"><option>{new Intl.DateTimeFormat('es-GT',{month:'long',year:'numeric'}).format(now)}</option></select></div><div className="filter-tabs">{['Todos','Gastos','Ingresos'].map(x=><button type="button" className={filter===x?'selected':''} onClick={()=>setFilter(x)} key={x}>{x}</button>)}</div><TransactionEditor tx={visible} onUpdate={updateTx}/></section></>
}

function TransactionEditor({tx,onUpdate}:{tx:Tx[],onUpdate:(id:string,item:Partial<Omit<Tx,'id'>>)=>Promise<Tx>}){
  const [editing,setEditing]=useState<Tx|null>(null)
  const [draft,setDraft]=useState({title:'',category:'Comida',type:'EXPENSE' as Tx['type'],amount:'',date:'',paymentMethod:'Débito'})
  const [saving,setSaving]=useState(false)
  const [error,setError]=useState('')
  const [notice,setNotice]=useState('')
  const categories=['Comida','Transporte','Hogar','Ocio','Compras','Salud','Viajes','Ahorros','Suscripciones','Gastos personales','Otros']
  const begin=(t:Tx)=>{setEditing(t);setError('');setDraft({title:t.title,category:t.category,type:t.type,amount:String(t.amount),date:new Date(t.date).toISOString().slice(0,10),paymentMethod:t.paymentMethod||'Débito'})}
  const close=()=>{setEditing(null);setError('')}
  const submit=async(e:FormEvent)=>{
    e.preventDefault();if(!editing)return;setSaving(true);setError('')
    try{await onUpdate(editing.id,{title:draft.title.trim()||draft.category,category:draft.category,type:draft.type,amount:Number(draft.amount),date:new Date(`${draft.date}T12:00:00`).toISOString(),paymentMethod:draft.paymentMethod});setNotice('Movimiento actualizado.');close()}
    catch(err){setError(err instanceof Error?err.message:'No se pudo actualizar el movimiento.')}
    finally{setSaving(false)}
  }
  return <>
    <div className="tx-list editable-tx-list">{tx.slice(0,100).map(t=>{const icons:Record<string,any>={Comida:Utensils,Transporte:Car,Compras:ShoppingBag,Hogar:House,Salud:Heart,Viajes:Plane};const Icon=icons[t.category]||MoreHorizontal;return <article className="tx-row" key={t.id}><div className={`tx-icon ${t.type==='INCOME'?'income':''}`}><Icon size={18}/></div><div className="tx-name"><b>{t.title}</b><span>{t.category} · {new Date(t.date).toLocaleDateString('es-GT',{day:'numeric',month:'short'})}</span></div><strong className={t.type==='INCOME'?'green':'amount'}>{t.type==='INCOME'?'+':'−'}{money(t.amount)}</strong><button type="button" className="edit-tx-button" onClick={()=>begin(t)} aria-label={`Editar ${t.title}`}><Pencil size={15}/><span>Editar</span></button></article>})}{tx.length===0&&<div className="empty">Aún no hay movimientos. ¡Registra el primero!</div>}</div>
    {notice&&<p className="success-msg" role="status">{notice}</p>}
    {editing&&<div className="edit-overlay" onMouseDown={e=>{if(e.target===e.currentTarget)close()}}><section className="edit-tx-dialog" role="dialog" aria-modal="true" aria-labelledby="edit-tx-title"><div className="edit-tx-heading"><div><span className="eyebrow">TUS FINANZAS</span><h2 id="edit-tx-title">Editar movimiento</h2></div><button type="button" className="edit-close" onClick={close} aria-label="Cerrar"><X size={19}/></button></div><form onSubmit={submit}>
      <div className="edit-type-toggle"><button type="button" className={draft.type==='EXPENSE'?'selected expense':''} onClick={()=>setDraft(v=>({...v,type:'EXPENSE'}))}><ArrowUpRight size={16}/> Gasto</button><button type="button" className={draft.type==='INCOME'?'selected income':''} onClick={()=>setDraft(v=>({...v,type:'INCOME'}))}><ArrowDownRight size={16}/> Ingreso</button></div>
      <label className="edit-field">Descripción<input value={draft.title} onChange={e=>setDraft(v=>({...v,title:e.target.value}))} maxLength={100} required/></label>
      <div className="edit-form-row"><label className="edit-field">Monto<input type="number" min="0.01" step="0.01" value={draft.amount} onChange={e=>setDraft(v=>({...v,amount:e.target.value}))} required/></label><label className="edit-field">Categoría<select value={draft.category} onChange={e=>setDraft(v=>({...v,category:e.target.value}))}>{[...new Set([...categories,draft.category])].map(c=><option key={c}>{c}</option>)}</select></label></div>
      <div className="edit-form-row"><label className="edit-field">Fecha<input type="date" value={draft.date} onChange={e=>setDraft(v=>({...v,date:e.target.value}))} required/></label><label className="edit-field">Método de pago<select value={draft.paymentMethod} onChange={e=>setDraft(v=>({...v,paymentMethod:e.target.value}))}><option>Débito</option><option>Crédito</option><option>Efectivo</option><option>Apple Pay</option></select></label></div>
      {error&&<p className="account-error" role="alert">{error}</p>}<div className="edit-actions"><button type="button" className="edit-cancel" onClick={close}>Cancelar</button><button className="primary-btn" disabled={saving}>{saving?'Guardando…':'Guardar cambios'}</button></div>
    </form></section></div>}
  </>
}
function NewTransaction({addTx}:{addTx:(t:Omit<Tx,'id'>)=>Promise<void>}){
  const [typ,setTyp]=useState<'EXPENSE'|'INCOME'>('EXPENSE')
  const [amount,setAmount]=useState('')
  const [category,setCategory]=useState('Comida')
  const [title,setTitle]=useState('')
  const [payment,setPayment]=useState('Débito')
  const [date,setDate]=useState(()=>{const now=new Date();return `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')}`})
  const [notice,setNotice]=useState('')
  const [error,setError]=useState('')
  const [saving,setSaving]=useState(false)
  const configuredCats=savedProfile()?.expenseCategories||[]
  const cats=[...new Set([...configuredCats,'Comida','Transporte','Hogar','Ocio','Compras','Salud','Viajes','Ahorros','Suscripciones','Gastos personales','Otros'])]
  const quickCats=cats.slice(0,4)
  const icons:Record<string,any>={Comida:Utensils,Transporte:Car,Hogar:House,Ocio:Sparkles,Compras:ShoppingBag,Salud:Heart,Viajes:Plane,Ahorros:Wallet,Otros:MoreHorizontal}
  const submit=async(e:FormEvent)=>{
    e.preventDefault();setError('');setNotice('');setSaving(true)
    try{
      await addTx({title:title.trim()||category,category,type:typ,amount:Number(amount),date:new Date(`${date}T12:00:00`).toISOString(),paymentMethod:payment})
      setNotice('Movimiento registrado. Ya puedes verlo en tus finanzas.')
      setAmount('');setTitle('')
    }catch(err){setError(err instanceof Error?err.message:'No se pudo guardar el movimiento. Intenta de nuevo.')}
    finally{setSaving(false)}
  }
  return <>
    <PageTitle eyebrow="REGISTRO RÁPIDO" title="Nuevo movimiento" sub="¿Qué quieres registrar hoy?"/>
    <form className="transaction-form intuitive-transaction" onSubmit={submit}>
      <section className="panel form-panel">
        <div className="form-type" aria-label="Tipo de movimiento">
          <button type="button" className={typ==='EXPENSE'?'on':''} onClick={()=>setTyp('EXPENSE')}><ArrowUpRight size={17}/> Gasto</button>
          <button type="button" className={typ==='INCOME'?'on income-on':''} onClick={()=>setTyp('INCOME')}><ArrowDownRight size={17}/> Ingreso</button>
        </div>
        <label className="form-label" htmlFor="movement-amount">Monto <small>{currencyCode()}</small></label>
        <div className="amount-input movement-amount"><span>{currencySymbol()}</span><input id="movement-amount" type="number" inputMode="decimal" min="0.01" step="0.01" placeholder="0.00" value={amount} onChange={e=>setAmount(e.target.value)} required/></div>
        <label className="form-label">Categoría</label>
        <div className="quick-categories" aria-label="Categorías frecuentes">
          {quickCats.map(c=>{const Icon=icons[c]||MoreHorizontal;return <button type="button" className={`quick-category ${category===c?'chosen':''}`} onClick={()=>setCategory(c)} key={c}><Icon size={16}/><span>{c}</span></button>})}
          <select aria-label="Más categorías" value={quickCats.includes(category)?'':category} onChange={e=>e.target.value&&setCategory(e.target.value)}><option value="">Más categorías</option>{cats.filter(c=>!quickCats.includes(c)).map(c=><option key={c} value={c}>{c}</option>)}</select>
        </div>
        <label className="form-label" htmlFor="concept">Descripción <small>OPCIONAL</small></label>
        <input id="concept" className="text-input" placeholder="Ej. Almuerzo, salario, transporte…" value={title} onChange={e=>setTitle(e.target.value)}/>
        <details className="movement-details">
          <summary>Agregar fecha y método de pago</summary>
          <div className="two-fields">
            <div><label className="form-label" htmlFor="date">Fecha</label><div className="input-icon"><CalendarDays size={17}/><input id="date" type="date" value={date} onChange={e=>setDate(e.target.value)} required/></div></div>
            <div><label className="form-label" htmlFor="payment">Método de pago</label><select id="payment" className="text-input" value={payment} onChange={e=>setPayment(e.target.value)}><option>Débito</option><option>Crédito</option><option>Efectivo</option><option>Apple Pay</option></select></div>
          </div>
        </details>
        {notice&&<div className="success-msg" role="status">{notice}</div>}
        {error&&<div className="account-error" role="alert">{error}</div>}
        <button className="primary-btn save-btn" type="submit" disabled={saving}>{saving?'Guardando…':'Registrar movimiento'} <Plus size={17}/></button>
      </section>
      <aside className="form-aside"><div className="panel aside-tip"><div className="spark-badge"><Sparkles size={19}/></div><h3>Un registro rápido<br/>te da más claridad.</h3><p>Elige el tipo y monto; puedes añadir más detalles cuando los necesites.</p><div className="aside-art">✦</div></div><div className="aside-note"><span>🔒</span><p>Tus datos financieros están protegidos.</p></div></aside>
    </form>
  </>
}function Goals({goals,addGoal,contribute}:{goals:Goal[],addGoal:(name:string,target:number)=>Promise<void>,contribute:(id:string)=>Promise<void>}){
  const [name,setName]=useState('')
  const [target,setTarget]=useState('')
  const [feedback,setFeedback]=useState('')
  const [busy,setBusy]=useState(false)
  const create=async(e:FormEvent)=>{
    e.preventDefault();setFeedback('')
    try{await addGoal(name.trim(),Number(target));setFeedback('¡Meta creada! Ya puedes seguir tu progreso.');setName('');setTarget('')}
    catch(err){setFeedback(err instanceof Error?err.message:'No se pudo crear la meta.')}
  }
  const addContribution=async(id:string)=>{
    setFeedback('');setBusy(true)
    try{await contribute(id);setFeedback('Aporte de Q 100 agregado a tu meta.')}
    catch(err){setFeedback(err instanceof Error?err.message:'No se pudo agregar el aporte.')}
    finally{setBusy(false)}
  }
  return <div className="goals-page">
    <header className="goals-heading"><span className="eyebrow">AHORRA PARA LO QUE TE IMPORTA</span><h1>Mis metas</h1><p>Define cuánto necesitas y celebra cada avance.</p></header>
    <form className="goal-create-card" onSubmit={create}>
      <div className="goal-create-icon"><Target size={22}/></div>
      <div className="goal-create-copy"><b>Crea una meta de ahorro</b><span>Por ejemplo: un viaje, una computadora o un fondo de emergencia.</span></div>
      <label><span>¿Para qué estás ahorrando?</span><input placeholder="Ej. Viaje a Antigua" value={name} onChange={e=>setName(e.target.value)} required maxLength={60}/></label>
      <label><span>¿Cuánto necesitas?</span><div className="goal-target-input"><b>{currencySymbol()}</b><input aria-label="Monto objetivo" placeholder="0.00" type="number" min="1" step="0.01" value={target} onChange={e=>setTarget(e.target.value)} required/></div></label>
      <button className="primary-btn" type="submit"><Plus size={17}/> Crear meta</button>
    </form>
    {feedback&&<p className="success-msg goal-feedback" role="status">{feedback}</p>}
    <div className="goal-overview"><div><Target size={19}/><span><b>{goals.length}</b> {goals.length===1?'meta activa':'metas activas'}</span></div><div><small>Total ahorrado</small><b>{money(goals.reduce((sum,g)=>sum+g.saved,0))}</b></div></div>
    {goals.length>0?<div className="goals-grid">{goals.map((g,i)=>{const progress=Math.min(100,Math.round(g.saved/g.target*100));return <article className={`goal-card goal-${i%3}`} key={g.id}>
      <div className="goal-head"><span className="goal-icon"><Target size={20}/></span><span className="goal-tag">{progress>=100?'¡META LOGRADA!':'EN PROGRESO'}</span></div>
      <h3>{g.name}</h3><p>Vas avanzando paso a paso.</p>
      <div className="goal-progress-copy"><span>Llevas ahorrado</span><b>{progress}%</b></div>
      <div className="goal-progress"><i style={{width:`${progress}%`}}/></div>
      <div className="goal-amounts"><span>{money(g.saved)} <small>ahorrados</small></span><span>{money(g.target)} <small>objetivo</small></span></div>
      <button className="contribute" disabled={busy||progress>=100} onClick={()=>addContribution(g.id)}><Plus size={15}/> Agregar Q 100</button>
    </article>})}</div>:<section className="goal-empty"><div className="goal-empty-icon"><Sparkles size={23}/></div><h2>Tu primera meta empieza aquí</h2><p>Escribe algo que quieras lograr y el monto. KUDO te ayudará a visualizar tu avance.</p></section>}
  </div>
}function KudoAI({tx,name}:{tx:Tx[],name:string}) {
  const [messages,setMessages]=useState<{role:'ai'|'user';text:string}[]>([{role:'ai',text:`¡Hola, ${name}! 👋 Soy Kudo AI. Puedo analizar tus movimientos y ayudarte con ahorro, gastos, saldo o metas.`}]);
  const [input,setInput]=useState('');
  const answer=(question:string)=>{
    const q=question.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
    const now=new Date();
    const monthTx=tx.filter(t=>{const d=new Date(t.date);return d.getFullYear()===now.getFullYear()&&d.getMonth()===now.getMonth()});
    const income=monthTx.filter(t=>t.type==='INCOME').reduce((sum,t)=>sum+t.amount,0);
    const expenses=monthTx.filter(t=>t.type==='EXPENSE').reduce((sum,t)=>sum+t.amount,0);
    const balance=income-expenses;
    const byCategory=monthTx.filter(t=>t.type==='EXPENSE').reduce<Record<string,number>>((acc,t)=>{acc[t.category]=(acc[t.category]||0)+t.amount;return acc},{});
    const ranked=Object.entries(byCategory).sort((a,b)=>b[1]-a[1]);
    const top=ranked[0];
    const categoryQuery=Object.keys(byCategory).find(category=>q.includes(category.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase()));
    const focus: [string,number] | undefined = categoryQuery ? [categoryQuery,byCategory[categoryQuery]] : top;
    if(monthTx.length===0) return 'Aún no hay movimientos registrados este mes para hacer un análisis personalizado. Registra tus ingresos y gastos y luego pregúntame por tu saldo, tus categorías o un plan de ahorro.';
    if(/viaj|vacacion|meta|objetivo/.test(q)) return `Sobre tu viaje: este mes tienes ${money(income)} en ingresos registrados y ${money(expenses)} en gastos, para un saldo neto registrado de ${money(balance)}. Para calcular un plan realista, dime cuánto cuesta el viaje y cuándo necesitas tener ese dinero.`;
    if(/ahorr|guardar|apartar/.test(q)) {
      if(top) { const suggested=top[1]*0.1; return `Este mes llevas ${money(expenses)} en gastos. Tu categoría más alta es ${top[0]} con ${money(top[1])}. Una meta inicial sería reducirla 10% y apartar ${money(suggested)} este mes. Si me dices cuánto quieres ahorrar y para cuándo, calculo el ritmo semanal.`; }
      return `Tu saldo neto registrado este mes es ${money(balance)}. Puedes empezar apartando una cantidad fija cada semana. Dime cuánto quieres ahorrar y la fecha objetivo para armar un plan.`;
    }
    if(/ingres|saldo|balance|disponible/.test(q)) return `Este mes registras ${money(income)} en ingresos y ${money(expenses)} en gastos. La diferencia entre esos movimientos es ${money(balance)}. Es el saldo de lo que has registrado aquí, no necesariamente el saldo de tu cuenta bancaria.`;
    if(/categoria|gast|analiz|donde|presupuest|limite|cuanto|comida|transporte|compras|hogar|salud|viajes|ocio/.test(q)) {
      if(!focus) return `Este mes registras ${money(expenses)} en gastos. Aún no hay categorías suficientes para comparar; al registrar más movimientos podré señalar dónde se concentra el gasto.`;
      const percent=expenses>0?Math.round(focus[1]/expenses*100):0;
      const qualifier=categoryQuery?`En ${focus[0]} llevas ${money(focus[1])} (${percent}% de tus gastos).`:`Tu categoría con más gasto es ${focus[0]}: ${money(focus[1])} (${percent}%).`;
      return `Este mes registras ${money(expenses)} en gastos. ${qualifier} Un límite de ${money(focus[1]*0.9)} para el próximo mes te permitiría reducir esa categoría alrededor de 10%.`;
    }    return `Leí tu pregunta: “${question}”. Este mes llevas ${money(income)} en ingresos y ${money(expenses)} en gastos. Puedo analizar tu saldo, tus categorías de gasto o ayudarte a calcular una meta de ahorro.`;
  };
  const send=(e:FormEvent)=>{e.preventDefault();const q=input.trim();if(!q)return;setMessages(v=>[...v,{role:'user',text:q},{role:'ai',text:answer(q)}]);setInput('')};
  return <><PageTitle eyebrow="TU COMPAÑERO FINANCIERO" title="Kudo AI ✨" sub="Ideas claras para sentirte bien con tu dinero."/><div className="privacy-note" role="note">🔒 Protegemos tus datos y cuidamos tu privacidad.</div><div className="ai-layout"><section className="panel chat-panel"><div className="chat-head"><div className="spark-badge"><Sparkles size={19}/></div><div><b>Tu espacio con Kudo</b><small><i/> Analiza tus movimientos registrados</small></div></div><div className="chat-messages">{messages.map((m,i)=><div className={`message ${m.role}`} key={i}><div className="message-avatar">{m.role==='ai'?'✦':name.charAt(0).toUpperCase()}</div><p>{m.text}</p></div>)}</div><div className="suggestions">{['Analiza mis gastos','¿Cómo puedo ahorrar?','¿Cuál es mi saldo?'].map(s=><button onClick={()=>setInput(s)} key={s}>{s}</button>)}</div><form className="chat-input" onSubmit={send}><input placeholder="Escribe tu pregunta..." value={input} onChange={e=>setInput(e.target.value)}/><button aria-label="Enviar"><Send size={17}/></button></form><small className="ai-disclaimer">Kudo AI ofrece orientación general basada en tus movimientos registrados. No reemplaza asesoría financiera profesional.</small></section><aside className="ai-side"><div className="panel ai-side-card"><span className="insight-label">TUS MOVIMIENTOS REGISTRADOS</span><h3>Respuestas basadas en tus datos</h3><p>El análisis considera tus movimientos del mes actual. Registra ingresos y gastos para obtener recomendaciones más útiles.</p><div className="ai-meter"><span>Movimientos este mes</span><b>{tx.filter(t=>{const d=new Date(t.date),n=new Date();return d.getFullYear()===n.getFullYear()&&d.getMonth()===n.getMonth()}).length}</b><div><i style={{width:`${Math.min(100,tx.length?100:0)}%`}}/></div></div></div></aside></div></>}

export default App
