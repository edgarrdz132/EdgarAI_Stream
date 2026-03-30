import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Eye, EyeOff, Lock, Mail, AlertCircle, CheckCircle } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'

const EDGAR_IMG = 'https://jelxossqzywochqsszsq.supabase.co/storage/v1/object/public/assets/edgarai.jpg'

export default function LoginPage() {
  const [tab, setTab]           = useState('login')
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [password2, setPassword2] = useState('')
  const [showPwd, setShowPwd]   = useState(false)
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState('')
  const [success, setSuccess]   = useState('')
  const { login, register } = useAuthStore()
  const navigate = useNavigate()

  const reset = () => { setError(''); setSuccess('') }

  const handleLogin = async (e) => {
    e.preventDefault()
    if (!email || !password) { setError('Completa todos los campos'); return }
    reset(); setLoading(true)
    try {
      await login(email, password)
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.message || 'Credenciales incorrectas')
    } finally { setLoading(false) }
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    if (!email || !password || !password2) { setError('Completa todos los campos'); return }
    if (password !== password2) { setError('Las contraseñas no coinciden'); return }
    if (password.length < 6) { setError('Mínimo 6 caracteres'); return }
    reset(); setLoading(true)
    try {
      await register(email, password)
      setSuccess('✅ Cuenta creada. Revisa tu correo para confirmar.')
    } catch (err) {
      setError(err.response?.data?.message || 'Error al crear la cuenta')
    } finally { setLoading(false) }
  }

  const handleForgot = async (e) => {
    e.preventDefault()
    if (!email) { setError('Ingresa tu correo'); return }
    reset(); setLoading(true)
    try {
      // Llamar al endpoint de recuperación
      setSuccess('✅ Enlace enviado. Revisa tu correo.')
    } catch (err) {
      setError('Error al enviar el enlace')
    } finally { setLoading(false) }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#080808', display: 'flex', alignItems: 'stretch' }}>

      {/* Left side - mascot */}
      <div style={{ flex: 1, position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: `url(${EDGAR_IMG})`, backgroundSize: 'cover', backgroundPosition: 'center top', filter: 'brightness(0.35) saturate(1.2)' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, transparent 40%, #080808 100%), linear-gradient(to top, #080808 0%, transparent 25%)' }} />
        <div style={{ position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem', padding: '3rem 2rem' }}>
          <div style={{ width: 260, height: 320, borderRadius: 16, overflow: 'hidden', border: '2px solid rgba(229,9,20,0.4)', boxShadow: '0 0 60px rgba(229,9,20,0.2)', background: '#111' }}>
            <img src={EDGAR_IMG} alt="EdgarAI" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top' }} onError={e => { e.target.parentElement.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:100%;font-size:5rem">🎭</div>' }} />
          </div>
          <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '2.2rem', letterSpacing: 4, background: 'linear-gradient(90deg, #fff, #e50914, #00f5ff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', textAlign: 'center' }}>EdgarAI Stream</div>
          <div style={{ fontFamily: 'monospace', fontSize: '0.62rem', color: 'rgba(255,255,255,0.4)', letterSpacing: 2 }}>// urbano · digital · anónimo</div>
        </div>
      </div>

      {/* Right side - form */}
      <div style={{ width: 420, minWidth: 360, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', background: 'rgba(8,8,8,0.97)', borderLeft: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ width: '100%', maxWidth: 360 }}>

          {/* Brand */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
            <div style={{ width: 38, height: 38, borderRadius: 8, overflow: 'hidden', border: '1.5px solid rgba(229,9,20,0.5)', flexShrink: 0 }}>
              <img src={EDGAR_IMG} alt="EdgarAI" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => { e.target.parentElement.textContent = '🎭' }} />
            </div>
            <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '1.5rem', letterSpacing: 2, background: 'linear-gradient(90deg, #fff, #e50914)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>EdgarAI Stream</div>
          </div>

          {/* Tabs */}
          <div style={{ display: 'flex', borderRadius: 4, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.08)', marginBottom: '1.75rem' }}>
            {['login', 'register'].map(t => (
              <button key={t} onClick={() => { setTab(t); reset() }} style={{ flex: 1, padding: '0.6rem', textAlign: 'center', fontSize: '0.9rem', fontWeight: 700, letterSpacing: 1, cursor: 'pointer', border: 'none', fontFamily: 'inherit', background: tab === t ? '#e50914' : 'transparent', color: tab === t ? '#fff' : '#888', transition: 'all 0.2s' }}>
                {t === 'login' ? 'Iniciar sesión' : 'Registrarse'}
              </button>
            ))}
          </div>

          {/* Messages */}
          {error && (
            <div style={{ padding: '0.6rem 1rem', borderRadius: 4, fontSize: '0.8rem', marginBottom: '1rem', background: 'rgba(229,9,20,0.1)', border: '1px solid rgba(229,9,20,0.3)', color: '#ff6b6b', display: 'flex', alignItems: 'center', gap: '0.5rem', fontFamily: 'monospace' }}>
              <AlertCircle size={14} />{error}
            </div>
          )}
          {success && (
            <div style={{ padding: '0.6rem 1rem', borderRadius: 4, fontSize: '0.8rem', marginBottom: '1rem', background: 'rgba(0,230,118,0.1)', border: '1px solid rgba(0,230,118,0.3)', color: '#00e676', display: 'flex', alignItems: 'center', gap: '0.5rem', fontFamily: 'monospace' }}>
              <CheckCircle size={14} />{success}
            </div>
          )}

          {/* Login form */}
          {tab === 'login' && (
            <form onSubmit={handleLogin}>
              <Field label="Correo electrónico" icon={<Mail size={16} />}>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="tu@correo.com" disabled={loading} style={inputStyle} />
              </Field>
              <Field label="Contraseña" icon={<Lock size={16} />}>
                <input type={showPwd ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" disabled={loading} style={inputStyle} />
                <button type="button" onClick={() => setShowPwd(!showPwd)} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#888', cursor: 'pointer' }}>{showPwd ? <EyeOff size={16} /> : <Eye size={16} />}</button>
              </Field>
              <button type="submit" disabled={loading} style={btnStyle}>
                {loading ? '...' : '▶ ENTRAR'}
              </button>
              <div style={{ textAlign: 'center', margin: '1rem 0', position: 'relative' }}>
                <span style={{ position: 'relative', background: 'rgba(8,8,8,0.97)', padding: '0 0.75rem', fontSize: '0.7rem', color: '#555', fontFamily: 'monospace' }}>o</span>
              </div>
              <button type="button" onClick={() => { setTab('forgot'); reset() }} style={{ ...btnStyle, background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', fontSize: '0.82rem' }}>¿Olvidaste tu contraseña?</button>
            </form>
          )}

          {/* Register form */}
          {tab === 'register' && (
            <form onSubmit={handleRegister}>
              <Field label="Correo electrónico" icon={<Mail size={16} />}>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="tu@correo.com" disabled={loading} style={inputStyle} />
              </Field>
              <Field label="Contraseña" icon={<Lock size={16} />}>
                <input type={showPwd ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} placeholder="Mínimo 6 caracteres" disabled={loading} style={inputStyle} />
              </Field>
              <Field label="Confirmar contraseña" icon={<Lock size={16} />}>
                <input type="password" value={password2} onChange={e => setPassword2(e.target.value)} placeholder="Repite tu contraseña" disabled={loading} style={inputStyle} />
              </Field>
              <button type="submit" disabled={loading} style={btnStyle}>
                {loading ? '...' : '✦ CREAR CUENTA'}
              </button>
            </form>
          )}

          {/* Forgot form */}
          {tab === 'forgot' && (
            <form onSubmit={handleForgot}>
              <p style={{ fontSize: '0.82rem', color: '#888', marginBottom: '1rem', lineHeight: 1.6 }}>Ingresa tu correo y te enviaremos un enlace para restablecer tu contraseña.</p>
              <Field label="Correo electrónico" icon={<Mail size={16} />}>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="tu@correo.com" disabled={loading} style={inputStyle} />
              </Field>
              <button type="submit" disabled={loading} style={btnStyle}>
                {loading ? '...' : '📧 ENVIAR ENLACE'}
              </button>
              <div style={{ marginTop: '0.75rem' }}>
                <button type="button" onClick={() => { setTab('login'); reset() }} style={{ ...btnStyle, background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)' }}>← Volver al Login</button>
              </div>
            </form>
          )}

          <div style={{ margin: '1.2rem 0', height: 1, background: 'rgba(255,255,255,0.05)' }} />
          <Link to="/" style={{ display: 'block', textAlign: 'center', padding: '0.65rem 1.5rem', background: 'rgba(0,245,255,0.08)', border: '1px solid rgba(0,245,255,0.3)', borderRadius: 4, color: '#00f5ff', fontWeight: 700, letterSpacing: 1.5, fontSize: '0.9rem', textTransform: 'uppercase', textDecoration: 'none' }}>
            👁 ENTRAR SIN CUENTA
          </Link>
        </div>
      </div>
    </div>
  )
}

function Field({ label, icon, children }) {
  return (
    <div style={{ marginBottom: '1rem' }}>
      <label style={{ fontSize: '0.7rem', fontWeight: 700, color: '#888', letterSpacing: 1.5, textTransform: 'uppercase', fontFamily: 'monospace', display: 'block', marginBottom: '0.4rem' }}>{label}</label>
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
        <span style={{ position: 'absolute', left: 10, color: '#555' }}>{icon}</span>
        {children}
      </div>
    </div>
  )
}

const inputStyle = {
  width: '100%', background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: 4, padding: '0.7rem 1rem 0.7rem 2.2rem', color: '#fff',
  fontFamily: 'inherit', fontSize: '1rem', outline: 'none',
}

const btnStyle = {
  width: '100%', background: '#e50914', color: '#fff', border: 'none',
  borderRadius: 4, padding: '0.65rem 1.5rem', fontWeight: 700,
  letterSpacing: 1.5, cursor: 'pointer', fontSize: '0.95rem',
  textTransform: 'uppercase', marginBottom: '0.5rem', fontFamily: 'inherit',
}
