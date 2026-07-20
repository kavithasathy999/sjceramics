const crypto = require('crypto');
const express = require('express');
const multer = require('multer');
const path = require('path');
const controller = require('../controllers/blogsController');

const router = express.Router();
const uploadDirectory = path.resolve(__dirname, '..', 'uploads', 'blogs');
const maxVideoSize = 8 * 1024 * 1024;
const allowedTypes = new Set(['image/jpeg', 'image/png', 'image/webp', 'video/mp4', 'video/webm']);
const allowedExtensions = new Set(['.jpg', '.jpeg', '.png', '.webp', '.mp4', '.webm']);
const upload = multer({
  storage: multer.diskStorage({
    destination: (_req, _file, callback) => callback(null, uploadDirectory),
    filename: (_req, file, callback) => callback(null, `${Date.now()}-${crypto.randomUUID()}${path.extname(file.originalname).toLowerCase()}`),
  }),
  limits: { fileSize: maxVideoSize + 1 },
  fileFilter: (_req, file, callback) => allowedTypes.has(file.mimetype) && allowedExtensions.has(path.extname(file.originalname).toLowerCase())
    ? callback(null, true)
    : callback(new multer.MulterError('LIMIT_UNEXPECTED_FILE', file.fieldname)),
});

router.get('/', controller.getBlogs);
router.post('/', upload.single('media'), controller.createBlog);
router.put('/:id', upload.single('media'), controller.updateBlog);
router.delete('/:id', controller.deleteBlog);

module.exports = router;
