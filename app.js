const express = require("express");
const hbs = require("express-handlebars");
const flash = require("connect-flash");
const session = require("express-session");
const db = require("./models");
const methodOverride = require("method-override");
const passport = require("./config/passport");

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
  })
);
app.set("view engine", "hbs");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
  session({ session: "sercet", resave: false, saveUninitialized: false })
);
app.use(methodOverride("_method"));

app.listen(port, () => {
  console.log(`Example app is listening at http://localhost:${port}`);
});
