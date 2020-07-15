const express = require("express");

const router = express.Router();

const studentControllers = require("../controllers/student");
const isAuth = require("../middlewere/is-auth");
router.get("/profile", isAuth, studentControllers.getProfile);

router.get("/stu-dashboard", isAuth, studentControllers.getStudentDashboard);

module.exports = router;
