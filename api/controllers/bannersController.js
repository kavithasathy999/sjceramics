const fs = require('fs/promises');
const path = require('path');
const db = require('../config/db');
const { publicUrl } = require('../utils/publicUrl');

const uploadDirectory = path.resolve(__dirname, '..', 'uploads', 'banners');
const countWords = (value) => value.trim().split(/\s+/).filter(Boolean).length;
const imagePath = (filename) => filename ? `uploads/banners/${path.basename(filename)}` : null;

const serializeBanner = (req, banner) => ({
  id: banner.id,
  title: banner.title,
  description: banner.description,
  placement: banner.placement,
  sortOrder: banner.sort_order,
  imageUrl: publicUrl(req, banner.image) || null,
  createdAt: banner.created_at,
  updatedAt: banner.updated_at,
});

const removeFile = async (filename) => {
  if (!filename) return;
  try {
    await fs.unlink(path.join(uploadDirectory, path.basename(filename)));
  } catch (error) {
    if (error.code !== 'ENOENT') console.error('Image cleanup failed:', error);
  }
};

const removeFiles = async (files = []) => {
  await Promise.all(files.map((file) => removeFile(file.filename)));
};

const validateBanner = (banner, requireImage) => {
  const errors = [];
  const title = typeof banner.title === 'string' ? banner.title.trim() : '';
  const description = typeof banner.description === 'string' ? banner.description.trim() : '';
  const sortOrder = Number(banner.sortOrder);

  if (!title) errors.push('Banner title is required.');
  else if (countWords(title) > 5) errors.push('Banner title must contain 5 words or fewer.');
  if (!description) errors.push('Banner description is required.');
  else if (countWords(description) > 20) errors.push('Banner description must contain 20 words or fewer.');
  if (!Number.isInteger(sortOrder) || sortOrder < 1) errors.push('Enter a valid sort order.');
  if (requireImage && !banner.file) errors.push('Banner image is required.');

  return { errors, title, description, sortOrder };
};

const getBanners = async (req, res, next) => {
  try {
    const [rows] = await db.query('SELECT * FROM banners ORDER BY sort_order ASC, id ASC');
    res.json({ success: true, data: rows.map((row) => serializeBanner(req, row)) });
  } catch (error) {
    next(error);
  }
};

const createBanners = async (req, res, next) => {
  const files = req.files || [];
  let connection;
  try {
    const payload = JSON.parse(req.body.slides || '[]');
    if (!Array.isArray(payload) || payload.length === 0) {
      await removeFiles(files);
      return res.status(400).json({ success: false, message: 'Add at least one banner.' });
    }

    const slides = payload.map((slide) => ({
      ...slide,
      file: Number.isInteger(slide.fileIndex) ? files[slide.fileIndex] : null,
    }));
    const validationErrors = slides.flatMap((slide, index) => {
      const result = validateBanner(slide, true);
      return result.errors.map((message) => ({ slide: index + 1, message }));
    });
    if (validationErrors.length) {
      await removeFiles(files);
      return res.status(400).json({ success: false, message: 'Banner validation failed.', errors: validationErrors });
    }

    const submittedOrders = slides.map((slide) => Number(slide.sortOrder));
    if (new Set(submittedOrders).size !== submittedOrders.length) {
      await removeFiles(files);
      return res.status(409).json({ success: false, message: 'Each banner must have a unique sort order.' });
    }

    connection = await db.getConnection();
    await connection.beginTransaction();
    const placeholders = submittedOrders.map(() => '?').join(',');
    const [conflicts] = await connection.query(
      `SELECT sort_order FROM banners WHERE sort_order IN (${placeholders})`,
      submittedOrders,
    );
    if (conflicts.length) {
      await connection.rollback();
      await removeFiles(files);
      return res.status(409).json({ success: false, message: `Sort order ${conflicts[0].sort_order} is already in use.` });
    }

    const insertedIds = [];
    for (const slide of slides) {
      const validated = validateBanner(slide, true);
      const [result] = await connection.execute(
        'INSERT INTO banners (title, description, image, placement, sort_order) VALUES (?, ?, ?, ?, ?)',
        [validated.title, validated.description, imagePath(slide.file.filename), slide.placement || 'Home hero', validated.sortOrder],
      );
      insertedIds.push(result.insertId);
    }
    await connection.commit();

    const idPlaceholders = insertedIds.map(() => '?').join(',');
    const [created] = await db.query(
      `SELECT * FROM banners WHERE id IN (${idPlaceholders}) ORDER BY sort_order ASC`,
      insertedIds,
    );
    return res.status(201).json({ success: true, message: 'Banners created successfully.', data: created.map((row) => serializeBanner(req, row)) });
  } catch (error) {
    if (connection) await connection.rollback().catch(() => {});
    await removeFiles(files);
    if (error instanceof SyntaxError) return res.status(400).json({ success: false, message: 'Invalid slide data.' });
    return next(error);
  } finally {
    if (connection) connection.release();
  }
};

const updateBanner = async (req, res, next) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id < 1) {
    if (req.file) await removeFile(req.file.filename);
    return res.status(400).json({ success: false, message: 'Invalid banner id.' });
  }

  try {
    const [existingRows] = await db.execute('SELECT * FROM banners WHERE id = ?', [id]);
    if (!existingRows.length) {
      if (req.file) await removeFile(req.file.filename);
      return res.status(404).json({ success: false, message: 'Banner not found.' });
    }

    const candidate = { ...req.body, file: req.file };
    const validated = validateBanner(candidate, false);
    if (validated.errors.length) {
      if (req.file) await removeFile(req.file.filename);
      return res.status(400).json({ success: false, message: validated.errors[0], errors: validated.errors });
    }

    const [conflicts] = await db.execute('SELECT id FROM banners WHERE sort_order = ? AND id <> ?', [validated.sortOrder, id]);
    if (conflicts.length) {
      if (req.file) await removeFile(req.file.filename);
      return res.status(409).json({ success: false, message: `Sort order ${validated.sortOrder} is already in use.` });
    }

    const existing = existingRows[0];
    const nextImage = req.file ? imagePath(req.file.filename) : existing.image;
    await db.execute(
      'UPDATE banners SET title = ?, description = ?, image = ?, placement = ?, sort_order = ? WHERE id = ?',
      [validated.title, validated.description, nextImage, req.body.placement || existing.placement, validated.sortOrder, id],
    );
    if (req.file && existing.image) await removeFile(existing.image);

    const [updated] = await db.execute('SELECT * FROM banners WHERE id = ?', [id]);
    return res.json({ success: true, message: 'Banner updated successfully.', data: serializeBanner(req, updated[0]) });
  } catch (error) {
    if (req.file) await removeFile(req.file.filename);
    return next(error);
  }
};

const deleteBanner = async (req, res, next) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id < 1) return res.status(400).json({ success: false, message: 'Invalid banner id.' });

  try {
    const [rows] = await db.execute('SELECT image FROM banners WHERE id = ?', [id]);
    if (!rows.length) return res.status(404).json({ success: false, message: 'Banner not found.' });
    await db.execute('DELETE FROM banners WHERE id = ?', [id]);
    await removeFile(rows[0].image);
    return res.json({ success: true, message: 'Banner deleted successfully.' });
  } catch (error) {
    return next(error);
  }
};

module.exports = { getBanners, createBanners, updateBanner, deleteBanner };
