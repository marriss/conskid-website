const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");

const app = express();

const sequelize = require("./util/database.js");
const MySQLStore = require("express-mysql-session")(session);
const csrf = require("csurf");

const flash = require("connect-flash");

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

const homeRoutes = require("./routes/home.js");
const studentRoutes = require("./routes/students.js");
const employerRoutes = require("./routes/employers.js");
const errorRoutes = require("./routes/error.js");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "assets")));

app.use(
  session({
    key: "session_cookie_name",
    secret: "my_shivani",
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
  })
);

app.use(csrfProtection);
app.use(flash());

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();
  next();
});

app.use(homeRoutes);
app.use(studentRoutes);
app.use(employerRoutes);
app.use(errorRoutes);

sequelize
  .sync()
  .then((result) => {
    app.listen(3000);
  })
  .catch((err) => console.log(err));
