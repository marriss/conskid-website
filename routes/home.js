const express = require("express");

const router = express.Router();

const { check, body } = require("express-validator");

const mainControllers = require("../controllers/indexPage");
const authControllers = require("../controllers/auth");
const isAuth = require("../middlewere/is-auth");

const User = require("../models/user");

router.get("/", mainControllers.getIndex);

router.get("/login", authControllers.getLogin);

router.get("/welcome", mainControllers.getWelcome);

router.post("/welcome", isAuth, mainControllers.postWelcome);

router.post(
  "/login",
  [check("email").isEmail().withMessage("Please enter a valid email")],
  authControllers.postLogin
);

router.get("/signup", authControllers.getSignUp);

router.post(
  "/signup",
  [
    check("email")
      .isEmail()
      .withMessage("Please enter a valid email")
      .custom((value, { req }) => {
        return User.findOne({
          where: {
            email: value,
          },
        }).then((foundUser) => {
          if (foundUser) {
            return Promise.reject("Email Already in use");
          }
        });
      }),

    body(
      "password",
      "Please! Enter a password with minimum 6 characters"
    ).isLength({ min: 6 }),

    body("confirm_password").custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Passwords have to match!");
      } else {
        return true;
      }
    }),

    body("phone")
      .custom((value, { req }) => {
        var phoneno = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
        if (value.match(phoneno)) {
          return true;
        } else {
          throw new Error("Please enter a valid phone number");
        }
      })
      .custom((value, { req }) => {
        return User.findOne({
          where: {
            phone: value,
          },
        }).then((foundUser) => {
          if (foundUser) {
            return Promise.reject("Phone Already in use");
          }
        });
      }),

    body("type").custom((value, { req }) => {
      if (value === "signup") {
        throw new Error("Please Select a login type!");
      } else {
        return true;
      }
    }),

    // body("college").custom((value, { req })=>{
    //   if(value === "college"){
    //     throw new Error("Please Select a college!");
    //   } else {
    //     return true;
    //   }
    // }),
  ],
  authControllers.postSignUp
);

router.get("/logout", authControllers.getLogout);

router.get("/reset-password", authControllers.getResetPassword);

router.post("/reset-password", authControllers.postResetPassword);

router.get("/reset/:token", authControllers.getNewPassword);

router.post("/new-password", authControllers.postNewPassword);

router.get('/contact-form', mainControllers.getContactForm);

router.post("/contact-form", mainControllers.postContactForm);

module.exports = router;
