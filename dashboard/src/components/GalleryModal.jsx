import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import Icon from './Icon'

const MAX_IMAGE_SIZE = 3 * 1024 * 1024
const ALLOWED_IMAGE_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp'])
const countWords = (value) => value.trim() ? value.trim().split(/\s+/).length : 0

function GalleryModal({ item, onClose, onSave }) {
  const [title, setTitle] = useState(item?.title || '')
  const [image, setImage] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(item?.imageUrl || '')
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)
  const objectUrlRef = useRef('')
  const fileInputRef = useRef(null)

  useEffect(() => {
    const closeOnEscape = (event) => {
      if (event.key === 'Escape' && !saving) onClose()
    }
    document.addEventListener('keydown', closeOnEscape)
    return () => document.removeEventListener('keydown', closeOnEscape)
  }, [onClose, saving])

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
    const trimmedTitle = title.trim()
    const nextErrors = {}
    if (!trimmedTitle) nextErrors.title = 'Gallery title is required.'
    else if (countWords(trimmedTitle) > 4) nextErrors.title = 'Title must contain 4 words or fewer.'
    if (!item && !image) nextErrors.image = 'Gallery image is required.'
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length) return

    setSaving(true)
    try {
      await onSave({ title: trimmedTitle, image })
    } finally {
      setSaving(false)
    }
  }

  return createPortal(
    <div className="modal-layer" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && !saving && onClose()}>
      <section className="gallery-modal" role="dialog" aria-modal="true" aria-labelledby="gallery-modal-title">
        <header>
          <div><span className="content-kicker">Gallery details</span><h2 id="gallery-modal-title">{item ? 'Edit Gallery Item' : 'Add Gallery Item'}</h2></div>
          <button type="button" onClick={onClose} disabled={saving} aria-label="Close dialog"><Icon name="close" /></button>
        </header>
        <form onSubmit={handleSubmit}>
          <label>
            <span className="field-label-row"><strong>Title</strong><small className={countWords(title) > 4 ? 'over-limit' : ''}>{countWords(title)} / 4 words</small></span>
            <input value={title} onChange={(event) => { setTitle(event.target.value); setErrors((current) => ({ ...current, title: '' })) }} placeholder="Enter gallery title" />
          </label>
          {errors.title && <em>{errors.title}</em>}

          <div className="gallery-modal-preview">
            {previewUrl ? <img src={previewUrl} alt="Gallery preview" /> : <Icon name="gallery" />}
          </div>
          <input ref={fileInputRef} className="gallery-file-input" type="file" accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp" onChange={handleImage} />
          <button className="gallery-upload-button" type="button" onClick={() => fileInputRef.current?.click()}>{previewUrl ? 'Change Image' : 'Upload Image'}</button>
          <small className="gallery-modal-help">JPG, PNG or WebP - Max 3 MB</small>
          {errors.image && <em>{errors.image}</em>}

          <div className="modal-actions">
            <button type="button" onClick={onClose} disabled={saving}>Cancel</button>
            <button className="primary" type="submit" disabled={saving}>{saving ? 'Saving...' : item ? 'Save Changes' : 'Add Gallery Item'}</button>
          </div>
        </form>
      </section>
    </div>,
    document.body,
  )
}

export default GalleryModal
