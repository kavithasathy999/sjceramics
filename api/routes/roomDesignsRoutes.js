const crypto = require('crypto');
const express = require('express');
const multer = require('multer');
const path = require('path');
const controller = require('../controllers/roomDesignsController');

const router = express.Router();
const uploadDirectory = path.resolve(__dirname, '..', 'uploads', 'room-designs');
const allowedTypes = new Set(['image/jpeg', 'image/png', 'image/webp']);
const upload = multer({
  storage: multer.diskStorage({
    destination: (_req, _file, callback) => callback(null, uploadDirectory),
    filename: (_req, file, callback) => callback(null, `${Date.now()}-${crypto.randomUUID()}${path.extname(file.originalname).toLowerCase()}`),
  }),
  limits: { fileSize: 3 * 1024 * 1024 },
  fileFilter: (_req, file, callback) => allowedTypes.has(file.mimetype)
    ? callback(null, true)
    : callback(new multer.MulterError('LIMIT_UNEXPECTED_FILE', file.fieldname)),
});

router.get('/', controller.getRoomDesigns);
router.post('/', upload.single('image'), controller.createRoomDesign);
router.put('/:id', upload.single('image'), controller.updateRoomDesign);
router.delete('/:id', controller.deleteRoomDesign);

module.exports = router;
