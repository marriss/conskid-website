const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");

const app = express();

const sequelize = require("./util/database.js");
const MySQLStore = require("express-mysql-session")(session);
const csrf = require("csurf");
const flash = require("connect-flash");
const multer = require("multer");

const sessionStore = new MySQLStore({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "conskidindia#123",
  database: "conskid",
});

app.set("view engine", "ejs");
app.set("views", "views");

const csrfProtection = csrf();

// Importing Routes
const homeRoutes = require("./routes/home.js");
const studentRoutes = require("./routes/students.js");
const employerRoutes = require("./routes/employers.js");
const errorRoutes = require("./routes/error.js");

// Importing Models
const User = require("./models/user.js");
const UserInfo = require("./models/userInfo.js");
const ProfileHeadline = require("./models/profileHeadline.js");
const Education = require("./models/education.js");
const Experience = require("./models/experience.js");
const Achievement = require("./models/achievement.js");
const Project = require("./models/project.js");
const Certification = require("./models/certification.js");

// Creating Associations
User.hasOne(ProfileHeadline, { constraints: true, onDelete: "CASCADE" });
ProfileHeadline.belongsTo(User);

User.hasOne(UserInfo, { constraints: true, onDelete: "CASCADE" });
UserInfo.belongsTo(User);

User.hasMany(Education, { constraints: true, onDelete: "CASCADE" });
Education.belongsTo(User);

User.hasMany(Experience, { constraints: true, onDelete: "CASCADE" });
Experience.belongsTo(User);

User.hasMany(Achievement, { constraints: true, onDelete: "CASCADE" });
Achievement.belongsTo(User);

User.hasMany(Project, { constraints: true, onDelete: "CASCADE" });
Project.belongsTo(User);

User.hasMany(Certification, { constraints: true, onDelete: "CASCADE" });
Certification.belongsTo(User);

// Setting Local and static folders andusing body parser
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "assets")));


// Setting Session Store
app.use(
  session({
    key: "Conskid_login_Session",
    secret: "Secret_Conskid",
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
  })
);

//Setting the user to req who is logged in
app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }

  User.findByPk(req.session.user.id).then((user) => {
    req.user = user;
    next();
  });
});

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./assets/images/profileImages");
  },

  filename: (req, file, cb) => {
    cb(null, req.user.id.toString() + "-" + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).single("image")
);

app.use(csrfProtection);
app.use(flash());

// Setting Local Variebles
app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();
  res.locals.user = req.session.user;
  next();
});

// Using Routes
app.use(homeRoutes);
app.use(studentRoutes);
app.use(employerRoutes);
app.use(errorRoutes);

sequelize
  // .sync({ force: true })
  .sync()
  .then((result) => {
    app.listen(3000);
  })
  .catch((err) => console.log(err));
