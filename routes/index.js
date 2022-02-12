var express = require('express');
var router = express.Router();
const passport = require('../logic/authentication');

const userController = require('../controllers/userController');
const Message = require('../models/Message');

/* GET home page. */
router.get('/', function (req, res, next) {
  console.log(req.user);
  res.render('index', { user: req.user });
});

router.get('/login', (req, res, next) => {
  res.render('login');
});
router.post('/login', userController.user_login_post);

router.get('/signup', (req, res, next) => {
  res.render('signup');
});
router.post('/signup', userController.user_signup_post);

router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

router.get('/become_member', (req, res, next) => {
  res.render('secret_password_page', { user: req.user });
});
router.post('/become_member', userController.become_member_post);

router.post('/create_message', (req, res, next) => {
  if (!req.user) return res.render('index', { message: 'user not found' });

  new Message({
    user: req.user._id,
    date: new Date(),
    title: req.body.title,
    content: req.body.content,
  }).save((err) => {
    if (err) return next(err);

    res.redirect('/');
  });
});

module.exports = router;
