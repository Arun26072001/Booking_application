const express = require("express");
const { addVehicle, getAllVehicles, updateVehicle, getVehicleById, deleteVehicle } = require("../controllers/vehicleController");
const { verifyEmployees, verifyDriverManagerAdmin } = require("../middleware/authorization");
const router = express.Router();

router.post("/", verifyDriverManagerAdmin, addVehicle);
router.get("/", verifyEmployees, getAllVehicles);
router.put("/:id", verifyDriverManagerAdmin, updateVehicle);
router.get("/:name", verifyEmployees, getVehicleById);
router.delete("/:id", verifyDriverManagerAdmin, deleteVehicle);

module.exports = router;