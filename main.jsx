import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom/client'
import { supabase } from './supabaseClient.js'
import App from './claro-legal-divorce.jsx'

const NAVY = '#1B2A4E'
const CREAM = '#FAF7F2'
const GOLD = '#C9A961'
const INK = '#2C2416'
const FONT = 'Palatino, "Palatino Linotype", "Book Antiqua", Georgia, serif'

const STRINGS = {
  es: {
    welcome: 'Bienvenido a Claro Legal',
    subtitle: 'Inicia sesión o crea una cuenta para comenzar tu divorcio sin oposición.',
    signInTab: 'Iniciar sesión',
    signUpTab: 'Crear cuenta',
    forgotTab: 'Recuperar',
    email: 'Correo electrónico',
    password: 'Contraseña',
    emailPlaceholder: 'tu@correo.com',
    passwordPlaceholder: 'Tu contraseña',
    signInButton: 'Iniciar sesión',
    signUpButton: 'Crear cuenta',
    forgotButton: 'Enviar instrucciones',
    forgotLink: '¿Olvidaste tu contraseña?',
    backLink: 'Volver',
    loading: 'Cargando…',
    busy: 'Procesando…',
    confirmEmail: 'Revisa tu correo para confirmar tu cuenta antes de iniciar sesión.',
    resetSent: 'Te enviamos un correo con instrucciones para restablecer tu contraseña.',
    footer: 'Asistencia para divorcios sin oposición en NY',
    error_invalid_credentials: 'Correo o contraseña incorrectos.',
    error_email_taken: 'Ese correo ya tiene una cuenta. Inicia sesión.',
    error_weak_password: 'La contraseña debe tener al menos 6 caracteres.',
    error_invalid_email: 'Correo inválido.',
    error_generic: 'Algo salió mal. Inténtalo de nuevo.',
  },
  en: {
    welcome: 'Welcome to Claro Legal',
    subtitle: 'Sign in or create an account to begin your uncontested divorce.',
    signInTab: 'Sign in',
    signUpTab: 'Create account',
    forgotTab: 'Recover',
    email: 'Email address',
    password: 'Password',
    emailPlaceholder: 'your@email.com',
    passwordPlaceholder: 'Your password',
    signInButton: 'Sign in',
    signUpButton: 'Create account',
    forgotButton: 'Send instructions',
    forgotLink: 'Forgot your password?',
    backLink: 'Back',
    loading: 'Loading…',
    busy: 'Working…',
    confirmEmail: 'Check your email to confirm your account before signing in.',
    resetSent: 'We sent you an email with instructions to reset your password.',
    footer: 'NY uncontested divorce assistance',
    error_invalid_credentials: 'Incorrect email or password.',
    error_email_taken: 'That email already has an account. Try signing in.',
    error_weak_password: 'Password must be at least 6 characters.',
    error_invalid_email: 'Invalid email address.',
    error_generic: 'Something went wrong. Please try again.',
  },
}

function mapError(rawMessage, lang) {
  const t = STRINGS[lang]
  if (!rawMessage) return t.error_generic
  const m = rawMessage.toLowerCase()
  if (m.includes('invalid login') || m.includes('invalid credentials')) return t.error_invalid_credentials
  if (m.includes('already registered') || m.includes('user already')) return t.error_email_taken
  if (m.includes('password') && (m.includes('short') || m.includes('6 characters'))) return t.error_weak_password
  if (m.includes('invalid email')) return t.error_invalid_email
  return rawMessage
}

