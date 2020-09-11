const ProfileHeadline = require("../models/profileHeadline.js");
const UserInfo = require("../models/userInfo.js");

const nodemailer = require("nodemailer");
const sendgridTransport = require("nodemailer-sendgrid-transport");

const transporter = nodemailer.createTransport(
  sendgridTransport({
    auth: {
      api_key:
        "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",
    },
  })
);

exports.getIndex = (req, res, next) => {
  res.render("home", {
    title: "C-onskid",
    isAuthenticated: req.session.isLoggedIn,
    user: req.session.user,
    home: true,
  });
};

exports.getWelcome = (req, res, next) => {
  res.render("welcome", {
    title: "Welcome",
    errors: [],
    home: false,
  });
};

exports.postWelcome = async (req, res, next) => {
  let { skills, profiles, college } = req.body;

  let errors = [];
  if (!skills) {
    errors.push({ text: "Please add atleast one skill" });
  }
  if (!profiles) {
    errors.push({ text: "Please add atleast one area of interest" });
  }

  if (college === "college") {
    errors.push({ text: "Please select a college" });
  }
  // Check for errors
  if (errors.length > 0) {
    res.render("welcome", {
      title: "Welcome",
      home: false,
      errors,
      skills,
      profiles,
    });
  } else {
    skills = skills.toLowerCase().replace(/,[ ]+/g, ",");
    profiles = profiles.toLowerCase().replace(/,[ ]+/g, ",");

    let x = skills.split(",");
    let y = profiles.split(",");
    let skillString = "",
      profileString = "";     
    x.forEach((skill) => {
      if(skill.length>0){
      skillString += skill[0].toUpperCase() + skill.slice(1) + ", ";
    }
    });
    y.forEach((profile) => {
      if(profile.length > 0){
      profileString += profile[0].toUpperCase() + profile.slice(1) + ", ";
      }
    });

    // Insert into table

    await UserInfo.create({
      first_name: req.user.first_name,
      last_name: req.user.last_name,
      phone: req.user.phone,
      userId: req.user.id,
    });

    await ProfileHeadline.create({
      title: "Hey! I am at C-onskid",
      firstName: req.user.first_name,
      lastName: req.user.last_name,
      type: req.user.type,
      experienceQty: 0,
      achievementQty: 0,
      projectQty: 0,
      certificationQty: 0,
      skills: skills,
      profiles: profiles,
      skillString: skillString,
      profileString: profileString,
      phone: req.user.phone,
      college: college,
      userId: req.user.id,
    })
      .then((gig) => res.redirect("/"))
      .catch((err) => console.log(err));
  }
};

exports.getContactForm = (req, res, next) => {
  res.render("contact-form", {
    title: "Send Message",
    home: false,
  });
};

exports.postContactForm = (req, res, next) => {
  const { name, email, phone, message } = req.body;

  res.redirect("/");

  transporter.sendMail({
    to: "info@c-onskid.com",
    from: "info@c-onskid.com",
    subject: "Get In Touch Query",
    html: `
          <h5>Name:${name}</h5><br>
          <h5>Phone:${phone}</h5><br>
          <h5>Email:${email}</h5><br>
          <p> Message:${message} </p>
  
          `,
  });
};
