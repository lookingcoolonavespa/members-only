const async = require('async');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const {
  isUsernameInUse,
  doPasswordsMatch,
} = require('../logic/custom_validators');

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

    bcrypt.hash(req.body.password, 10, (err, hashedPassword) => {
      if (err) return next(err);

      const user = new User({
        username: req.body.username,
        password: hashedPassword,
      }).save((err) => {
        if (err) return next(err);
        res.redirect('/');
      });
    });
  },
];
