const Token = require('../models/token');
const { v4: uuidv4 } = require('uuid');

module.exports = {};

// - getTokenForUserId(userId) - should be an async function that returns a string after creating a Token record
module.exports.getTokenForUserId = async (userId) => {
  const uuid = await uuidv4();
  const token = await Token.create({ userId: userId, uuid: uuid });
  return token.uuid;
}

// - getUserIdFromToken(tokenString) - should be an async function that returns a userId string using the tokenString to get a Token record
module.exports.getUserIdFromToken = async (uuid) => {
  const token = await Token.findOne({ uuid: uuid }).lean();
  if (token) {
    return token.userId;
  } else {
    return false;
  }
}

// - removeToken(tokenString) - an async function that deletes the corresponding Token record
module.exports.removeToken = async (uuid) => {
  try {
    await Token.deleteOne({ uuid: uuid });
    return true;
  } catch(e) {
    throw(e);
  }
}
