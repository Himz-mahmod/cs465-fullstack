const express = require('express');
const router = express.Router();
const tripsController = require('../controllers/trips');

router
  .route('/trips')
  .get(tripsController.tripsList)     // GET all trips
  .post(tripsController.tripsAddTrip); // POST a new trip

router
  .route('/trips/:tripCode')
  .get(tripsController.tripsFindByCode)  // GET one trip
  .put(tripsController.tripsUpdateTrip); // PUT changes to one trip

module.exports = router;