const fs = require('fs/promises');
const path = require('path');
const db = require('../config/db');
const { publicUrl } = require('../utils/publicUrl');

const MAX_IMAGE_SIZE = 3 * 1024 * 1024;
const MAX_VIDEO_SIZE = 8 * 1024 * 1024;
const IMAGE_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);
const VIDEO_TYPES = new Set(['video/mp4', 'video/webm']);
const CATEGORIES = new Set(['Tiles', 'Sanitary Wares', 'Bath Fittings', 'Others']);
const uploadDirectory = path.resolve(__dirname, '..', 'uploads', 'blogs');
const countWords = (value) => value ? value.trim().split(/\s+/).filter(Boolean).length : 0;
const normalizeTitle = (value) => typeof value === 'string' ? value.trim().replace(/\s+/g, ' ') : '';
const normalizeAuthor = (value) => typeof value === 'string' ? value.trim().replace(/\s+/g, ' ') : '';
const normalizeDescription = (value) => typeof value === 'string' ? value.replace(/\r\n?/g, '\n').trim() : '';
const storedPath = (filename) => `uploads/blogs/${path.basename(filename)}`;

const removeFile = async (value) => {
  if (!value) return;
  try {
    await fs.unlink(path.join(uploadDirectory, path.basename(value)));
  } catch (error) {
    if (error.code !== 'ENOENT') console.error('Blog media cleanup failed:', error);
  }
};

const mediaType = (file) => IMAGE_TYPES.has(file?.mimetype) ? 'image' : VIDEO_TYPES.has(file?.mimetype) ? 'video' : '';

const todayInIndia = () => Object.fromEntries(
  new Intl.DateTimeFormat('en', {
    day: '2-digit', month: '2-digit', year: 'numeric', timeZone: 'Asia/Kolkata',
  }).formatToParts(new Date()).filter(({ type }) => type !== 'literal').map(({ type, value }) => [type, value]),
);

const isValidDate = (value) => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const parsed = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(parsed.getTime()) && parsed.toISOString().slice(0, 10) === value;
};

const displayDate = (value) => new Intl.DateTimeFormat('en-GB', {
  day: '2-digit', month: 'long', year: 'numeric', timeZone: 'Asia/Kolkata',
}).format(new Date(`${value}T12:00:00Z`));

