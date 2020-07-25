const Sequelize = require("sequelize");
const Op = Sequelize.Op;

const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const sendgridTransport = require("nodemailer-sendgrid-transport");

const { validationResult } = require("express-validator/check");

const User = require("../models/user");

const transporter = nodemailer.createTransport(
  sendgridTransport({
    auth: {
      api_key:
        "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",
    },
  })
);

exports.getLogin = (req, res, next) => {
  let successMsg = req.flash("success");
  if (successMsg.length > 0) {
    successMsg = successMsg[0];
  } else {
    successMsg = null;
  }

  let message = req.flash("error");
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }

  res.render("auth/login", {
    title: "login",
    isAuthenticated: req.session.isLoggedIn,
    user: req.session.user,
    errorMessage: message,
    successMessage: successMsg,
    oldInput: { email: "" },
    home: false,
  });
};

exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  const error = validationResult(req);

  let successMsg = req.flash("success");

  if (successMsg.length > 0) {
    successMsg = successMsg[0];
  } else {
    successMsg = null;
  }

  if (!error.isEmpty()) {
    return res.status(422).render("auth/login", {
      title: "login",
      isAuthenticated: req.session.isLoggedIn,
      user: req.session.user,
      errorMessage: error.array()[0].msg,
      successMessage: successMsg,
      oldInput: { email: email },
      home: false,
    });
  }

  User.findOne({
    where: {
      email: email,
    },
  })
    .then((foundUser) => {
      if (!foundUser) {
        return res.status(422).render("auth/login", {
          title: "login",
          isAuthenticated: req.session.isLoggedIn,
          user: req.session.user,
          errorMessage: "Invalid Email or Password.",
          oldInput: { email: email },
          home: false,
        });
      }
      bcrypt.compare(password, foundUser.password).then((doMatch) => {
        if (doMatch) {
          req.session.isLoggedIn = true;
          req.session.user = foundUser;

          return req.session.save((err) => {
            console.log(err);

            foundUser.getProfileHeadline().then((profile) => {
              if (profile) {
                // console.log(profile);
                console.log("vishal");
                return res.redirect("/");
              } else {
                if (foundUser.type === "student") {
                  return res.redirect("/welcome");
                } else {
                  return res.redirect("/");
                }
              }
            });
          });
        }
        return res.status(422).render("auth/login", {
          title: "login",
          isAuthenticated: req.session.isLoggedIn,
          user: req.session.user,
          errorMessage: "Invalid Email or Password.",
          oldInput: { email: email },
          home: false,
        });
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getLogout = (req, res, next) => {
  req.session.destroy((err) => {
    console.log(err);
    res.redirect("/");
  });
};

exports.getSignUp = (req, res, next) => {
  let message = req.flash("error");
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render("auth/signup", {
    title: "signup",
    isAuthenticated: req.session.isLoggedIn,
    user: req.session.user,
    errorMessage: message,
    oldInput: {
      first_name: "",
      last_name: "",
      email: "",
      type: "",
    },
    validationErrors: [],
    home: false,
  });
};

exports.postSignUp = (req, res, next) => {
  const first_name = req.body.first_name;
  const last_name = req.body.last_name;
  const email = req.body.email;
  const password = req.body.password;
  const phone = req.body.phone;
  const type = req.body.type;

  const error = validationResult(req);

  if (!error.isEmpty()) {
    return res.status(422).render("auth/signup", {
      title: "signup",
      isAuthenticated: req.session.isLoggedIn,
      user: req.session.user,
      errorMessage: error.array()[0].msg,
      home: false,
      oldInput: {
        first_name: first_name,
        last_name: last_name,
        email: email,
        type: type,
        phone: phone,
      },
      validationErrors: error.array(),
    });
  }

  bcrypt
    .hash(password, 12)
    .then((hashedPassword) => {
      const user = new User({
        first_name: first_name,
        last_name: last_name,
        email: email,
        password: hashedPassword,
        type: type,
        phone: phone,
      });
      return user.save();
    })
    .then((result) => {
      res.redirect("/login");
      return transporter.sendMail({
        to: email,
        from: "info@c-onskid.com",
        subject: "Signup Successful",
        html:
          "<h1 style = 'color: green'> Welcome to C-onskid</h1></br><h3> Your Account has been successfully Hacked</h3>",
      });
    })
    .catch((err) => console.log(err));
  // })
  // .catch((err) => console.log(err));
};

exports.getResetPassword = (req, res, next) => {
  let message = req.flash("error");
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }

  res.render("auth/reset-password", {
    title: "Reset Password",
    errorMessage: message,
    home: false,
  });
};

exports.postResetPassword = (req, res, next) => {
  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      console.log(err);
      return res.redirect("/reset-password");
    }

    const token = buffer.toString("hex");

    // console.log(req.body.email);
    User.findOne({ where: { email: req.body.email } })
      .then((foundUser) => {
        if (!foundUser) {
          req.flash("error", "No Account with that email!");
          return res.redirect("/reset-password");
        }

        // console.log(Date.now());
        foundUser.resetToken = token;
        foundUser.resetExpirations = Date.now() + 3600000;
        return foundUser.save();
      })
      .then((result) => {
        res.redirect("/");
        transporter.sendMail({
          to: req.body.email,
          from: "info@c-onskid.com",
          subject: "Password Reset",
          html: `
          <p> You Requested For Password Reset! </p>
          <p> Click here <a href = "http://localhost:3000/reset/${token}">Set new Password</a> to set a new password</p>
          `,
        });
      })
      .catch((err) => console.log(err));
  });
};

exports.getNewPassword = (req, res, next) => {
  const token = req.params.token;

  User.findOne({
    where: {
      [Op.and]: [
        { resetToken: token },
        { resetExpirations: { [Op.gt]: Date.now() } },
      ],
    },
  })
    .then((foundUser) => {
      // console.log(foundUser);
      if (foundUser) {
        let message = req.flash("error");
        if (message.length > 0) {
          message = message[0];
        } else {
          message = null;
        }
        res.render("auth/new-password", {
          title: "Set New Password",
          errorMessage: message,
          userId: foundUser.id.toString(),
          passwordToken: token,
          home: false,
        });
      } else {
        // console.log("message");
        req.flash("error", "Session Timeout! Please try again");
        res.redirect("/login");
      }
    })
    .catch((err) => console.log(err));
};

exports.postNewPassword = (req, res, next) => {
  const newPassword = req.body.newPassword;
  const userId = req.body.userId;
  const passwordToken = req.body.passwordToken;

  if (newPassword.length < 6) {
    res.render("auth/new-password", {
      title: "Set New Password",
      errorMessage: "Please Enter a password of minimum 6 characters",
      userId: userId,
      passwordToken: passwordToken,
      home: false,
    });
  } else {
    let resetUser;
    User.findOne({
      where: {
        resetToken: passwordToken,
        resetExpirations: { [Op.gt]: Date.now() },
        id: userId,
      },
    })
      .then((foundUser) => {
        if (!foundUser) {
          req.flash("error", "Session Timeout! Please try again");
          res.redirect("/login");
        } else {
          resetUser = foundUser;
          return bcrypt.hash(newPassword, 12);
        }
      })
      .then((hashedPassword) => {
        resetUser.password = hashedPassword;
        resetUser.resetToken = null;
        resetUser.resetExpirations = null;
        return resetUser.save();
      })
      .then((result) => {
        req.flash("success", "Password Updated Successfully! Please login");
        res.redirect("/login");
      })
      .catch((err) => console.log(err));
  }
};
