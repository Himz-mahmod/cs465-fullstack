const mongoose = require('mongoose');
const Trip = require('../models/travlr'); // Register model
const Model = mongoose.model('trips');

// GET: /trips - lists all the trips
const tripsList = async (req, res) => {
  const q = await Model
    .find({}) // No filter, return all records
    .exec();

  if (!q) { // Database returned no data
    return res
      .status(404)
      .json({ message: 'No trips found' });
  } else { // Return resulting trip list
    return res
      .status(200)
      .json(q);
  }
};

// GET: /trips/:tripCode - lists a single trip
const tripsFindByCode = async (req, res) => {
  const q = await Model
    .find({ 'code': req.params.tripCode }) // Return single record
    .exec();

  if (!q) { // Database returned no data
    return res
      .status(404)
      .json({ message: 'Trip not found' });
  } else { // Return resulting trip
    return res
      .status(200)
      .json(q);
  }
};

// POST: /trips - adds a new trip
const tripsAddTrip = async (req, res) => {
  try {
    const newTrip = new Trip({
      code: req.body.code,
      name: req.body.name,
      length: req.body.length,
      start: req.body.start,
      resort: req.body.resort,
      perPerson: req.body.perPerson,
      image: req.body.image,
      description: req.body.description
    });

    const q = await newTrip.save();
    return res
      .status(201)
      .json(q);
  } catch (err) { // Missing or invalid fields
    return res
      .status(400)
      .json(err);
  }
};

// PUT: /trips/:tripCode - updates an existing trip
const tripsUpdateTrip = async (req, res) => {
  try {
    const q = await Model
      .findOneAndUpdate(
        { 'code': req.params.tripCode },
        {
          code: req.body.code,
          name: req.body.name,
          length: req.body.length,
          start: req.body.start,
          resort: req.body.resort,
          perPerson: req.body.perPerson,
          image: req.body.image,
          description: req.body.description
        },
        { new: true } // Return the updated trip
      )
      .exec();

    if (!q) { // No trip with that code
      return res
        .status(404)
        .json({ message: 'Trip not found' });
    } else {
      return res
        .status(200)
        .json(q);
    }
  } catch (err) {
    return res
      .status(400)
      .json(err);
  }
};

// DELETE: /trips/:tripCode - deletes an existing trip
const tripsDeleteTrip = async (req, res) => {
  try {
    const q = await Model
      .findOneAndDelete({ 'code': req.params.tripCode })
      .exec();

    if (!q) { // No trip with that code
      return res
        .status(404)
        .json({ message: 'Trip not found' });
    } else {
      return res
        .status(200)
        .json({ message: 'Trip deleted', code: q.code });
    }
  } catch (err) {
    return res
      .status(400)
      .json(err);
  }
};

module.exports = {
  tripsList,
  tripsFindByCode,
  tripsAddTrip,
  tripsUpdateTrip,
  tripsDeleteTrip
};