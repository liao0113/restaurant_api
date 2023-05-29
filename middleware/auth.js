const helpers = require("../helpers");
module.exports = {
  authenticated: (req, res, next) => {
    if (helpers.ensureAuthenticated(req)) {
      return next();
    }
    req.flash("error_msg", "請先登入!");
    res.redirect("/login");
  },
};
