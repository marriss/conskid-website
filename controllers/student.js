const UserInfo = require("../models/userInfo.js");
const Education = require("../models/education.js");
const Experience = require("../models/experience.js");
const Achievement = require("../models/achievement.js");
const Project = require("../models/project.js");
const Certification = require("../models/certification.js");
const ProfileHeadline = require("../models/profileHeadline.js");
const User = require("../models/user.js");

exports.getStudentProfile = async (req, res, next) => {
  let userInfo,
    things,
    educations,
    experiences,
    achievements,
    projects,
    certifications;
    
  try {
    await req.user
      .getUserInfo()
      .then((userinfo) => {
        if (!userinfo) {
          UserInfo.create({
            first_name: req.user.first_name,
            last_name: req.user.last_name,
            userId: req.user.id,
          }).then((userinfo) => {
            userInfo = userinfo;
          });
        } else {
          userInfo = userinfo;
        }
      })
      .catch((err) => console.log(err));

    await req.user
      .getProfileHeadline()
      .then((thing) => {
        if (!thing) {
          ProfileHeadline.create({
            title: "Hey! I am at C-onskid",
            firstName: req.user.first_name,
            lastName: req.user.last_name,
            type: req.user.type,
            phone: req.user.phone,
            experienceQty: 0,
            achievementQty: 0,
            projectQty: 0,
            certificationQty: 0,
            skills: "",
            profiles: "",
            userId: req.user.id,
            // imgUrl: req.user.imgUrl,
          }).then((thing) => {
            things = thing;
          });
        } else {
          things = thing;
        }
      })
      .catch((err) => console.log(err));

    await req.user
      .getEducations()
      .then((education) => {
        if (!education) {
          educations = [];
          // console.log(education);
          // console.log("The length: " + education.length);
        } else {
          // console.log(education.length);
          educations = education;
          educations.sort((a, b) => (a.startYear < b.endYear ? 1 : -1));
        }
      })
      .catch((err) => console.log(err));

    await req.user
      .getExperiences()
      .then((experience) => {
        if (!experience) {
          experiences = [];
        } else {
          experiences = experience;
          experiences.sort((a, b) => (a.startDate < b.endDate ? 1 : -1));
        }
      })
      .catch((err) => console.log(err));

    await req.user
      .getAchievements()
      .then((achievement) => {
        if (!achievement) {
          achievements = [];
        } else {
          achievements = achievement;
        }
      })
      .catch((err) => console.log(err));

    await req.user
      .getProjects()
      .then((project) => {
        if (!project) {
          projects = [];
        } else {
          projects = project;
          projects.sort((a, b) => (a.startDate < b.endDate ? 1 : -1));
        }
      })
      .catch((err) => console.log(err));

    await req.user
      .getCertifications()
      .then((certification) => {
        if (!certification) {
          certifications = [];
        } else {
          certifications = certification;
          certifications.sort((a, b) => (a.startDate < b.endDate ? 1 : -1));
        }
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
      isPersonal: true,
      errorMessage: req.flash("error"),
    });
  } catch (err) {
    console.log(err);
  }
};

exports.postEditUserInfo = async (req, res, next) => {
  await req.user
    .getProfileHeadline()
    .then((profile) => {
      profile.firstName = req.body.firstName;
      profile.lastName = req.body.lastName;
      profile.save();
    })
    .catch((err) => console.log(err));

  await User.findByPk(req.user.id)
    .then((user) => {
      user.first_name = req.body.firstName;
      user.last_name = req.body.lastName;
      user.save();
    })
    .catch((err) => console.log(err));

  await req.user
    .getUserInfo()
    .then((userInfo) => {
      userInfo.first_name = req.body.firstName;
      userInfo.last_name = req.body.lastName;
      userInfo.address = req.body.address;
      userInfo.phone = req.body.phone;
      userInfo.github = req.body.github;
      userInfo.linkedin = req.body.linkedIn;
      userInfo.facebook = req.body.facebook;
      userInfo.twitter = req.body.twitter;
      userInfo.instagram = req.body.instagram;
      userInfo.skype = req.body.skype;
      return userInfo.save();
    })
    .then((result) => {
      res.redirect("/stu-profile");
    })
    .catch((err) => console.log(err));
};

