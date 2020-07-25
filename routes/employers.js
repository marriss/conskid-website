const express = require("express");

const router = express.Router();

const employerControllers = require("../controllers/employer");
const isAuth = require("../middlewere/is-auth");

router.get("/emp-dashboard", isAuth, employerControllers.getEmployerDashboard);

router.get("/candidates", isAuth, employerControllers.getCandidates);

router.get(
  "/stu-profile/:stuId",
  isAuth,
  employerControllers.getCandidateProfile
);

// Search for gigs
router.get("/search", isAuth, employerControllers.postSearch);

router.post("/arrange-interview", isAuth, employerControllers.postArrangeInterview);

module.exports = router;
