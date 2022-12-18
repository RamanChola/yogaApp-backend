var express = require("express");
var router = express.Router();
const dataController = require("../controllers/data-controllers");
const checkAuth = require("../middleware/check-auth");

router.post("/subscribe", checkAuth, dataController.subscribe);
router.get("/isSubscribed/:client_id", checkAuth, dataController.isSubscribed);
router.get("/getPlans", checkAuth, dataController.getPlans);
router.get(
  "/getSubscriptionDetails/:client_id",
  checkAuth,
  dataController.getSubscriptionDetails
);

module.exports = router;
