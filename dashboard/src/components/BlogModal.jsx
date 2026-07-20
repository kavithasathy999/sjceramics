import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import Icon from './Icon'

const CATEGORY_OPTIONS = ['Tiles', 'Sanitary Wares', 'Bath Fittings', 'Others']
const CATEGORY_ALIASES = { Sanitaryware: 'Sanitary Wares', 'Sanitary Ware': 'Sanitary Wares' }
const IMAGE_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp'])
const VIDEO_TYPES = new Set(['video/mp4', 'video/webm'])
const MAX_IMAGE_SIZE = 3 * 1024 * 1024
const MAX_VIDEO_SIZE = 8 * 1024 * 1024
const countWords = (value) => value.trim().split(/\s+/).filter(Boolean).length
const normalizeSpaces = (value) => value.trim().replace(/\s+/g, ' ')
const today = () => {
  const date = new Date()
  const pad = (value) => String(value).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
}
const dateInputValue = (value) => {
  if (!value) return ''
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value
  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) return ''
  const pad = (part) => String(part).padStart(2, '0')
  return `${parsed.getFullYear()}-${pad(parsed.getMonth() + 1)}-${pad(parsed.getDate())}`
}
const validDate = (value) => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false
  const parsed = new Date(`${value}T00:00:00Z`)
  return !Number.isNaN(parsed.getTime()) && parsed.toISOString().slice(0, 10) === value
}

