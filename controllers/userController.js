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
    const { email, name, password, passwordCheck } = req.body;
    const emailRule =
      /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z]+$/;
    if (!emailRule.test(email)) {
      req.flash("error_msg", "email格式錯誤!");
      return res.redirect("back");
    }
    if (password !== passwordCheck) {
      req.flash("error_msg", "密碼不一致!");
      return res.redirect("back");
    }
    try {
      const isExist = User.findOne({ where: { email } });
      if (isExist) {
        req.flash("error_msg", "此信箱已被使用!");
        return res.redirect("back");
      }
      await User.create({
        name,
        email,
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
    let user = await User.findbyPk(req.params.id, {
      include: [
        Comment,
        { model: Restaurant, as: "FavoritedRestaurants" },
        { model: User, as: "Followers" },
        { model: User, as: "Followings" },
      ],
    });
    const filerRestId = [
      ...new Set(user.Comments.map((comment) => comment.RestaurantId)),
    ];
    //raw: true,next: ture 把提出的資料變成JSON格式
    const commentRest = await Restaurant.findAll({
      raw: true,
      nest: true,
      where: { id: filterRestId },
      attributes: ["id", "image"],
    });
    user = {
      ...user.toJSON(),
      identify: Number(req.params.id) === Number(helpers.getUser(req).id),
      CommentedRest: commentRest,
    };
    res.render("profile", { user });
  },
};
