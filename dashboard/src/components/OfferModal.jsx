import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import Icon from './Icon'

const MAX_IMAGE_SIZE = 3 * 1024 * 1024
const ALLOWED_IMAGE_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp'])
const CATEGORIES = ['Tiles', 'Sanitary Wares', 'Bath Fittings', 'Others']
const ARRIVAL_STATUSES = ['Coming soon', 'Available soon', 'Showroom arrival']
const countWords = (value) => value.trim() ? value.trim().split(/\s+/).length : 0
const sectionLabels = { todays_offer: "Today's Offer", launching_offer: 'Launching Offer', new_arrivals: 'New Arrivals' }

const initialValues = (item, sectionType) => ({
  sectionType,
  productName: item?.productName || '',
  category: item?.category || '',
  size: item?.size || '',
  finish: item?.finish || '',
  mrp: item?.mrp ?? '',
  offerPrice: item?.offerPrice ?? '',
  availability: item?.availability || '',
  arrivalStatus: item?.arrivalStatus || (sectionType === 'new_arrivals' ? 'Coming soon' : ''),
})

const validate = (values, image, editing) => {
  const errors = {}
  const name = values.productName.trim()
  const size = values.size.trim()
  const finish = values.finish.trim()
  const availability = values.availability.trim()
  if (!name) errors.productName = 'Product name is required.'
  else if (name.length < 2 || name.length > 100) errors.productName = 'Product name must contain 2-100 characters.'
  else if (countWords(name) > 12) errors.productName = 'Product name must contain 12 words or fewer.'
  else if (/[<>]/.test(name)) errors.productName = 'Product name contains unsupported characters.'
  if (!CATEGORIES.includes(values.category)) errors.category = 'Select a valid category.'
  if (!size) errors.size = 'Size is required.'
  else if (size.length < 2 || size.length > 50) errors.size = 'Size must contain 2-50 characters.'
  else if (!/^[\p{L}\p{N}\s×xX./-]+$/u.test(size)) errors.size = 'Size contains unsupported characters.'
  if (!finish) errors.finish = 'Finish is required.'
  else if (finish.length < 2 || finish.length > 60) errors.finish = 'Finish must contain 2-60 characters.'
  else if (!/^[\p{L}\p{N}\s/&().,-]+$/u.test(finish)) errors.finish = 'Finish contains unsupported characters.'
  if (!availability) errors.availability = 'Availability is required.'
  else if (availability.length < 5 || availability.length > 150) errors.availability = 'Availability must contain 5-150 characters.'
  else if (countWords(availability) > 20) errors.availability = 'Availability must contain 20 words or fewer.'
  else if (/[<>]/.test(availability)) errors.availability = 'Availability contains unsupported characters.'

  if (values.sectionType === 'new_arrivals') {
    if (!ARRIVAL_STATUSES.includes(values.arrivalStatus)) errors.arrivalStatus = 'Select a valid arrival status.'
  } else {
    const validPrice = (value) => /^\d+(\.\d{1,2})?$/.test(String(value).trim()) && Number(value) > 0 && Number(value) <= 1000000
    if (!validPrice(values.mrp)) errors.mrp = 'MRP must be between 0.01 and 10,00,000 with up to 2 decimal places.'
    if (!validPrice(values.offerPrice)) errors.offerPrice = 'Offer price must be between 0.01 and 10,00,000 with up to 2 decimal places.'
    else if (validPrice(values.mrp) && Number(values.offerPrice) >= Number(values.mrp)) errors.offerPrice = 'Offer price must be lower than MRP.'
  }
  if (!editing && !image) errors.image = 'Offer image is required.'
  return errors
}

