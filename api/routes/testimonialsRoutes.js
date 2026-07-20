const express = require('express');
const controller = require('../controllers/testimonialsController');

const router = express.Router();

router.get('/', controller.getTestimonials);
router.post('/', controller.createTestimonial);
router.put('/:id', controller.updateTestimonial);
router.delete('/:id', controller.deleteTestimonial);

module.exports = router;
