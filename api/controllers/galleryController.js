const fs = require('fs/promises');
const path = require('path');
const db = require('../config/db');
const { publicUrl } = require('../utils/publicUrl');

const MAX_GALLERY_ITEMS = 20;
const CATEGORY_VALUES = new Set(['Tiles', 'Sanitary Wares', 'Bath Fittings', 'Others']);
const uploadDirectory = path.resolve(__dirname, '..', 'uploads', 'gallery');
const storedPath = (filename) => `uploads/gallery/${path.basename(filename)}`;
const countWords = (value) => value.trim().split(/\s+/).filter(Boolean).length;

const validateTitle = (value) => {
  const title = typeof value === 'string' ? value.trim() : '';
  if (!title) return { title, error: 'Gallery title is required.' };
  if (countWords(title) > 4) return { title, error: 'Gallery title must contain 4 words or fewer.' };
  return { title, error: '' };
};

const validateCategory = (value) => {
  const category = typeof value === 'string' ? value.trim() : '';
  if (!category) return { category, error: 'Category is required.' };
  if (!CATEGORY_VALUES.has(category)) return { category, error: 'Select a valid category.' };
  return { category, error: '' };
};

const categoryFilter = (category) => JSON.stringify({ filterCategory: 'category', filterValue: category });

const removeFile = async (value) => {
  if (!value) return;
  try {
    await fs.unlink(path.join(uploadDirectory, path.basename(value)));
  } catch (error) {
    if (error.code !== 'ENOENT') console.error('Gallery image cleanup failed:', error);
  }
};

const parseFilterState = (value) => {
  try {
    return JSON.parse(value || '{}');
  } catch {
    return {};
  }
};

const serialize = (req, row) => ({
  id: row.id,
  title: row.title,
  imageUrl: publicUrl(req, row.image),
  category: row.category,
  position: row.object_position,
  filter: parseFilterState(row.filter_state),
  sortOrder: row.sort_order,
  updatedAt: row.updated_at,
});

const getGalleryItems = async (req, res, next) => {
  try {
    const [rows] = await db.query('SELECT * FROM gallery_items ORDER BY sort_order ASC, id ASC');
    return res.json({ success: true, data: rows.map((row) => serialize(req, row)), limit: MAX_GALLERY_ITEMS });
  } catch (error) {
    return next(error);
  }
};

const createGalleryItem = async (req, res, next) => {
  const validated = validateTitle(req.body.title);
  const validatedCategory = validateCategory(req.body.category);
  if (validated.error || validatedCategory.error || !req.file) {
    if (req.file) await removeFile(req.file.filename);
    return res.status(400).json({ success: false, message: validated.error || validatedCategory.error || 'Choose a gallery image.' });
  }

  let connection;
  try {
    connection = await db.getConnection();
    await connection.beginTransaction();
    const [[{ itemCount }]] = await connection.query('SELECT COUNT(*) AS itemCount FROM gallery_items FOR UPDATE');
    if (Number(itemCount) >= MAX_GALLERY_ITEMS) {
      await connection.rollback();
      await removeFile(req.file.filename);
      return res.status(409).json({ success: false, message: 'A maximum of 20 gallery items can be added.' });
    }

    const nextOrder = Number(itemCount) + 1;
    const [result] = await connection.execute(
      `INSERT INTO gallery_items (title, image, category, object_position, filter_state, sort_order)
       VALUES (?, ?, ?, 'center', ?, ?)`,
      [validated.title, storedPath(req.file.filename), validatedCategory.category, categoryFilter(validatedCategory.category), nextOrder],
    );
    const [created] = await connection.execute('SELECT * FROM gallery_items WHERE id = ?', [result.insertId]);
    await connection.commit();
    return res.status(201).json({ success: true, message: 'Gallery item added successfully.', data: serialize(req, created[0]) });
  } catch (error) {
    if (connection) await connection.rollback().catch(() => {});
    await removeFile(req.file.filename);
    return next(error);
  } finally {
    if (connection) connection.release();
  }
};

const updateGalleryItem = async (req, res, next) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id < 1) {
    if (req.file) await removeFile(req.file.filename);
    return res.status(400).json({ success: false, message: 'Invalid gallery item id.' });
  }
  const validated = validateTitle(req.body.title);
  const validatedCategory = validateCategory(req.body.category);
  if (validated.error || validatedCategory.error) {
    if (req.file) await removeFile(req.file.filename);
    return res.status(400).json({ success: false, message: validated.error || validatedCategory.error });
  }

  try {
    const [rows] = await db.execute('SELECT * FROM gallery_items WHERE id = ?', [id]);
    if (!rows.length) {
      if (req.file) await removeFile(req.file.filename);
      return res.status(404).json({ success: false, message: 'Gallery item not found.' });
    }
    const nextImage = req.file ? storedPath(req.file.filename) : rows[0].image;
    const nextFilterState = validatedCategory.category === rows[0].category
      ? rows[0].filter_state
      : categoryFilter(validatedCategory.category);
    await db.execute(
      'UPDATE gallery_items SET title = ?, category = ?, filter_state = ?, image = ? WHERE id = ?',
      [validated.title, validatedCategory.category, nextFilterState, nextImage, id],
    );
    const [updated] = await db.execute('SELECT * FROM gallery_items WHERE id = ?', [id]);
    if (req.file) await removeFile(rows[0].image);
    return res.json({ success: true, message: 'Gallery item updated successfully.', data: serialize(req, updated[0]) });
  } catch (error) {
    if (req.file) await removeFile(req.file.filename);
    return next(error);
  }
};

const deleteGalleryItem = async (req, res, next) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id < 1) return res.status(400).json({ success: false, message: 'Invalid gallery item id.' });

  let connection;
  try {
    connection = await db.getConnection();
    await connection.beginTransaction();
    const [rows] = await connection.execute('SELECT image, sort_order FROM gallery_items WHERE id = ? FOR UPDATE', [id]);
    if (!rows.length) {
      await connection.rollback();
      return res.status(404).json({ success: false, message: 'Gallery item not found.' });
    }
    await connection.execute('DELETE FROM gallery_items WHERE id = ?', [id]);
    await connection.execute(
      'UPDATE gallery_items SET sort_order = sort_order - 1 WHERE sort_order > ? ORDER BY sort_order ASC',
      [rows[0].sort_order],
    );
    await connection.commit();
    await removeFile(rows[0].image);
    return res.json({ success: true, message: 'Gallery item deleted successfully.' });
  } catch (error) {
    if (connection) await connection.rollback().catch(() => {});
    return next(error);
  } finally {
    if (connection) connection.release();
  }
};

module.exports = { getGalleryItems, createGalleryItem, updateGalleryItem, deleteGalleryItem };
