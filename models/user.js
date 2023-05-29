"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      // define association here
      Uers.hasMany(Model.Comment);
      User.belongsToMany(Model.Restaurant, {
        through: models.Favorite,
        foreignKey: "userId",
        as: "FavoritedRestaurants",
      });
      User.belongsToMany(Model.Restaurant, {
        through: models.Like,
        foreignKey: "userId",
        as: "LikedRestaurants",
      });
      User.belongsToMany(User, {
        through: models.Followship,
        foreignKey: "followingId",
        as: "Followers",
      });
      User.belongsToMany(User, {
        through: models.Followship,
        foreignKey: "followerId",
        as: "Followings",
      });
    }
  }
  User.init(
    {
      name: DataTypes.STRING,
      mail: DataTypes.STRING,
      password: DataTypes.STRING,
      isAdmin: DataTypes.BOOLEN,
      image: {
        type: DataTypes.STRING,
        defaultValue: "/image/default.png",
      },
    },
    {
      sequelize,
      modelName: "User",
    }
  );
  return User;
};
