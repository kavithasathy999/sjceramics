import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import Icon from './Icon'

function ConfirmDelete({ banner, onCancel, onConfirm }) {
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape') onCancel()
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [onCancel])

  return createPortal(
    <div className="modal-layer" onMouseDown={(event) => event.target === event.currentTarget && onCancel()}>
      <section className="confirm-modal" role="alertdialog" aria-modal="true" aria-labelledby="delete-title">
        <div className="delete-icon"><Icon name="trash" /></div>
        <h2 id="delete-title">Are you sure want to delete?</h2>
        <p>“{banner.title}” will be permanently removed.</p>
        <div className="modal-actions"><button onClick={onCancel}>Cancel</button><button className="danger" onClick={onConfirm}>Delete</button></div>
      </section>
    </div>,
    document.body,
  )
}

export default ConfirmDelete
