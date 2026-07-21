import { useCallback, useEffect, useRef, useState } from 'react';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { toast } from 'react-toastify';
import { statesList, stateCitiesMap } from '../utils/indiaData';
import { getProducts } from '../services/productsApi';
import { submitEnquiry } from '../services/enquiriesApi';
import SearchableDropdown from './SearchableDropdown';
import './ServiceEnquiryModal.css';

const PhoneInputComponent = PhoneInput.default || PhoneInput;

const EMPTY_FORM = {
  roomType: '',
  areaSqFt: '',
  boxesRequired: '',
  tileType: '',
  fullName: '',
  email: '',
  phone: '91',
  address1: '',
  address2: '',
  state: '',
  city: '',
  message: '',
};

const NAME_PATTERN = /^[A-Za-z ]+$/;
const ROOM_PATTERN = /^[A-Za-z ]+$/;
const ADDRESS_PATTERN = /^[a-zA-Z0-9\s,./-]*$/;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const wordCount = (value) => value.trim() ? value.trim().split(/\s+/).length : 0;
const normalizeWhitespace = (value) => value.trim().replace(/\s+/g, ' ');

function getFieldError(field, value) {
  const trimmed = typeof value === 'string' ? value.trim() : value;

  switch (field) {
    case 'roomType':
      return trimmed && ROOM_PATTERN.test(trimmed) ? '' : 'Please enter a valid room type using letters and spaces only.';
    case 'areaSqFt':
      return Number(value) > 0 ? '' : 'Please enter an area greater than 0 square feet.';
    case 'boxesRequired':
      return Number.isInteger(Number(value)) && Number(value) > 0 ? '' : 'Please enter at least 1 box.';
    case 'tileType':
      return value ? '' : 'Please select a type of tile.';
    case 'fullName':
      return trimmed && NAME_PATTERN.test(trimmed) ? '' : 'Please enter a valid name (letters and spaces only).';
    case 'email':
      return EMAIL_PATTERN.test(trimmed) ? '' : 'Please enter a valid email address.';
    case 'phone':
      return /^91\d{10}$/.test(String(value).replace(/\D/g, '')) ? '' : 'Please enter a valid 10-digit mobile number.';
    case 'address1':
      return trimmed && trimmed.length <= 150 && ADDRESS_PATTERN.test(value) ? '' : 'Address contains invalid characters or exceeds 150 characters.';
    case 'address2':
      return !trimmed || (trimmed.length <= 150 && ADDRESS_PATTERN.test(value)) ? '' : 'Address contains invalid characters or exceeds 150 characters.';
    case 'state':
      return value ? '' : 'Please select your state.';
    case 'city':
      return value ? '' : 'Please select your city.';
    case 'message':
      return trimmed && wordCount(value) <= 100 ? '' : 'Message is required and must not exceed 100 words.';
    default:
      return '';
  }
}

