const Note = require('../models/note');

module.exports = {};

module.exports.createNote = async (userId, text) => {
  try {
    const note = await Note.create({ text: text, userId: userId });
    return note;
  } catch (e) {
    throw e;
  }
}

module.exports.getNote = async (userId, noteId) => {
  try {
    const note = await Note.findOne({ userId: userId, _id: noteId });
    return note;
  } catch (e) {
    throw e;
  }
}

module.exports.getUserNotes = async (userId) => {
  try {
    const notes = await Note.find({ userId: userId });
    return notes;
  } catch (e) {
    throw e;
  }
}
