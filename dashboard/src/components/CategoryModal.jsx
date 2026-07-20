import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import Icon from './Icon'

const MAX_IMAGE_SIZE = 3 * 1024 * 1024
const ALLOWED_IMAGE_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp'])
const GROUP_OPTIONS = ['Tiles', 'Sanitary Wares', 'Bath Fittings', 'Others']
const countWords = (value) => value.trim() ? value.trim().split(/\s+/).length : 0

function CategoryModal({ item, nextSortOrder, onClose, onSave }) {
  const [name, setName] = useState(item?.name || '')
  const [group, setGroup] = useState(item?.group || '')
  const [sortOrder, setSortOrder] = useState(item?.sortOrder || nextSortOrder)
  const [image, setImage] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(item?.imageUrl || '')
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)
  const fileInputRef = useRef(null)
  const objectUrlRef = useRef('')

  useEffect(() => {
    const closeOnEscape = (event) => { if (event.key === 'Escape' && !saving) onClose() }
    document.addEventListener('keydown', closeOnEscape)
    return () => document.removeEventListener('keydown', closeOnEscape)
  }, [onClose, saving])
  useEffect(() => () => { if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current) }, [])

  const handleImage = (event) => {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return
    if (!ALLOWED_IMAGE_TYPES.has(file.type)) return setErrors((current) => ({ ...current, image: 'Upload a JPG, PNG, or WebP image.' }))
    if (file.size > MAX_IMAGE_SIZE) return setErrors((current) => ({ ...current, image: 'Image must be 3 MB or smaller.' }))
    if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current)
    objectUrlRef.current = URL.createObjectURL(file)
    setImage(file)
    setPreviewUrl(objectUrlRef.current)
    setErrors((current) => ({ ...current, image: '' }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    const normalizedName = name.trim().replace(/\s+/g, ' ')
    const numericOrder = Number(sortOrder)
    const nextErrors = {}
    if (!normalizedName) nextErrors.name = 'Category name is required.'
    else if (normalizedName.length < 2 || normalizedName.length > 60) nextErrors.name = 'Category name must contain 2-60 characters.'
    else if (countWords(normalizedName) > 6) nextErrors.name = 'Category name must contain 6 words or fewer.'
    else if (/[<>]/.test(normalizedName)) nextErrors.name = 'Category name contains unsupported characters.'
    if (!GROUP_OPTIONS.includes(group)) nextErrors.group = 'Select a valid group.'
    if (!Number.isInteger(numericOrder) || numericOrder < 1 || numericOrder > 999) nextErrors.sortOrder = 'Sort order must be a whole number between 1 and 999.'
    if (!item && !image) nextErrors.image = 'Category image is required.'
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length) return
    setSaving(true)
    try {
      await onSave({ name: normalizedName, group, sortOrder: numericOrder, image })
    } catch (error) {
      setErrors((current) => ({ ...current, ...(error.fields || {}) }))
    } finally {
      setSaving(false)
    }
  }

  return createPortal(
    <div className="modal-layer" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && !saving && onClose()}>
      <section className="gallery-modal category-modal" role="dialog" aria-modal="true" aria-labelledby="category-modal-title">
        <header><div><span className="content-kicker">Category details</span><h2 id="category-modal-title">{item ? 'Edit Category' : 'Add Category'}</h2></div><button type="button" onClick={onClose} disabled={saving} aria-label="Close dialog"><Icon name="close" /></button></header>
        <form onSubmit={handleSubmit} noValidate>
          <label><span className="field-label-row"><strong>Category name</strong><small className={countWords(name) > 6 ? 'over-limit' : ''}>{countWords(name)} / 6 words</small></span><input value={name} maxLength="60" onChange={(event) => { setName(event.target.value); setErrors((current) => ({ ...current, name: '' })) }} placeholder="Enter category name" aria-invalid={Boolean(errors.name)} /></label>
          {errors.name && <em>{errors.name}</em>}
          <label><span className="field-label-row"><strong>Group</strong></span><select value={group} onChange={(event) => { setGroup(event.target.value); setErrors((current) => ({ ...current, group: '' })) }} aria-invalid={Boolean(errors.group)}><option value="">Select group</option>{GROUP_OPTIONS.map((option) => <option key={option}>{option}</option>)}</select></label>
          {errors.group && <em>{errors.group}</em>}
          <label><span className="field-label-row"><strong>Sort order</strong><small>1–999</small></span><input type="number" min="1" max="999" step="1" value={sortOrder} onChange={(event) => { setSortOrder(event.target.value); setErrors((current) => ({ ...current, sortOrder: '' })) }} aria-invalid={Boolean(errors.sortOrder)} /></label>
          {errors.sortOrder && <em>{errors.sortOrder}</em>}
          <div className="gallery-modal-preview">{previewUrl ? <img src={previewUrl} alt="Category preview" /> : <Icon name="gallery" />}</div>
          <input ref={fileInputRef} className="gallery-file-input" type="file" accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp" onChange={handleImage} />
          <button className="gallery-upload-button" type="button" onClick={() => fileInputRef.current?.click()}>{previewUrl ? 'Change Image' : 'Upload Image'}</button>
          <small className="gallery-modal-help">JPG, PNG or WebP · Maximum 3 MB (3 MB is allowed)</small>
          {errors.image && <em>{errors.image}</em>}
          <div className="modal-actions"><button type="button" onClick={onClose} disabled={saving}>Cancel</button><button className="primary" type="submit" disabled={saving}>{saving ? 'Saving...' : item ? 'Save Changes' : 'Add Category'}</button></div>
        </form>
      </section>
    </div>,
    document.body,
  )
}

export default CategoryModal