function OfferModal({ item, sectionType, onClose, onSave }) {
  const [values, setValues] = useState(() => initialValues(item, sectionType))
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

  const change = (field) => (event) => {
    setValues((current) => ({ ...current, [field]: event.target.value }))
    setErrors((current) => ({ ...current, [field]: '' }))
  }

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
    const nextErrors = validate(values, image, Boolean(item))
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length) {
      requestAnimationFrame(() => document.querySelector('.offer-modal [aria-invalid="true"]')?.focus())
      return
    }
    setSaving(true)
    try {
      await onSave({
        ...values,
        productName: values.productName.trim().replace(/\s+/g, ' '),
        size: values.size.trim().replace(/\s+/g, ' '),
        finish: values.finish.trim().replace(/\s+/g, ' '),
        availability: values.availability.trim().replace(/\s+/g, ' '),
        image,
      })
    } catch (error) {
      setErrors((current) => ({ ...current, ...(error.fields || {}) }))
    } finally {
      setSaving(false)
    }
  }

  const fieldError = (field) => errors[field] ? `${field}-error` : undefined
  const invalid = (field) => Boolean(errors[field])

  return createPortal(
    <div className="modal-layer" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && !saving && onClose()}>
      <section className="offer-modal" role="dialog" aria-modal="true" aria-labelledby="offer-modal-title">
        <header>
          <div><span className="content-kicker">{sectionLabels[sectionType]}</span><h2 id="offer-modal-title">{item ? 'Edit Card' : 'Add Card'}</h2></div>
          <button type="button" onClick={onClose} disabled={saving} aria-label="Close dialog"><Icon name="close" /></button>
        </header>
        <form onSubmit={handleSubmit} noValidate>
          <div className="offer-form-grid">
            <label className="offer-field offer-field-wide">
              <span><strong>Product name</strong><small className={countWords(values.productName) > 12 ? 'over-limit' : ''}>{countWords(values.productName)} / 12 words</small></span>
              <input value={values.productName} onChange={change('productName')} maxLength="100" placeholder="Enter product name" aria-invalid={invalid('productName')} aria-describedby={fieldError('productName')} />
              {errors.productName && <em id="productName-error">{errors.productName}</em>}
            </label>
            <label className="offer-field">
              <span><strong>Category</strong></span>
              <select value={values.category} onChange={change('category')} aria-invalid={invalid('category')} aria-describedby={fieldError('category')}>
                <option value="">Select category</option>{CATEGORIES.map((category) => <option key={category}>{category}</option>)}
              </select>
              {errors.category && <em id="category-error">{errors.category}</em>}
            </label>
            <label className="offer-field">
              <span><strong>Size</strong><small>{values.size.length} / 50</small></span>
              <input value={values.size} onChange={change('size')} maxLength="50" placeholder="600x600 mm" aria-invalid={invalid('size')} aria-describedby={fieldError('size')} />
              {errors.size && <em id="size-error">{errors.size}</em>}
            </label>
            <label className="offer-field">
              <span><strong>Finish</strong><small>{values.finish.length} / 60</small></span>
              <input value={values.finish} onChange={change('finish')} maxLength="60" placeholder="Glossy/High Glossy" aria-invalid={invalid('finish')} aria-describedby={fieldError('finish')} />
              {errors.finish && <em id="finish-error">{errors.finish}</em>}
            </label>
            {sectionType === 'new_arrivals' ? (
              <label className="offer-field">
                <span><strong>Arrival status</strong></span>
                <select value={values.arrivalStatus} onChange={change('arrivalStatus')} aria-invalid={invalid('arrivalStatus')} aria-describedby={fieldError('arrivalStatus')}>
                  {ARRIVAL_STATUSES.map((status) => <option key={status}>{status}</option>)}
                </select>
                {errors.arrivalStatus && <em id="arrivalStatus-error">{errors.arrivalStatus}</em>}
              </label>
            ) : (
              <>
                <label className="offer-field"><span><strong>MRP (₹)</strong></span><input type="number" min="0.01" max="1000000" step="0.01" value={values.mrp} onChange={change('mrp')} placeholder="350" aria-invalid={invalid('mrp')} aria-describedby={fieldError('mrp')} />{errors.mrp && <em id="mrp-error">{errors.mrp}</em>}</label>
                <label className="offer-field"><span><strong>Offer price (₹)</strong></span><input type="number" min="0.01" max="1000000" step="0.01" value={values.offerPrice} onChange={change('offerPrice')} placeholder="290" aria-invalid={invalid('offerPrice')} aria-describedby={fieldError('offerPrice')} />{errors.offerPrice && <em id="offerPrice-error">{errors.offerPrice}</em>}</label>
              </>
            )}
            <label className="offer-field offer-field-wide">
              <span><strong>Availability</strong><small className={countWords(values.availability) > 20 ? 'over-limit' : ''}>{countWords(values.availability)} / 20 words</small></span>
              <input value={values.availability} onChange={change('availability')} maxLength="150" placeholder="Availability will be announced soon" aria-invalid={invalid('availability')} aria-describedby={fieldError('availability')} />
              {errors.availability && <em id="availability-error">{errors.availability}</em>}
            </label>
          </div>

          <div className="offer-image-editor">
            <div className="offer-image-preview">{previewUrl ? <img src={previewUrl} alt="Offer preview" /> : <Icon name="gallery" />}</div>
            <div><input ref={fileInputRef} type="file" accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp" onChange={handleImage} /><button type="button" onClick={() => fileInputRef.current?.click()}>{previewUrl ? 'Change Image' : 'Upload Image'}</button><small>JPG, PNG or WebP · Maximum 3 MB (3 MB is allowed)</small>{errors.image && <em id="image-error">{errors.image}</em>}</div>
          </div>

          <div className="modal-actions"><button type="button" onClick={onClose} disabled={saving}>Cancel</button><button className="primary" type="submit" disabled={saving}>{saving ? 'Saving...' : item ? 'Save Changes' : 'Add Card'}</button></div>
        </form>
      </section>
    </div>,
    document.body,
  )
}

export default OfferModal
