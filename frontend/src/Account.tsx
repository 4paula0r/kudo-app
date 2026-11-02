import { FormEvent, useEffect, useState } from 'react'
import { CalendarDays, Globe2, Mail, Save, UserRound } from 'lucide-react'

type Profile = { id?: string; name: string; email: string; firstName?: string | null; secondName?: string | null; firstSurname?: string | null; secondSurname?: string | null; dateOfBirth?: string | null; countryOfResidence?: string | null }

type Props = {
  user: Profile | null
  onSave: (profile: Omit<Profile, 'id' | 'name'>) => Promise<Profile>
}

export default function Account({ user, onSave }: Props) {
  const [firstName, setFirstName] = useState(user?.firstName ?? user?.name ?? '')
  const [secondName, setSecondName] = useState(user?.secondName ?? '')
  const [firstSurname, setFirstSurname] = useState(user?.firstSurname ?? '')
  const [secondSurname, setSecondSurname] = useState(user?.secondSurname ?? '')
  const [dateOfBirth, setDateOfBirth] = useState(user?.dateOfBirth?.slice(0, 10) ?? '')
  const [countryOfResidence, setCountryOfResidence] = useState(user?.countryOfResidence ?? '')
  const [email, setEmail] = useState(user?.email ?? '')
  const [notice, setNotice] = useState('')
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!user) return
    setFirstName(user.firstName ?? user.name)
    setSecondName(user.secondName ?? '')
    setFirstSurname(user.firstSurname ?? '')
    setSecondSurname(user.secondSurname ?? '')
    setDateOfBirth(user.dateOfBirth?.slice(0, 10) ?? '')
    setCountryOfResidence(user.countryOfResidence ?? '')
    setEmail(user.email)
  }, [user])

  async function submit(event: FormEvent) {
    event.preventDefault()
    setSaving(true)
    setNotice('')
    setError('')
    try {
      const updated = await onSave({ firstName: firstName.trim(), secondName: secondName.trim() || null, firstSurname: firstSurname.trim(), secondSurname: secondSurname.trim() || null, dateOfBirth: dateOfBirth || null, countryOfResidence: countryOfResidence.trim() || null, email: email.trim() })
      setFirstName(updated.firstName ?? firstName.trim())
      setSecondName(updated.secondName ?? '')
      setFirstSurname(updated.firstSurname ?? '')
      setSecondSurname(updated.secondSurname ?? '')
      setDateOfBirth(updated.dateOfBirth?.slice(0, 10) ?? '')
      setCountryOfResidence(updated.countryOfResidence ?? '')
      setEmail(updated.email)
      setNotice('Tu perfil se actualizó correctamente.')
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'No se pudo actualizar el perfil.')
    } finally {
      setSaving(false)
    }
  }

  return <>
    <div className="page-title">
      <div><div className="eyebrow">TU ESPACIO PERSONAL</div><h1>Mi cuenta</h1><p>Administra tus datos personales y de contacto.</p></div>
    </div>
    <section className="account-layout">
      <div className="panel account-card">
        <div className="account-heading">
          <div className="account-avatar">{(firstName.trim().charAt(0) || 'A').toUpperCase()}</div>
          <div><h2>Información personal</h2><p>Estos datos identifican tu cuenta KUDO.</p></div>
        </div>
        <form className="account-form" onSubmit={submit}>
          <div className="account-fields">
            <label htmlFor="account-first-name">Primer nombre</label>
            <div className="account-input"><UserRound size={17}/><input id="account-first-name" value={firstName} onChange={event => setFirstName(event.target.value)} maxLength={60} required autoComplete="given-name"/></div>
            <label htmlFor="account-second-name">Segundo nombre <span>(opcional)</span></label>
            <div className="account-input"><UserRound size={17}/><input id="account-second-name" value={secondName} onChange={event => setSecondName(event.target.value)} maxLength={60} autoComplete="additional-name"/></div>
            <label htmlFor="account-first-surname">Primer apellido</label>
            <div className="account-input"><UserRound size={17}/><input id="account-first-surname" value={firstSurname} onChange={event => setFirstSurname(event.target.value)} maxLength={60} required autoComplete="family-name"/></div>
            <label htmlFor="account-second-surname">Segundo apellido <span>(opcional)</span></label>
            <div className="account-input"><UserRound size={17}/><input id="account-second-surname" value={secondSurname} onChange={event => setSecondSurname(event.target.value)} maxLength={60}/></div>
            <label htmlFor="account-birth-date">Fecha de nacimiento <span>(opcional)</span></label>
            <div className="account-input"><CalendarDays size={17}/><input id="account-birth-date" type="date" value={dateOfBirth} max={new Date().toISOString().slice(0, 10)} onChange={event => setDateOfBirth(event.target.value)} autoComplete="bday"/></div>
            <label htmlFor="account-country">País de residencia <span>(opcional)</span></label>
            <div className="account-input"><Globe2 size={17}/><input id="account-country" value={countryOfResidence} onChange={event => setCountryOfResidence(event.target.value)} maxLength={100} autoComplete="country-name" placeholder="Ej. Guatemala"/></div>
          </div>
          <label htmlFor="account-email">Correo electrónico</label>
          <div className="account-input"><Mail size={17}/><input id="account-email" type="email" value={email} onChange={event => setEmail(event.target.value)} maxLength={200} required autoComplete="email"/></div>
          {notice && <p className="account-notice" role="status">{notice}</p>}
          {error && <p className="account-error" role="alert">{error}</p>}
          <button className="primary-btn account-save" type="submit" disabled={saving}><Save size={16}/>{saving ? 'Guardando…' : 'Guardar cambios'}</button>
        </form>
      </div>
      <aside className="account-side panel"><div className="account-side-mark">K</div><h3>Tu cuenta, a tu manera</h3><p>Tu nombre completo también se mostrará en el saludo de Inicio. Los campos marcados como opcionales pueden completarse después.</p></aside>
    </section>
  </>
}
