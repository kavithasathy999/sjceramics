import { useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import mapBg from '../assets/images/background/map.png';
import contactImg from '../assets/images/background/contact-floating-tile-ivory.png';
import contactImg2 from '../assets/images/background/contact-floating-tile-beige.png';
import ball from '../assets/images/icons/ball.png';
import { submitContactEnquiry } from '../services/contactEnquiriesApi';

const INITIAL_VALUES = { fullName: '', email: '', phone: '', address: '', message: '' };
const FIELD_NAMES = Object.keys(INITIAL_VALUES);
const CONTACT_TOAST_ID = 'contact-enquiry-status';
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const countWords = (value) => value.trim().split(/\s+/).filter(Boolean).length;
const normalize = (value) => value.trim().replace(/\s+/g, ' ');
const hasUnsupportedControl = (value) => Array.from(value).some((character) => {
  const code = character.codePointAt(0);
  return code < 32 && code !== 9 && code !== 10;
});
const notify = (type, message) => {
  const options = { autoClose: 1500, position: 'top-right' };
  if (toast.isActive(CONTACT_TOAST_ID)) {
    toast.update(CONTACT_TOAST_ID, { ...options, render: message, type });
  } else {
    toast[type](message, { ...options, toastId: CONTACT_TOAST_ID });
  }
};

const fieldError = (field, value) => {
  const trimmed = value.trim();
  if (field === 'fullName') {
    const normalized = normalize(value);
    if (!normalized) return 'Full name is required.';
    if (normalized.length < 2 || normalized.length > 60) return 'Full name must contain 2-60 characters.';
    if (countWords(normalized) > 6) return 'Full name must contain 6 words or fewer.';
    if (!/[\p{L}\p{M}]/u.test(normalized) || !/^[\p{L}\p{M} .'-]+$/u.test(normalized)) return 'Use only letters, spaces, periods, apostrophes, or hyphens.';
  }
  if (field === 'email') {
    if (!trimmed) return 'Email is required.';
    if (trimmed.length > 120 || !EMAIL_PATTERN.test(trimmed)) return 'Enter a valid email address.';
  }
  if (field === 'phone') {
    if (!trimmed) return 'Mobile number is required.';
    if (!/^[6-9]\d{9}$/.test(trimmed)) return 'Enter a valid 10-digit Indian mobile number.';
  }
  if (field === 'address') {
    const normalized = normalize(value);
    if (!normalized) return 'Address is required.';
    if (normalized.length < 5 || normalized.length > 200) return 'Address must contain 5-200 characters.';
    if (countWords(normalized) > 35) return 'Address must contain 35 words or fewer.';
    if (/[<>]/.test(normalized) || hasUnsupportedControl(normalized)) return 'Address contains unsupported characters.';
    if (!/^[a-zA-Z0-9\s,./#()'-]+$/.test(normalized)) return 'Enter a valid address (letters, numbers, spaces, commas, periods, etc.).';
  }
  if (field === 'message') {
    if (!trimmed) return 'Your message is required.';
    if (countWords(trimmed) < 3) return 'Your message must contain at least 3 words.';
    if (countWords(trimmed) > 100) return 'Your message must contain 100 words or fewer.';
    if (trimmed.length > 700) return 'Your message must contain 700 characters or fewer.';
    if (/[<>]/.test(trimmed) || hasUnsupportedControl(trimmed)) return 'Your message contains unsupported characters.';
  }
  return '';
};

export default function ContactSection() {
  const [values, setValues] = useState(INITIAL_VALUES);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [status, setStatus] = useState('idle');
  const formRef = useRef(null);
  const refs = { fullName: useRef(null), email: useRef(null), phone: useRef(null), address: useRef(null), message: useRef(null) };
  const resetTimerRef = useRef(null);

  useEffect(() => () => { if (resetTimerRef.current) clearTimeout(resetTimerRef.current); }, []);
  useEffect(() => {
    const clearWarningsOnOutsideClick = (event) => {
      if (!formRef.current?.contains(event.target)) {
        setErrors({});
        setTouched({});
        setStatus((current) => current === 'error' ? 'idle' : current);
      }
    };
    document.addEventListener('click', clearWarningsOnOutsideClick);
    return () => document.removeEventListener('click', clearWarningsOnOutsideClick);
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    const nextValue = name === 'fullName'
      ? value.replace(/\p{N}/gu, '')
      : name === 'phone' ? value.replace(/\D/g, '').slice(0, 10) : value;
    setValues((current) => ({ ...current, [name]: nextValue }));
    if (touched[name]) setErrors((current) => ({ ...current, [name]: fieldError(name, nextValue) }));
  };

  const handleBlur = (event) => {
    const { name, value } = event.target;
    const nextValue = name === 'fullName' ? normalize(value) : name === 'email' ? value.trim().toLowerCase() : value.trim();
    setValues((current) => ({ ...current, [name]: nextValue }));
    setTouched((current) => ({ ...current, [name]: true }));
    setErrors((current) => ({ ...current, [name]: fieldError(name, nextValue) }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const normalizedValues = {
      fullName: normalize(values.fullName),
      email: values.email.trim().toLowerCase(),
      phone: values.phone.trim(),
      address: normalize(values.address),
      message: values.message.replace(/\r\n?/g, '\n').trim(),
    };
    const nextErrors = Object.fromEntries(FIELD_NAMES.map((field) => [field, fieldError(field, normalizedValues[field])]).filter(([, error]) => error));
    setValues(normalizedValues);
    setTouched(Object.fromEntries(FIELD_NAMES.map((field) => [field, true])));
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) {
      notify('error', 'Please correct the highlighted fields.');
      const firstInvalidField = FIELD_NAMES.find((field) => nextErrors[field] && refs[field].current);
      refs[firstInvalidField]?.current?.focus();
      return;
    }

    setStatus('sending');
    try {
      await submitContactEnquiry(normalizedValues);
      setValues(INITIAL_VALUES);
      setTouched({});
      setErrors({});
      setStatus('sent');
      notify('success', 'Your message has been sent successfully.');
      resetTimerRef.current = setTimeout(() => setStatus('idle'), 4000);
    } catch (error) {
      const serverErrors = error.fields || {};
      setErrors((current) => ({ ...current, ...serverErrors }));
      setTouched((current) => ({ ...current, ...Object.fromEntries(Object.keys(serverErrors).map((field) => [field, true])) }));
      setStatus('error');
      notify('error', error.message);
    }
  };

  const errorProps = (field) => ({
    'aria-invalid': Boolean(errors[field]),
    'aria-describedby': errors[field] ? `contact-${field}-error` : undefined,
  });
  const ErrorMessage = ({ field }) => errors[field] ? <span className="contact-field-error" id={`contact-${field}-error`} role="alert">{errors[field]}</span> : null;

  return (
    <section className="contact-one" style={{ '--contact-map-image': `url(${mapBg})` }}>
      <div className="contact-one_curve" />
      <div className="auto-container">
        <div className="inner-container">
          <div className="contact-one_image">
            <img src={contactImg} alt="Ivory marble ceramic tile" />
            <div className="contact-one_ball" style={{ backgroundImage: `url(${ball})` }} />
          </div>
          <div className="contact-one_image-two">
            <img src={contactImg2} alt="Beige stone ceramic tile" />
          </div>

          <div className="row clearfix">
            <div className="contact-one_info-column col-lg-5 col-md-12 col-sm-12">
              <div className="contact-one_info-outer">
                <h2 className="contact-one_title">Feel Free To Contact Us</h2>
                <ul className="contact-one_list">
                  <li>
                    <span className="flaticon-telephone" />
                    <strong>Call Anytime</strong>
                    <a href="tel:+919384105222" style={{ color: 'inherit' }}>+91 93841 05222</a> <br />
                    <a href="tel:04446560926" style={{ color: 'inherit' }}>044 46560926 (Landline)</a>
                  </li>
                  <li>
                    <span className="flaticon-pin" />
                    <strong>Address</strong>
                    107/2A, Medavakkam - Mambakkam Main Road, Mambakkam, Chennai, Tamil Nadu, India - 600127.
                  </li>
                </ul>
                <div className="contact-one_phone">
                  <div className="contact-one_phone-inner">
                    <div className="side-icon flaticon-wood-1" />
                    <div className="icon flaticon-envelope" aria-hidden="true" />
                    Contact Emails <br />
                    <a href="mailto:sales@sjceramics.in">sales@sjceramics.in</a> <br />
                  </div>
                </div>
              </div>
            </div>

            <div className="contact-one_form-column col-lg-7 col-md-12 col-sm-12">
              <div className="contact-one_form-outer">
                <div className="title-box">
                  <h3>Enquiry Form</h3>
                </div>

                <div className="default-form">
                  <form ref={formRef} onSubmit={handleSubmit} noValidate>
                    <div className="row clearfix">
                      <div className={`col-lg-12 col-md-12 col-sm-12 form-group${errors.fullName ? ' has-error' : ''}`}>
                        <input
                          ref={refs.fullName}
                          type="text"
                          name="fullName"
                          placeholder="Full Name*"
                          value={values.fullName}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          maxLength="60"
                          required
                          aria-required="true"
                          {...errorProps('fullName')}
                        />
                        <ErrorMessage field="fullName" />
                      </div>
                      <div className={`col-lg-12 col-md-12 col-sm-12 form-group${errors.email ? ' has-error' : ''}`}>
                        <input
                          ref={refs.email}
                          type="email"
                          name="email"
                          placeholder="Email*"
                          value={values.email}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          maxLength="120"
                          required
                          aria-required="true"
                          {...errorProps('email')}
                        />
                        <ErrorMessage field="email" />
                      </div>
                      <div className={`col-lg-12 col-md-12 col-sm-12 form-group${errors.phone ? ' has-error' : ''}`}>
                        <input
                          ref={refs.phone}
                          type="tel"
                          name="phone"
                          placeholder="Mobile Number*"
                          value={values.phone}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          inputMode="numeric"
                          maxLength="10"
                          required
                          aria-required="true"
                          {...errorProps('phone')}
                        />
                        <ErrorMessage field="phone" />
                      </div>
                      <div className={`col-lg-12 col-md-12 col-sm-12 form-group${errors.address ? ' has-error' : ''}`}>
                        <input
                          ref={refs.address}
                          type="text"
                          name="address"
                          placeholder="Address*"
                          value={values.address}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          maxLength="200"
                          required
                          aria-required="true"
                          {...errorProps('address')}
                        />
                        <ErrorMessage field="address" />
                      </div>
                      <div className={`col-lg-12 col-md-12 col-sm-12 form-group${errors.message ? ' has-error' : ''}`}>
                        <textarea
                          ref={refs.message}
                          name="message"
                          placeholder="Your Message*"
                          value={values.message}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          maxLength="700"
                          required
                          aria-required="true"
                          {...errorProps('message')}
                        />
                        <span className={`contact-message-counter${countWords(values.message) > 100 ? ' over-limit' : ''}`}>{countWords(values.message)} / 100 words · {values.message.length} / 700 characters</span>
                        <ErrorMessage field="message" />
                      </div>
                      <div className="col-lg-12 col-md-12 col-sm-12 form-group">
                        <button type="submit" className="theme-btn submit-btn" disabled={status === 'sending'}>
                          {status === 'sending' ? 'Sending...' : status === 'sent' ? 'Message Sent!' : 'Send Message'}
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
