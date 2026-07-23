import { useState } from 'react'
import Icon from '../components/Icon'

const ADMIN_EMAIL = 'sjceramics2026@gmail.com'
const ADMIN_PASSWORD = 'sjceramics@2026'

function LoginPage({ onLogin, sessionExpiredNotice }) {
  const [form, setForm] = useState({ email: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle')

  const updateField = (event) => {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
    setErrors((current) => ({ ...current, [name]: '', credentials: '' }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    const nextErrors = {}

    if (!form.email.trim()) nextErrors.email = 'Enter your email address.'
    if (!form.password) nextErrors.password = 'Enter your password.'

    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors)
      return
    }

    if (form.email.trim().toLowerCase() !== ADMIN_EMAIL || form.password !== ADMIN_PASSWORD) {
      setErrors({ credentials: 'Invalid email address or password.' })
      return
    }

    setStatus('loading')
    window.setTimeout(onLogin, 700)
  }

  return (
    <main className="login-page">
      <section className="login-brand" aria-labelledby="partner-title">
        <div className="brand-grid" aria-hidden="true" />
        <div className="floating-surfaces" aria-hidden="true">
          <span className="surface-tile terrazzo surface-one" />
          <span className="surface-tile terracotta surface-two" />
          <span className="surface-tile ivory surface-three" />
          <span className="surface-tile terrazzo surface-four" />
          <span className="surface-tile terracotta surface-five" />
        </div>
        <div className="partner-lockup">
          <div className="partner-logos" aria-label="SJ Ceramics and KAG Tiles">
            <div className="logo-partner-unit sj-partner-unit">
              <div className="partner-logo-card sj-logo-card">
                <img src="/Logo_Png.png" alt="SJ Ceramics" />
              </div>
            </div>
            <span className="partner-link" aria-hidden="true"><i /><b>×</b><i /></span>
            <div className="logo-partner-unit kag-partner-unit">
              <div className="partner-logo-card kag-logo-card">
                <img src="/kaglogo.png" alt="KAG Tiles" />
              </div>
            </div>
          </div>
        </div>
        <div className="login-brand-footer">
          <span>Elegance</span><i /><span>Quality</span><i /><span>Trust</span>
        </div>
      </section>

      <section className="login-form-panel">
        <div className="form-tile-pattern" aria-hidden="true" />
        <div className="form-floating-surfaces" aria-hidden="true">
          <span className="surface-tile terrazzo form-surface-one" />
          <span className="surface-tile terracotta form-surface-two" />
        </div>
        <div className="login-card">
          <div className="mobile-kag-lockup">
            <div className="mobile-partner-logos">
              <div className="mobile-logo-unit">
                <img src="/Logo_Png.png" alt="SJ Ceramics" />
              </div>
              <span>×</span>
              <div className="mobile-logo-unit mobile-kag-unit">
                <img src="/kaglogo.svg" alt="KAG Tiles" />
              </div>
            </div>
          </div>

          <header className="login-heading">
            <span className="section-kicker">SJ Ceramics</span>
            <h2>Admin Login</h2>
            <p>Sign in to manage your showroom workspace.</p>
          </header>

          <form onSubmit={handleSubmit} noValidate>
            {sessionExpiredNotice && (
              <div className="credential-error" role="alert">
                Your session has expired after 2 hours of inactivity. Please sign in again.
              </div>
            )}
            {errors.credentials && <div className="credential-error" role="alert">{errors.credentials}</div>}

            <div className={`field-group ${errors.email ? 'has-error' : ''}`}>
              <label htmlFor="email">Email address</label>
              <div className="input-wrap">
                <Icon name="mail" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="username"
                  placeholder="admin@sjceramics.com"
                  value={form.email}
                  onChange={updateField}
                  aria-invalid={Boolean(errors.email)}
                />
              </div>
              {errors.email && <span className="field-error">{errors.email}</span>}
            </div>

            <div className={`field-group ${errors.password ? 'has-error' : ''}`}>
              <label htmlFor="password">Password</label>
              <div className="input-wrap">
                <Icon name="lock" />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={updateField}
                  aria-invalid={Boolean(errors.password)}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword((current) => !current)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  <Icon name={showPassword ? 'eye' : 'eyeOff'} />
                </button>
              </div>
              {errors.password && <span className="field-error">{errors.password}</span>}
            </div>

            <button className="sign-in-button" type="submit" disabled={status === 'loading'}>
              <span className="button-gloss" aria-hidden="true" />
              {status === 'loading' ? <><i className="spinner" />Signing in…</> : <>Sign In <span>→</span></>}
            </button>
          </form>

          <footer className="secure-note"><i /> Secure administrator access</footer>
        </div>
      </section>
    </main>
  )
}

export default LoginPage