exports.postEditThing = (req, res, next) => {
  req.user
    .getProfileHeadline()
    .then((thing) => {
      thing.title = req.body.title;
      thing.headline = req.body.headline;
      return thing.save();
    })
    .then((result) => {
      res.redirect("/stu-profile");
    })
    .catch((err) => console.log(err));
};

// Education
exports.postAddEducation = (req, res, next) => {
  Education.create({
    school: req.body.school,
    degree: req.body.degree,
    fieldOfStudy: req.body.fieldOfStudy,
    startYear: req.body.startYear,
    endYear: req.body.endYear,
    activities: req.body.activities,
    description: req.body.description,
    userId: req.user.id,
  })
    .then((result) => {
      res.redirect("/stu-profile");
    })
    .catch((err) => console.log(err));
};

exports.postEditEducation = (req, res, next) => {
  const eduId = req.body.educationId;
  console.log(eduId);
  Education.findByPk(eduId)
    .then((education) => {
      education.school = req.body.school;
      education.degree = req.body.degree;
      education.fieldOfStudy = req.body.fieldOfStudy;
      education.startYear = req.body.startYear;
      education.endYear = req.body.endYear;
      education.activities = req.body.activities;
      education.description = req.body.description;
      return education.save();
    })
    .then((result) => {
      res.redirect("/stu-profile");
    })
    .catch((err) => console.log(err));
};

exports.postDeleteEducation = (req, res, next) => {
  const eduId = req.body.educationId;
  Education.findByPk(eduId)
    .then((education) => {
      return education.destroy();
    })
    .then((result) => {
      res.redirect("/stu-profile");
    })
    .catch((err) => console.log(err));
};

// Experience
exports.postAddExperience = (req, res, next) => {
  Experience.create({
    title: req.body.title,
    employmentType: req.body.employmentType,
    company: req.body.company,
    location: req.body.location,
    startDate: req.body.startDate,
    endDate: req.body.endDate,
    headline: req.body.headline,
    description: req.body.description,
    userId: req.user.id,
  })
    .then((result) => {
      req.user
        .getProfileHeadline()
        .then((thing) => {
          thing.experienceQty = thing.experienceQty + 1;
          return thing.save();
        })
        .then((result) => {
          res.redirect("/stu-profile");
        });
    })
    .catch((err) => console.log(err));
};

exports.postEditExperience = (req, res, next) => {
  const expId = req.body.experienceId;
  Experience.findByPk(expId)
    .then((experience) => {
      experience.title = req.body.title;
      experience.employmentType = req.body.employmentType;
      experience.company = req.body.company;
      experience.location = req.body.location;
      experience.startDate = req.body.startDate;
      experience.endDate = req.body.endDate;
      experience.headline = req.body.headline;
      experience.description = req.body.description;
      return experience.save();
    })
    .then((result) => {
      console.log(result);
      res.redirect("/stu-profile");
    })
    .catch((err) => console.log(err));
};

exports.postDeleteExperience = (req, res, next) => {
  const expId = req.body.experienceId;
  Experience.findByPk(expId)
    .then((experience) => {
      return experience.destroy();
    })
    .then((result) => {
      req.user
        .getProfileHeadline()
        .then((thing) => {
          thing.experienceQty = thing.experienceQty - 1;
          return thing.save();
        })
        .then((result) => {
          res.redirect("/stu-profile");
        });
    })
    .catch((err) => console.log(err));
};

// Achievement
exports.postAddAchievement = (req, res, next) => {
  Achievement.create({
    title: req.body.title,
    description: req.body.description,
    userId: req.user.id,
  })
    .then((result) => {
      req.user
        .getProfileHeadline()
        .then((thing) => {
          thing.achievementQty = thing.achievementQty + 1;
          return thing.save();
        })
        .then((result) => {
          res.redirect("/stu-profile");
        });
    })
    .catch((err) => console.log(err));
};

exports.postEditAchievement = (req, res, next) => {
  const achId = req.body.achievementId;
  Achievement.findByPk(achId)
    .then((achievement) => {
      achievement.title = req.body.title;
      achievement.description = req.body.description;
      return achievement.save();
    })
    .then((result) => {
      // console.log(result);
      res.redirect("/stu-profile");
    })
    .catch((err) => console.log(err));
};

