const crypto = require('crypto');
const express = require('express');
const multer = require('multer');
const path = require('path');
const controller = require('../controllers/homeCategoriesController');

const router = express.Router();
const uploadDirectory = path.resolve(__dirname, '..', 'uploads', 'categories');
const maxImageSize = 3 * 1024 * 1024;
const allowedTypes = new Set(['image/jpeg', 'image/png', 'image/webp']);
const allowedExtensions = new Set(['.jpg', '.jpeg', '.png', '.webp']);
const upload = multer({
  storage: multer.diskStorage({
    destination: (_req, _file, callback) => callback(null, uploadDirectory),
    filename: (_req, file, callback) => callback(null, `${Date.now()}-${crypto.randomUUID()}${path.extname(file.originalname).toLowerCase()}`),
  }),
  limits: { fileSize: maxImageSize + 1 },
  fileFilter: (_req, file, callback) => allowedTypes.has(file.mimetype) && allowedExtensions.has(path.extname(file.originalname).toLowerCase())
    ? callback(null, true)
    : callback(new multer.MulterError('LIMIT_UNEXPECTED_FILE', file.fieldname)),
});

router.get('/', controller.getHomeCategories);
router.post('/', upload.single('image'), controller.createHomeCategory);
router.put('/:id', upload.single('image'), controller.updateHomeCategory);
router.delete('/:id', controller.deleteHomeCategory);

module.exports = router;
