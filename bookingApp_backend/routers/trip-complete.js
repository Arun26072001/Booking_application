const express = require("express");
const { completeTripToDriver, getCompletedTripDetails, updateCompletedTrip, getCompletedTrips } = require("../controllers/tripCompleteController");
const { verifyVendorDriverManagerAdmin, verifyEmployees } = require("../middleware/authorization");
// const { upload } = require("../controllers/ImgUpload");
const router = express.Router();

router.get("/", getCompletedTrips)
router.post("/:id", verifyVendorDriverManagerAdmin, completeTripToDriver);
router.get("/:id", verifyEmployees, getCompletedTripDetails);
router.put("/:id", verifyEmployees, updateCompletedTrip);

module.exports = router;