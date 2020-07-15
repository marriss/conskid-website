exports.getProfile = (req, res, next) => {
  res.render("profile", {
    title: "Profile",
    isAuthenticated: req.session.isLoggedIn,
    user: req.session.user,
  });
};

exports.getStudentDashboard = (req, res, next) => {
  res.render("students/stu-dashboard", {
    title: "Dashboard",
    isAuthenticated: req.session.isLoggedIn,
    user: req.session.user,
  });
};
