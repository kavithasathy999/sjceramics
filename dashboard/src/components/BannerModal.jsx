import { useState } from 'react'
import Icon from './Icon'

const MAX_IMAGE_SIZE = 3 * 1024 * 1024
const ALLOWED_IMAGE_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp'])

const countWords = (value) => value.trim() ? value.trim().split(/\s+/).length : 0
const createClientId = () => `slide-${Date.now()}-${Math.random().toString(36).slice(2)}`

const createSlide = (sortOrder, banner) => ({
  clientId: createClientId(),
  title: banner?.title || '',
  description: banner?.description || '',
  image: banner?.image || '',
  sortOrder: banner?.sortOrder || sortOrder,
  placement: banner?.placement || 'Home hero',
  theme: banner?.theme || 'ruby',
})

function BannerModal({ banner, onClose, onSave, existingSortOrders, nextSortOrder }) {
  const [slides, setSlides] = useState(() => [createSlide(nextSortOrder, banner)])
  const [activeIndex, setActiveIndex] = useState(0)
  const [errors, setErrors] = useState({})
  const [savedSlideIds, setSavedSlideIds] = useState(() => new Set())
  const [submitting, setSubmitting] = useState(false)
  const [serverError, setServerError] = useState('')
  const activeSlide = slides[activeIndex]
  const activeErrors = errors[activeSlide.clientId] || {}
  const activeSlideSaved = savedSlideIds.has(activeSlide.clientId)
  const allSlidesSaved = slides.every((slide) => savedSlideIds.has(slide.clientId))

  const markSlideDirty = (clientId) => {
    setSavedSlideIds((current) => {
      const next = new Set(current)
      next.delete(clientId)
      return next
    })
  }

  const updateSlide = (field, value) => {
    const clientId = activeSlide.clientId
    setSlides((current) => current.map((slide, index) => index === activeIndex ? { ...slide, [field]: value } : slide))
    setErrors((current) => ({ ...current, [clientId]: { ...current[clientId], [field]: '', slide: '' } }))
    markSlideDirty(clientId)
  }

  const validateSlide = (index) => {
    const slide = slides[index]
    const slideErrors = {}
    const titleWords = countWords(slide.title)
    const descriptionWords = countWords(slide.description)
    const order = Number(slide.sortOrder)
    const occupiedOrders = new Set(existingSortOrders.map(Number))

    slides.forEach((otherSlide, otherIndex) => {
      if (otherIndex !== index) {
        const otherOrder = Number(otherSlide.sortOrder)
        if (Number.isInteger(otherOrder) && otherOrder > 0) occupiedOrders.add(otherOrder)
      }
    })

    if (!slide.title.trim()) slideErrors.title = 'Banner title is required.'
    else if (titleWords > 5) slideErrors.title = 'Banner title must contain 5 words or fewer.'

    if (!slide.description.trim()) slideErrors.description = 'Banner description is required.'
    else if (descriptionWords > 20) slideErrors.description = 'Banner description must contain 20 words or fewer.'

    if (!slide.image && (!banner || index > 0)) slideErrors.image = 'Banner image is required.'

    if (!Number.isInteger(order) || order < 1) slideErrors.sortOrder = 'Enter a valid sort order.'
    else if (occupiedOrders.has(order)) slideErrors.sortOrder = 'This sort order is already in use.'

    setErrors((current) => ({ ...current, [slide.clientId]: slideErrors }))
    return Object.keys(slideErrors).length === 0
  }

  const saveActiveSlide = () => {
    if (!validateSlide(activeIndex)) return
    setSavedSlideIds((current) => new Set(current).add(activeSlide.clientId))
  }

  const addSlide = () => {
    if (!allSlidesSaved) return
    const occupiedOrders = [...existingSortOrders, ...slides.map((slide) => Number(slide.sortOrder) || 0)]
    const order = Math.max(0, ...occupiedOrders) + 1
    setSlides((current) => [...current, createSlide(order)])
    setActiveIndex(slides.length)
  }

  const removeSlide = (indexToRemove) => {
    if (slides.length === 1) return
    const removedId = slides[indexToRemove].clientId
    setSlides((current) => current.filter((_, index) => index !== indexToRemove))
    setSavedSlideIds((current) => {
      const next = new Set(current)
      next.delete(removedId)
      return next
    })
    setErrors((current) => {
      const next = { ...current }
      delete next[removedId]
      return next
    })
    setActiveIndex((current) => Math.max(0, current > indexToRemove ? current - 1 : Math.min(current, slides.length - 2)))
  }

  const handleImage = (event) => {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return

    if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
      setErrors((current) => ({ ...current, [activeSlide.clientId]: { ...current[activeSlide.clientId], image: 'Upload a JPG, PNG, or WebP image.' } }))
      markSlideDirty(activeSlide.clientId)
      return
    }
    if (file.size > MAX_IMAGE_SIZE) {
      setErrors((current) => ({ ...current, [activeSlide.clientId]: { ...current[activeSlide.clientId], image: 'Banner image must be 3 MB or smaller.' } }))
      markSlideDirty(activeSlide.clientId)
      return
    }

    const reader = new FileReader()
    reader.onload = () => updateSlide('image', String(reader.result))
    reader.onerror = () => setErrors((current) => ({ ...current, [activeSlide.clientId]: { ...current[activeSlide.clientId], image: 'Unable to read this image. Try another file.' } }))
    reader.readAsDataURL(file)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!allSlidesSaved) {
      const firstUnsavedIndex = slides.findIndex((slide) => !savedSlideIds.has(slide.clientId))
      setActiveIndex(Math.max(0, firstUnsavedIndex))
      const unsavedSlide = slides[firstUnsavedIndex]
      if (unsavedSlide) {
        setErrors((current) => ({ ...current, [unsavedSlide.clientId]: { ...current[unsavedSlide.clientId], slide: 'Save this slide before saving all banners.' } }))
      }
      return
    }

    setSubmitting(true)
    setServerError('')
    try {
      await onSave(slides.map((slide) => ({
        title: slide.title.trim(),
        description: slide.description.trim(),
        image: slide.image,
        placement: slide.placement,
        theme: slide.theme,
        sortOrder: Number(slide.sortOrder),
      })))
    } catch (error) {
      setServerError(error.message)
      setSubmitting(false)
    }
  }

  return (
    <div className="modal-layer" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section className="banner-modal multi-slide-modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <header>
          <div><span className="content-kicker">Banner details</span><h2 id="modal-title">{banner ? 'Edit banner' : 'Add banners'}</h2></div>
          <button type="button" onClick={onClose} aria-label="Close dialog"><Icon name="close" /></button>
        </header>

        <div className="slide-tabs" aria-label="Banner slides">
          {slides.map((slide, index) => {
            const saved = savedSlideIds.has(slide.clientId)
            return (
              <button
                type="button"
                key={slide.clientId}
                className={`${index === activeIndex ? 'active' : ''} ${errors[slide.clientId] ? 'has-error' : ''} ${saved ? 'saved' : ''}`}
                onClick={() => setActiveIndex(index)}
              >
                Slide {index + 1}
                {saved && <i className="saved-mark" aria-label="Saved">✓</i>}
                {slides.length > 1 && <span onClick={(event) => { event.stopPropagation(); removeSlide(index) }} role="button" tabIndex="0" aria-label={`Remove slide ${index + 1}`}>×</span>}
              </button>
            )
          })}
          <button className="add-slide-button" type="button" onClick={addSlide} disabled={!allSlidesSaved} title={!allSlidesSaved ? 'Save the current slide first' : 'Add another slide'}><Icon name="plus" />Add Slide</button>
        </div>

        <form onSubmit={handleSubmit}>
          {activeErrors.slide && <div className="slide-form-alert" role="alert">{activeErrors.slide}</div>}

          <label>
            <span className="field-label-row"><span>Banner title</span><small className={countWords(activeSlide.title) > 5 ? 'over-limit' : ''}>{countWords(activeSlide.title)} / 5 words</small></span>
            <input value={activeSlide.title} onChange={(event) => updateSlide('title', event.target.value)} placeholder="Enter banner title" />
          </label>
          {activeErrors.title && <span className="modal-error">{activeErrors.title}</span>}

          <label>
            <span className="field-label-row"><span>Banner description</span><small className={countWords(activeSlide.description) > 20 ? 'over-limit' : ''}>{countWords(activeSlide.description)} / 20 words</small></span>
            <textarea value={activeSlide.description} onChange={(event) => updateSlide('description', event.target.value)} placeholder="Enter banner description" rows="4" />
          </label>
          {activeErrors.description && <span className="modal-error">{activeErrors.description}</span>}

          <div className="banner-upload-row">
            <label className="banner-image-field">
              <span>Banner image</span>
              <span className="image-upload-control">
                {activeSlide.image ? <img src={activeSlide.image} alt="Banner preview" /> : <Icon name="banner" />}
                <span><strong>{activeSlide.image ? 'Change image' : 'Upload image'}</strong><small>JPG, PNG or WebP · Max 3 MB</small></span>
                <input type="file" accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp" onChange={handleImage} />
              </span>
            </label>

            <label className="sort-order-field">
              <span>Sort order</span>
              <input type="number" min="1" step="1" value={activeSlide.sortOrder} onChange={(event) => updateSlide('sortOrder', event.target.value)} />
            </label>
          </div>
          {activeErrors.image && <span className="modal-error">{activeErrors.image}</span>}
          {activeErrors.sortOrder && <span className="modal-error">{activeErrors.sortOrder}</span>}

          <div className="slide-save-row">
            <span className={activeSlideSaved ? 'saved' : ''}>{activeSlideSaved ? 'Slide saved' : 'Save this slide to enable Add Slide'}</span>
            <button className="save-slide-button" type="button" onClick={saveActiveSlide}>{activeSlideSaved ? 'Saved' : 'Save Slide'}</button>
          </div>

          <div className="modal-actions">
            {serverError && <span className="modal-server-error" role="alert">{serverError}</span>}
            <button type="button" onClick={onClose} disabled={submitting}>Cancel</button>
            <button className="primary" type="submit" disabled={!allSlidesSaved || submitting}>{submitting ? 'Saving…' : banner ? 'Save Changes' : 'Save Banner'}</button>
          </div>
        </form>
      </section>
    </div>
  )
}

export default BannerModal
