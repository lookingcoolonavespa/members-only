const User = require('../models/User');

exports.isUsernameInUse = async (username) => {
  const user = await User.findOne({ username });
  return user ? Promise.reject('username in use') : Promise.resolve();
};

exports.doPasswordsMatch = (value, { req }) => value === req.body.password;
