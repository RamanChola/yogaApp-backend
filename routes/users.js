var express = require("express");
var router = express.Router();
const usersController = require("../controllers/users-controllers");

router.post("/signup", usersController.signup);
router.post("/login", usersController.login);

module.exports = router;
