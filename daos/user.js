const User = require('../models/user');
const bcrypt = require('bcrypt');


module.exports = {};

module.exports.createUser = async (userObj) => {
  try {
    const user = await User.create(userObj);
    return user;
  } catch(e) {
    if (e.message.includes('validation failed')) {
      throw new BadDataError(e.message);
    }
    throw e;
  }
}

module.exports.getUser = async (email) => {
  return await User.findOne({ email: email }).lean();
}

module.exports.updateUserPassword = async (userId, password) => {
  const user = await User.findOne({ _id: userId })
  user.password = password
  return await user.save();
}

class BadDataError extends Error {};
module.exports.BadDataError = BadDataError;
// - createUser(userObj) - should store a user record
// - getUser(email) - should get a user record using their email
// - updateUserPassword(userId, password) - should update the user's password field
