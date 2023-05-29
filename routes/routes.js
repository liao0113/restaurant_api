const express = require("express");
const router = express.Router();
const passport = require("passport");
const { authenticated } = require("../middleware/auth");
const userController = require("../controllers/userController");

router.get("/users/:id", authenticated, userController.getUserProfile);

//user login and register
router.get("/login", userController.renderLoginPage);
router.post(
  "/login",
  passport.authenticate(
    "local",
    {
      failureRedirect: "/login",
      failureFlash: true,
    },
    userController.login
  )
);
router.get("/register", userController.renderRegisterPage);
router.post("/register", userController.register);
router.get("/logout", userController.logout);
