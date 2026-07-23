import { useCallback, useEffect, useState } from 'react'
import LoginPage from './pages/LoginPage'
import DashboardShell from './components/DashboardShell'
import './App.css'

const AUTH_KEY = 'sj-dashboard-authenticated'
const AUTH_LAST_ACTIVITY_KEY = 'sj-dashboard-last-activity'
const LEGACY_AUTH_TIMESTAMP_KEY = 'sj-dashboard-auth-timestamp'
const TWO_HOURS_MS = 2 * 60 * 60 * 1000 // 2 hours in milliseconds
const ACTIVITY_WRITE_INTERVAL_MS = 30 * 1000

function getLastActivityTime() {
  return Number(sessionStorage.getItem(AUTH_LAST_ACTIVITY_KEY) || sessionStorage.getItem(LEGACY_AUTH_TIMESTAMP_KEY) || 0)
}

function recordActivity(time = Date.now()) {
  sessionStorage.setItem(AUTH_LAST_ACTIVITY_KEY, time.toString())
  sessionStorage.removeItem(LEGACY_AUTH_TIMESTAMP_KEY)
}

function checkIsSessionValid() {
  const isAuth = sessionStorage.getItem(AUTH_KEY) === 'true'
  if (!isAuth) return false
  const lastActivityTime = getLastActivityTime()
  if (!lastActivityTime || Date.now() - lastActivityTime >= TWO_HOURS_MS) {
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
    sessionStorage.removeItem(AUTH_LAST_ACTIVITY_KEY)
    sessionStorage.removeItem(LEGACY_AUTH_TIMESTAMP_KEY)
    setAuthenticated(false)
    if (expired) {
      setSessionExpiredNotice(true)
    }
  }, [])

  const handleLogin = () => {
    sessionStorage.setItem(AUTH_KEY, 'true')
    recordActivity()
    setSessionExpiredNotice(false)
    setAuthenticated(true)
  }

  useEffect(() => {
    const loadingTimer = window.setTimeout(() => setLoading(false), 850)
    return () => window.clearTimeout(loadingTimer)
  }, [])

  // Logout only after 2 hours of inactivity. User activity refreshes the idle window.
  useEffect(() => {
    if (!authenticated) return undefined

    let logoutTimer
    let lastActivityWrite = getLastActivityTime()

    const expireSession = () => {
      handleLogout(true)
    }

    const scheduleLogout = () => {
      window.clearTimeout(logoutTimer)
      const elapsed = Date.now() - getLastActivityTime()
      const remainingTime = TWO_HOURS_MS - elapsed
      logoutTimer = window.setTimeout(expireSession, Math.max(0, remainingTime))
    }

    const refreshActivity = () => {
      if (!checkIsSessionValid()) {
        expireSession()
        return
      }

      const now = Date.now()
      if (now - lastActivityWrite >= ACTIVITY_WRITE_INTERVAL_MS) {
        recordActivity(now)
        lastActivityWrite = now
        scheduleLogout()
      }
    }

    if (!checkIsSessionValid()) {
      logoutTimer = window.setTimeout(expireSession, 0)
      return () => window.clearTimeout(logoutTimer)
    }

    const handleVisibilityCheck = () => {
      if (document.visibilityState === 'visible' && !checkIsSessionValid()) {
        expireSession()
      } else if (document.visibilityState === 'visible') {
        refreshActivity()
      }
    }

    const activityEvents = ['click', 'keydown', 'pointermove', 'scroll', 'touchstart']
    activityEvents.forEach((eventName) => {
      window.addEventListener(eventName, refreshActivity, { passive: true })
    })
    document.addEventListener('visibilitychange', handleVisibilityCheck)
    window.addEventListener('focus', handleVisibilityCheck)
    scheduleLogout()

    return () => {
      window.clearTimeout(logoutTimer)
      activityEvents.forEach((eventName) => {
        window.removeEventListener(eventName, refreshActivity)
      })
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
