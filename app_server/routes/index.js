const express = require('express');
const router = express.Router();
const travelController = require('../controllers/travel');

router.get('/', travelController.index);
router.get('/travel', travelController.travel);

module.exports = router;