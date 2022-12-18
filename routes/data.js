var express = require("express");
var router = express.Router();
const dataController = require("../controllers/data-controllers");
const checkAuth = require("../middleware/check-auth");

// adds the subscription to the user based on clien_id and plan_id
router.post("/subscribe", checkAuth, dataController.subscribe);

// checks if the user is subscribed with the provided client_id in the params
router.get("/isSubscribed/:client_id", checkAuth, dataController.isSubscribed);

// fetches all the plans
router.get("/getPlans", checkAuth, dataController.getPlans);

// fetches the subscription details for the given client_id
router.get(
  "/getSubscriptionDetails/:client_id",
  checkAuth,
  dataController.getSubscriptionDetails
);

module.exports = router;
