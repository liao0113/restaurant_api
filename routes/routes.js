const express = require("express");
const router = express.Router();

const passport = require("passport");
const { authenticated, adminauthenticated } = require("../middleware/auth");
const userController = require("../controllers/userController");
const categoryController = require("../controllers/categoryController");
const commentController = require("../controllers/commentController");
const restaurantController = require("../controllers/restaurantController");
const adminController = require("../controllers/adminController");
const multer = require("multer");
const upload = multer({ dest: "temp/" });
//主頁
router.get("/", authenticated, (req, res) => res.redirect("/restaurants"));
router.get("/restaurants", authenticated, restaurantController.getRestaurants);
router.get(
  "/restaurants/:id",
  authenticated,
  restaurantController.getRestaurant
);
router.get("/restaurants/feeds", authenticated, restaurantController.getFeeds);
router.get(
  "/restaurants/top",
  authenticated,
  restaurantController.getTopRestaurant
);
router.get(
  "/restaurants/:id/dashboard",
  authenticated,
  restaurantController.getDashBoard
);
//user的操作
router.get("/users/:id", authenticated, userController.getUserProfile);
router.get("/users/:id/edit", authenticated, userController.editUserPage);
router.put(
  "/users/:id",
  authenticated,
  upload.single("image"),
  userController.putUserProflie
);
router.get("/users/top", authenticated, userController.getTopUser);
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
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  userController.login
);
router.get("/register", userController.renderRegisterPage);
router.post("/register", userController.register);
router.get("/logout", userController.logout);

//comment
router.post("/comments", authenticated, commentController.postComment);
router.delete(
  "/comments/:id",
  adminauthenticated,
  commentController.deleteComment
);

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
//admin users管理
router.get("/admin/users", adminauthenticated, adminController.getUsers);
router.patch(
  "/admin/users/:id",
  adminauthenticated,
  adminController.toggleAdmin
);

//admin restaurants管理
router.get("/admin", adminauthenticated, (req, res) =>
  res.redirect("/admin/restaurants")
);
router.get(
  "/admin/restaurants",
  adminauthenticated,
  adminController.getRestaurants
);
router.get(
  "/admin/restaurants/create",
  adminauthenticated,
  adminController.createRestaurant
);
router.get(
  "/admin/restaurants/:id/edit",
  adminauthenticated,
  adminController.editRestaurant
);
router.post(
  "/admin/restaurants",
  adminauthenticated,
  upload.single("image"),
  adminController.postRestaurant
);
router.get(
  "/admin/restaurants/:id",
  adminauthenticated,
  adminController.getRestaurant
);
router.get(
  "/admin/restaurant/:id/edit",
  adminauthenticated,
  adminController.editRestaurant
);
router.put(
  "/admin/restaurants/:id",
  adminauthenticated,
  upload.single("image"),
  adminController.putRestaurant
);
router.delete(
  "/admin/restaurants/:id",
  adminauthenticated,
  adminController.deleteRestaurant
);

module.exports = router;
