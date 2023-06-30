const express = require("express");
const hbs = require("express-handlebars");
const flash = require("connect-flash");
const session = require("express-session");
const db = require("./models");
const methodOverride = require("method-override");
const passport = require("./config/passport");
const helpers = require("./_helpers");

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const app = express();
const port = process.env.PORT || 3000;

app.engine(
  "hbs",
  hbs.engine({
    defaultLayout: "main",
    extname: ".hbs",
    helpers: require("./config/hbs-helper"),
  })
);
app.set("view engine", "hbs");
app.use(session({ secret: "secret", resave: false, saveUninitialized: false }));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride("_method"));
app.use(flash());
app.use("/image", express.static(__dirname + "/image"));
app.use("/upload", express.static(__dirname + "/upload"));

app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.loginUser = helpers.getUser(req);
  next();
});

app.listen(port, () => {
  console.log(`Example app is listening at http://localhost:${port}`);
});

require("./routes")(app);

module.exports = app;
