import { useCallback, useEffect, useRef, useState } from 'react';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { toast } from 'react-toastify';
import { statesList, stateCitiesMap } from '../utils/indiaData';
import { PRODUCT_FILTER_OPTIONS, PRODUCT_TYPE_OPTIONS } from '../utils/productCatalogOptions';
import { getProducts } from '../services/productsApi';
import SearchableDropdown from './SearchableDropdown';

const PhoneInputComponent = PhoneInput.default || PhoneInput;

const EMPTY_FORM = {
  fullName: '', email: '', phone: '91', address1: '', address2: '', state: '', city: '', interest: '',
};
const ADDRESS_PATTERN = /^[a-zA-Z0-9\s,./-]*$/;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const wordCount = (value) => value.trim() ? value.trim().split(/\s+/).length : 0;
let nextPreferenceId = 0;
const createProductPreference = () => ({
  id: `product-preference-${nextPreferenceId += 1}`,
  productType: '',
  whereToUse: '',
  tileSize: '',
  roomLength: '',
  roomWidth: '',
});
const isEmptyProductPreference = (row) => (
  !row.productType && !row.whereToUse && !row.tileSize && !row.roomLength && !row.roomWidth
);

function getProductPreferenceErrors(row) {
  const dimensionError = (value) => (
    value && Number(value) > 0 ? '' : 'Enter a value greater than 0.'
  );

  return {
    productType: row.productType ? '' : 'Select a product type.',
    whereToUse: row.whereToUse ? '' : 'Select where to use it.',
    tileSize: row.tileSize ? '' : 'Select a size.',
    roomLength: dimensionError(row.roomLength),
    roomWidth: dimensionError(row.roomWidth),
  };
}

// Returns the precise inline message used by both live validation and submit validation.
function getFieldError(field, value) {
  const trimmed = typeof value === 'string' ? value.trim() : value;
  switch (field) {
    case 'preference': return value ? '' : 'Please select your preference.';
    case 'fullName': return /^[A-Za-z ]+$/.test(trimmed) ? '' : 'Please enter a valid name (letters and spaces only).';
    case 'email': return EMAIL_PATTERN.test(trimmed) ? '' : 'Please enter a valid email address.';
    case 'phone': return /^91\d{10}$/.test(String(value).replace(/\D/g, '')) ? '' : 'Please enter a valid 10-digit mobile number.';
    case 'address1': return trimmed && trimmed.length <= 150 && ADDRESS_PATTERN.test(value) ? '' : 'Address contains invalid characters or exceeds 150 characters.';
    case 'address2': return !trimmed || (trimmed.length <= 150 && ADDRESS_PATTERN.test(value)) ? '' : 'Address contains invalid characters or exceeds 150 characters.';
    case 'state': return value ? '' : 'Please select your state.';
    case 'city': return value ? '' : 'Please select your city.';
    case 'interest': return trimmed && wordCount(value) <= 50 ? '' : 'This field is required and must not exceed 50 words.';
    default: return '';
  }
}

