const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
require('../models/user');
const User = mongoose.model('users');

// Log in with email + password
passport.use(new LocalStrategy(
  { usernameField: 'email' },
  async (username, password, done) => {
    try {
      const q = await User.findOne({ email: username }).exec();
      if (!q || !q.validPassword(password)) {
        return done(null, false, { message: 'Incorrect email or password' });
      }
      return done(null, q);
    } catch (err) {
      return done(err);
    }
  }
));
