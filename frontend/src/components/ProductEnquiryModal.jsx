import { useCallback, useEffect, useRef, useState } from 'react';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { toast } from 'react-toastify';
import { statesList, stateCitiesMap } from '../utils/indiaData';
import SearchableDropdown from './SearchableDropdown';
import './ProductEnquiryModal.css';

const PhoneInputComponent = PhoneInput.default || PhoneInput;
const ADDRESS_PATTERN = /^[A-Za-z0-9\s,./-]*$/;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const wordCount = (value) => value.trim() ? value.trim().split(/\s+/).length : 0;
const normalizeSpaces = (value) => value.trim().replace(/\s+/g, ' ');
const formatPrice = (price) => new Intl.NumberFormat('en-IN').format(price);

const createInitialForm = () => ({
  fullName: '',
  email: '',
  phone: '91',
  address1: '',
  address2: '',
  state: '',
  city: '',
  message: '',
});

function getFieldError(field, value) {
  const trimmed = typeof value === 'string' ? normalizeSpaces(value) : value;
  switch (field) {
    case 'fullName':
      return /^[A-Za-z]+(?: [A-Za-z]+)*$/.test(trimmed)
        ? ''
        : 'Enter a valid name using letters and spaces only.';
    case 'email':
      return EMAIL_PATTERN.test(trimmed) ? '' : 'Enter a valid email address.';
    case 'phone':
      return /^91\d{10}$/.test(String(value).replace(/\D/g, ''))
        ? ''
        : 'Enter a valid 10-digit Indian mobile number.';
    case 'address1':
      return trimmed && trimmed.length <= 150 && ADDRESS_PATTERN.test(value)
        ? ''
        : 'Enter a valid address using up to 150 characters.';
    case 'address2':
      return !trimmed || (trimmed.length <= 150 && ADDRESS_PATTERN.test(value))
        ? ''
        : 'Enter a valid address using up to 150 characters.';
    case 'state':
      return value ? '' : 'Select a state.';
    case 'city':
      return value ? '' : 'Select a city.';
    case 'message':
      return trimmed && wordCount(value) <= 50
        ? ''
        : 'Message is required and must not exceed 50 words.';
    default:
      return '';
  }
}

