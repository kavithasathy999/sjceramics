import { useCallback, useEffect, useState } from 'react'
import LoginPage from './pages/LoginPage'
import DashboardShell from './components/DashboardShell'
import './App.css'

const AUTH_KEY = 'sj-dashboard-authenticated'
const AUTH_TIMESTAMP_KEY = 'sj-dashboard-auth-timestamp'
const TWO_HOURS_MS = 2 * 60 * 60 * 1000 // 2 hours in milliseconds

function checkIsSessionValid() {
  const isAuth = sessionStorage.getItem(AUTH_KEY) === 'true'
  if (!isAuth) return false
  const loginTime = Number(sessionStorage.getItem(AUTH_TIMESTAMP_KEY) || 0)
  if (!loginTime || Date.now() - loginTime >= TWO_HOURS_MS) {
    return false
  }
  return true
}

function App() {
  const [loading, setLoading] = useState(true)
  const [authenticated, setAuthenticated] = useState(checkIsSessionValid)
  const [sessionExpiredNotice, setSessionExpiredNotice] = useState(false)

  const handleLogout = useCallback((expired = false) => {
    sessionStorage.removeItem(AUTH_KEY)
    sessionStorage.removeItem(AUTH_TIMESTAMP_KEY)
    setAuthenticated(false)
    if (expired) {
      setSessionExpiredNotice(true)
    }
  }, [])

  const handleLogin = () => {
    sessionStorage.setItem(AUTH_KEY, 'true')
    sessionStorage.setItem(AUTH_TIMESTAMP_KEY, Date.now().toString())
    setSessionExpiredNotice(false)
    setAuthenticated(true)
  }

  useEffect(() => {
    const loadingTimer = window.setTimeout(() => setLoading(false), 850)
    return () => window.clearTimeout(loadingTimer)
  }, [])

  // Manage 2-hour timer & tab visibility session checks
  useEffect(() => {
    if (!authenticated) return undefined

    const loginTime = Number(sessionStorage.getItem(AUTH_TIMESTAMP_KEY) || 0)
    const elapsed = Date.now() - loginTime
    const remainingTime = TWO_HOURS_MS - elapsed

    if (remainingTime <= 0) {
      handleLogout(true)
      return undefined
    }

    const logoutTimer = window.setTimeout(() => {
      handleLogout(true)
    }, remainingTime)

    const handleVisibilityCheck = () => {
      if (document.visibilityState === 'visible' && !checkIsSessionValid()) {
        handleLogout(true)
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityCheck)
    window.addEventListener('focus', handleVisibilityCheck)

    return () => {
      window.clearTimeout(logoutTimer)
      document.removeEventListener('visibilitychange', handleVisibilityCheck)
      window.removeEventListener('focus', handleVisibilityCheck)
    }
  }, [authenticated, handleLogout])

  if (loading) {
    return (
      <main className="app-loader" role="status" aria-live="polite" aria-label="Loading SJ Ceramics dashboard">
        <div className="loader-tile loader-tile-one" aria-hidden="true" />
        <div className="loader-tile loader-tile-two" aria-hidden="true" />
        <div className="loader-brand">
          <div className="loader-logo-shell">
            <span className="loader-logo-glow" aria-hidden="true" />
            <img src="/Logo_Png.png" alt="SJ Ceramics" />
          </div>
          <p>Preparing your workspace<span className="loader-dots" aria-hidden="true"><i /><i /><i /></span></p>
        </div>
      </main>
    )
  }

  return authenticated ? (
    <DashboardShell onLogout={() => handleLogout(false)} />
  ) : (
    <LoginPage onLogin={handleLogin} sessionExpiredNotice={sessionExpiredNotice} />
  )
}

export default App
