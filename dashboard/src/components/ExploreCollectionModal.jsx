import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import Icon from './Icon'

const TYPE_OPTIONS = [
  { value: 'colors', label: 'Choose By Colors' },
  { value: 'size', label: 'Choose By Size' },
  { value: 'thickness', label: 'Choose By Thickness' },
]
const HEX_PATTERN = /^#[0-9A-F]{6}$/
const DECIMAL_PATTERN = /^\d{1,3}(?:\.\d{1,2})?$/
const countWords = (value) => value.trim().split(/\s+/).filter(Boolean).length
const normalize = (value) => value.trim().replace(/\s+/g, ' ')
const sanitizeDecimal = (value) => {
  const cleaned = value.replace(/[^\d.]/g, '')
  const [integer = '', ...decimalParts] = cleaned.split('.')
  const decimal = decimalParts.join('').slice(0, 2)
  return `${integer.slice(0, 3)}${cleaned.includes('.') ? `.${decimal}` : ''}`
}

function ExploreCollectionModal({ item, onClose, onSave }) {
  const [type, setType] = useState(item?.type || '')
  const [colorName, setColorName] = useState(item?.colorName || '')
  const [colorValue, setColorValue] = useState(item?.colorHex || '#DD2328')
  const [width, setWidth] = useState(item?.width == null ? '' : String(item.width))
  const [height, setHeight] = useState(item?.height == null ? '' : String(item.height))
  const [thickness, setThickness] = useState(item?.thickness == null ? '' : String(item.thickness))
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)
  const refs = { type: useRef(null), colorName: useRef(null), colorHex: useRef(null), width: useRef(null), height: useRef(null), thickness: useRef(null) }
  const pickerValue = HEX_PATTERN.test(colorValue.toUpperCase()) ? colorValue : '#FF0055'

  useEffect(() => {
    const closeOnEscape = (event) => { if (event.key === 'Escape' && !saving) onClose() }
    document.addEventListener('keydown', closeOnEscape)
    return () => document.removeEventListener('keydown', closeOnEscape)
  }, [onClose, saving])

  const resetTypeFields = (nextType) => {
    setType(nextType)
    setColorName('')
    setColorValue('#DD2328')
    setWidth('')
    setHeight('')
    setThickness('')
    setErrors({})
  }

  const validateDecimal = (value, field, label, maximum, nextErrors) => {
    if (!value) nextErrors[field] = `${label} is required.`
    else if (!DECIMAL_PATTERN.test(value)) nextErrors[field] = `${label} must be a positive number with up to 2 decimal places.`
    else if (Number(value) <= 0 || Number(value) > maximum) nextErrors[field] = `${label} must be between 0.01 and ${maximum}.`
  }

  const submit = async (event) => {
    event.preventDefault()
    const normalizedName = normalize(colorName)
    const nextErrors = {}
    if (!type) nextErrors.type = 'Collection type is required.'
    if (type === 'colors') {
      if (!normalizedName) nextErrors.colorName = 'Colour name is required.'
      else if (normalizedName.length < 2 || normalizedName.length > 40) nextErrors.colorName = 'Colour name must contain 2-40 characters.'
      else if (countWords(normalizedName) > 5) nextErrors.colorName = 'Colour name must contain 5 words or fewer.'
      else if (!/[\p{L}\p{M}]/u.test(normalizedName) || !/^[\p{L}\p{M}\p{N} '&-]+$/u.test(normalizedName)) nextErrors.colorName = 'Use only letters, numbers, spaces, apostrophes, or hyphens.'
      const unchangedLegacy = Boolean(item && colorValue === item.colorHex && !HEX_PATTERN.test(colorValue.toUpperCase()))
      if (!HEX_PATTERN.test(colorValue.toUpperCase()) && !unchangedLegacy) nextErrors.colorHex = 'Select a valid six-digit colour value.'
    } else if (type === 'size') {
      validateDecimal(width, 'width', 'Width', 999, nextErrors)
      validateDecimal(height, 'height', 'Height', 999, nextErrors)
    } else if (type === 'thickness') {
      validateDecimal(thickness, 'thickness', 'Thickness', 100, nextErrors)
    }
    setColorName(normalizedName)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length) {
      const firstField = Object.keys(nextErrors)[0]
      refs[firstField]?.current?.focus()
      return
    }

    const values = type === 'colors'
      ? { type, colorName: normalizedName, colorHex: colorValue }
      : type === 'size' ? { type, width, height } : { type, thickness }
    setSaving(true)
    try {
      await onSave(values)
    } catch (error) {
      const serverErrors = error.fields || {}
      setErrors((current) => ({ ...current, ...serverErrors, form: error.message }))
      const firstField = Object.keys(serverErrors)[0]
      refs[firstField]?.current?.focus()
    } finally {
      setSaving(false)
    }
  }

  return createPortal(
    <div className="modal-layer" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && !saving && onClose()}>
      <section className="gallery-modal explore-collection-modal" role="dialog" aria-modal="true" aria-labelledby="explore-collection-title">
        <header><div><span className="content-kicker">Explore collection details</span><h2 id="explore-collection-title">{item ? 'Edit Collection' : 'Add Collection'}</h2></div><button type="button" onClick={onClose} disabled={saving} aria-label="Close dialog"><Icon name="close" /></button></header>
        <form onSubmit={submit} noValidate>
          <label><span className="field-label-row"><strong>Collection Type</strong></span><select ref={refs.type} value={type} disabled={Boolean(item)} onChange={(event) => resetTypeFields(event.target.value)} aria-invalid={Boolean(errors.type)}><option value="">Select collection type</option>{TYPE_OPTIONS.map((option) => <option value={option.value} key={option.value}>{option.label}</option>)}</select></label>
          {errors.type && <em>{errors.type}</em>}

          {type === 'colors' && <>
            <label><span className="field-label-row"><strong>Colour Name</strong><small>{countWords(colorName)} / 5 words</small></span><input ref={refs.colorName} value={colorName} maxLength="40" onChange={(event) => { setColorName(event.target.value); setErrors((current) => ({ ...current, colorName: '', form: '' })) }} placeholder="Enter colour name" aria-invalid={Boolean(errors.colorName)} /></label>
            {errors.colorName && <em>{errors.colorName}</em>}
            <label><span className="field-label-row"><strong>Choose Colour</strong><small>{HEX_PATTERN.test(colorValue.toUpperCase()) ? colorValue.toUpperCase() : 'Existing multicolor gradient'}</small></span><div className="collection-color-picker"><input ref={refs.colorHex} type="color" value={pickerValue} onChange={(event) => { setColorValue(event.target.value.toUpperCase()); setErrors((current) => ({ ...current, colorHex: '', form: '' })) }} aria-label="Choose collection colour" /><span style={{ background: colorValue }} /><strong>{HEX_PATTERN.test(colorValue.toUpperCase()) ? colorValue.toUpperCase() : 'Multicolor'}</strong></div></label>
            {errors.colorHex && <em>{errors.colorHex}</em>}
          </>}

          {type === 'size' && <div className="collection-dimension-grid">
            <div><label><span className="field-label-row"><strong>Width</strong><small>Max 999</small></span><input ref={refs.width} value={width} inputMode="decimal" onChange={(event) => { setWidth(sanitizeDecimal(event.target.value)); setErrors((current) => ({ ...current, width: '', form: '' })) }} placeholder="e.g. 12" aria-invalid={Boolean(errors.width)} /></label>{errors.width && <em>{errors.width}</em>}</div>
            <div><label><span className="field-label-row"><strong>Height</strong><small>Max 999</small></span><input ref={refs.height} value={height} inputMode="decimal" onChange={(event) => { setHeight(sanitizeDecimal(event.target.value)); setErrors((current) => ({ ...current, height: '', form: '' })) }} placeholder="e.g. 24" aria-invalid={Boolean(errors.height)} /></label>{errors.height && <em>{errors.height}</em>}</div>
            <div className="collection-value-preview"><span>Display preview</span><strong>{width && height ? `${width}×${height}` : '—'}</strong></div>
          </div>}

          {type === 'thickness' && <>
            <label><span className="field-label-row"><strong>Thickness</strong><small>1-100 mm</small></span><div className="collection-suffix-input"><input ref={refs.thickness} value={thickness} inputMode="decimal" onChange={(event) => { setThickness(sanitizeDecimal(event.target.value)); setErrors((current) => ({ ...current, thickness: '', form: '' })) }} placeholder="e.g. 8.5" aria-invalid={Boolean(errors.thickness)} /><span>mm</span></div></label>
            {errors.thickness && <em>{errors.thickness}</em>}
          </>}

          {errors.form && <em>{errors.form}</em>}
          <div className="modal-actions"><button type="button" onClick={onClose} disabled={saving}>Cancel</button><button className="primary" type="submit" disabled={saving}>{saving ? 'Saving...' : item ? 'Save Changes' : 'Add Collection'}</button></div>
        </form>
      </section>
    </div>,
    document.body,
  )
}

export default ExploreCollectionModal
