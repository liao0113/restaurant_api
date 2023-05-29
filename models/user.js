"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      // define association here
      User.hasMany(models.comment);
      User.belongsToMany(models.Restaurant, {
        through: models.favorite,
        foreignKey: "userId",
        as: "FavoritedRestaurants",
      });
      User.belongsToMany(models.Restaurant, {
        through: models.like,
        foreignKey: "userId",
        as: "LikedRestaurants",
      });
      User.belongsToMany(User, {
        through: models.followship,
        foreignKey: "followingId",
        as: "Followers",
      });
      User.belongsToMany(User, {
        through: models.followship,
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
      isAdmin: DataTypes.BOOLEAN,
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
