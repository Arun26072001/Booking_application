const express = require("express");
const { getStates, addState } = require("../controllers/stateController");
const { verifyEmployees, verifyAdmin } = require("../middleware/authorization");
const router = express.Router();

router.get("/", verifyEmployees,getStates);
router.post("/", verifyAdmin,addState);

module.exports = router;