const fs = require('fs/promises');
const path = require('path');
const db = require('../config/db');

const uploadDirectory = path.resolve(__dirname, '..', 'uploads', 'offers');
const MAX_IMAGE_SIZE = 3 * 1024 * 1024;
const SECTION_CONFIG = Object.freeze({
  todays_offer: { label: "Today's Offer", limit: 1 },
  launching_offer: { label: 'Launching Offer', limit: 1 },
  new_arrivals: { label: 'New Arrivals', limit: 6 },
});
const CATEGORY_VALUES = new Set(['Tiles', 'Sanitary Wares', 'Bath Fittings', 'Others']);
const ARRIVAL_STATUSES = new Set(['Coming soon', 'Available soon', 'Showroom arrival']);
const countWords = (value) => value ? value.split(/\s+/).filter(Boolean).length : 0;
const normalizeText = (value) => typeof value === 'string' ? value.trim().replace(/\s+/g, ' ') : '';
const imagePath = (filename) => `uploads/offers/${path.basename(filename)}`;
const publicUrl = (req, value) => value
  ? `${req.protocol}://${req.get('host')}/${value.replace(/\\/g, '/').replace(/^\/+/, '')}`
  : '';

const removeFile = async (value) => {
  if (!value) return;
  try {
    await fs.unlink(path.join(uploadDirectory, path.basename(value)));
  } catch (error) {
    if (error.code !== 'ENOENT') console.error('Offer image cleanup failed:', error);
  }
};

const validateText = (errors, field, label, value, { min, max, words, pattern } = {}) => {
  const normalized = normalizeText(value);
  if (!normalized) errors[field] = `${label} is required.`;
  else if (normalized.length < min || normalized.length > max) errors[field] = `${label} must contain ${min}-${max} characters.`;
  else if (words && countWords(normalized) > words) errors[field] = `${label} must contain ${words} words or fewer.`;
  else if (/[<>\u0000-\u001F]/.test(normalized)) errors[field] = `${label} contains unsupported characters.`;
  else if (pattern && !pattern.test(normalized)) errors[field] = `${label} contains unsupported characters.`;
  return normalized;
};

const parsePrice = (errors, field, label, value) => {
  const raw = typeof value === 'string' ? value.trim() : value;
  if (raw === '' || raw === null || raw === undefined) {
    errors[field] = `${label} is required.`;
    return null;
  }
  if (!/^\d+(\.\d{1,2})?$/.test(String(raw))) {
    errors[field] = `Enter a valid ${label.toLowerCase()} with up to 2 decimal places.`;
    return null;
  }
  const number = Number(raw);
  if (number <= 0 || number > 1000000) {
    errors[field] = `${label} must be between 0.01 and 10,00,000.`;
    return null;
  }
  return number;
};

const validateOffer = (body, sectionType) => {
  const errors = {};
  const productName = validateText(errors, 'productName', 'Product name', body.productName, { min: 2, max: 100, words: 12 });
  const category = normalizeText(body.category);
  if (!CATEGORY_VALUES.has(category)) errors.category = 'Select a valid category.';
  const size = validateText(errors, 'size', 'Size', body.size, { min: 2, max: 50, pattern: /^[\p{L}\p{N}\s×xX./-]+$/u });
  const finish = validateText(errors, 'finish', 'Finish', body.finish, { min: 2, max: 60, pattern: /^[\p{L}\p{N}\s/&().,-]+$/u });
  const availability = validateText(errors, 'availability', 'Availability', body.availability, { min: 5, max: 150, words: 20 });
  let mrp = null;
  let offerPrice = null;
  let arrivalStatus = null;

  if (sectionType === 'new_arrivals') {
    arrivalStatus = normalizeText(body.arrivalStatus);
    if (!ARRIVAL_STATUSES.has(arrivalStatus)) errors.arrivalStatus = 'Select a valid arrival status.';
  } else {
    mrp = parsePrice(errors, 'mrp', 'MRP', body.mrp);
    offerPrice = parsePrice(errors, 'offerPrice', 'Offer price', body.offerPrice);
    if (mrp !== null && offerPrice !== null && offerPrice >= mrp) errors.offerPrice = 'Offer price must be lower than MRP.';
  }

  return { errors, values: { productName, category, size, finish, availability, mrp, offerPrice, arrivalStatus } };
};

const serializeItem = (req, row) => ({
  id: row.id,
  sectionType: row.section_type,
  label: SECTION_CONFIG[row.section_type]?.label || '',
  productName: row.product_name,
  category: row.category,
  size: row.size,
  finish: row.finish,
  mrp: row.mrp === null ? null : Number(row.mrp),
  offerPrice: row.offer_price === null ? null : Number(row.offer_price),
  availability: row.availability,
  arrivalStatus: row.arrival_status,
  imageUrl: publicUrl(req, row.image),
  sortOrder: row.sort_order,
  updatedAt: row.updated_at,
});

const getHomeOffers = async (req, res, next) => {
  try {
    const [sections] = await db.query('SELECT * FROM home_offer_sections ORDER BY FIELD(section_type, \'todays_offer\', \'launching_offer\', \'new_arrivals\')');
    const [items] = await db.query('SELECT * FROM home_offer_items ORDER BY section_type, sort_order, id');
    return res.json({
      success: true,
      data: sections.map((section) => ({
        sectionType: section.section_type,
        label: SECTION_CONFIG[section.section_type].label,
        configured: Boolean(section.configured),
        limit: SECTION_CONFIG[section.section_type].limit,
        items: items.filter((item) => item.section_type === section.section_type).map((item) => serializeItem(req, item)),
      })),
    });
  } catch (error) {
    return next(error);
  }
};

