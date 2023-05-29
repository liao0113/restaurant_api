"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Restaurant extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Restaurant.belongsTo(models.Category);
      Restaurant.hasMany(models.comment);
      Restaurant.belongsToMany(models.User, {
        through: models.favorite,
        foreignKey: "RestaurantId",
        as: "FavoritedUsers",
      });
      Restaurant.belongsToMany(models.User, {
        through: models.like,
        foreignKey: "RestaurantId",
        as: "LikedUsers",
      });
    }
  }
  Restaurant.init(
    {
      name: DataTypes.STRING,
      tel: DataTypes.STRING,
      address: DataTypes.STRING,
      opening_hour: DataTypes.STRING,
      description: DataTypes.TEXT,
      image: DataTypes.STRING,
      CategoryId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Restaurant",
    }
  );
  return Restaurant;
};
