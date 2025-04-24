const express = require("express");
const { completeTripToDriver, getCompletedTripDetails, updateCompletedTrip, getCompletedTrips } = require("../controllers/tripCompleteController");
const { verifyDriverManagerAdmin, verifyEmployees } = require("../middleware/authorization");
// const { upload } = require("../controllers/ImgUpload");
const router = express.Router();

router.get("/", getCompletedTrips)
router.post("/:id", verifyDriverManagerAdmin, completeTripToDriver);
router.get("/:id", verifyEmployees, getCompletedTripDetails);
router.put("/:id", verifyEmployees, updateCompletedTrip);

module.exports = router;