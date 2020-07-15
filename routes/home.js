const express = require("express");

const router = express.Router();

const mainControllers = require("../controllers/indexPage");
const authControllers = require("../controllers/auth");
const isAuth = require("../middlewere/is-auth");

router.get("/", mainControllers.getIndex);

router.get("/login", authControllers.getLogin);

router.post("/login", authControllers.postLogin);

router.get("/signup", authControllers.getSignUp);

router.post("/signup", authControllers.postSignUp);

router.get("/logout", authControllers.getLogout);

router.get("/reset-password", authControllers.getResetPassword);

router.post("/reset-password", authControllers.postResetPassword);

router.get("/reset/:token", authControllers.getNewPassword);

router.post("/new-password", authControllers.postNewPassword);

module.exports = router;
