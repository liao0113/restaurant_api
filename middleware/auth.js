const helpers = require("../_helpers");
module.exports = {
  authenticated: (req, res, next) => {
    if (helpers.ensureAuthenticated(req)) {
      return next();
    }
    req.flash("error_msg", "請先登入!");
    res.redirect("/login");
  },
  adminauthenticated: (req, res, next) => {
    if (helpers.ensureAuthenticated(req)) {
      if (helpers.getUser(req).isAdmin) {
        return next();
      }
    }
    req.flash("error_msg", "你不是管理者!");
    res.redirect("/login");
  },
};
