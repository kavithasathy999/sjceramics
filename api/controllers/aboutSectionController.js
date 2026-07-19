const fs = require('fs/promises');
const path = require('path');
const db = require('../config/db');

const uploadDirectory = path.resolve(__dirname, '..', 'uploads', 'about');
const countWords = (value) => value.trim().split(/\s+/).filter(Boolean).length;
const videoPath = (filename) => `uploads/about/${path.basename(filename)}`;

const removeVideo = async (storedPath) => {
  if (!storedPath) return;
  try {
    await fs.unlink(path.join(uploadDirectory, path.basename(storedPath)));
  } catch (error) {
    if (error.code !== 'ENOENT') console.error('About video cleanup failed:', error);
  }
};

const serializeSection = (req, section) => ({
  id: section.id,
  title: section.title,
  description: section.description,
  videoUrl: `${req.protocol}://${req.get('host')}/${section.video.replace(/\\/g, '/').replace(/^\/+/, '')}`,
  createdAt: section.created_at,
  updatedAt: section.updated_at,
});

const validateContent = (body) => {
  const title = typeof body.title === 'string' ? body.title.trim() : '';
  const description = typeof body.description === 'string' ? body.description.trim() : '';
  const errors = [];

  if (!title) errors.push('About title is required.');
  else if (countWords(title) > 6) errors.push('About title must contain 6 words or fewer.');
  if (!description) errors.push('About description is required.');
  else if (countWords(description) > 100) errors.push('About description must contain 100 words or fewer.');

  return { title, description, errors };
};

const getAboutSection = async (req, res, next) => {
  try {
    const [rows] = await db.execute('SELECT * FROM about_section WHERE id = 1');
    if (!rows.length) return res.status(404).json({ success: false, message: 'About section is not configured.' });
    return res.json({ success: true, data: serializeSection(req, rows[0]) });
  } catch (error) {
    return next(error);
  }
};

const updateAboutSection = async (req, res, next) => {
  try {
    const validated = validateContent(req.body);
    if (validated.errors.length) {
      if (req.file) await removeVideo(req.file.filename);
      return res.status(400).json({ success: false, message: validated.errors[0], errors: validated.errors });
    }

    const [rows] = await db.execute('SELECT * FROM about_section WHERE id = 1');
    if (!rows.length) {
      if (req.file) await removeVideo(req.file.filename);
      return res.status(404).json({ success: false, message: 'About section is not configured.' });
    }

    const current = rows[0];
    const nextVideo = req.file ? videoPath(req.file.filename) : current.video;
    await db.execute(
      'UPDATE about_section SET title = ?, description = ?, video = ? WHERE id = 1',
      [validated.title, validated.description, nextVideo],
    );
    if (req.file && current.video !== nextVideo) await removeVideo(current.video);

    const [updatedRows] = await db.execute('SELECT * FROM about_section WHERE id = 1');
    return res.json({ success: true, message: 'About section updated successfully.', data: serializeSection(req, updatedRows[0]) });
  } catch (error) {
    if (req.file) await removeVideo(req.file.filename);
    return next(error);
  }
};

module.exports = { getAboutSection, updateAboutSection };
