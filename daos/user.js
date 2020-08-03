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
  try {
    return await User.findOne({ email: email }).lean();
  } catch(e) {
    throw e;
  }
}

module.exports.updateUserPassword = async (userId, password) => {
  try {
    return await User.update({ _id: userId }, { password: password })
  } catch(e) {
    throw e;
  }
}

class BadDataError extends Error {};
module.exports.BadDataError = BadDataError;
