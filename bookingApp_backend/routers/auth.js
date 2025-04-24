const express = require("express");
const { addEmployee, loginUser, logoutUser, forgetPassword, getEmployees, updateEmployee, getEmployeeData, deleteEmp } = require("../controllers/authController");
const { verifyEmployees, verifyAdminManager } = require("../middleware/authorization");
const router = express.Router();

router.post("/login", loginUser);
router.get("/logout", logoutUser);
router.post("/:id", verifyAdminManager, addEmployee);
router.get("/", verifyEmployees, getEmployees);
router.get("/:email", verifyEmployees, getEmployeeData);
router.post("/forget/password", forgetPassword);
router.delete("/:id", verifyAdminManager, deleteEmp)
router.put("/:id", verifyAdminManager, updateEmployee);
module.exports = router;