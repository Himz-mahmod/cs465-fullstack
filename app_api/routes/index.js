const express = require('express');
const router = express.Router();
const { expressjwt } = require('express-jwt');

const tripsController = require('../controllers/trips');
const authController = require('../controllers/authentication');

// Check the "Authorization: Bearer <token>" header before admin actions.
// express-jwt verifies the signature with JWT_SECRET and puts the
// verified claims (id, email, name) on req.payload.
const authenticateJWT = expressjwt({
  secret: () => process.env.JWT_SECRET,
  algorithms: ['HS256'],
  requestProperty: 'payload'
});

router
  .route('/register')
  .post(authController.register);

router
  .route('/login')
  .post(authController.login);

router
  .route('/trips')
  .get(tripsController.tripsList)                      // GET all trips (public)
  .post(authenticateJWT, tripsController.tripsAddTrip); // POST a new trip (admin)

router
  .route('/trips/:tripCode')
  .get(tripsController.tripsFindByCode)                          // GET one trip (public)
  .put(authenticateJWT, tripsController.tripsUpdateTrip)         // PUT changes (admin)
  .delete(authenticateJWT, tripsController.tripsDeleteTrip);     // DELETE a trip (admin)

// Turn a missing, forged or expired token into a 401 response
router.use((err, req, res, next) => {
  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({ message: err.message });
  }
  next(err);
});

module.exports = router;
