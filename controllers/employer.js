exports.getEmployerDashboard = (req, res, next) => {
  res.render("students/stu-dashboard", {
    title: "Profile",
    isAuthenticated: req.session.isLoggedIn,
    user: req.session.user,
  });
};

exports.getCandidates = (req, res, next) => {
  res.render("employers/candidates", {
    title: "Candidates",
    isAuthenticated: req.session.isLoggedIn,
    user: req.session.user,
  });
};
