const crypto = require('crypto');
const express = require('express');
const multer = require('multer');
const path = require('path');
const controller = require('../controllers/bannersController');

const router = express.Router();
const uploadDirectory = path.resolve(__dirname, '..', 'uploads', 'banners');
const allowedTypes = new Set(['image/jpeg', 'image/png', 'image/webp']);

const upload = multer({
  storage: multer.diskStorage({
    destination: (_req, _file, callback) => callback(null, uploadDirectory),
    filename: (_req, file, callback) => callback(null, `${Date.now()}-${crypto.randomUUID()}${path.extname(file.originalname).toLowerCase()}`),
  }),
  limits: { fileSize: 3 * 1024 * 1024 },
  fileFilter: (_req, file, callback) => {
    if (!allowedTypes.has(file.mimetype)) return callback(new multer.MulterError('LIMIT_UNEXPECTED_FILE', file.fieldname));
    return callback(null, true);
  },
});

router.get('/', controller.getBanners);
router.post('/batch', upload.array('images'), controller.createBanners);
router.put('/:id', upload.single('image'), controller.updateBanner);
router.delete('/:id', controller.deleteBanner);

module.exports = router;
