var express = require("express");
var router = express.Router();
const usersController = require("../controllers/users-controllers");
// for signup
router.post("/signup", usersController.signup);
// for login
router.post("/login", usersController.login);

module.exports = router;
