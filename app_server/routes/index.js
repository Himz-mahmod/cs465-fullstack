const express = require('express');
const router = express.Router();
const indexController = require('../controllers/index');
const travelController = require('../controllers/travel');

router.get('/', indexController.index);
router.get('/travel', travelController.travel);

module.exports = router;