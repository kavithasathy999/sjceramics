import { useEffect, useState } from 'react'
import LoginPage from './pages/LoginPage'
import DashboardShell from './components/DashboardShell'
import './App.css'

const AUTH_KEY = 'sj-dashboard-authenticated'

function App() {
  const [loading, setLoading] = useState(true)
  const [authenticated, setAuthenticated] = useState(() => sessionStorage.getItem(AUTH_KEY) === 'true')

  useEffect(() => {
    const loadingTimer = window.setTimeout(() => setLoading(false), 850)
    return () => window.clearTimeout(loadingTimer)
  }, [])

  const handleLogin = () => {
    sessionStorage.setItem(AUTH_KEY, 'true')
    setAuthenticated(true)
  }

  const handleLogout = () => {
    sessionStorage.removeItem(AUTH_KEY)
    setAuthenticated(false)
  }

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

  return authenticated ? <DashboardShell onLogout={handleLogout} /> : <LoginPage onLogin={handleLogin} />
}

export default App