const createHomeOffer = async (req, res, next) => {
  const sectionType = normalizeText(req.body.sectionType);
  if (!SECTION_CONFIG[sectionType]) {
    if (req.file) await removeFile(req.file.filename);
    return res.status(400).json({ success: false, message: 'Select a valid offer section.', errors: { sectionType: 'Select a valid offer section.' } });
  }
  const validated = validateOffer(req.body, sectionType);
  if (!req.file) validated.errors.image = 'Offer image is required.';
  else if (req.file.size > MAX_IMAGE_SIZE) validated.errors.image = 'Image must be 3 MB or smaller.';
  if (Object.keys(validated.errors).length) {
    if (req.file) await removeFile(req.file.filename);
    return res.status(400).json({ success: false, message: 'Offer validation failed.', errors: validated.errors });
  }

  let connection;
  try {
    connection = await db.getConnection();
    await connection.beginTransaction();
    await connection.execute('SELECT section_type FROM home_offer_sections WHERE section_type = ? FOR UPDATE', [sectionType]);
    const [[{ itemCount }]] = await connection.execute('SELECT COUNT(*) AS itemCount FROM home_offer_items WHERE section_type = ?', [sectionType]);
    const limit = SECTION_CONFIG[sectionType].limit;
    if (Number(itemCount) >= limit) {
      await connection.rollback();
      await removeFile(req.file.filename);
      return res.status(409).json({ success: false, message: `${SECTION_CONFIG[sectionType].label} can contain a maximum of ${limit} ${limit === 1 ? 'card' : 'cards'}.` });
    }
    const values = validated.values;
    const [result] = await connection.execute(
      `INSERT INTO home_offer_items
       (section_type, product_name, category, size, finish, mrp, offer_price, availability, arrival_status, image, sort_order)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [sectionType, values.productName, values.category, values.size, values.finish, values.mrp, values.offerPrice, values.availability, values.arrivalStatus, imagePath(req.file.filename), Number(itemCount) + 1],
    );
    await connection.execute('UPDATE home_offer_sections SET configured = 1 WHERE section_type = ?', [sectionType]);
    const [created] = await connection.execute('SELECT * FROM home_offer_items WHERE id = ?', [result.insertId]);
    await connection.commit();
    return res.status(201).json({ success: true, message: 'Offer card added successfully.', data: serializeItem(req, created[0]) });
  } catch (error) {
    if (connection) await connection.rollback().catch(() => {});
    await removeFile(req.file.filename);
    return next(error);
  } finally {
    if (connection) connection.release();
  }
};

const updateHomeOffer = async (req, res, next) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id < 1) {
    if (req.file) await removeFile(req.file.filename);
    return res.status(400).json({ success: false, message: 'Invalid offer card id.' });
  }
  try {
    const [rows] = await db.execute('SELECT * FROM home_offer_items WHERE id = ?', [id]);
    if (!rows.length) {
      if (req.file) await removeFile(req.file.filename);
      return res.status(404).json({ success: false, message: 'Offer card not found.' });
    }
    const existing = rows[0];
    const validated = validateOffer(req.body, existing.section_type);
    if (req.file?.size > MAX_IMAGE_SIZE) validated.errors.image = 'Image must be 3 MB or smaller.';
    if (Object.keys(validated.errors).length) {
      if (req.file) await removeFile(req.file.filename);
      return res.status(400).json({ success: false, message: 'Offer validation failed.', errors: validated.errors });
    }
    const values = validated.values;
    const nextImage = req.file ? imagePath(req.file.filename) : existing.image;
    await db.execute(
      `UPDATE home_offer_items SET product_name = ?, category = ?, size = ?, finish = ?, mrp = ?,
       offer_price = ?, availability = ?, arrival_status = ?, image = ? WHERE id = ?`,
      [values.productName, values.category, values.size, values.finish, values.mrp, values.offerPrice, values.availability, values.arrivalStatus, nextImage, id],
    );
    await db.execute('UPDATE home_offer_sections SET configured = 1 WHERE section_type = ?', [existing.section_type]);
    const [updated] = await db.execute('SELECT * FROM home_offer_items WHERE id = ?', [id]);
    if (req.file) await removeFile(existing.image);
    return res.json({ success: true, message: 'Offer card updated successfully.', data: serializeItem(req, updated[0]) });
  } catch (error) {
    if (req.file) await removeFile(req.file.filename);
    return next(error);
  }
};

const deleteHomeOffer = async (req, res, next) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id < 1) return res.status(400).json({ success: false, message: 'Invalid offer card id.' });
  let connection;
  try {
    connection = await db.getConnection();
    await connection.beginTransaction();
    const [rows] = await connection.execute('SELECT * FROM home_offer_items WHERE id = ? FOR UPDATE', [id]);
    if (!rows.length) {
      await connection.rollback();
      return res.status(404).json({ success: false, message: 'Offer card not found.' });
    }
    const item = rows[0];
    await connection.execute('DELETE FROM home_offer_items WHERE id = ?', [id]);
    await connection.execute(
      'UPDATE home_offer_items SET sort_order = sort_order - 1 WHERE section_type = ? AND sort_order > ? ORDER BY sort_order ASC',
      [item.section_type, item.sort_order],
    );
    await connection.execute('UPDATE home_offer_sections SET configured = 1 WHERE section_type = ?', [item.section_type]);
    await connection.commit();
    await removeFile(item.image);
    return res.json({ success: true, message: 'Offer card deleted successfully.' });
  } catch (error) {
    if (connection) await connection.rollback().catch(() => {});
    return next(error);
  } finally {
    if (connection) connection.release();
  }
};

module.exports = { getHomeOffers, createHomeOffer, updateHomeOffer, deleteHomeOffer };