function AuthScreen({ lang, setLang }) {
  const t = STRINGS[lang]
  const [mode, setMode] = useState('signIn')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [successMsg, setSuccessMsg] = useState('')

  function clearMessages() { setErrorMsg(''); setSuccessMsg('') }

  async function handleSubmit(e) {
    e.preventDefault()
    clearMessages()
    setBusy(true)
    try {
      if (mode === 'signIn') {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) setErrorMsg(mapError(error.message, lang))
      } else if (mode === 'signUp') {
        const { error } = await supabase.auth.signUp({ email, password })
        if (error) setErrorMsg(mapError(error.message, lang))
        else setSuccessMsg(t.confirmEmail)
      } else if (mode === 'forgot') {
        const { error } = await supabase.auth.resetPasswordForEmail(email)
        if (error) setErrorMsg(mapError(error.message, lang))
        else setSuccessMsg(t.resetSent)
      }
    } catch (err) {
      setErrorMsg(mapError(err && err.message, lang))
    } finally {
      setBusy(false)
    }
  }

  const tabs = [
    { id: 'signIn', label: t.signInTab },
    { id: 'signUp', label: t.signUpTab },
  ]

  return (
    <div style={{ minHeight: '100vh', background: CREAM, display: 'flex', flexDirection: 'column', fontFamily: FONT, color: INK }}>
      <header style={{ background: NAVY, color: CREAM, padding: '18px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 2px 6px rgba(0,0,0,0.08)', flexWrap: 'wrap', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 24, fontWeight: 700, letterSpacing: 0.5 }}>Claro Legal</span>
          <span style={{ fontSize: 12, color: GOLD, letterSpacing: 1, textTransform: 'uppercase' }}>NY Uncontested Divorce</span>
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          <button type="button" onClick={() => setLang('es')} style={langBtnStyle(lang === 'es')}>ES</button>
          <button type="button" onClick={() => setLang('en')} style={langBtnStyle(lang === 'en')}>EN</button>
        </div>
      </header>

      <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px' }}>
        <div style={{ width: '100%', maxWidth: 440, background: '#fff', padding: '32px 28px', borderRadius: 8, boxShadow: '0 8px 24px rgba(27, 42, 78, 0.10)', border: `1px solid ${GOLD}33` }}>
          <h1 style={{ fontSize: 24, margin: 0, color: NAVY, textAlign: 'center', marginBottom: 6 }}>{t.welcome}</h1>
          <p style={{ fontSize: 14, color: '#665', textAlign: 'center', marginTop: 0, marginBottom: 22, lineHeight: 1.5 }}>{t.subtitle}</p>

          {mode !== 'forgot' && (
            <div style={{ display: 'flex', gap: 0, marginBottom: 20, borderBottom: `1px solid ${GOLD}55` }}>
              {tabs.map(tab => (
                <button key={tab.id} type="button"
                  onClick={() => { setMode(tab.id); clearMessages() }}
                  style={tabBtnStyle(mode === tab.id)}>{tab.label}</button>
              ))}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <label style={labelStyle}>{t.email}</label>
            <input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder={t.emailPlaceholder} style={inputStyle} autoComplete="email" />

            {mode !== 'forgot' && (
              <>
                <label style={labelStyle}>{t.password}</label>
                <input type="password" required minLength={6} value={password} onChange={e => setPassword(e.target.value)} placeholder={t.passwordPlaceholder} style={inputStyle} autoComplete={mode === 'signUp' ? 'new-password' : 'current-password'} />
              </>
            )}

            {errorMsg && <div style={errorStyle}>{errorMsg}</div>}
            {successMsg && <div style={successStyle}>{successMsg}</div>}

            <button type="submit" disabled={busy} style={primaryBtnStyle(busy)}>
              {busy ? t.busy : mode === 'signIn' ? t.signInButton : mode === 'signUp' ? t.signUpButton : t.forgotButton}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: 16 }}>
            {mode === 'signIn' && (
              <button type="button" onClick={() => { setMode('forgot'); clearMessages() }} style={linkBtnStyle}>{t.forgotLink}</button>
            )}
            {mode === 'forgot' && (
              <button type="button" onClick={() => { setMode('signIn'); clearMessages() }} style={linkBtnStyle}>← {t.backLink}</button>
            )}
          </div>
        </div>
      </main>

      <footer style={{ textAlign: 'center', fontSize: 12, color: '#998', padding: 16 }}>© Claro Legal · {t.footer}</footer>
    </div>
  )
}

const labelStyle = { display: 'block', fontSize: 13, color: NAVY, marginTop: 12, marginBottom: 4, fontWeight: 600 }
const inputStyle = { width: '100%', boxSizing: 'border-box', padding: '10px 12px', fontSize: 15, border: '1px solid #d4ccba', borderRadius: 4, fontFamily: FONT, color: INK, background: '#fff', outline: 'none' }
const errorStyle = { background: '#fde8e8', color: '#922', padding: '8px 12px', borderRadius: 4, fontSize: 13, marginTop: 14, border: '1px solid #f5c0c0' }
const successStyle = { background: '#eaf5ea', color: '#264', padding: '8px 12px', borderRadius: 4, fontSize: 13, marginTop: 14, border: '1px solid #c2dfc2' }
const linkBtnStyle = { background: 'none', border: 'none', color: NAVY, fontFamily: FONT, fontSize: 13, cursor: 'pointer', textDecoration: 'underline' }

