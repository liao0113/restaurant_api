const express = require("express");
const router = express.Router();
const passport = require("passport");
const { authenticated } = require("../middleware/auth");
const userController = require("../controllers/userController");
//user的操作
router.get("/users/:id", authenticated, userController.getUserProfile);
router.get("/user/:id/edit", authenticated, userController.editUserPage);
router.put("/users/:id", authenticated, userController.putUserProflie);
router.get("/users/topr", authenticated, userController.getTopUser);
//增加刪除喜愛餐廳或追蹤刪除喜歡的user
router.post(
  "/favorite/:restaurantId",
  authenticated,
  userController.addFavorite
);
router.delete(
  "/favorite/:restaurantId",
  authenticated,
  userController.removeFavorite
);
router.post("/like/:restaurantId", authenticated, userController.addLike);
router.delete("/like/:restaurantId", authenticated, userController.removeLike);
router.post("/following/:userId", authenticated, userController.addFollowing);
router.delete(
  "/following/:userId",
  authenticated,
  userController.removeFollowing
);
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
