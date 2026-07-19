import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import ToastContext from '../context/ToastContext'

const TOAST_DURATION = 1500

function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])
  const timersRef = useRef(new Map())

  const removeToast = useCallback((id) => {
    const timer = timersRef.current.get(id)
    if (timer) window.clearTimeout(timer)
    timersRef.current.delete(id)
    setToasts((current) => current.filter((toast) => toast.id !== id))
  }, [])

  const showToast = useCallback((message, type = 'success') => {
    const id = globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random()}`
    setToasts((current) => [...current, { id, message, type }])
    const timer = window.setTimeout(() => removeToast(id), TOAST_DURATION)
    timersRef.current.set(id, timer)
    return id
  }, [removeToast])

  useEffect(() => () => {
    timersRef.current.forEach((timer) => window.clearTimeout(timer))
    timersRef.current.clear()
  }, [])

  const value = useMemo(() => ({ showToast, removeToast }), [showToast, removeToast])

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="toast-viewport" aria-live="polite" aria-atomic="false">
        {toasts.map((toast) => (
          <div className={`dashboard-toast ${toast.type}`} role={toast.type === 'error' ? 'alert' : 'status'} key={toast.id}>
            <span className="toast-symbol" aria-hidden="true">{toast.type === 'error' ? '!' : '✓'}</span>
            <p>{toast.message}</p>
            <button type="button" onClick={() => removeToast(toast.id)} aria-label="Close notification">×</button>
            <span className="toast-progress" aria-hidden="true" />
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export default ToastProvider
