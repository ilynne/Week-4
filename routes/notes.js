const { Router } = require("express");
const router = Router();
const noteDAO = require('../daos/note');
const tokenDAO = require('../daos/token');

const isLoggedIn = async (req, res, next) => {
  const { authorization } = req.headers
  if (authorization) {
    const token = authorization.split(' ')[1];
    if (token) {
      req.token = token;
      const userId = await tokenDAO.getUserIdFromToken(token)
      if (userId) {
        req.userId = userId;
        next();
      } else {
        res.sendStatus(401);
      }
    } else {
      res.sendStatus(401);
    }
  } else {
    res.sendStatus(401);
  }
}

// Create
router.post("/", isLoggedIn, async (req, res, next) => {
  const userId = req.userId;
  const { text } = req.body;
  try {
    const note = await noteDAO.createNote(userId, text);
    res.json(note);
  } catch(e) {
    next(e);
  }
});

// Index
router.get("/", isLoggedIn, async (req, res, next) => {
  const userId = req.userId;
  try {
    const notes = await noteDAO.getUserNotes(userId);
    res.json(notes);
  } catch(e) {
    next(e);
  }
});

// Single Note
router.get("/:id", isLoggedIn, async (req, res, next) => {
  const { id } = req.params;
  const userId = req.userId;
  try {
    const note = await noteDAO.getNote(userId, id)
    if (note) {
      res.json(note);
    } else {
      res.status(404).send('no note found')
    }
  } catch(e) {
    next(e);
  }
});

// errors
router.use(async (error, req, res, next) => {
  if (error.message.includes("Cast to ObjectId failed")) {
    res.status(400).send(error.message);
  } else {
    res.status(500).send(error.message);
  }
});

module.exports = router;
