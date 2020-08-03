const mongoose = require('mongoose');

const tokenSchema = new mongoose.Schema({
  uuid: { type: String, required: true },
  userId: { type: String, required: true }
});

tokenSchema.index({ uuid: 1 })
tokenSchema.index({ userId: 1 })
module.exports = mongoose.model("tokens", tokenSchema);
