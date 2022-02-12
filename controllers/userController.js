const async = require('async');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const {
  isUsernameInUse,
  doPasswordsMatch,
  isSecretPasswordEntered,
} = require('../logic/custom_validators');
const passport = require('../logic/authentication');

const User = require('../models/User');

exports.user_signup_post = [
  body('username')
    .trim()
    .notEmpty()
    .withMessage('username is missing')
    .isLength({ nax: 100 })
    .withMessage('username is too long brudda')
    .custom(isUsernameInUse),
  body('password').trim().notEmpty().withMessage('password is missing'),
  body('confirm_password')
    .trim()
    .custom(doPasswordsMatch)
    .withMessage('passwords do not match'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.render('signup', {
        errors: errors.errors,
        username: req.body.username,
      });
    }

    bcrypt.hash(req.body.password, 10, async (err, hashedPassword) => {
      if (err) return next(err);

      const user = new User({
        username: req.body.username,
        password: hashedPassword,
        role: 'pleb',
      });
      await user.save((err) => {
        if (err) return next(err);
      });

      req.login(user, (err) => {
        if (err) return next(err);

        res.redirect('/');
      });
    });
  },
];

exports.user_login_post = (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) return next(err);
    if (!user) return res.render('login', { message: info.message });
    req.login(user, (err) => {
      if (err) return next(err);

      res.redirect('/');
    });
  })(req, res, next);
};

exports.become_member_post = [
  body('password', 'invalid password')
    .trim()
    .notEmpty()
    .custom(isSecretPasswordEntered),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.render('secret_password_page', {
        errors: errors.errors,
      });
    }

    User.findByIdAndUpdate(
      req.user._id,
      { role: 'member' },
      {},
      (err, user) => {
        if (err) return next(err);

        res.redirect('/');
      }
    );
  },
];
