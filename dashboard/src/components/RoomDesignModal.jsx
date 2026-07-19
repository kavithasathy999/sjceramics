import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import Icon from './Icon'

const MAX_IMAGE_SIZE = 3 * 1024 * 1024
const ALLOWED_IMAGE_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp'])
const countWords = (value) => value.trim() ? value.trim().split(/\s+/).length : 0

function RoomDesignModal({ roomDesign, nextSortOrder, onClose, onSave }) {
  const [title, setTitle] = useState(roomDesign?.title || '')
  const [sortOrder, setSortOrder] = useState(String(roomDesign?.sortOrder || nextSortOrder || 1))
  const [image, setImage] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(roomDesign?.imageUrl || '')
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)
  const objectUrlRef = useRef('')
  const fileInputRef = useRef(null)

  useEffect(() => {
    const closeOnEscape = (event) => {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', closeOnEscape)
    return () => document.removeEventListener('keydown', closeOnEscape)
  }, [onClose])

  useEffect(() => {
    const objectUrl = objectUrlRef
    return () => {
      if (objectUrl.current) URL.revokeObjectURL(objectUrl.current)
    }
  }, [])

  const handleImage = (event) => {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return
    if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
      setErrors((current) => ({ ...current, image: 'Upload a JPG, PNG, or WebP image.' }))
      return
    }
    if (file.size > MAX_IMAGE_SIZE) {
      setErrors((current) => ({ ...current, image: 'Image must be 3 MB or smaller.' }))
      return
    }

    if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current)
    objectUrlRef.current = URL.createObjectURL(file)
    setImage(file)
    setPreviewUrl(objectUrlRef.current)
    setErrors((current) => ({ ...current, image: '' }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    const nextErrors = {}
    const trimmedTitle = title.trim()
    if (!trimmedTitle) nextErrors.title = 'Room design title is required.'
    else if (countWords(trimmedTitle) > 4) nextErrors.title = 'Title must contain 4 words or fewer.'
    const parsedSortOrder = Number(sortOrder)
    if (!Number.isInteger(parsedSortOrder) || parsedSortOrder < 1) nextErrors.sortOrder = 'Enter a positive whole number.'
    if (!roomDesign && !image) nextErrors.image = 'Room design image is required.'
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length) return

    setSaving(true)
    try {
      await onSave({ title: trimmedTitle, image, sortOrder: parsedSortOrder })
    } finally {
      setSaving(false)
    }
  }

  return createPortal(
    <div className="modal-layer" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && !saving && onClose()}>
      <section className="room-design-modal" role="dialog" aria-modal="true" aria-labelledby="room-design-modal-title">
        <header>
          <div><span className="content-kicker">Room design details</span><h2 id="room-design-modal-title">{roomDesign ? 'Edit Rooms & Design' : 'Add Rooms & Design'}</h2></div>
          <button type="button" onClick={onClose} disabled={saving} aria-label="Close dialog"><Icon name="close" /></button>
        </header>

        <form onSubmit={handleSubmit}>
          <label>
            <span className="field-label-row"><strong>Title</strong><small className={countWords(title) > 4 ? 'over-limit' : ''}>{countWords(title)} / 4 words</small></span>
            <input value={title} onChange={(event) => { setTitle(event.target.value); setErrors((current) => ({ ...current, title: '' })) }} placeholder="Enter room design title" />
          </label>
          {errors.title && <em>{errors.title}</em>}

          <label>
            <span className="field-label-row"><strong>Sort Order</strong><small>Controls frontend display position</small></span>
            <input type="number" min="1" step="1" inputMode="numeric" value={sortOrder} onChange={(event) => { setSortOrder(event.target.value); setErrors((current) => ({ ...current, sortOrder: '' })) }} placeholder="Enter display order" />
          </label>
          {errors.sortOrder && <em>{errors.sortOrder}</em>}

          <div className="room-modal-image-preview">
            {previewUrl ? <img src={previewUrl} alt="Room design preview" /> : <Icon name="banner" />}
          </div>
          <input ref={fileInputRef} className="room-modal-file-input" type="file" accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp" onChange={handleImage} />
          <button className="room-modal-upload" type="button" onClick={() => fileInputRef.current?.click()}>{previewUrl ? 'Change Image' : 'Upload Image'}</button>
          <small className="room-modal-help">JPG, PNG or WebP - Max 3 MB</small>
          {errors.image && <em>{errors.image}</em>}

          <div className="modal-actions">
            <button type="button" onClick={onClose} disabled={saving}>Cancel</button>
            <button className="primary" type="submit" disabled={saving}>{saving ? 'Saving...' : roomDesign ? 'Save Changes' : 'Add Room Design'}</button>
          </div>
        </form>
      </section>
    </div>,
    document.body,
  )
}

export default RoomDesignModal
