const { Router } = require("express");
const router = Router();
// const isLoggedIn = require("./index.js");
const bcrypt = require("bcrypt");
const userDAO = require('../daos/user');
const tokenDAO = require('../daos/token')

const isLoggedIn = async (req, res, next) => {
  const { authorization } = req.headers
  if (authorization) {
    console.log(authorization);
    const token = authorization.split(' ')[1];
    console.log('logged in user token is: ', token);
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

const emailAndPassword = async (req, res, next) => {
  const { email, password } = req.body
  if (!email || !password) {
    // console.log('email and password', email, password)
    res.status(400).send('email and password are required')
  } else {
    next();
  }
}

// Login
router.post("/", emailAndPassword, async (req, res, next) => {
  const { email, password } = req.body
  try {
    const user = await userDAO.getUser(email);
    if (user && await bcrypt.compare(password, user.password)) {
      try {
        // console.log('passwords match');
        console.log('logging in: ', user, email, password)
        const token = await tokenDAO.getTokenForUserId(user._id)
        res.json({ token: token })
      } catch(e) {
        next(e);
      }
    } else {
      res.status(401).send('invalid login')
    }
  } catch(e) {
    next(e)
  }
});

// Signup
router.post("/signup", emailAndPassword, async (req, res, next) => {
  const { email, password } = req.body;
  const encryptedPassword = await bcrypt.hash(password, 10);
  try {
    const user = await userDAO.createUser({ email: email, password: encryptedPassword });
    res.json(user);
  } catch(e) {
    next(e);
  }
})

// Password
router.post("/password", isLoggedIn, async (req, res, next) => {
  const { password } = req.body
  // console.log('password route', password);
  if (!password) {
    res.status(400).send('email and password are required')
  } else {
    try {
      console.log('change pw for ', req.userId, ' to ', password)
      // res.json('change successful')
      const encryptedPassword = await bcrypt.hash(password, 10);
      await userDAO.updateUserPassword(req.userId, encryptedPassword);
      res.status(200).send('success');
    } catch(e) {
      console.log('it did not work');
      next(e);
    }
  }
  // res.status(401).send('stub');
})

// Logout
router.post("/logout", isLoggedIn, async (req, res, next) => {
  const deletedToken = await tokenDAO.removeToken(req.token);
  if (deletedToken === true) {
    res.status(200).send('success');
  } else {
    res.status(401).send('failure');
  }
})


// errors
router.use(async (error, req, res, next) => {
  if (error instanceof userDAO.BadDataError) {
    res.status(409).send(error.message);
  } else {
    console.log(error.message)
    res.status(500).send('something went wrong');
  }
});

module.exports = router;
