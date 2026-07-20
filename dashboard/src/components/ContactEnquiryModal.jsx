import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import Icon from './Icon'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
const countWords = (value) => value.trim().split(/\s+/).filter(Boolean).length
const normalize = (value) => value.trim().replace(/\s+/g, ' ')
const hasUnsupportedControl = (value) => Array.from(value).some((character) => {
  const code = character.codePointAt(0)
  return code < 32 && code !== 9 && code !== 10
})

function ContactEnquiryModal({ item, onClose, onSave }) {
  const [values, setValues] = useState({ fullName: item.fullName, email: item.email, phone: item.phone, message: item.message })
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const closeOnEscape = (event) => { if (event.key === 'Escape' && !saving) onClose() }
    document.addEventListener('keydown', closeOnEscape)
    return () => document.removeEventListener('keydown', closeOnEscape)
  }, [onClose, saving])

  const change = (event) => {
    const { name, value } = event.target
    const nextValue = name === 'fullName' ? value.replace(/\p{N}/gu, '') : name === 'phone' ? value.replace(/\D/g, '').slice(0, 10) : value
    setValues((current) => ({ ...current, [name]: nextValue }))
    setErrors((current) => ({ ...current, [name]: '', form: '' }))
  }

  const submit = async (event) => {
    event.preventDefault()
    const normalized = {
      fullName: normalize(values.fullName),
      email: values.email.trim().toLowerCase(),
      phone: values.phone.trim(),
      message: values.message.replace(/\r\n?/g, '\n').trim(),
    }
    const nextErrors = {}
    if (!normalized.fullName) nextErrors.fullName = 'Full name is required.'
    else if (normalized.fullName.length < 2 || normalized.fullName.length > 60) nextErrors.fullName = 'Full name must contain 2-60 characters.'
    else if (countWords(normalized.fullName) > 6) nextErrors.fullName = 'Full name must contain 6 words or fewer.'
    else if (!/[\p{L}\p{M}]/u.test(normalized.fullName) || !/^[\p{L}\p{M} .'-]+$/u.test(normalized.fullName)) nextErrors.fullName = 'Use only letters, spaces, periods, apostrophes, or hyphens.'
    if (!normalized.email) nextErrors.email = 'Email is required.'
    else if (normalized.email.length > 120 || !EMAIL_PATTERN.test(normalized.email)) nextErrors.email = 'Enter a valid email address.'
    if (!normalized.phone) nextErrors.phone = 'Mobile number is required.'
    else if (!/^[6-9]\d{9}$/.test(normalized.phone)) nextErrors.phone = 'Enter a valid 10-digit Indian mobile number.'
    if (!normalized.message) nextErrors.message = 'Your message is required.'
    else if (countWords(normalized.message) < 3) nextErrors.message = 'Your message must contain at least 3 words.'
    else if (countWords(normalized.message) > 100) nextErrors.message = 'Your message must contain 100 words or fewer.'
    else if (normalized.message.length > 700) nextErrors.message = 'Your message must contain 700 characters or fewer.'
    else if (/[<>]/.test(normalized.message) || hasUnsupportedControl(normalized.message)) nextErrors.message = 'Your message contains unsupported characters.'

    setValues(normalized)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length) return
    setSaving(true)
    try {
      await onSave(normalized)
    } catch (error) {
      setErrors((current) => ({ ...current, ...(error.fields || {}), form: error.message }))
    } finally {
      setSaving(false)
    }
  }

  return createPortal(
    <div className="modal-layer" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && !saving && onClose()}>
      <section className="gallery-modal contact-enquiry-modal" role="dialog" aria-modal="true" aria-labelledby="contact-enquiry-modal-title">
        <header><div><span className="content-kicker">Contact enquiry details</span><h2 id="contact-enquiry-modal-title">Edit Contact Enquiry</h2></div><button type="button" onClick={onClose} disabled={saving} aria-label="Close dialog"><Icon name="close" /></button></header>
        <form onSubmit={submit} noValidate>
          <label><span className="field-label-row"><strong>Customer Name</strong><small>{countWords(values.fullName)} / 6 words</small></span><input name="fullName" value={values.fullName} maxLength="60" onChange={change} placeholder="Enter customer name" aria-invalid={Boolean(errors.fullName)} /></label>
          {errors.fullName && <em>{errors.fullName}</em>}
          <label><span className="field-label-row"><strong>Email Address</strong></span><input name="email" type="email" value={values.email} maxLength="120" onChange={change} placeholder="Enter email address" aria-invalid={Boolean(errors.email)} /></label>
          {errors.email && <em>{errors.email}</em>}
          <label><span className="field-label-row"><strong>Mobile Number</strong></span><input name="phone" type="tel" inputMode="numeric" value={values.phone} maxLength="10" onChange={change} placeholder="Enter mobile number" aria-invalid={Boolean(errors.phone)} /></label>
          {errors.phone && <em>{errors.phone}</em>}
          <label><span className="field-label-row"><strong>Message</strong><small>{countWords(values.message)} / 100 words · {values.message.length} / 700 characters</small></span><textarea name="message" value={values.message} maxLength="700" rows="7" onChange={change} placeholder="Enter customer message" aria-invalid={Boolean(errors.message)} /></label>
          {errors.message && <em>{errors.message}</em>}
          {errors.form && <em>{errors.form}</em>}
          <div className="modal-actions"><button type="button" onClick={onClose} disabled={saving}>Cancel</button><button className="primary" type="submit" disabled={saving}>{saving ? 'Saving...' : 'Save Changes'}</button></div>
        </form>
      </section>
    </div>,
    document.body,
  )
}

export default ContactEnquiryModal
