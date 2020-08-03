const { Router } = require("express");
const router = Router();
const bcrypt = require("bcrypt");
const userDAO = require('../daos/user');
const tokenDAO = require('../daos/token')
const { route } = require(".");

// router.use(async (req, res, next) => {
//   console.log('isLoggedIn', req.params);
//   if (false) {
//     res.status(401);
//   } else {
//     next();
//   }
// })
router.post(["/", "/signup", "/password"], async (req, res, next) => {
  const { email, password } = req.body
  if (!email || !password) {
    res.status(400).send('email and password are required')
  } else {
    next();
  }
})

// Login
router.post("/", async (req, res, next) => {
  const { email, password } = req.body
  // const encryptedPassword = await bcrypt.hash(password, 10);
  console.log('login route is stubbed', email, password)
  // res.status(200).send('stub');
  try {
    const user = await userDAO.getUser(email);
    // console.log(user.password, encryptedPassword)
    if (user && await bcrypt.compare(password, user.password)) {
      try {
        console.log('passwords match');
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
  // try {
  //   const user = await userDAO.getUser(email);
  //   res.status(401)
  //   // if (user.password === encryptedPassword) {
  //   //   const token = await tokenDAO.getTokenForUserId(user._id)
  //   //   res.json(token);
  //   // } else {
  //   //   next()
  //   // }
  // } catch(e) {
  //   next(e);
  // }
});

// Signup
router.post("/signup", async (req, res, next) => {
  const { email, password } = req.body;
  const encryptedPassword = await bcrypt.hash(password, 10);
  // console.log('signup', email, password);
  try {
    const user = await userDAO.createUser({ email: email, password: encryptedPassword });
    res.json(user);
  } catch(e) {
    next(e);
  }
})

// Password
router.post("/password", async (req, res, next) => {
  const { email, password } = req.body
  console.log('password route is stubbed', email, password);
  res.status(401).send('stub');
})

// Logout
router.post("/logout", async (req, res, next) => {
  const { email, password } = req.body
  console.log('logout route is stubbed', email, password);
  res.status(401).send('stub');
})

// route.use()

// // Create
// router.post("/", async (req, res, next) => {
//   console.log(req.params)
//   // const userId = req.params.userId;
//   // const transaction = req.body;
//   // transaction.userId = userId;
//   // if (!transaction || JSON.stringify(transaction) === '{}' ) {
//   //   res.status(400).send('transaction is required');
//   // } else {
//   //   try {
//   //     const savedtransaction = await transactionDAO.create(transaction);
//   //     res.json(savedtransaction);
//   //   } catch(e) {
//   //     next(e);
//   //   }
//   // }
// });

// errors
router.use(async (error, req, res, next) => {
  if (error instanceof userDAO.BadDataError) {
    res.status(409).send(error.message);
  } else {
    res.status(500).send('something went wrong');
  }
  // console.log(error.message)
  // res.status(500);
  // if (error.message.includes('Cast to ObjectId failed')) {
  //   res.status(400).send(`Invalid id provided`);
  // } else {
  //   res.status(500).send('Something went wrong.')
  // }
});

module.exports = router;
