const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');

const User = require('../models/User');

passport.use(
  new LocalStrategy((username, password, done) => {
    User.findOne({ username }, (err, user) => {
      if (err) return done(err);
      if (!user) return done(null, false, { message: 'no user found' });

      bcrypt.compare(password, user.password, (err, res) => {
        if (res) return done(null, user);
        else return done(null, false, { message: 'incorrect password' });
      });
    });
  })
);

passport.serializeUser((user, done) => {
  console.log(user);
  done(null, user._id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  });
});

module.exports = passport;