function BlogModal({ item, onClose, onSave }) {
  const [category, setCategory] = useState(CATEGORY_ALIASES[item?.category] || item?.category || '')
  const [title, setTitle] = useState(item?.title || '')
  const [author, setAuthor] = useState(item?.author || '')
  const [date, setDate] = useState(dateInputValue(item?.date))
  const [description, setDescription] = useState(item?.description || '')
  const [media, setMedia] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(item?.mediaUrl || '')
  const [previewType, setPreviewType] = useState(item?.mediaType || 'image')
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)
  const fileInputRef = useRef(null)

  useEffect(() => () => {
    if (previewUrl?.startsWith('blob:')) URL.revokeObjectURL(previewUrl)
  }, [previewUrl])

  const selectMedia = (event) => {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return
    const type = IMAGE_TYPES.has(file.type) ? 'image' : VIDEO_TYPES.has(file.type) ? 'video' : ''
    let message = ''
    if (!type) message = 'Upload a JPG, PNG, WebP, MP4, or WebM file.'
    else if (type === 'image' && file.size > MAX_IMAGE_SIZE) message = 'Image must be 3 MB or smaller.'
    else if (type === 'video' && file.size > MAX_VIDEO_SIZE) message = 'Video must be 8 MB or smaller.'
    if (message) {
      setErrors((current) => ({ ...current, media: message }))
      return
    }
    if (previewUrl?.startsWith('blob:')) URL.revokeObjectURL(previewUrl)
    setMedia(file)
    setPreviewType(type)
    setPreviewUrl(URL.createObjectURL(file))
    setErrors((current) => ({ ...current, media: '' }))
  }

  const submit = async (event) => {
    event.preventDefault()
    const trimmedTitle = normalizeSpaces(title)
    const trimmedAuthor = normalizeSpaces(author)
    const trimmedDescription = description.trim()
    const nextErrors = {}
    if (!CATEGORY_OPTIONS.includes(category)) nextErrors.category = 'Select a valid category.'
    if (!trimmedTitle) nextErrors.title = 'Title is required.'
    else if (countWords(trimmedTitle) > 12) nextErrors.title = 'Title must contain 12 words or fewer.'
    else if (trimmedTitle.length > 180) nextErrors.title = 'Title must contain 180 characters or fewer.'
    if (!trimmedAuthor) nextErrors.author = 'Blog shared person name is required.'
    else if (trimmedAuthor.length < 2) nextErrors.author = 'Blog shared person name must contain at least 2 characters.'
    else if (trimmedAuthor.length > 80) nextErrors.author = 'Blog shared person name must contain 80 characters or fewer.'
    else if (!/[\p{L}\p{M}]/u.test(trimmedAuthor) || !/^[\p{L}\p{M} .'-]+$/u.test(trimmedAuthor)) nextErrors.author = 'Use only letters, spaces, periods, apostrophes, or hyphens.'
    if (!date) nextErrors.date = 'Blog date is required.'
    else if (!validDate(date)) nextErrors.date = 'Enter a valid blog date.'
    else if (date > today()) nextErrors.date = 'Blog date cannot be in the future.'
    if (!trimmedDescription) nextErrors.description = 'Description is required.'
    else if (countWords(trimmedDescription) > 500) nextErrors.description = 'Description must contain 500 words or fewer.'
    if (!item && !media) nextErrors.media = 'Upload an image or video.'
    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors)
      return
    }
    setSaving(true)
    try {
      await onSave({ category, title: trimmedTitle, author: trimmedAuthor, date, description: trimmedDescription, media })
    } catch (error) {
      setErrors((current) => ({ ...current, ...error.fields, form: error.message }))
    } finally {
      setSaving(false)
    }
  }

  return createPortal(
    <div className="modal-layer" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && !saving && onClose()}>
      <section className="gallery-modal blog-modal" role="dialog" aria-modal="true" aria-labelledby="blog-modal-title">
        <header>
          <div><span className="content-kicker">Blog details</span><h2 id="blog-modal-title">{item ? 'Edit Blog' : 'Add Blog'}</h2></div>
          <button type="button" onClick={onClose} disabled={saving} aria-label="Close dialog"><Icon name="close" /></button>
        </header>
        <form onSubmit={submit} noValidate>
          <label>
            <span className="field-label-row"><strong>Category</strong></span>
            <select value={category} onChange={(event) => { setCategory(event.target.value); setErrors((current) => ({ ...current, category: '' })) }} aria-invalid={Boolean(errors.category)}>
              <option value="">Select category</option>
              {CATEGORY_OPTIONS.map((option) => <option value={option} key={option}>{option}</option>)}
            </select>
          </label>
          {errors.category && <em>{errors.category}</em>}

          <label>
            <span className="field-label-row"><strong>Title</strong><small className={countWords(title) > 12 ? 'over-limit' : ''}>{countWords(title)} / 12 words</small></span>
            <input value={title} maxLength="180" onChange={(event) => { setTitle(event.target.value); setErrors((current) => ({ ...current, title: '' })) }} placeholder="Enter blog title" aria-invalid={Boolean(errors.title)} />
          </label>
          {errors.title && <em>{errors.title}</em>}

          <label>
            <span className="field-label-row"><strong>Blog Shared Person Name</strong><small>{author.length} / 80 characters</small></span>
            <input value={author} maxLength="80" onChange={(event) => { setAuthor(event.target.value); setErrors((current) => ({ ...current, author: '' })) }} placeholder="Enter shared person name" aria-invalid={Boolean(errors.author)} />
          </label>
          {errors.author && <em>{errors.author}</em>}

          <label>
            <span className="field-label-row"><strong>Calendar</strong></span>
            <input type="date" value={date} max={today()} onChange={(event) => { setDate(event.target.value); setErrors((current) => ({ ...current, date: '' })) }} aria-invalid={Boolean(errors.date)} />
          </label>
          {errors.date && <em>{errors.date}</em>}

          <label>
            <span className="field-label-row"><strong>Description</strong><small className={countWords(description) > 500 ? 'over-limit' : ''}>{countWords(description)} / 500 words</small></span>
            <textarea value={description} onChange={(event) => { setDescription(event.target.value); setErrors((current) => ({ ...current, description: '' })) }} placeholder="Enter the full blog description" rows="9" aria-invalid={Boolean(errors.description)} />
          </label>
          {errors.description && <em>{errors.description}</em>}

          <div className="blog-modal-preview">
            {previewUrl ? previewType === 'video'
              ? <video src={previewUrl} controls preload="metadata" />
              : <img src={previewUrl} alt="Blog preview" />
              : <Icon name="blog" />}
          </div>
          <input ref={fileInputRef} className="gallery-file-input" type="file" accept=".jpg,.jpeg,.png,.webp,.mp4,.webm,image/jpeg,image/png,image/webp,video/mp4,video/webm" onChange={selectMedia} />
          <button className="gallery-upload-button" type="button" onClick={() => fileInputRef.current?.click()}>{previewUrl ? 'Change Image or Video' : 'Upload Image or Video'}</button>
          <small className="gallery-modal-help">JPG, PNG or WebP · Max 3 MB &nbsp;|&nbsp; MP4 or WebM · Max 8 MB</small>
          {errors.media && <em className="blog-media-error">{errors.media}</em>}
          {errors.form && <em className="blog-form-error">{errors.form}</em>}

          <div className="modal-actions"><button type="button" onClick={onClose} disabled={saving}>Cancel</button><button className="primary" type="submit" disabled={saving}>{saving ? 'Saving...' : item ? 'Save Changes' : 'Add Blog'}</button></div>
        </form>
      </section>
    </div>,
    document.body,
  )
}

export default BlogModal
