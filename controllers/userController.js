const {
  User,
  Comment,
  Restaurant,
  Favorite,
  Like,
  Followship,
} = require("../models");
const bcrypt = require("bcryptjs");
const helpers = require("../_helpers");
const imgur = require("imgur-node-api");

module.exports = {
  renderLoginPage: (req, res) => {
    res.render("login");
  },
  renderRegisterPage: (req, res) => {
    res.render("register");
  },
  login: (req, res) => {
    req.flash("success_msg", "成功登入!");
    res.redirect("/restaurants");
  },
  register: async (req, res) => {
    const { mail, name, password, passwordCheck } = req.body;
    const emailRule =
      /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z]+$/;
    if (!emailRule.test(mail)) {
      req.flash("error_msg", "email格式錯誤!");
      return res.redirect("back");
    }
    if (password !== passwordCheck) {
      req.flash("error_msg", "密碼不一致!");
      return res.redirect("back");
    }
    try {
      const isExist = await User.findOne({ where: { mail } });
      if (isExist) {
        req.flash("error_msg", "此信箱已被使用!");
        return res.redirect("back");
      }
      await User.create({
        name,
        mail,
        password: bcrypt.hash(password, 10),
      });
      req.flash("success_msg", "成功註冊帳號!");
      return res.redirect("/login");
    } catch (error) {
      console.log(err);
    }
  },
  logout: (req, res) => {
    req.flash("success_msg", "成功登出!");
    req.logout();
    res.redirect("/login");
  },
  getUserProfile: async (req, res) => {
    let currUser = await User.findbyPk(req.params.id, {
      include: [
        Comment,
        { model: Restaurant, as: "FavoritedRestaurants" },
        { model: User, as: "Followers" },
        { model: User, as: "Followings" },
      ],
    });
    const filterRestId = [
      ...new Set(currUser.comments.map((comment) => comment.restaurantId)),
    ];
    //raw: true,nest: ture 把提出的資料變成JSON格式
    const commentRest = await Restaurant.findAll({
      raw: true,
      nest: true,
      where: { id: filterRestId },
      attributes: ["id", "image"],
    });
    currUser = {
      ...currUser.toJSON(),
      identify: Number(req.params.id) === Number(helpers.getUser(req).id),
      CommentedRest: commentRest,
    };
    res.render("profile", { currUser });
  },
  editUserPage: (req, res) => {
    if (Number(req.params.id) !== Number(helpers.getUser(req).id)) {
      return res.redirect("back");
    } else {
      return User.findbyPk(req.params.id, { raw: true }).then((user) => {
        res.render("edit", { user });
      });
    }
  },
  putUserProflie: async (req, res) => {
    const { file } = req;
    if (file) {
      imgur.setClientID(`${IMGUR_CLIENT_ID}`);
      imgur.upload(file.path, async (err, img) => {
        let oldUser = await User.findbyPk(req.params.id);
        let updateUser = await oldUser.update({
          name: req.body.name,
          mail: req.body.mail,
          image: file ? img.data.link : oldUser.image,
        });
      });
      req.flash("success_msg", "使用者編輯成功!");
      return res.redirect(`/users/${req.params.id}`);
    } else {
      let oldUser = await User.findbyPk(req.params.id);
      let updateUser = await oldUser.update({
        name: req.body.name,
        mail: req.body.mail,
        image: oldUser.image,
      });
      req.flash("success_msg", "使用者編輯成功!");
      return res.redirect(`/users/${req.params.id}`);
    }
  },
  getTopUser: async (req, res) => {
    let users = await User.findAll({
      include: [{ model: "User", as: "Followers" }],
    });
    users = users.map((user) => ({
      ...user.toJSON(),
      followerCount: user.Followers.length,
      isFollowed: req.user.Followings.map((data) => data.id).includes(user.id),
    }));
    users = users.sort((a, b) => b.FollowerCount - a.FollowerCount);
    return res.render("topUser", { users });
  },
  addFavorite: async (req, res) => {
    await Favorite.create({
      userId: req.user.id,
      restaurantId: req.params.restaurantId,
    });
    return res.redirect("back");
  },
  removeFavorite: async (req, res) => {
    await Favorite.destroy({
      where: {
        userId: req.user.id,
        restaurantId: req.params.restaurantId,
      },
    });
    return res.redirect("back");
  },
  addLike: async (req, res) => {
    await Like.create({
      userId: req.user.id,
      restaurantId: req.params.restaurantId,
    });
    return res.redirect("back");
  },
  removeLike: async (req, res) => {
    await Like.destroy({
      where: {
        userId: req.user.id,
        restaurantId: req.params.restaurantId,
      },
    });
    return res.redirect("back");
  },
  addFollowing: async (req, res) => {
    await Followship.create({
      followerId: req.user.id,
      followingId: req.params.userId,
    });
    return res.redirect("back");
  },
  removeFollowing: async (req, res) => {
    await Followship.destroy({
      where: {
        followerId: req.user.id,
        followingId: req.params.userId,
      },
    });
    return res.redirect("back");
  },
};
