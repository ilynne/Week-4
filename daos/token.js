const Token = require('../models/token');
const { v1: uuidv1 } = require('uuid');

module.exports = {};

// - getTokenForUserId(userId) - should be an async function that returns a string after creating a Token record
module.exports.getTokenForUserId = async (userId) => {
  const uuid = await uuidv1();
  const token = await Token.create({ userId: userId, uuid: uuid });
  return token.uuid;
}

// - getUserIdFromToken(tokenString) - should be an async function that returns a userId string using the tokenString to get a Token record
module.exports.getUserIdFromToken = async (uuid) => {
  const token = await Token.findOne({ uuid: uuid }).lean();
  return token.userId
}

// - removeToken(tokenString) - an async function that deletes the corresponding Token record
module.exports.removeToken = async (uuid) => {
  return await Token.deleteOne({ uuid: uuid });
}