exports.postDeleteAchievement = (req, res, next) => {
  const achId = req.body.achievementId;
  Achievement.findByPk(achId)
    .then((achievement) => {
      return achievement.destroy();
    })
    .then((result) => {
      req.user
        .getProfileHeadline()
        .then((thing) => {
          thing.achievementQty = thing.achievementQty - 1;
          return thing.save();
        })
        .then((result) => {
          res.redirect("/stu-profile");
        });
    })
    .catch((err) => console.log(err));
};

// Project
exports.postAddProject = (req, res, next) => {
  Project.create({
    title: req.body.title,
    startDate: req.body.startDate,
    endDate: req.body.endDate,
    link: req.body.link,
    description: req.body.description,
    userId: req.user.id,
  })
    .then((result) => {
      req.user
        .getProfileHeadline()
        .then((thing) => {
          thing.projectQty = thing.projectQty + 1;
          return thing.save();
        })
        .then((result) => {
          res.redirect("/stu-profile");
        });
    })
    .catch((err) => console.log(err));
};

exports.postEditProject = (req, res, next) => {
  const proId = req.body.projectId;
  Project.findByPk(proId)
    .then((project) => {
      project.title = req.body.title;
      project.startDate = req.body.startDate;
      project.endDate = req.body.endDate;
      project.link = req.body.link;
      project.description = req.body.description;
      return project.save();
    })
    .then((result) => {
      // console.log(result);
      res.redirect("/stu-profile");
    })
    .catch((err) => console.log(err));
};

exports.postDeleteProject = (req, res, next) => {
  const proId = req.body.projectId;
  Project.findByPk(proId)
    .then((project) => {
      return project.destroy();
    })
    .then((result) => {
      req.user
        .getProfileHeadline()
        .then((thing) => {
          thing.projectQty = thing.projectQty - 1;
          return thing.save();
        })
        .then((result) => {
          res.redirect("/stu-profile");
        });
    })
    .catch((err) => console.log(err));
};

// Certification
exports.postAddCertification = (req, res, next) => {
  Certification.create({
    title: req.body.title,
    startDate: req.body.startDate,
    endDate: req.body.endDate,
    link: req.body.link,
    description: req.body.description,
    userId: req.user.id,
  })
    .then((result) => {
      req.user
        .getProfileHeadline()
        .then((thing) => {
          thing.certificationQty = thing.certificationQty + 1;
          return thing.save();
        })
        .then((result) => {
          res.redirect("/stu-profile");
        });
    })
    .catch((err) => console.log(err));
};

exports.postEditCertification = (req, res, next) => {
  const cerId = req.body.certificationId;
  Certification.findByPk(cerId)
    .then((certification) => {
      certification.title = req.body.title;
      certification.startDate = req.body.startDate;
      certification.endDate = req.body.endDate;
      certification.link = req.body.link;
      certification.description = req.body.description;
      return certification.save();
    })
    .then((result) => {
      // console.log(result);
      res.redirect("/stu-profile");
    })
    .catch((err) => console.log(err));
};

exports.postDeleteCertification = (req, res, next) => {
  const cerId = req.body.certificationId;
  Certification.findByPk(cerId)
    .then((certification) => {
      return certification.destroy();
    })
    .then((result) => {
      req.user
        .getProfileHeadline()
        .then((thing) => {
          thing.certificationQty = thing.certificationQty - 1;
          return thing.save();
        })
        .then((result) => {
          res.redirect("/stu-profile");
        });
    })
    .catch((err) => console.log(err));
};

// Image Upload

exports.postUploadImage = (req, res, next) => {
  const img = req.file;

  if (!img) {
    req.flash("error", "The selected file is not a valid image");
    res.redirect("/stu-profile");
  } else {
    const imagePath = req.user.id + "-" + req.file.originalname;
    ProfileHeadline.findOne({ where: { userId: req.user.id } })
      .then((profile) => {
        console.log(profile);
        profile.imgUrl = imagePath;
        return profile.save();
      })
      .then((result) => {
        res.redirect("/stu-profile");
      })
      .catch((err) => console.log(err));
  }
};

exports.getStudentDashboard = (req, res, next) => {
  res.render("students/stu-dashboard", {
    title: "Dashboard",
    home: false,
    // isAuthenticated: req.session.isLoggedIn,
    // user: req.session.user,
  });
};