export default function ContactModal({ isOpen, onClose }) {
  const [preference, setPreference] = useState('');
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [productPreferences, setProductPreferences] = useState(() => [createProductPreference()]);
  const [productPreferenceErrors, setProductPreferenceErrors] = useState({});
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const preferenceRef = useRef(null);

  const [dynamicTypes, setDynamicTypes] = useState(PRODUCT_TYPE_OPTIONS);
  const [dynamicUsages, setDynamicUsages] = useState(PRODUCT_FILTER_OPTIONS.usage);
  const [dynamicSizes, setDynamicSizes] = useState(PRODUCT_FILTER_OPTIONS.sizes);

  useEffect(() => {
    getProducts()
      .then((data) => {
        const types = [...new Set(data.map(p => p.productType).filter(Boolean))];
        const usages = [...new Set(data.map(p => p.whereToUse).filter(Boolean))];
        const sizes = [...new Set(data.map(p => p.size).filter(Boolean))];
        
        if (types.length) setDynamicTypes(types);
        if (usages.length) setDynamicUsages(usages);
        if (sizes.length) setDynamicSizes(sizes);
      })
      .catch((err) => {
        console.error('Failed to load dynamic contact modal options:', err);
      });
  }, []);

  const resetAndClose = useCallback(() => {
    setPreference('');
    setFormData(EMPTY_FORM);
    setProductPreferences([createProductPreference()]);
    setProductPreferenceErrors({});
    setErrors({});
    onClose();
  }, [onClose]);

  useEffect(() => {
    if (!isOpen) return undefined;
    const onKeyDown = (event) => event.key === 'Escape' && resetAndClose();
    document.addEventListener('keydown', onKeyDown);
    const focusTimer = window.setTimeout(() => preferenceRef.current?.focus(), 80);
    return () => { document.removeEventListener('keydown', onKeyDown); window.clearTimeout(focusTimer); };
  }, [isOpen, resetAndClose]);

  if (!isOpen) return null;

  const setLiveError = (field, value) => {
    setErrors((current) => ({ ...current, [field]: getFieldError(field, value) }));
  };

  const handlePreferenceChange = (event) => {
    const value = event.target.value;
    setPreference(value);
    setFormData(EMPTY_FORM);
    setProductPreferences([createProductPreference()]);
    setProductPreferenceErrors({});
    setErrors({ preference: getFieldError('preference', value) });
  };

  const handleInputChange = ({ target: { name, value } }) => {
    // Prevent disallowed characters rather than allowing invalid data to accumulate.
    if (name === 'fullName' && value && !/^[A-Za-z ]*$/.test(value)) return;
    if ((name === 'address1' || name === 'address2') && (!ADDRESS_PATTERN.test(value) || value.length > 150)) return;
    const nextValue = name === 'fullName' ? value.replace(/^\s+/, '') : value;
    setFormData((current) => ({ ...current, [name]: nextValue }));
    setLiveError(name, nextValue);
  };

  const trimOnBlur = (field) => {
    setFormData((current) => {
      const value = current[field].trim();
      setLiveError(field, value);
      return { ...current, [field]: value };
    });
  };

  const handlePhoneChange = (phone) => {
    const digits = phone.replace(/\D/g, '');
    // react-phone-input supplies the country code; never allow more than +91 plus ten digits.
    if (!digits.startsWith('91') || digits.length > 12) return;
    setFormData((current) => ({ ...current, phone: digits }));
    setLiveError('phone', digits);
  };

  const handleStateChange = (event) => {
    const state = event.target.value;
    setFormData((current) => ({ ...current, state, city: '' }));
    setErrors((current) => ({ ...current, state: getFieldError('state', state), city: 'Please select your city.' }));
  };

  const handleCityChange = (event) => {
    const city = event.target.value;
    setFormData((current) => ({ ...current, city }));
    setLiveError('city', city);
  };

  const handleProductPreferenceChange = (rowId, field, value) => {
    if ((field === 'roomLength' || field === 'roomWidth') && value && !/^\d*(?:\.\d{0,2})?$/.test(value)) return;

    setProductPreferences((current) => current.map((row) => (
      row.id === rowId ? { ...row, [field]: value } : row
    )));
    setProductPreferenceErrors((current) => ({
      ...current,
      [rowId]: { ...current[rowId], [field]: '' },
    }));
  };

  const validateProductPreference = (row) => {
    const rowErrors = getProductPreferenceErrors(row);
    setProductPreferenceErrors((current) => ({ ...current, [row.id]: rowErrors }));
    return Object.values(rowErrors).every((error) => !error);
  };

  const handleAddProductPreference = () => {
    const lastRow = productPreferences[productPreferences.length - 1];
    if (!validateProductPreference(lastRow)) return;
    setProductPreferences((current) => [...current, createProductPreference()]);
  };

  const handleRemoveProductPreference = (rowId) => {
    setProductPreferences((current) => current.filter((row) => row.id !== rowId));
    setProductPreferenceErrors((current) => {
      const nextErrors = { ...current };
      delete nextErrors[rowId];
      return nextErrors;
    });
  };

  const getActiveProductPreferences = () => productPreferences.filter((row, index) => (
    index === 0 || !isEmptyProductPreference(row)
  ));

  const validateProductPreferences = () => {
    const activeRows = getActiveProductPreferences();
    const nextErrors = activeRows.reduce((result, row) => ({
      ...result,
      [row.id]: getProductPreferenceErrors(row),
    }), {});
    setProductPreferenceErrors(nextErrors);
    return Object.values(nextErrors).every((rowErrors) => (
      Object.values(rowErrors).every((error) => !error)
    ));
  };

  const validateAll = () => {
    const values = { preference, ...formData };
    const nextErrors = Object.keys(values).reduce((result, field) => ({ ...result, [field]: getFieldError(field, values[field]) }), {});
    setErrors(nextErrors);
    const formIsValid = Object.values(nextErrors).every((error) => !error);
    const preferencesAreValid = validateProductPreferences();
    return formIsValid && preferencesAreValid;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!validateAll()) return;
    setIsSubmitting(true);
    const payload = {
      preference,
      ...formData,
      productPreferences: getActiveProductPreferences().map((row) => ({
        productType: row.productType,
        whereToUse: row.whereToUse,
        tileSize: row.tileSize,
        roomLength: row.roomLength,
        roomWidth: row.roomWidth,
      })),
      phone: `+${formData.phone}`,
      fullName: formData.fullName.trim(),
      email: formData.email.trim(),
      address1: formData.address1.trim(),
      address2: formData.address2.trim(),
      interest: formData.interest.trim(),
    };
    // Replace this boundary with the enquiry API call when it is available.
    window.setTimeout(() => {
      console.info('Submitted inquiry:', payload);
      toast.success(`Thank you, ${payload.fullName}. Your enquiry has been submitted.`);
      setIsSubmitting(false);
      resetAndClose();
    }, 600);
  };

  const cities = formData.state ? stateCitiesMap[formData.state] || [] : [];
  const interestWords = wordCount(formData.interest);
  const errorProps = (field) => ({ 'aria-invalid': Boolean(errors[field]), 'aria-describedby': errors[field] ? `${field}-error` : undefined });
  const Error = ({ field }) => errors[field] ? <span id={`${field}-error`} className="error-text" role="alert">{errors[field]}</span> : null;

  return (
    <div className="contact-modal-overlay" onMouseDown={resetAndClose}>
      <div className="contact-modal-content" onMouseDown={(event) => event.stopPropagation()} role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <button className="contact-modal-close" onClick={resetAndClose} aria-label="Close contact form" type="button">&times;</button>
        <div className="contact-modal-header">
          <p className="contact-modal-eyebrow">SJ CERAMICS · ENQUIRY</p>
          <h3 id="modal-title">Plan your perfect space</h3>
        </div>
        <form onSubmit={handleSubmit} className="contact-modal-form" noValidate>
          <div className="form-group">
            <label htmlFor="preference">Select Preference <span className="required">*</span></label>
            <select ref={preferenceRef} id="preference" value={preference} onChange={handlePreferenceChange} className={errors.preference ? 'error' : ''} aria-required="true" {...errorProps('preference')}>
              <option value="">Select your preference</option><option value="Budget">Budget</option><option value="Premium">Premium</option><option value="Luxury">Luxury</option>
            </select>
            <Error field="preference" />
          </div>
          <div className="preference-based-fields">
            <div className="form-row">
              <div className="form-group"><label htmlFor="fullName">Full Name <span className="required">*</span></label><input type="text" id="fullName" name="fullName" value={formData.fullName} onChange={handleInputChange} onBlur={() => trimOnBlur('fullName')} placeholder="Your full name" className={errors.fullName ? 'error' : ''} aria-required="true" {...errorProps('fullName')} /><Error field="fullName" /></div>
              <div className="form-group"><label htmlFor="phone">Phone Number <span className="required">*</span></label><div className={`phone-input-wrapper ${errors.phone ? 'error' : ''}`}><PhoneInputComponent country="in" onlyCountries={['in']} disableDropdown countryCodeEditable={false} value={formData.phone} onChange={handlePhoneChange} inputProps={{ id: 'phone', name: 'phone', inputMode: 'numeric', required: true, 'aria-required': 'true', ...errorProps('phone') }} containerClass="react-phone-container" inputClass="react-phone-input-field" /></div><Error field="phone" /></div>
            </div>
            <div className="form-group"><label htmlFor="email">Email Address <span className="required">*</span></label><input type="email" id="email" name="email" value={formData.email} onChange={handleInputChange} onBlur={() => trimOnBlur('email')} placeholder="name@domain.com" className={errors.email ? 'error' : ''} aria-required="true" {...errorProps('email')} /><Error field="email" /></div>
            <div className="form-group"><label htmlFor="address1">Address Line 1 <span className="required">*</span></label><input type="text" id="address1" name="address1" value={formData.address1} onChange={handleInputChange} onBlur={() => trimOnBlur('address1')} maxLength="150" placeholder="House number, street and landmark" className={errors.address1 ? 'error' : ''} aria-required="true" {...errorProps('address1')} /><span className="char-counter">{formData.address1.length}/150 characters</span><Error field="address1" /></div>
            <div className="form-group"><label htmlFor="address2">Address Line 2 <span className="optional">Optional</span></label><input type="text" id="address2" name="address2" value={formData.address2} onChange={handleInputChange} onBlur={() => trimOnBlur('address2')} maxLength="150" placeholder="Apartment, suite or unit" className={errors.address2 ? 'error' : ''} {...errorProps('address2')} /><span className="char-counter">{formData.address2.length}/150 characters</span><Error field="address2" /></div>
            <div className="form-row">
              <div className="form-group"><label htmlFor="state">State <span className="required">*</span></label><SearchableDropdown id="state" name="state" options={statesList} value={formData.state} onChange={handleStateChange} placeholder="Select your state" error={Boolean(errors.state)} ariaInvalid={Boolean(errors.state)} ariaDescribedby={errors.state ? 'state-error' : undefined} /><Error field="state" /></div>
              <div className="form-group"><label htmlFor="city">City <span className="required">*</span></label><SearchableDropdown id="city" name="city" options={cities} value={formData.city} onChange={handleCityChange} placeholder={formData.state ? 'Select your city' : 'Choose a state first'} disabled={!formData.state} error={Boolean(errors.city)} ariaInvalid={Boolean(errors.city)} ariaDescribedby={errors.city ? 'city-error' : undefined} /><Error field="city" /></div>
            </div>
            <section className="product-preferences" aria-labelledby="product-preferences-title">
              <div className="product-preferences-heading">
                <h4 id="product-preferences-title">Choose your preferences</h4>
              </div>
              <div className="product-preferences-table">
                <div className="product-preferences-columns" aria-hidden="true">
                  <span>Product Type</span>
                  <span>Where to Use</span>
                  <span>Size of the Tile</span>
                  <span>Room Length (ft)</span>
                  <span>Room Width (ft)</span>
                  <span>Action</span>
                </div>
                {productPreferences.map((row, index) => {
                  const rowErrors = productPreferenceErrors[row.id] || {};
                  const isLastRow = index === productPreferences.length - 1;
                  return (
                    <div className="product-preference-row" key={row.id}>
                      <div className="product-preference-field" data-label="Product Type">
                        <label className="visually-hidden" htmlFor={`${row.id}-type`}>Product Type</label>
                        <SearchableDropdown
                          id={`${row.id}-type`}
                          name="productType"
                          options={dynamicTypes}
                          value={row.productType}
                          onChange={(event) => handleProductPreferenceChange(row.id, 'productType', event.target.value)}
                          placeholder="Select"
                          error={Boolean(rowErrors.productType)}
                          ariaInvalid={Boolean(rowErrors.productType)}
                          ariaDescribedby={rowErrors.productType ? `${row.id}-type-error` : undefined}
                        />
                        {rowErrors.productType && <span id={`${row.id}-type-error`} className="error-text">{rowErrors.productType}</span>}
                      </div>
                      <div className="product-preference-field" data-label="Where to Use">
                        <label className="visually-hidden" htmlFor={`${row.id}-usage`}>Where to Use</label>
                        <SearchableDropdown
                          id={`${row.id}-usage`}
                          name="whereToUse"
                          options={dynamicUsages}
                          value={row.whereToUse}
                          onChange={(event) => handleProductPreferenceChange(row.id, 'whereToUse', event.target.value)}
                          placeholder="Select"
                          error={Boolean(rowErrors.whereToUse)}
                          ariaInvalid={Boolean(rowErrors.whereToUse)}
                          ariaDescribedby={rowErrors.whereToUse ? `${row.id}-usage-error` : undefined}
                        />
                        {rowErrors.whereToUse && <span id={`${row.id}-usage-error`} className="error-text">{rowErrors.whereToUse}</span>}
                      </div>
                      <div className="product-preference-field" data-label="Size of the Tile">
                        <label className="visually-hidden" htmlFor={`${row.id}-size`}>Size of the Tile</label>
                        <SearchableDropdown
                          id={`${row.id}-size`}
                          name="tileSize"
                          options={dynamicSizes}
                          value={row.tileSize}
                          onChange={(event) => handleProductPreferenceChange(row.id, 'tileSize', event.target.value)}
                          placeholder="Select"
                          error={Boolean(rowErrors.tileSize)}
                          ariaInvalid={Boolean(rowErrors.tileSize)}
                          ariaDescribedby={rowErrors.tileSize ? `${row.id}-size-error` : undefined}
                        />
                        {rowErrors.tileSize && <span id={`${row.id}-size-error`} className="error-text">{rowErrors.tileSize}</span>}
                      </div>
                      <div className="product-preference-field" data-label="Room Length (ft)">
                        <label className="visually-hidden" htmlFor={`${row.id}-length`}>Room Length in feet</label>
                        <input
                          id={`${row.id}-length`}
                          type="text"
                          inputMode="decimal"
                          value={row.roomLength}
                          onChange={(event) => handleProductPreferenceChange(row.id, 'roomLength', event.target.value)}
                          placeholder="Length"
                          className={rowErrors.roomLength ? 'error' : ''}
                          aria-invalid={Boolean(rowErrors.roomLength)}
                        />
                        {rowErrors.roomLength && <span className="error-text">{rowErrors.roomLength}</span>}
                      </div>
                      <div className="product-preference-field" data-label="Room Width (ft)">
                        <label className="visually-hidden" htmlFor={`${row.id}-width`}>Room Width in feet</label>
                        <input
                          id={`${row.id}-width`}
                          type="text"
                          inputMode="decimal"
                          value={row.roomWidth}
                          onChange={(event) => handleProductPreferenceChange(row.id, 'roomWidth', event.target.value)}
                          placeholder="Width"
                          className={rowErrors.roomWidth ? 'error' : ''}
                          aria-invalid={Boolean(rowErrors.roomWidth)}
                        />
                        {rowErrors.roomWidth && <span className="error-text">{rowErrors.roomWidth}</span>}
                      </div>
                      <div className="product-preference-actions" data-label="Action">
                        {isLastRow && (
                          <button type="button" className="product-preference-add" onClick={handleAddProductPreference}>
                            <i className="fa-solid fa-plus" aria-hidden="true" /> Add
                          </button>
                        )}
                        {productPreferences.length > 1 && (
                          <button type="button" className="product-preference-remove" onClick={() => handleRemoveProductPreference(row.id)} aria-label="Remove preference row">
                            <i className="fa-solid fa-trash" aria-hidden="true" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
            <div className="form-group"><label htmlFor="interest">I am Interested In <span className="required">*</span></label><textarea id="interest" name="interest" value={formData.interest} onChange={handleInputChange} onBlur={() => trimOnBlur('interest')} rows="3" placeholder="Tiles, sanitary ware or bath fittings you are looking for" className={errors.interest ? 'error' : ''} aria-required="true" {...errorProps('interest')} /><span className={`word-counter ${interestWords > 50 ? 'limit-exceeded' : ''}`}>{interestWords}/50 words</span><Error field="interest" /></div>
          </div>
          <div className="contact-modal-actions"><button type="button" className="btn-cancel" onClick={resetAndClose} disabled={isSubmitting}>Cancel</button><button type="submit" className="btn-submit" disabled={isSubmitting}>{isSubmitting ? 'Sending…' : 'Send Enquiry'}</button></div>
        </form>
      </div>
    </div>
  );
}
