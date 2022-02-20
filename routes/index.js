var express = require('express');
var router = express.Router();

const userController = require('../controllers/userController');
const Message = require('../models/Message');

function getMessagesForPage(page, numPerPage) {
  return Promise.all([
    Message.count({}),
    Message.find()
      .sort({ date: -1 })
      .skip(numPerPage * (page - 1))
      .limit(numPerPage)
      .populate('user'),
  ]);
}

/* GET home page. */
router.get('/', async function (req, res, next) {
  const numberOfMessagesPerPage = 10;
  const [messagesCount, messages] = await getMessagesForPage(
    1,
    numberOfMessagesPerPage
  );
  const pageCount = Math.ceil(messagesCount / numberOfMessagesPerPage);

  res.render('index', { user: req.user, currentPage: 1, messages, pageCount });
});

router.get('/page/:num', async function (req, res, next) {
  const numberOfMessagesPerPage = 10;
  const [messagesCount, messages] = await getMessagesForPage(
    req.params.num,
    numberOfMessagesPerPage
  );
  const pageCount = Math.ceil(messagesCount / numberOfMessagesPerPage);

  messages.length > 0
    ? res.render('index', {
        user: req.user,
        currentPage: req.params.num,
        messages,
        pageCount,
      })
    : res.redirect('/');
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

router.post('/delete_message', async (req, res, next) => {
  Message.findByIdAndRemove(req.body.messageid, function deleteMessage(err) {
    if (err) return next(err);

    res.redirect('back');
  });
});

module.exports = router;
