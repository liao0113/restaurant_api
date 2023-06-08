const helpers = require("../_helpers");
const {
  User,
  Comment,
  Restaurant,
  Favorite,
  Like,
  Followship,
  Category,
} = require("../models");
const pageLimit = 9;

module.exports = {
  getRestaurants: async (req, res) => {
    let offset = 0;
    const whereQuery = {};
    let categoryId = "";
    if (req.query.page) {
      offset = (req.query.page - 1) * pageLimit;
    }
    if (req.query.categoryId) {
      categoryId = Number(req.query.categoryId);
      whereQuery.categoryId = categoryId;
    }
    const restaurants = await Restaurant.findAndCountAll({
      include: Category,
      where: whereQuery,
      offset: offset,
      limit: pageLimit,
    });
    //分頁的資料
    const page = Number(req.query.page) || 1;
    const pages = Math.ceil(restaurants.count / pageLimit);
    const totalPage = Array.from({ length: pages }).map(
      (item, index) => index + 1
    );
    //前一頁
    const prev = page - 1 < 1 ? 1 : page - 1;
    //後一頁
    const next = page + 1 > pages ? pages : page + 1;

    const data = restaurants.rows.map((r) => ({
      ...r.dataValues,
      description: r.Values.description.substring(0, 70),
      categoryName: r.Category.name,
      isFavorited: req.user.FavoritedRestaurants.map((d) => d.id).includes(
        r.id
      ),
      isLiked: req.user.LikedRestaurants.map((d) => d.id).includes(r.id),
    }));
    const categories = await Category.findAll({ raw: true, nest: true });
    res.render("restaurants", {
      restaurants: data,
      categories,
      categoryId,
      page,
      totalPage,
      prev,
      next,
    });
  },
  getRestaurant: async (req, res) => {
    const restaurant = await Restaurant.findbyPk(req.params.id, {
      include: [
        Category,
        { model: User, as: "FavoritedUsers" },
        { model: User, as: "LikedUsers" },
        { model: Comment, include: [User] },
      ],
    });
    await restaurant.increment("viewCounts");
    const isFavorited = restaurant.FavoritedUsers.map(
      (data) => data.id
    ).includes(req.user.id);
    const isLiked = restaurant.LikedUsers.map((data) => data.id).includes(
      req.user.id
    );
    res.render("restaurant", {
      restaurant: restaurant.toJSON(),
      isFavorited,
      isLiked,
    });
  },
  //最新動態
  getFeeds: (req, res) => {
    Promise.all([
      Restaurant.findAll({
        include: Category,
        limit: 10,
        raw: true,
        nest: true,
        order: ["createdAt", "DESC"],
      }),
      Comment.findAll({
        include: [User, Restaurant],
        limit: 10,
        raw: true,
        nest: true,
        order: ["createdAt", "DESC"],
      }),
    ]).then((restaurants, comments) => {
      return res.render("feeds", { restaurants, comments });
    });
  },
  getDashBoard: (req, res) => {
    Promise.all([
      Restaurant.findbyPk(req.params.id, {
        include: Category,
      }),
      Comment.findAndCountAll({
        where: { restaurantId: req.params.id },
        raw: true,
        nest: true,
      }),
      Favorite.findAndCountAll({
        where: { restaurantId: req.params.id },
        raw: true,
        nest: true,
      }),
    ]).then((restaurant, comments, favorites) => {
      return res.render("dashboard", {
        restaurant: restaurant.toJSON(),
        comments,
        favorites,
      });
    });
  },
  getTopRestaurant: async (req, res) => {
    let restaurants = await Restaurant.findAll({
      include: { model: User, as: "FavoritedUsers" },
    });
    restaurants = restaurants.map((restaurant) => ({
      ...restaurant.dataValues,
      description: restaurant.description.substring(0, 70),
      favoriteCount: restaurant.FavoritedUsers.length,
      isFavorited: restaurant.FavoritedUsers.map((data) => data.id).includes(
        helpers.getUser(req).id
      ),
    }));
    restaurants = restaurants
      .sort((a, b) => b.favoriteCount - a.favoriteCount)
      .slice(0, 10);
    return res.render("topRestaurant", { restaurants });
  },
};
