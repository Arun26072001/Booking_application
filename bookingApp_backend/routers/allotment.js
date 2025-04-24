const express = require("express");
const { addAllotment, getAllotments, getAllomentById, updateAllotment } = require("../controllers/AllotmentController");
const { verifyAdmin, verifyAdminManager, verifyEmployees } = require("../middleware/authorization");
const router = express.Router();

// router.get("/driver-trips", getDriverTrips);
router.post("/:id", verifyAdminManager, addAllotment);
router.get("/", verifyEmployees, getAllotments);
router.get("/:id", verifyAdminManager, getAllomentById);
router.put("/:id", verifyAdminManager, updateAllotment)

module.exports = router;