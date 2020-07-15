exports.getIndex = (req, res, next) => {
  res.render("home", {
    title: "C-onskid",
    isAuthenticated: req.session.isLoggedIn,
    user: req.session.user,
  });
};
