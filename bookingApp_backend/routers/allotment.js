const express = require("express");
const { addAllotment, getAllotments, getAllomentById, updateAllotment } = require("../controllers/AllotmentController");
const { verifyAdminManagerVendor, verifyEmployees } = require("../middleware/authorization");
const router = express.Router();

router.post("/:id", verifyAdminManagerVendor, addAllotment);
router.get("/", verifyEmployees, getAllotments);
router.get("/:id", verifyAdminManagerVendor, getAllomentById);
router.put("/:id", verifyAdminManagerVendor, updateAllotment)

module.exports = router;