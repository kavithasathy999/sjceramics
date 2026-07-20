const db = require('../config/db');
const { sendContactEmails } = require('../services/contactEmailService');

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const countWords = (value) => value.trim().split(/\s+/).filter(Boolean).length;
const normalize = (value) => typeof value === 'string' ? value.trim().replace(/\s+/g, ' ') : '';
const normalizeMessage = (value) => typeof value === 'string' ? value.replace(/\r\n?/g, '\n').trim() : '';
const hasUnsupportedControl = (value) => Array.from(value).some((character) => {
  const code = character.codePointAt(0);
  return code < 32 && code !== 9 && code !== 10;
});

const validate = (body = {}) => {
  const errors = {};
  const fullName = normalize(body.fullName);
  const email = normalize(body.email).toLowerCase();
  const phone = normalize(body.phone);
  const message = normalizeMessage(body.message);

  if (!fullName) errors.fullName = 'Full name is required.';
  else if (fullName.length < 2 || fullName.length > 60) errors.fullName = 'Full name must contain 2-60 characters.';
  else if (countWords(fullName) > 6) errors.fullName = 'Full name must contain 6 words or fewer.';
  else if (!/[\p{L}\p{M}]/u.test(fullName) || !/^[\p{L}\p{M} .'-]+$/u.test(fullName)) errors.fullName = 'Use only letters, spaces, periods, apostrophes, or hyphens.';

  if (!email) errors.email = 'Email is required.';
  else if (email.length > 120 || !EMAIL_PATTERN.test(email)) errors.email = 'Enter a valid email address.';

  if (!phone) errors.phone = 'Mobile number is required.';
  else if (!/^[6-9]\d{9}$/.test(phone)) errors.phone = 'Enter a valid 10-digit Indian mobile number.';

  if (!message) errors.message = 'Your message is required.';
  else if (countWords(message) < 3) errors.message = 'Your message must contain at least 3 words.';
  else if (countWords(message) > 100) errors.message = 'Your message must contain 100 words or fewer.';
  else if (message.length > 700) errors.message = 'Your message must contain 700 characters or fewer.';
  else if (/[<>]/.test(message) || hasUnsupportedControl(message)) errors.message = 'Your message contains unsupported characters.';

  return { errors, fullName, email, phone, message };
};

const serialize = (row) => ({
  id: row.id,
  fullName: row.full_name,
  email: row.email,
  phone: row.phone,
  message: row.message,
  submittedAt: row.submitted_at,
  updatedAt: row.updated_at,
});

const validId = (value) => {
  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : null;
};

const getContactEnquiries = async (_req, res, next) => {
  try {
    const [rows] = await db.query('SELECT * FROM contact_enquiries ORDER BY submitted_at DESC, id DESC');
    return res.json({ success: true, data: rows.map(serialize) });
  } catch (error) {
    return next(error);
  }
};

const submitContactEnquiry = async (req, res, next) => {
  const validated = validate(req.body);
  if (Object.keys(validated.errors).length) {
    return res.status(400).json({ success: false, message: 'Contact form validation failed.', errors: validated.errors });
  }

  try {
    const [result] = await db.execute(
      'INSERT INTO contact_enquiries (full_name, email, phone, message) VALUES (?, ?, ?, ?)',
      [validated.fullName, validated.email, validated.phone, validated.message],
    );
    const [rows] = await db.execute('SELECT * FROM contact_enquiries WHERE id = ?', [result.insertId]);
    const enquiry = serialize(rows[0]);

    try {
      await sendContactEmails(enquiry);
    } catch (error) {
      console.error('Contact email delivery failed:', error.message);
      if (error.code === 'SMTP_CONFIGURATION_MISSING') {
        return res.status(503).json({ success: false, message: 'Your enquiry was saved, but the email service is not configured. Please contact us by phone.' });
      }
      return res.status(502).json({ success: false, message: 'Your enquiry was saved, but email delivery failed. Please try again later.' });
    }

    return res.status(201).json({ success: true, message: 'Your message has been sent successfully.', data: enquiry });
  } catch (error) {
    return next(error);
  }
};

const updateContactEnquiry = async (req, res, next) => {
  const id = validId(req.params.id);
  if (!id) return res.status(400).json({ success: false, message: 'Invalid contact enquiry id.' });
  const validated = validate(req.body);
  if (Object.keys(validated.errors).length) {
    return res.status(400).json({ success: false, message: 'Contact enquiry validation failed.', errors: validated.errors });
  }

  try {
    const [existing] = await db.execute('SELECT id FROM contact_enquiries WHERE id = ?', [id]);
    if (!existing.length) return res.status(404).json({ success: false, message: 'Contact enquiry not found.' });
    await db.execute(
      'UPDATE contact_enquiries SET full_name = ?, email = ?, phone = ?, message = ? WHERE id = ?',
      [validated.fullName, validated.email, validated.phone, validated.message, id],
    );
    const [rows] = await db.execute('SELECT * FROM contact_enquiries WHERE id = ?', [id]);
    return res.json({ success: true, message: 'Contact enquiry updated successfully.', data: serialize(rows[0]) });
  } catch (error) {
    return next(error);
  }
};

const deleteContactEnquiry = async (req, res, next) => {
  const id = validId(req.params.id);
  if (!id) return res.status(400).json({ success: false, message: 'Invalid contact enquiry id.' });
  try {
    const [result] = await db.execute('DELETE FROM contact_enquiries WHERE id = ?', [id]);
    if (!result.affectedRows) return res.status(404).json({ success: false, message: 'Contact enquiry not found.' });
    return res.json({ success: true, message: 'Contact enquiry deleted successfully.' });
  } catch (error) {
    return next(error);
  }
};

module.exports = { getContactEnquiries, submitContactEnquiry, updateContactEnquiry, deleteContactEnquiry, validate };
