const express = require('express');
const controller = require('../controllers/exploreCollectionsController');

const router = express.Router();
router.get('/', controller.getExploreCollections);
router.post('/', controller.createExploreCollection);
router.put('/:id', controller.updateExploreCollection);
router.delete('/:id', controller.deleteExploreCollection);

module.exports = router;
