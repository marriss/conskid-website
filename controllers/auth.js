const crypto = require("crypto");

const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const sendgridTransport = require("nodemailer-sendgrid-transport");

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
  });
};

exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  User.findOne({
    where: {
      email: email,
    },
  })
    .then((foundUser) => {
      if (!foundUser) {
        req.flash("error", "Invalid Email or Password.");
        return res.redirect("/login");
      }
      bcrypt.compare(password, foundUser.password).then((doMatch) => {
        if (doMatch) {
          req.session.isLoggedIn = true;
          req.session.user = foundUser;

          return req.session.save((err) => {
            console.log(err);
            return res.redirect("/");
          });
        }
        req.flash("error", "Invalid Email or Password.");
        res.redirect("/login");
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getLogout = (req, res, next) => {
  req.session.destroy((err) => {
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
  });
};

exports.postSignUp = (req, res, next) => {
  const first_name = req.body.first_name;
  const last_name = req.body.last_name;
  const email = req.body.email;
  const password = req.body.password;
  const type = req.body.type;

  User.findOne({
    where: {
      email: email,
    },
  })
    .then((foundUser) => {
      if (foundUser) {
        req.flash("error", "Email Already in use");
        return res.redirect("/signup");
      }
      return bcrypt
        .hash(password, 12)
        .then((hashedPassword) => {
          const user = new User({
            first_name: first_name,
            last_name: last_name,
            email: email,
            password: hashedPassword,
            type: type,
          });
          return user.save();
        })
        .then((result) => {
          res.redirect("/login");
          return transporter.sendMail({
            to: email,
            from: "vishal.kumar@c-onskid.com",
            subject: "Signup Successful",
            html:
              "<h1 style = 'color: green'> Welcome to C-onskid</h1></br><h3> Your Account has been successfully Hacked</h3>",
          });
        })
        .catch((err) => console.log(err));
    })
    .catch((err) => console.log(err));
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
  });
};

exports.postResetPassword = (req, res, next) => {
  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      console.log(err);
      return res.redirect("/reset-password");
    }

    const token = buffer.toString("hex");

    User.findOne({ email: req.body.email })
      .then((foundUser) => {
        if (!foundUser) {
          req.flash("error", "No Account with that email!");
          return res.redirect("/reset-password");
        }

        foundUser.resetToken = token;
        foundUser.resetExpirations = Date.now() + 3600000;
        return foundUser.save();
      })
      .then((result) => {
        res.redirect("/");
        transporter.sendMail({
          to: req.body.email,
          from: "vishal.kumar@c-onskid.com",
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

  User.findOne({ resetToken: token, resetExpirations: { $gt: Date.now() } })
    .then((foundUser) => {
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
      });
    })
    .catch((err) => console.log(err));
};

exports.postNewPassword = (req, res, next) => {
  const newPassword = req.body.newPassword;
  const userId = req.body.userId;
  const passwordToken = req.body.passwordToken;

  let resetUser;

  User.findOne({
    resetToken: passwordToken,
    resetExpirations: { $gt: Date.now() },
    id: userId,
  })
    .then((foundUser) => {
      resetUser = foundUser;
      return bcrypt.hash(newPassword, 12);
    })
    .then((hashedPassword) => {
      resetUser.password = hashedPassword;
      resetUser.resetToken = null;
      resetUser.resetExpirations = null;
      return resetUser.save();
    })
    .then((result) => {
      res.redirect("/login");
    })
    .catch((err) => console.log(err));
};
