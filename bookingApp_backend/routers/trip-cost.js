const express = require("express");
const { verifyAdminManagerAccountant } = require("../middleware/authorization");
const router = express.Router();
const {addTripCost} = require("../controllers/tripCostController");

router.post("/:id", verifyAdminManagerAccountant, addTripCost)

module.exports = router;