export default function ProductEnquiryModal({ product, onClose }) {
  const [formData, setFormData] = useState(createInitialForm);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const firstFieldRef = useRef(null);

  const resetAndClose = useCallback(() => {
    setFormData(createInitialForm());
    setErrors({});
    onClose();
  }, [onClose]);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const handleKeyDown = (event) => event.key === 'Escape' && resetAndClose();
    document.addEventListener('keydown', handleKeyDown);
    const focusTimer = window.setTimeout(() => firstFieldRef.current?.focus(), 80);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleKeyDown);
      window.clearTimeout(focusTimer);
    };
  }, [resetAndClose]);

  const setLiveError = (field, value) => {
    setErrors((current) => ({ ...current, [field]: getFieldError(field, value) }));
  };

  const handleInputChange = ({ target: { name, value } }) => {
    if (name === 'fullName' && value && !/^[A-Za-z ]*$/.test(value)) return;
    if ((name === 'address1' || name === 'address2') &&
      (!ADDRESS_PATTERN.test(value) || value.length > 150)) return;

    const nextValue = name === 'fullName' ? value.replace(/^\s+/, '') : value;
    setFormData((current) => ({ ...current, [name]: nextValue }));
    setLiveError(name, nextValue);
  };

  const trimOnBlur = (field) => {
    setFormData((current) => {
      const value = normalizeSpaces(current[field]);
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

  const handleStateChange = ({ target: { value } }) => {
    setFormData((current) => ({ ...current, state: value, city: '' }));
    setErrors((current) => ({
      ...current,
      state: getFieldError('state', value),
      city: value ? 'Select a city.' : '',
    }));
  };

  const handleCityChange = ({ target: { value } }) => {
    setFormData((current) => ({ ...current, city: value }));
    setLiveError('city', value);
  };

  const validateAll = () => {
    const nextErrors = Object.keys(formData).reduce(
      (result, field) => ({ ...result, [field]: getFieldError(field, formData[field]) }),
      {}
    );
    setErrors(nextErrors);
    return Object.values(nextErrors).every((error) => !error);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!validateAll()) return;

    setIsSubmitting(true);
    const payload = {
      productId: product.id,
      productName: product.name,
      ...formData,
      phone: `+${formData.phone}`,
      fullName: normalizeSpaces(formData.fullName),
      email: formData.email.trim(),
      address1: normalizeSpaces(formData.address1),
      address2: normalizeSpaces(formData.address2),
      message: normalizeSpaces(formData.message),
    };

    // Frontend-only submission boundary until the enquiry API is available.
    window.setTimeout(() => {
      console.info('Submitted product enquiry:', payload);
      toast.success(`Thank you, ${payload.fullName}. Your product enquiry has been received.`);
      setIsSubmitting(false);
      resetAndClose();
    }, 600);
  };

  const cities = formData.state ? stateCitiesMap[formData.state] || [] : [];
  const messageWords = wordCount(formData.message);
  const errorProps = (field) => ({
    'aria-invalid': Boolean(errors[field]),
    'aria-describedby': errors[field] ? `product-${field}-error` : undefined,
  });
  const Error = ({ field }) => errors[field]
    ? <span id={`product-${field}-error`} className="error-text" role="alert">{errors[field]}</span>
    : null;

  return (
    <div className="contact-modal-overlay product-enquiry-overlay" onMouseDown={resetAndClose}>
      <div
        className="contact-modal-content product-enquiry-modal"
        onMouseDown={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="product-enquiry-title"
      >
        <button className="contact-modal-close" onClick={resetAndClose} aria-label="Close enquiry form" type="button">&times;</button>

        <div className="product-enquiry-summary">
          <img src={product.image} alt={product.name} />
          <div>
            <span>{product.category} · KAG</span>
            <h3 id="product-enquiry-title">{product.name}</h3>
            <p>
              <del>MRP ₹{formatPrice(product.mrp)}</del>
              <strong>Offer Price ₹{formatPrice(product.offerPrice)}</strong>
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="contact-modal-form product-enquiry-form" noValidate>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="product-fullName">Full Name <span className="required">*</span></label>
              <input ref={firstFieldRef} id="product-fullName" name="fullName" value={formData.fullName} onChange={handleInputChange} onBlur={() => trimOnBlur('fullName')} placeholder="Your full name" className={errors.fullName ? 'error' : ''} required {...errorProps('fullName')} />
              <Error field="fullName" />
            </div>
            <div className="form-group">
              <label htmlFor="product-email">Email Address <span className="required">*</span></label>
              <input type="email" id="product-email" name="email" value={formData.email} onChange={handleInputChange} onBlur={() => trimOnBlur('email')} placeholder="name@domain.com" className={errors.email ? 'error' : ''} required {...errorProps('email')} />
              <Error field="email" />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="product-phone">Phone Number <span className="required">*</span></label>
            <div className={`phone-input-wrapper ${errors.phone ? 'error' : ''}`}>
              <PhoneInputComponent
                country="in"
                onlyCountries={['in']}
                disableDropdown
                countryCodeEditable={false}
                value={formData.phone}
                onChange={handlePhoneChange}
                inputProps={{ id: 'product-phone', name: 'phone', inputMode: 'numeric', required: true, ...errorProps('phone') }}
                containerClass="react-phone-container"
                inputClass="react-phone-input-field"
              />
            </div>
            <Error field="phone" />
          </div>

          <div className="form-group">
            <label htmlFor="product-address1">Address Line 1 <span className="required">*</span></label>
            <input id="product-address1" name="address1" value={formData.address1} onChange={handleInputChange} onBlur={() => trimOnBlur('address1')} maxLength="150" placeholder="House number, street and landmark" className={errors.address1 ? 'error' : ''} required {...errorProps('address1')} />
            <span className="char-counter">{formData.address1.length}/150 characters</span>
            <Error field="address1" />
          </div>

          <div className="form-group">
            <label htmlFor="product-address2">Address Line 2 <span className="optional">Optional</span></label>
            <input id="product-address2" name="address2" value={formData.address2} onChange={handleInputChange} onBlur={() => trimOnBlur('address2')} maxLength="150" placeholder="Apartment, suite or unit" className={errors.address2 ? 'error' : ''} {...errorProps('address2')} />
            <span className="char-counter">{formData.address2.length}/150 characters</span>
            <Error field="address2" />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="product-state">State <span className="required">*</span></label>
              <select id="product-state" name="state" value={formData.state} onChange={handleStateChange} className={errors.state ? 'error' : ''} required {...errorProps('state')}>
                <option value="">Select your state</option>
                {statesList.map((state) => <option value={state} key={state}>{state}</option>)}
              </select>
              <Error field="state" />
            </div>
            <div className="form-group">
              <label htmlFor="product-city">City <span className="required">*</span></label>
              <SearchableDropdown id="product-city" name="city" options={cities} value={formData.city} onChange={handleCityChange} placeholder={formData.state ? 'Search your city' : 'Choose a state first'} disabled={!formData.state} error={Boolean(errors.city)} ariaInvalid={Boolean(errors.city)} ariaDescribedby={errors.city ? 'product-city-error' : undefined} />
              <Error field="city" />
            </div>
          </div>

          <section className="product-enquiry-details" aria-labelledby="selected-product-details-title">
            <div className="product-enquiry-details-heading">
              <span>Selected Product</span>
              <h4 id="selected-product-details-title">Product Details</h4>
            </div>
            <dl className="product-enquiry-details-grid">
              <div>
                <dt>Product Name</dt>
                <dd>{product.name}</dd>
              </div>
              <div>
                <dt>Category</dt>
                <dd>{product.category}</dd>
              </div>
              <div>
                <dt>Brand</dt>
                <dd>{product.brand}</dd>
              </div>
              <div>
                <dt>Size</dt>
                <dd>{product.size}</dd>
              </div>
              <div>
                <dt>Type</dt>
                <dd>{product.type}</dd>
              </div>
              <div>
                <dt>Material</dt>
                <dd>{product.material}</dd>
              </div>
              <div>
                <dt>Finish</dt>
                <dd>{product.finish}</dd>
              </div>
              <div>
                <dt>Where to Use</dt>
                <dd>{product.application}</dd>
              </div>
              <div>
                <dt>MRP</dt>
                <dd><del>₹{formatPrice(product.mrp)}</del></dd>
              </div>
              <div className="product-enquiry-offer-price">
                <dt>Offer Price</dt>
                <dd>₹{formatPrice(product.offerPrice)}</dd>
              </div>
            </dl>
          </section>

          <div className="form-group">
            <label htmlFor="product-message">Message <span className="required">*</span></label>
            <textarea id="product-message" name="message" value={formData.message} onChange={handleInputChange} onBlur={() => trimOnBlur('message')} rows="3" placeholder="Tell us what you would like to know" className={errors.message ? 'error' : ''} required {...errorProps('message')} />
            <span className={`word-counter ${messageWords > 50 ? 'limit-exceeded' : ''}`}>{messageWords}/50 words</span>
            <Error field="message" />
          </div>

          <div className="contact-modal-actions">
            <button type="button" className="btn-cancel" onClick={resetAndClose} disabled={isSubmitting}>Cancel</button>
            <button type="submit" className="btn-submit" disabled={isSubmitting}>{isSubmitting ? 'Sending…' : 'Send Enquiry'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
