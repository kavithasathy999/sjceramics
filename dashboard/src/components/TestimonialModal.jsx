import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import Icon from './Icon'

const countWords = (value) => value.trim().split(/\s+/).filter(Boolean).length
const normalize = (value) => value.trim().replace(/\s+/g, ' ')
const hasUnsupportedControl = (value) => Array.from(value).some((character) => character.codePointAt(0) < 32)

function TestimonialModal({ item, onClose, onSave }) {
  const [customerName, setCustomerName] = useState(item?.customerName || '')
  const [designation, setDesignation] = useState(item?.designation || '')
  const [description, setDescription] = useState(item?.description || '')
  const [starRating, setStarRating] = useState(item?.starRating ? String(item.starRating) : '')
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const closeOnEscape = (event) => { if (event.key === 'Escape' && !saving) onClose() }
    document.addEventListener('keydown', closeOnEscape)
    return () => document.removeEventListener('keydown', closeOnEscape)
  }, [onClose, saving])

  const submit = async (event) => {
    event.preventDefault()
    const normalizedName = normalize(customerName)
    const normalizedDesignation = normalize(designation)
    const normalizedDescription = normalize(description)
    const numericRating = Number(starRating)
    const nextErrors = {}

    if (!normalizedName) nextErrors.customerName = 'Customer name is required.'
    else if (normalizedName.length < 2 || normalizedName.length > 80) nextErrors.customerName = 'Customer name must contain 2-80 characters.'
    else if (countWords(normalizedName) > 8) nextErrors.customerName = 'Customer name must contain 8 words or fewer.'
    else if (!/[\p{L}\p{M}]/u.test(normalizedName) || !/^[\p{L}\p{M} .'-]+$/u.test(normalizedName)) nextErrors.customerName = 'Use only letters, spaces, periods, apostrophes, or hyphens.'

    if (!normalizedDesignation) nextErrors.designation = 'Designation is required.'
    else if (normalizedDesignation.length < 2 || normalizedDesignation.length > 100) nextErrors.designation = 'Designation must contain 2-100 characters.'
    else if (countWords(normalizedDesignation) > 12) nextErrors.designation = 'Designation must contain 12 words or fewer.'
    else if (!/^[\p{L}\p{M}\p{N} &/,.()'-]+$/u.test(normalizedDesignation)) nextErrors.designation = 'Designation contains unsupported characters.'

    if (!normalizedDescription) nextErrors.description = 'Description is required.'
    else if (countWords(normalizedDescription) < 3) nextErrors.description = 'Description must contain at least 3 words.'
    else if (countWords(normalizedDescription) > 100) nextErrors.description = 'Description must contain 100 words or fewer.'
    else if (normalizedDescription.length > 700) nextErrors.description = 'Description must contain 700 characters or fewer.'
    else if (/[<>]/.test(normalizedDescription) || hasUnsupportedControl(normalizedDescription)) nextErrors.description = 'Description contains unsupported characters.'

    if (!Number.isInteger(numericRating) || numericRating < 1 || numericRating > 5) nextErrors.starRating = 'Select a star rating between 1 and 5.'

    setErrors(nextErrors)
    if (Object.keys(nextErrors).length) return
    setSaving(true)
    try {
      await onSave({ customerName: normalizedName, designation: normalizedDesignation, description: normalizedDescription, starRating: numericRating })
    } catch (error) {
      setErrors((current) => ({ ...current, ...(error.fields || {}), form: error.message }))
    } finally {
      setSaving(false)
    }
  }

  return createPortal(
    <div className="modal-layer" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && !saving && onClose()}>
      <section className="gallery-modal testimonial-modal" role="dialog" aria-modal="true" aria-labelledby="testimonial-modal-title">
        <header><div><span className="content-kicker">Testimonial details</span><h2 id="testimonial-modal-title">{item ? 'Edit Testimonial' : 'Add Testimonial'}</h2></div><button type="button" onClick={onClose} disabled={saving} aria-label="Close dialog"><Icon name="close" /></button></header>
        <form onSubmit={submit} noValidate>
          <label><span className="field-label-row"><strong>Customer Name</strong><small className={countWords(customerName) > 8 ? 'over-limit' : ''}>{countWords(customerName)} / 8 words</small></span><input value={customerName} maxLength="80" onChange={(event) => { setCustomerName(event.target.value); setErrors((current) => ({ ...current, customerName: '' })) }} placeholder="Enter customer name" aria-invalid={Boolean(errors.customerName)} /></label>
          {errors.customerName && <em>{errors.customerName}</em>}
          <label><span className="field-label-row"><strong>Designation</strong><small className={countWords(designation) > 12 ? 'over-limit' : ''}>{countWords(designation)} / 12 words</small></span><input value={designation} maxLength="100" onChange={(event) => { setDesignation(event.target.value); setErrors((current) => ({ ...current, designation: '' })) }} placeholder="Enter designation" aria-invalid={Boolean(errors.designation)} /></label>
          {errors.designation && <em>{errors.designation}</em>}
          <label><span className="field-label-row"><strong>Description</strong><small className={countWords(description) > 100 ? 'over-limit' : ''}>{countWords(description)} / 100 words · {description.length} / 700 characters</small></span><textarea value={description} maxLength="700" rows="7" onChange={(event) => { setDescription(event.target.value); setErrors((current) => ({ ...current, description: '' })) }} placeholder="Enter customer testimonial" aria-invalid={Boolean(errors.description)} /></label>
          {errors.description && <em>{errors.description}</em>}
          <label><span className="field-label-row"><strong>Star Rating</strong></span><select value={starRating} onChange={(event) => { setStarRating(event.target.value); setErrors((current) => ({ ...current, starRating: '' })) }} aria-invalid={Boolean(errors.starRating)}><option value="">Select star rating</option>{[5, 4, 3, 2, 1].map((rating) => <option value={rating} key={rating}>{rating} Star{rating === 1 ? '' : 's'}</option>)}</select></label>
          {errors.starRating && <em>{errors.starRating}</em>}
          {errors.form && <em>{errors.form}</em>}
          <div className="modal-actions"><button type="button" onClick={onClose} disabled={saving}>Cancel</button><button className="primary" type="submit" disabled={saving}>{saving ? 'Saving...' : item ? 'Save Changes' : 'Add Testimonial'}</button></div>
        </form>
      </section>
    </div>,
    document.body,
  )
}

export default TestimonialModal