function primaryBtnStyle(busy) {
  return { width: '100%', marginTop: 18, padding: '12px', fontSize: 15, fontFamily: FONT, fontWeight: 600, background: busy ? '#7B8AAA' : NAVY, color: CREAM, border: 'none', borderRadius: 4, cursor: busy ? 'wait' : 'pointer', letterSpacing: 0.3 }
}
function langBtnStyle(active) {
  return { background: active ? GOLD : 'transparent', color: active ? NAVY : CREAM, border: `1px solid ${GOLD}`, padding: '6px 14px', borderRadius: 4, fontFamily: FONT, fontWeight: 600, cursor: 'pointer' }
}
function tabBtnStyle(active) {
  return { flex: 1, padding: '10px 8px', fontSize: 14, fontFamily: FONT, fontWeight: 600, background: 'none', border: 'none', borderBottom: active ? `3px solid ${GOLD}` : '3px solid transparent', color: active ? NAVY : '#888', cursor: 'pointer', marginBottom: -1 }
}

function ConfigErrorScreen({ lang }) {
  const t = STRINGS[lang]
  return (
    <div style={{ minHeight: '100vh', background: CREAM, fontFamily: FONT, color: INK, padding: 40, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ maxWidth: 540, background: '#fff', padding: 32, borderRadius: 8, border: `1px solid ${GOLD}55`, boxShadow: '0 8px 24px rgba(27,42,78,0.08)' }}>
        <h2 style={{ color: NAVY, marginTop: 0 }}>Claro Legal</h2>
        <p style={{ lineHeight: 1.6 }}>
          {lang === 'es'
            ? 'Configuración incompleta. Verifica que VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY estén configuradas en Netlify y que se haya hecho un nuevo despliegue después de añadirlas.'
            : 'Configuration incomplete. Make sure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set in Netlify and that a new deploy ran after adding them.'}
        </p>
      </div>
    </div>
  )
}

function AuthGate() {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)
  const [lang, setLang] = useState(() => {
    if (typeof window === 'undefined') return 'es'
    return window.localStorage.getItem('claro_lang') || 'es'
  })

  useEffect(() => {
    try { window.localStorage.setItem('claro_lang', lang) } catch (_) {}
  }, [lang])

  useEffect(() => {
    if (!supabase) { setLoading(false); return }
    supabase.auth.getSession().then(({ data }) => {
      setSession(data && data.session ? data.session : null)
      setLoading(false)
    }).catch(() => setLoading(false))

    const { data } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession)
    })
    return () => { try { data.subscription.unsubscribe() } catch (_) {} }
  }, [])

  if (!supabase) return <ConfigErrorScreen lang={lang} />

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: CREAM, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONT, color: NAVY }}>
        {STRINGS[lang].loading}
      </div>
    )
  }

  if (!session) return <AuthScreen lang={lang} setLang={setLang} />

  return <App />
}

function ErrorBoundaryFallback({ error }) {
  return (
    <div style={{ padding: 24, fontFamily: FONT, background: CREAM, color: INK, minHeight: '100vh' }}>
      <h2 style={{ color: NAVY }}>Claro Legal — error</h2>
      <pre style={{ background: '#fff', padding: 16, borderRadius: 6, overflow: 'auto', fontSize: 12 }}>{String(error && (error.stack || error.message || error))}</pre>
    </div>
  )
}

class ErrorBoundary extends React.Component {
  constructor(p) { super(p); this.state = { error: null } }
  static getDerivedStateFromError(error) { return { error } }
  componentDidCatch(err, info) { console.error('ErrorBoundary caught:', err, info) }
  render() { return this.state.error ? <ErrorBoundaryFallback error={this.state.error} /> : this.props.children }
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <ErrorBoundary>
    <AuthGate />
  </ErrorBoundary>
)
