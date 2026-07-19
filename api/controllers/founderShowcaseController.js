const fs = require('fs/promises');
const path = require('path');
const db = require('../config/db');

const uploadDirectory = path.resolve(__dirname, '..', 'uploads', 'founder');
const storedPath = (filename) => `uploads/founder/${path.basename(filename)}`;
const publicUrl = (req, value) => value
  ? `${req.protocol}://${req.get('host')}/${value.replace(/\\/g, '/').replace(/^\/+/, '')}`
  : null;

const removeFile = async (value) => {
  if (!value) return;
  try {
    await fs.unlink(path.join(uploadDirectory, path.basename(value)));
  } catch (error) {
    if (error.code !== 'ENOENT') console.error('Founder portrait cleanup failed:', error);
  }
};

const serialize = (req, row) => ({
  id: row.id,
  portraitUrl: publicUrl(req, row.portrait),
  updatedAt: row.updated_at,
});

const getFounderShowcase = async (req, res, next) => {
  try {
    const [rows] = await db.execute('SELECT * FROM founder_showcase WHERE id = 1');
    if (!rows.length) return res.status(404).json({ success: false, message: 'CEO & Founder section is not configured.' });
    return res.json({ success: true, data: serialize(req, rows[0]) });
  } catch (error) {
    return next(error);
  }
};

const updateFounderShowcase = async (req, res, next) => {
  if (!req.file) return res.status(400).json({ success: false, message: 'Choose a CEO & Founder photo.' });

  try {
    const [rows] = await db.execute('SELECT * FROM founder_showcase WHERE id = 1');
    if (!rows.length) {
      await removeFile(req.file.filename);
      return res.status(404).json({ success: false, message: 'CEO & Founder section is not configured.' });
    }

    const nextPortrait = storedPath(req.file.filename);
    await db.execute('UPDATE founder_showcase SET portrait = ? WHERE id = 1', [nextPortrait]);
    await removeFile(rows[0].portrait);
    const [updated] = await db.execute('SELECT * FROM founder_showcase WHERE id = 1');
    return res.json({ success: true, message: 'CEO & Founder photo updated successfully.', data: serialize(req, updated[0]) });
  } catch (error) {
    await removeFile(req.file.filename);
    return next(error);
  }
};

module.exports = { getFounderShowcase, updateFounderShowcase };
