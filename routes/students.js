const express = require("express");

const router = express.Router();

const studentControllers = require("../controllers/student");
const isAuth = require("../middlewere/is-auth");


router.get("/stu-profile", isAuth, studentControllers.getStudentProfile);

router.post("/editUserInfo", isAuth, studentControllers.postEditUserInfo);

router.post("/editThing", isAuth, studentControllers.postEditThing);


// Education
router.post("/addEducation", isAuth, studentControllers.postAddEducation);

router.post("/editEducation", isAuth, studentControllers.postEditEducation);

router.post("/deleteEducation", isAuth, studentControllers.postDeleteEducation);


// Experience
router.post("/addExperience", isAuth, studentControllers.postAddExperience);

router.post("/editExperience", isAuth, studentControllers.postEditExperience);

router.post("/deleteExperience", isAuth, studentControllers.postDeleteExperience);


// Achievement
router.post("/addAchievement", isAuth, studentControllers.postAddAchievement);

router.post("/editAchievement", isAuth, studentControllers.postEditAchievement);

router.post("/deleteAchievement", isAuth, studentControllers.postDeleteAchievement);


// Project
router.post("/addProject", isAuth, studentControllers.postAddProject);

router.post("/editProject", isAuth, studentControllers.postEditProject);

router.post("/deleteProject", isAuth, studentControllers.postDeleteProject);


// Certification
router.post("/addCertification", isAuth, studentControllers.postAddCertification);

router.post("/editCertification", isAuth, studentControllers.postEditCertification);

router.post("/deleteCertification", isAuth, studentControllers.postDeleteCertification);


// Upload Image

router.post("/imgUpload", isAuth, studentControllers.postUploadImage);



router.get("/stu-dashboard", isAuth, studentControllers.getStudentDashboard);

module.exports = router;
