const crypto = require('crypto');
const express = require('express');
const multer = require('multer');
const path = require('path');
const controller = require('../controllers/aboutSectionController');

const router = express.Router();
const uploadDirectory = path.resolve(__dirname, '..', 'uploads', 'about');
const allowedTypes = new Set(['video/mp4', 'video/webm']);

const upload = multer({
  storage: multer.diskStorage({
    destination: (_req, _file, callback) => callback(null, uploadDirectory),
    filename: (_req, file, callback) => callback(null, `${Date.now()}-${crypto.randomUUID()}${path.extname(file.originalname).toLowerCase()}`),
  }),
  limits: { fileSize: 8 * 1024 * 1024 },
  fileFilter: (_req, file, callback) => {
    if (!allowedTypes.has(file.mimetype)) return callback(new multer.MulterError('LIMIT_UNEXPECTED_FILE', file.fieldname));
    return callback(null, true);
  },
});

router.get('/', controller.getAboutSection);
router.put('/', upload.single('video'), controller.updateAboutSection);

module.exports = router;
