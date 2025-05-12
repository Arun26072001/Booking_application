const express = require("express");
const { addVehicle, getAllVehicles, updateVehicle, getVehicleById, deleteVehicle, fetchDriverVehicles } = require("../controllers/vehicleController");
const { verifyEmployees, verifyDriverManagerAdmin } = require("../middleware/authorization");
const router = express.Router();

router.post("/:id", verifyDriverManagerAdmin, addVehicle);
router.get("/", verifyEmployees, getAllVehicles);
// router.get("/in-garage", verifyEmployees, fetchOnGarageVehicles)
router.get("/:id", verifyDriverManagerAdmin, fetchDriverVehicles)
router.put("/:id", verifyDriverManagerAdmin, updateVehicle);
router.get("/:name", verifyEmployees, getVehicleById);
router.delete("/:id", verifyDriverManagerAdmin, deleteVehicle);

module.exports = router;