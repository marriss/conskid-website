const express = require("express");

const router = express.Router();

const employerControllers = require("../controllers/employer");
const isAuth = require("../middlewere/is-auth");

router.get("/emp-dashboard", isAuth, employerControllers.getEmployerDashboard);

router.get("/candidates", isAuth, employerControllers.getCandidates);

module.exports = router;