const validate = (body) => {
  const errors = {};
  const category = typeof body.category === 'string' ? body.category.trim() : '';
  const title = normalizeTitle(body.title);
  const author = normalizeAuthor(body.author);
  const date = typeof body.date === 'string' ? body.date.trim() : '';
  const description = normalizeDescription(body.description);
  if (!CATEGORIES.has(category)) errors.category = 'Select a valid category.';
  if (!title) errors.title = 'Title is required.';
  else if (countWords(title) > 12) errors.title = 'Title must contain 12 words or fewer.';
  else if (title.length > 180) errors.title = 'Title must contain 180 characters or fewer.';
  else if (/[<>\u0000-\u001F]/.test(title)) errors.title = 'Title contains unsupported characters.';
  if (!author) errors.author = 'Blog shared person name is required.';
  else if (author.length < 2) errors.author = 'Blog shared person name must contain at least 2 characters.';
  else if (author.length > 80) errors.author = 'Blog shared person name must contain 80 characters or fewer.';
  else if (!/[\p{L}\p{M}]/u.test(author) || !/^[\p{L}\p{M} .'-]+$/u.test(author)) errors.author = 'Use only letters, spaces, periods, apostrophes, or hyphens.';
  const indiaDate = todayInIndia();
  const currentDate = `${indiaDate.year}-${indiaDate.month}-${indiaDate.day}`;
  if (!date) errors.date = 'Blog date is required.';
  else if (!isValidDate(date)) errors.date = 'Enter a valid blog date.';
  else if (date > currentDate) errors.date = 'Blog date cannot be in the future.';
  if (!description) errors.description = 'Description is required.';
  else if (countWords(description) > 500) errors.description = 'Description must contain 500 words or fewer.';
  return { errors, category, title, author, date, description };
};

const validateMedia = (file, errors, required) => {
  if (!file) {
    if (required) errors.media = 'Upload an image or video.';
    return '';
  }
  const type = mediaType(file);
  if (!type) errors.media = 'Upload a JPG, PNG, WebP, MP4, or WebM file.';
  else if (type === 'image' && file.size > MAX_IMAGE_SIZE) errors.media = 'Image must be 3 MB or smaller.';
  else if (type === 'video' && file.size > MAX_VIDEO_SIZE) errors.media = 'Video must be 8 MB or smaller.';
  return type;
};

const excerptFrom = (description) => {
  const words = description.replace(/\s+/g, ' ').trim().split(' ').filter(Boolean);
  const excerpt = words.slice(0, 28).join(' ');
  return words.length > 28 ? `${excerpt}...` : excerpt;
};

const serialize = (req, row) => {
  const mediaUrl = publicUrl(req, row.media);
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    excerpt: row.excerpt,
    mediaUrl,
    mediaType: row.media_type,
    image: mediaUrl,
    content: row.description.split(/\n\s*\n/).filter(Boolean),
    category: row.category,
    author: row.author,
    date: row.display_date,
    sortOrder: row.sort_order,
    updatedAt: row.updated_at,
  };
};

const getBlogs = async (req, res, next) => {
  try {
    const [rows] = await db.query('SELECT * FROM blogs ORDER BY sort_order, id');
    return res.json({ success: true, data: rows.map((row) => serialize(req, row)) });
  } catch (error) {
    return next(error);
  }
};

const createBlog = async (req, res, next) => {
  const validated = validate(req.body);
  const type = validateMedia(req.file, validated.errors, true);
  if (Object.keys(validated.errors).length) {
    if (req.file) await removeFile(req.file.filename);
    return res.status(400).json({ success: false, message: 'Blog validation failed.', errors: validated.errors });
  }
  try {
    const [duplicate] = await db.execute('SELECT id FROM blogs WHERE LOWER(title) = LOWER(?)', [validated.title]);
    if (duplicate.length) {
      await removeFile(req.file.filename);
      return res.status(409).json({ success: false, message: 'A blog with this title already exists.' });
    }
    const [[{ nextOrder }]] = await db.query('SELECT COALESCE(MAX(sort_order), 0) + 1 AS nextOrder FROM blogs');
    const [result] = await db.execute(
      `INSERT INTO blogs
        (title, description, excerpt, media, media_type, category, author, display_date, sort_order)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [validated.title, validated.description, excerptFrom(validated.description), storedPath(req.file.filename), type, validated.category, validated.author, displayDate(validated.date), nextOrder],
    );
    await db.query('UPDATE blog_settings SET initialized = 1 WHERE id = 1');
    const [created] = await db.execute('SELECT * FROM blogs WHERE id = ?', [result.insertId]);
    return res.status(201).json({ success: true, message: 'Blog added successfully.', data: serialize(req, created[0]) });
  } catch (error) {
    if (req.file) await removeFile(req.file.filename);
    return next(error);
  }
};

const updateBlog = async (req, res, next) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id < 1) {
    if (req.file) await removeFile(req.file.filename);
    return res.status(400).json({ success: false, message: 'Invalid blog id.' });
  }
  const validated = validate(req.body);
  const type = validateMedia(req.file, validated.errors, false);
  if (Object.keys(validated.errors).length) {
    if (req.file) await removeFile(req.file.filename);
    return res.status(400).json({ success: false, message: 'Blog validation failed.', errors: validated.errors });
  }
  try {
    const [rows] = await db.execute('SELECT * FROM blogs WHERE id = ?', [id]);
    if (!rows.length) {
      if (req.file) await removeFile(req.file.filename);
      return res.status(404).json({ success: false, message: 'Blog not found.' });
    }
    const [duplicate] = await db.execute('SELECT id FROM blogs WHERE id <> ? AND LOWER(title) = LOWER(?)', [id, validated.title]);
    if (duplicate.length) {
      if (req.file) await removeFile(req.file.filename);
      return res.status(409).json({ success: false, message: 'A blog with this title already exists.' });
    }
    const existing = rows[0];
    const nextMedia = req.file ? storedPath(req.file.filename) : existing.media;
    const nextType = req.file ? type : existing.media_type;
    await db.execute(
      'UPDATE blogs SET title = ?, description = ?, excerpt = ?, media = ?, media_type = ?, category = ?, author = ?, display_date = ? WHERE id = ?',
      [validated.title, validated.description, excerptFrom(validated.description), nextMedia, nextType, validated.category, validated.author, displayDate(validated.date), id],
    );
    const [updated] = await db.execute('SELECT * FROM blogs WHERE id = ?', [id]);
    if (req.file) await removeFile(existing.media);
    return res.json({ success: true, message: 'Blog updated successfully.', data: serialize(req, updated[0]) });
  } catch (error) {
    if (req.file) await removeFile(req.file.filename);
    return next(error);
  }
};

const deleteBlog = async (req, res, next) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id < 1) return res.status(400).json({ success: false, message: 'Invalid blog id.' });
  let connection;
  try {
    connection = await db.getConnection();
    await connection.beginTransaction();
    const [rows] = await connection.execute('SELECT * FROM blogs WHERE id = ? FOR UPDATE', [id]);
    if (!rows.length) {
      await connection.rollback();
      return res.status(404).json({ success: false, message: 'Blog not found.' });
    }
    const blog = rows[0];
    await connection.execute('DELETE FROM blogs WHERE id = ?', [id]);
    await connection.execute('UPDATE blogs SET sort_order = sort_order - 1 WHERE sort_order > ? ORDER BY sort_order', [blog.sort_order]);
    await connection.execute('UPDATE blog_settings SET initialized = 1 WHERE id = 1');
    await connection.commit();
    await removeFile(blog.media);
    return res.json({ success: true, message: 'Blog deleted successfully.' });
  } catch (error) {
    if (connection) await connection.rollback().catch(() => {});
    return next(error);
  } finally {
    if (connection) connection.release();
  }
};

module.exports = { getBlogs, createBlog, updateBlog, deleteBlog };
