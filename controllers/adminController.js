const db = require("../models");
const User = db.User;
const Restaurant = db.Restaurant;
const Category = db.Category;
const imgur = require("imgur-node-api");

module.exports = {
  getRestaurants: async (req, res) => {
    const restaurants = await Restaurant.findAll({
      include: Category,
      raw: true,
      nest: true,
    });
    res.render("admin/restaurants", { restaurants });
  },
  getRestaurant: (req, res) => {
    Restaurant.findByPk(req.params.id, {
      include: Category,
    }).then((restaurant) => {
      res.render("admin/restaurant", { restaurant: restaurant.toJSON() });
    });
  },
  createRestaurant: (req, res) => {
    Category.findAll({
      raw: true,
      nest: true,
    }).then((categories) => {
      return res.render("admin/createRest", { categories });
    });
  },
  postRestaurant: async (req, res) => {
    if (!req.body.name) {
      req.flash("error_msg", "name didn't exist!");
      return res.redirect("back");
    }
    const { file } = req;
    if (file) {
      imgur.setClientID(process.env.IMGUR_CLIENT_ID);
      imgur.upload(file.path, async (err, img) => {
        await Restaurant.create({
          name: req.body.name,
          tel: req.body.tel,
          address: req.body.address,
          opening_hours: req.body.opening_hours,
          description: req.body.description,
          image: null,
          CategoryId: req.body.categoryId,
        });
      });
      req.flash("success_msg", "restaurant was successfully create!");
      return res.redirect("admin/restaurants");
    } else {
      await Restaurant.create({
        name: req.body.name,
        tel: req.body.tel,
        address: req.body.address,
        opening_hours: req.body.opening_hours,
        description: req.body.description,
        image: file ? img.data.link : null,
        CategoryId: req.body.categoryId,
      });
      req.flash("success_msg", "restaurant was successfully created!");
      return res.redirect("/admin/restaurants");
    }
  },
  editRestaurant: (req, res) => {
    Category.findAll({
      raw: true,
      nest: true,
    }).then((categories) => {
      Restaurant.findByPk(req.params.id).then((restaurant) => {
        return res.render("admin/createRest", {
          restaurant: restaurant.toJSON(),
          categories,
        });
      });
    });
  },
  putRestaurant: async (req, res) => {
    if (!req.body.name) {
      req.flash("error_msg", "name didn't exist!");
      return res.redirect("back");
    }
    const { file } = req;
    const restaurant = await Restaurant.findByPk(req.params.id);
    if (file) {
      imgur.setClientID(process.env.IMGUR_CLIENT_ID);
      imgur.upload(file.path, async (err, img) => {
        await restaurant.update({
          name: req.body.name,
          tel: req.body.tel,
          address: req.body.address,
          opening_hours: req.body.opening_hours,
          description: req.body.description,
          image: file ? img.data.link : restaurant.image,
          CategoryId: req.body.categoryId,
        });
      });
      req.flash("success_msg", "restaurant was successfully updated");
      return res.redirect("/admin/restaurants");
    } else {
      await restaurant.update({
        name: req.body.name,
        tel: req.body.tel,
        address: req.body.address,
        opening_hours: req.body.opening_hours,
        description: req.body.description,
        image: restaurant.image,
        CategoryId: req.body.categoryId,
      });
      req.flash("success_msg", "restaurant was successfully updated");
      return res.redirect("/admin/restaurants");
    }
  },
  deleteRestaurant: async (req, res) => {
    const deleteRest = await Restaurant.findByPk(req.params.id);
    await deleteRest.destory();
    req.flash("success_msg", "restaurant was successfully deleted!");
    res.redirect("/admin/restaurants");
  },
  getUsers: async (req, res) => {
    const users = await User.findAll({ raw: true, nest: true });
    res.render("admin/users", { users });
  },
  toggleAdmin: async (req, res) => {
    const user = await User.findByPk(req.params.id);
    if (user.mail === "root@example.com") {
      req.flash("error_msg", "禁止變更管理員權限!");
      return res.redirect("back");
    }
    await user.update({ isAdmin: !user.isAdmin });
    req.flash("success_msg", "使用者權限變更成功!");
    res.redirect("/admin/users");
  },
};