export default function ServiceEnquiryModal({ isOpen, onClose, sourceService }) {
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const firstFieldRef = useRef(null);

  const [tileTypes, setTileTypes] = useState([]);

  useEffect(() => {
    getProducts()
      .then((data) => {
        const types = [...new Set(data
          .filter(p => p.category === 'Tiles')
          .map(p => p.productType)
          .filter(Boolean)
        )];
        setTileTypes(types);
      })
      .catch((err) => {
        console.error('Failed to load dynamic tile types for ServiceEnquiryModal:', err);
      });
  }, []);

  const resetAndClose = useCallback(() => {
    setFormData(EMPTY_FORM);
    setErrors({});
    setIsSubmitting(false);
    onClose();
  }, [onClose]);

  useEffect(() => {
    if (!isOpen) return undefined;

    const previousOverflow = document.body.style.overflow;
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') resetAndClose();
    };

    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', handleKeyDown);
    const focusTimer = window.setTimeout(() => firstFieldRef.current?.focus(), 80);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleKeyDown);
      window.clearTimeout(focusTimer);
    };
  }, [isOpen, resetAndClose]);

  if (!isOpen) return null;

  const setLiveError = (field, value) => {
    setErrors((current) => ({ ...current, [field]: getFieldError(field, value) }));
  };

  const handleInputChange = ({ target: { name, value } }) => {
    if ((name === 'roomType' || name === 'fullName') && value && !/^[A-Za-z ]*$/.test(value)) return;
    if ((name === 'address1' || name === 'address2') && (!ADDRESS_PATTERN.test(value) || value.length > 150)) return;
    if (name === 'areaSqFt' && value && !/^\d*(\.\d{0,2})?$/.test(value)) return;
    if (name === 'boxesRequired' && value && !/^\d+$/.test(value)) return;

    const nextValue = (name === 'roomType' || name === 'fullName') ? value.replace(/^\s+/, '') : value;
    setFormData((current) => ({ ...current, [name]: nextValue }));
    setLiveError(name, nextValue);
  };

  const trimOnBlur = (field) => {
    setFormData((current) => {
      const value = normalizeWhitespace(current[field]);
      setLiveError(field, value);
      return { ...current, [field]: value };
    });
  };

  const handlePhoneChange = (phone) => {
    const digits = phone.replace(/\D/g, '');
    if (!digits.startsWith('91') || digits.length > 12) return;
    setFormData((current) => ({ ...current, phone: digits }));
    setLiveError('phone', digits);
  };

  const handleStateChange = (event) => {
    const state = event.target.value;
    setFormData((current) => ({ ...current, state, city: '' }));
    setErrors((current) => ({
      ...current,
      state: getFieldError('state', state),
      city: 'Please select your city.',
    }));
  };

  const handleCityChange = (event) => {
    const city = event.target.value;
    setFormData((current) => ({ ...current, city }));
    setLiveError('city', city);
  };

  const validateAll = () => {
    const nextErrors = Object.keys(formData).reduce((result, field) => ({
      ...result,
      [field]: getFieldError(field, formData[field]),
    }), {});

    setErrors(nextErrors);
    return Object.values(nextErrors).every((error) => !error);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validateAll()) return;

    setIsSubmitting(true);
    const payload = {
      type: 'service',
      sourceService,
      ...formData,
      phone: `+${formData.phone}`,
      roomType: normalizeWhitespace(formData.roomType),
      fullName: normalizeWhitespace(formData.fullName),
      email: formData.email.trim(),
      address1: normalizeWhitespace(formData.address1),
      address2: normalizeWhitespace(formData.address2),
      message: normalizeWhitespace(formData.message),
    };

    try {
      await submitEnquiry(payload);
      toast.success(`Thank you, ${payload.fullName}. Your enquiry has been submitted.`);
      resetAndClose();
    } catch (error) {
      setErrors((current) => ({ ...current, ...(error.fields || {}) }));
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const cities = formData.state ? stateCitiesMap[formData.state] || [] : [];
  const messageWords = wordCount(formData.message);
  const errorProps = (field) => ({
    'aria-invalid': Boolean(errors[field]),
    'aria-describedby': errors[field] ? `service-${field}-error` : undefined,
  });
  const Error = ({ field }) => errors[field]
    ? <span id={`service-${field}-error`} className="error-text" role="alert">{errors[field]}</span>
    : null;

  return (
    <div className="contact-modal-overlay" onMouseDown={resetAndClose}>
      <div
        className="contact-modal-content service-enquiry-modal"
        onMouseDown={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="service-enquiry-title"
      >
        <button className="contact-modal-close" onClick={resetAndClose} aria-label="Close enquiry form" type="button">&times;</button>
        <div className="contact-modal-header">
          <p className="contact-modal-eyebrow">SJ CERAMICS · PRODUCT ENQUIRY</p>
          <h3 id="service-enquiry-title">Enquiry Form</h3>
        </div>

        <form onSubmit={handleSubmit} className="contact-modal-form" noValidate>
          <section className="service-enquiry-section" aria-labelledby="room-details-title">
            <h4 id="room-details-title" className="service-enquiry-section-title">Room Details</h4>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="service-roomType">Room Type <span className="required">*</span></label>
                <input ref={firstFieldRef} type="text" id="service-roomType" name="roomType" value={formData.roomType} onChange={handleInputChange} onBlur={() => trimOnBlur('roomType')} placeholder="Bathroom, Bedroom, Living Room" className={errors.roomType ? 'error' : ''} aria-required="true" {...errorProps('roomType')} />
                <Error field="roomType" />
              </div>
              <div className="form-group">
                <label htmlFor="service-areaSqFt">Area in Square Feet <span className="required">*</span></label>
                <input type="number" id="service-areaSqFt" name="areaSqFt" min="0.01" step="0.01" inputMode="decimal" value={formData.areaSqFt} onChange={handleInputChange} placeholder="e.g. 250" className={errors.areaSqFt ? 'error' : ''} aria-required="true" {...errorProps('areaSqFt')} />
                <Error field="areaSqFt" />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="service-boxesRequired">Number of Boxes Required <span className="required">*</span></label>
                <input type="number" id="service-boxesRequired" name="boxesRequired" min="1" step="1" inputMode="numeric" value={formData.boxesRequired} onChange={handleInputChange} placeholder="e.g. 10" className={errors.boxesRequired ? 'error' : ''} aria-required="true" {...errorProps('boxesRequired')} />
                <Error field="boxesRequired" />
              </div>
              <div className="form-group">
                <label htmlFor="service-tileType">Type of Tile <span className="required">*</span></label>
                <select id="service-tileType" name="tileType" value={formData.tileType} onChange={handleInputChange} className={errors.tileType ? 'error' : ''} aria-required="true" {...errorProps('tileType')}>
                  <option value="">{tileTypes.length ? 'Select tile type' : 'No product types available'}</option>
                  {tileTypes.map((tileType) => <option value={tileType} key={tileType}>{tileType}</option>)}
                </select>
                <Error field="tileType" />
              </div>
            </div>
          </section>

          <section className="service-enquiry-section" aria-labelledby="contact-details-title">
            <h4 id="contact-details-title" className="service-enquiry-section-title">Contact &amp; Address Details</h4>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="service-fullName">Full Name <span className="required">*</span></label>
                <input type="text" id="service-fullName" name="fullName" value={formData.fullName} onChange={handleInputChange} onBlur={() => trimOnBlur('fullName')} placeholder="Your full name" className={errors.fullName ? 'error' : ''} aria-required="true" {...errorProps('fullName')} />
                <Error field="fullName" />
              </div>
              <div className="form-group">
                <label htmlFor="service-phone">Phone Number <span className="required">*</span></label>
                <div className={`phone-input-wrapper ${errors.phone ? 'error' : ''}`}>
                  <PhoneInputComponent country="in" onlyCountries={['in']} disableDropdown countryCodeEditable={false} value={formData.phone} onChange={handlePhoneChange} inputProps={{ id: 'service-phone', name: 'phone', inputMode: 'numeric', required: true, 'aria-required': 'true', ...errorProps('phone') }} containerClass="react-phone-container" inputClass="react-phone-input-field" />
                </div>
                <Error field="phone" />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="service-email">Email Address <span className="required">*</span></label>
              <input type="email" id="service-email" name="email" value={formData.email} onChange={handleInputChange} onBlur={() => trimOnBlur('email')} placeholder="name@domain.com" className={errors.email ? 'error' : ''} aria-required="true" {...errorProps('email')} />
              <Error field="email" />
            </div>

            <div className="form-group">
              <label htmlFor="service-address1">Address Line 1 <span className="required">*</span></label>
              <input type="text" id="service-address1" name="address1" value={formData.address1} onChange={handleInputChange} onBlur={() => trimOnBlur('address1')} maxLength="150" placeholder="House number, street and landmark" className={errors.address1 ? 'error' : ''} aria-required="true" {...errorProps('address1')} />
              <span className="char-counter">{formData.address1.length}/150 characters</span>
              <Error field="address1" />
            </div>

            <div className="form-group">
              <label htmlFor="service-address2">Address Line 2 <span className="optional">Optional</span></label>
              <input type="text" id="service-address2" name="address2" value={formData.address2} onChange={handleInputChange} onBlur={() => trimOnBlur('address2')} maxLength="150" placeholder="Apartment, suite or unit" className={errors.address2 ? 'error' : ''} {...errorProps('address2')} />
              <span className="char-counter">{formData.address2.length}/150 characters</span>
              <Error field="address2" />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="service-state">State <span className="required">*</span></label>
                <select id="service-state" name="state" value={formData.state} onChange={handleStateChange} className={errors.state ? 'error' : ''} aria-required="true" {...errorProps('state')}>
                  <option value="">Select your state</option>
                  {statesList.map((state) => <option value={state} key={state}>{state}</option>)}
                </select>
                <Error field="state" />
              </div>
              <div className="form-group">
                <label htmlFor="service-city">City <span className="required">*</span></label>
                <SearchableDropdown id="service-city" name="city" options={cities} value={formData.city} onChange={handleCityChange} placeholder={formData.state ? 'Select your city' : 'Choose a state first'} disabled={!formData.state} error={Boolean(errors.city)} ariaInvalid={Boolean(errors.city)} ariaDescribedby={errors.city ? 'service-city-error' : undefined} />
                <Error field="city" />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="service-message">Message <span className="required">*</span></label>
              <textarea id="service-message" name="message" value={formData.message} onChange={handleInputChange} onBlur={() => trimOnBlur('message')} rows="4" placeholder="Tell us about your tile requirements" className={errors.message ? 'error' : ''} aria-required="true" {...errorProps('message')} />
              <span className={`word-counter ${messageWords > 100 ? 'limit-exceeded' : ''}`}>{messageWords}/100 words</span>
              <Error field="message" />
            </div>
          </section>

          <div className="contact-modal-actions">
            <button type="button" className="btn-cancel" onClick={resetAndClose} disabled={isSubmitting}>Cancel</button>
            <button type="submit" className="btn-submit" disabled={isSubmitting}>{isSubmitting ? 'Sending…' : 'Send Enquiry'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
