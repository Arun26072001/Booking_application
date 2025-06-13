const express = require("express");
const { addEmployee, loginUser, logoutUser, forgetPassword, getEmployees, updateEmployee, getEmployeeData, deleteEmp, addDriver, getDrivers } = require("../controllers/authController");
const { verifyEmployees, verifyAdminManager, verifyAdminManagerVendor } = require("../middleware/authorization");
const router = express.Router();

router.post("/login", loginUser);
router.post("/:id", verifyAdminManager, addEmployee);
router.post("/add-driver/:id", verifyAdminManagerVendor, addDriver)
router.post("/forget/password", forgetPassword);
router.get("/logout", logoutUser);
router.get("/drivers/:id", verifyAdminManagerVendor, getDrivers)
router.get("/", verifyEmployees, getEmployees);
router.get("/:email", verifyEmployees, getEmployeeData);
router.delete("/:id", verifyAdminManagerVendor, deleteEmp)
router.put("/:id", verifyAdminManagerVendor, updateEmployee);
module.exports = router;