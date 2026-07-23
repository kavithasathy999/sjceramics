const fs = require('fs/promises');
const path = require('path');
const db = require('../config/db');
const { publicUrl } = require('../utils/publicUrl');

const MAX_IMAGE_SIZE = 3 * 1024 * 1024;
const GROUP_VALUES = new Set(['Tiles', 'Sanitary Wares', 'Bath Fittings', 'Others']);
const uploadDirectory = path.resolve(__dirname, '..', 'uploads', 'categories');
const countWords = (value) => value ? value.split(/\s+/).filter(Boolean).length : 0;
const normalize = (value) => typeof value === 'string' ? value.trim().replace(/\s+/g, ' ') : '';
const storedPath = (filename) => `uploads/categories/${path.basename(filename)}`;

const removeFile = async (value) => {
  if (!value) return;
  try {
    await fs.unlink(path.join(uploadDirectory, path.basename(value)));
  } catch (error) {
    if (error.code !== 'ENOENT') console.error('Category image cleanup failed:', error);
  }
};

const validate = (body) => {
  const errors = {};
  const name = normalize(body.name);
  const group = normalize(body.group);
  const sortOrder = Number(body.sortOrder);
  if (!name) errors.name = 'Category name is required.';
  else if (name.length < 2 || name.length > 60) errors.name = 'Category name must contain 2-60 characters.';
  else if (countWords(name) > 6) errors.name = 'Category name must contain 6 words or fewer.';
  else if (/[<>\u0000-\u001F]/.test(name)) errors.name = 'Category name contains unsupported characters.';
  if (!GROUP_VALUES.has(group)) errors.group = 'Select a valid group.';
  if (!Number.isInteger(sortOrder) || sortOrder < 1 || sortOrder > 999) errors.sortOrder = 'Sort order must be a whole number between 1 and 999.';
  return { errors, name, group, sortOrder };
};

const serialize = (req, row) => ({
  id: row.id,
  name: row.name,
  group: row.group_name,
  imageUrl: publicUrl(req, row.image),
  sortOrder: row.sort_order,
  updatedAt: row.updated_at,
});

const getHomeCategories = async (req, res, next) => {
  try {
    const [[settings]] = await db.query('SELECT configured FROM home_category_settings WHERE id = 1');
    const [rows] = await db.query('SELECT * FROM home_categories ORDER BY sort_order, id');
    return res.json({ success: true, configured: Boolean(settings?.configured), data: rows.map((row) => serialize(req, row)) });
  } catch (error) {
    return next(error);
  }
};

const createHomeCategory = async (req, res, next) => {
  const validated = validate(req.body);
  if (!req.file) validated.errors.image = 'Category image is required.';
  else if (req.file.size > MAX_IMAGE_SIZE) validated.errors.image = 'Image must be 3 MB or smaller.';
  if (Object.keys(validated.errors).length) {
    if (req.file) await removeFile(req.file.filename);
    return res.status(400).json({ success: false, message: 'Category validation failed.', errors: validated.errors });
  }
  try {
    const [conflicts] = await db.execute(
      'SELECT name, sort_order FROM home_categories WHERE LOWER(name) = LOWER(?) OR sort_order = ?',
      [validated.name, validated.sortOrder],
    );
    if (conflicts.length) {
      await removeFile(req.file.filename);
      const message = conflicts[0].sort_order === validated.sortOrder ? `Sort order ${validated.sortOrder} is already in use.` : 'Category name is already in use.';
      return res.status(409).json({ success: false, message });
    }
    const [result] = await db.execute(
      'INSERT INTO home_categories (name, group_name, image, sort_order) VALUES (?, ?, ?, ?)',
      [validated.name, validated.group, storedPath(req.file.filename), validated.sortOrder],
    );
    await db.execute('UPDATE home_category_settings SET configured = 1 WHERE id = 1');
    const [created] = await db.execute('SELECT * FROM home_categories WHERE id = ?', [result.insertId]);
    return res.status(201).json({ success: true, message: 'Category added successfully.', data: serialize(req, created[0]) });
  } catch (error) {
    if (req.file) await removeFile(req.file.filename);
    return next(error);
  }
};

const updateHomeCategory = async (req, res, next) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id < 1) {
    if (req.file) await removeFile(req.file.filename);
    return res.status(400).json({ success: false, message: 'Invalid category id.' });
  }
  const validated = validate(req.body);
  if (req.file?.size > MAX_IMAGE_SIZE) validated.errors.image = 'Image must be 3 MB or smaller.';
  if (Object.keys(validated.errors).length) {
    if (req.file) await removeFile(req.file.filename);
    return res.status(400).json({ success: false, message: 'Category validation failed.', errors: validated.errors });
  }
  try {
    const [rows] = await db.execute('SELECT * FROM home_categories WHERE id = ?', [id]);
    if (!rows.length) {
      if (req.file) await removeFile(req.file.filename);
      return res.status(404).json({ success: false, message: 'Category not found.' });
    }
    const [conflicts] = await db.execute(
      'SELECT id, name, sort_order FROM home_categories WHERE id <> ? AND (LOWER(name) = LOWER(?) OR sort_order = ?)',
      [id, validated.name, validated.sortOrder],
    );
    if (conflicts.length) {
      if (req.file) await removeFile(req.file.filename);
      const message = conflicts[0].sort_order === validated.sortOrder ? `Sort order ${validated.sortOrder} is already in use.` : 'Category name is already in use.';
      return res.status(409).json({ success: false, message });
    }
    const existing = rows[0];
    const nextImage = req.file ? storedPath(req.file.filename) : existing.image;
    await db.execute(
      'UPDATE home_categories SET name = ?, group_name = ?, image = ?, sort_order = ? WHERE id = ?',
      [validated.name, validated.group, nextImage, validated.sortOrder, id],
    );
    const [updated] = await db.execute('SELECT * FROM home_categories WHERE id = ?', [id]);
    if (req.file) await removeFile(existing.image);
    return res.json({ success: true, message: 'Category updated successfully.', data: serialize(req, updated[0]) });
  } catch (error) {
    if (req.file) await removeFile(req.file.filename);
    return next(error);
  }
};

const deleteHomeCategory = async (req, res, next) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id < 1) return res.status(400).json({ success: false, message: 'Invalid category id.' });
  let connection;
  try {
    connection = await db.getConnection();
    await connection.beginTransaction();
    const [rows] = await connection.execute('SELECT * FROM home_categories WHERE id = ? FOR UPDATE', [id]);
    if (!rows.length) {
      await connection.rollback();
      return res.status(404).json({ success: false, message: 'Category not found.' });
    }
    const item = rows[0];
    await connection.execute('DELETE FROM home_categories WHERE id = ?', [id]);
    await connection.execute('UPDATE home_categories SET sort_order = sort_order - 1 WHERE sort_order > ? ORDER BY sort_order', [item.sort_order]);
    await connection.execute('UPDATE home_category_settings SET configured = 1 WHERE id = 1');
    await connection.commit();
    await removeFile(item.image);
    return res.json({ success: true, message: 'Category deleted successfully.' });
  } catch (error) {
    if (connection) await connection.rollback().catch(() => {});
    return next(error);
  } finally {
    if (connection) connection.release();
  }
};

module.exports = { getHomeCategories, createHomeCategory, updateHomeCategory, deleteHomeCategory };
