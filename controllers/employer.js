const UserInfo = require("../models/userInfo.js");
const Education = require("../models/education.js");
const Experience = require("../models/experience.js");
const Achievement = require("../models/achievement.js");
const Project = require("../models/project.js");
const Certification = require("../models/certification.js");
const ProfileHeadline = require("../models/profileHeadline.js");

const nodemailer = require("nodemailer");
const sendgridTransport = require("nodemailer-sendgrid-transport");


const transporter = nodemailer.createTransport(
  sendgridTransport({
    auth: {
      api_key:
        "paste the Api key from company info",
    },
  })
);

const Sequelize = require("sequelize");
const Op = Sequelize.Op;

exports.getEmployerDashboard = (req, res, next) => {
  res.render("students/stu-dashboard", {
    title: "Profile",
    home: false,
  });
};

exports.getCandidates = (req, res, next) => {
  ProfileHeadline.findAll({ where: { type: "student" } })
    .then((candidates) => {     
      res.render("employers/candidates", {
        title: "Candidates",
        home: false,
        candidates: candidates,
        msg: req.flash("msg")[0],
        profiles: [],
        skills: [],
      });
    })
    .catch((err) => console.log(err));
};

exports.postSearch = (req, res, next) => {
  let { term } = req.query;

  if (term.length == 0) {
    res.redirect("/candidates");
  } else {
    term = term.toLowerCase().replace(/,[ ]+/g, ",");
    let newterm;
    if (term) {
      newterm = term.split(",");
    } else {
      newterm = term;
    }

    let object = [];

    newterm.forEach((term) => {
      var smallObj = { [Op.like]: "%" + term + "%" };
      object.push(smallObj);
    });

    ProfileHeadline.findAll({
      where: {
        type: "student",
        [Op.or]: [
          { skills: { [Op.and]: object } },
          { profiles: { [Op.and]: object } },
        ],
      },
    })
      .then((candidates) => {
        res.render("employers/candidates", {
          title: "Candidates",
          home: false,
          candidates: candidates,
          msg: req.flash("msg")[0],
          profiles: [],
          skills: [],
        });
      })
      .catch((err) => console.log(err));
  }
};

exports.postArrangeInterview = (req, res, next) => {
  let { isArrangeInterview, userId } = req.body;

  if (isArrangeInterview !== "Confirm") {
    req.flash("msg", "Invalid Captcha! Please try again.");
    res.redirect("/candidates");
  } else {
    req.flash(
      "msg",
      "Thank for your response, our team will contact you shortly. Please Check your email for Confirmation"
    );

    transporter.sendMail({
      to: "info@c-onskid.com",
      from: "info@c-onskid.com",
      subject: "Request for Arranging Interview",
      html:
        "<h1 style = 'color: green; text-align: center;'> Request for Arranging Interview</h1></br><h3 style = 'text-align: center;'> New Interview Arrangement Request</h3>",
    });

    transporter.sendMail({
      to: req.user.email,
      from: "info@c-onskid.com",
      subject: "Arrange Interview Request Confirmation",
      html:
        "<h1 style = 'color: green; text-align: center;'>Thank you for availing our services!</h1></br><h2 style = 'text-align: center;'> We have Received your request </h2></br><h4 style = 'text-align: center;'>Our team will contact you shortly regarding the details of the interview</h4>",
    });

    res.redirect("/candidates");
  }
};

exports.getCandidateProfile = async (req, res, next) => {
  const stuId = req.params.stuId;

  let userInfo,
    things,
    educations,
    experiences,
    achievements,
    projects,
    certifications;

  try {
    await UserInfo.findOne({ where: { userId: stuId } })
      .then((userinfo) => {
        userInfo = userinfo;
      })
      .catch((err) => console.log(err));

    await ProfileHeadline.findOne({ where: { userId: stuId } })
      .then((thing) => {
        things = thing;
      })
      .catch((err) => console.log(err));

    await Education.findAll({ where: { userId: stuId } })
      .then((education) => {
        educations = education;
        educations.sort((a, b) => (a.startYear < b.endYear ? 1 : -1));
      })
      .catch((err) => console.log(err));

    await Experience.findAll({ where: { userId: stuId } })
      .then((experience) => {
        experiences = experience;
        experiences.sort((a, b) => (a.startDate < b.endDate ? 1 : -1));
      })
      .catch((err) => console.log(err));

    await Achievement.findAll({ where: { userId: stuId } })
      .then((achievement) => {
        achievements = achievement;
      })
      .catch((err) => console.log(err));

    await Project.findAll({ where: { userId: stuId } })
      .then((project) => {
        projects = project;
        projects.sort((a, b) => (a.startDate < b.endDate ? 1 : -1));
      })
      .catch((err) => console.log(err));

    await Certification.findAll({ where: { userId: stuId } })
      .then((certification) => {
        certifications = certification;
        certifications.sort((a, b) => (a.startDate < b.endDate ? 1 : -1));
      })
      .catch((err) => console.log(err));

    await res.render("students/stu-profile", {
      title: "Profile",
      home: false,
      userInfo: userInfo,
      profile: things,
      educations: educations,
      experiences: experiences,
      achievements: achievements,
      projects: projects,
      certifications: certifications,
      user: req.user,
      isPersonal: false,
      errorMessage: req.flash("error"),
    });
  } catch (err) {
    console.log(err);
  }
};
