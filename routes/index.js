const { Router } = require("express");
const router = Router();

// router.use((req, res, next) => {
//   console.log(`${req.method} ${req.url} at ${new Date()}`);
//   next();
// });
// isLoggedIn(req, res, next) - should check if the user has a valid token and if so make req.userId = the userId associated with that token. The token will be coming in as a bearer token in the authorization header (i.e. req.headers.authorization = 'Bearer 1234abcd') and you will need to extract just the token text. Any route that says "If the user is logged in" should use this middleware function.

router.use("/login", require('./login'));

// const isLoggedIn = async(req, res, next) => {
//   return true;
// }

module.exports = router;
// module.exports = isLoggedIn;
