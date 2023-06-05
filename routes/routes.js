const express = require("express");
const router = express.Router();
const passport = require("passport");
const { authenticated, adminauthenticated } = require("../middleware/auth");
const userController = require("../controllers/userController");
const categoryController = require("../controllers/categoryController");
const commentController = require("../controllers/commentController");
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

//category
router.get(
  "/admin/categories",
  adminauthenticated,
  categoryController.getCategories
);
router.post(
  "/admin/categories",
  adminauthenticated,
  categoryController.postCategory
);
router.get(
  "/admin/categories/:id",
  adminauthenticated,
  categoryController.getCategories
);
router.put(
  "/admin/categories/:id",
  adminauthenticated,
  categoryController.updateCategory
);
router.delete(
  "/admin/categories/:id",
  adminauthenticated,
  categoryController.deleteCategory
);

//comment
router.post("/comments", authenticated, commentController.postComment);
router.delete(
  "/comments/:id",
  adminauthenticated,
  commentController.deleteComment
);
