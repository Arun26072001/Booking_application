const express = require("express");
const { addVehicle, getAllVehicles, updateVehicle, getVehicleById, deleteVehicle, fetchDriverVehicles } = require("../controllers/vehicleController");
const { verifyEmployees, verifyVendorDriverManagerAdmin } = require("../middleware/authorization");
const router = express.Router();

router.post("/:id", verifyVendorDriverManagerAdmin, addVehicle);
router.get("/", verifyEmployees, getAllVehicles);
router.get("/:id", verifyVendorDriverManagerAdmin, fetchDriverVehicles)
router.put("/:id", verifyVendorDriverManagerAdmin, updateVehicle);
router.get("/:name", verifyEmployees, getVehicleById);
router.delete("/:id", verifyVendorDriverManagerAdmin, deleteVehicle);

module.exports = router;