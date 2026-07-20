const express = require('express');
const { rateLimit } = require('express-rate-limit');
const controller = require('../controllers/contactEnquiriesController');

const router = express.Router();
const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: { success: false, message: 'Too many contact requests. Please try again later.' },
});

router.get('/', controller.getContactEnquiries);
router.post('/', contactLimiter, controller.submitContactEnquiry);
router.put('/:id', controller.updateContactEnquiry);
router.delete('/:id', controller.deleteContactEnquiry);

module.exports = router;
