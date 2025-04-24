const express = require("express");
const { addBooking, getBookingById, getAllBookings, deleteBooking, getCustomers, getDriverBookings, getAllotorTrips, updateBooking, getBookingByMail } = require("../controllers/bookingController");
const { verifyAdmin, verifyAllotor, verifyAdminManagerConsultant, verifyEmployees, verifyDriverManagerAdmin, verifyAdminManagerConsultantAccount } = require("../middleware/authorization");
const router = express.Router();

router.get("/customers", verifyAdminManagerConsultantAccount, getCustomers);
router.get("/customer/:mail", verifyAdminManagerConsultantAccount, getBookingByMail);
// getting driver trips
router.get("/driver-booking/:id", verifyDriverManagerAdmin, getDriverBookings);
// get alloter trips
router.get("/allotor-booking/:id", verifyAllotor, getAllotorTrips);
router.post("/:id", verifyAdminManagerConsultant, addBooking);
router.get("/:id", verifyEmployees, getBookingById);
router.get("/", verifyEmployees, getAllBookings);
router.put("/:id", verifyAdminManagerConsultant, updateBooking);
router.delete("/:id", verifyAdmin, deleteBooking);

module.exports = router;