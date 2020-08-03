const { Router } = require("express");
const router = Router();

// router.use((req, res, next) => {
//   console.log(`${req.method} ${req.url} at ${new Date()}`);
//   next();
// });


router.use("/login", require('./login'));

module.exports = router;
