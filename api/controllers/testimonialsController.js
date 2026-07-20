const db = require('../config/db');

const countWords = (value) => value ? value.split(/\s+/).filter(Boolean).length : 0;
const normalize = (value) => typeof value === 'string' ? value.trim().replace(/\s+/g, ' ') : '';

const validate = (body) => {
  const errors = {};
  const customerName = normalize(body.customerName);
  const designation = normalize(body.designation);
  const description = normalize(body.description);
  const starRating = Number(body.starRating);

  if (!customerName) errors.customerName = 'Customer name is required.';
  else if (customerName.length < 2 || customerName.length > 80) errors.customerName = 'Customer name must contain 2-80 characters.';
  else if (countWords(customerName) > 8) errors.customerName = 'Customer name must contain 8 words or fewer.';
  else if (!/[\p{L}\p{M}]/u.test(customerName) || !/^[\p{L}\p{M} .'-]+$/u.test(customerName)) errors.customerName = 'Use only letters, spaces, periods, apostrophes, or hyphens.';

  if (!designation) errors.designation = 'Designation is required.';
  else if (designation.length < 2 || designation.length > 100) errors.designation = 'Designation must contain 2-100 characters.';
  else if (countWords(designation) > 12) errors.designation = 'Designation must contain 12 words or fewer.';
  else if (!/^[\p{L}\p{M}\p{N} &/,.()'-]+$/u.test(designation)) errors.designation = 'Designation contains unsupported characters.';

  if (!description) errors.description = 'Description is required.';
  else if (countWords(description) < 3) errors.description = 'Description must contain at least 3 words.';
  else if (countWords(description) > 100) errors.description = 'Description must contain 100 words or fewer.';
  else if (description.length > 700) errors.description = 'Description must contain 700 characters or fewer.';
  else if (/[<>\u0000-\u001F]/.test(description)) errors.description = 'Description contains unsupported characters.';

  if (!Number.isInteger(starRating) || starRating < 1 || starRating > 5) errors.starRating = 'Star rating must be a whole number between 1 and 5.';

  return { errors, customerName, designation, description, starRating };
};

const serialize = (row) => ({
  id: row.id,
  customerName: row.customer_name,
  designation: row.designation,
  description: row.description,
  starRating: row.star_rating,
  sortOrder: row.sort_order,
  updatedAt: row.updated_at,
});

const getTestimonials = async (_req, res, next) => {
  try {
    const [rows] = await db.query('SELECT * FROM testimonials ORDER BY sort_order, id');
    return res.json({ success: true, data: rows.map(serialize) });
  } catch (error) {
    return next(error);
  }
};

const createTestimonial = async (req, res, next) => {
  const validated = validate(req.body);
  if (Object.keys(validated.errors).length) {
    return res.status(400).json({ success: false, message: 'Testimonial validation failed.', errors: validated.errors });
  }
  try {
    const [[{ nextOrder }]] = await db.query('SELECT COALESCE(MAX(sort_order), 0) + 1 AS nextOrder FROM testimonials');
    const [result] = await db.execute(
      'INSERT INTO testimonials (customer_name, designation, description, star_rating, sort_order) VALUES (?, ?, ?, ?, ?)',
      [validated.customerName, validated.designation, validated.description, validated.starRating, nextOrder],
    );
    await db.execute('UPDATE testimonial_settings SET initialized = 1 WHERE id = 1');
    const [created] = await db.execute('SELECT * FROM testimonials WHERE id = ?', [result.insertId]);
    return res.status(201).json({ success: true, message: 'Testimonial added successfully.', data: serialize(created[0]) });
  } catch (error) {
    return next(error);
  }
};

const updateTestimonial = async (req, res, next) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id < 1) return res.status(400).json({ success: false, message: 'Invalid testimonial id.' });
  const validated = validate(req.body);
  if (Object.keys(validated.errors).length) {
    return res.status(400).json({ success: false, message: 'Testimonial validation failed.', errors: validated.errors });
  }
  try {
    const [rows] = await db.execute('SELECT id FROM testimonials WHERE id = ?', [id]);
    if (!rows.length) return res.status(404).json({ success: false, message: 'Testimonial not found.' });
    await db.execute(
      'UPDATE testimonials SET customer_name = ?, designation = ?, description = ?, star_rating = ? WHERE id = ?',
      [validated.customerName, validated.designation, validated.description, validated.starRating, id],
    );
    const [updated] = await db.execute('SELECT * FROM testimonials WHERE id = ?', [id]);
    return res.json({ success: true, message: 'Testimonial updated successfully.', data: serialize(updated[0]) });
  } catch (error) {
    return next(error);
  }
};

const deleteTestimonial = async (req, res, next) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id < 1) return res.status(400).json({ success: false, message: 'Invalid testimonial id.' });
  let connection;
  try {
    connection = await db.getConnection();
    await connection.beginTransaction();
    const [rows] = await connection.execute('SELECT sort_order FROM testimonials WHERE id = ? FOR UPDATE', [id]);
    if (!rows.length) {
      await connection.rollback();
      return res.status(404).json({ success: false, message: 'Testimonial not found.' });
    }
    await connection.execute('DELETE FROM testimonials WHERE id = ?', [id]);
    await connection.execute('UPDATE testimonials SET sort_order = sort_order - 1 WHERE sort_order > ? ORDER BY sort_order', [rows[0].sort_order]);
    await connection.execute('UPDATE testimonial_settings SET initialized = 1 WHERE id = 1');
    await connection.commit();
    return res.json({ success: true, message: 'Testimonial deleted successfully.' });
  } catch (error) {
    if (connection) await connection.rollback().catch(() => {});
    return next(error);
  } finally {
    if (connection) connection.release();
  }
};

module.exports = { getTestimonials, createTestimonial, updateTestimonial, deleteTestimonial };
