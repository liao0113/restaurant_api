"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class comment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      comment.belongsTo(models.User);
      comment.belongsTo(models.Restaurant);
    }
  }
  comment.init(
    {
      text: DataTypes.STRING,
      userId: {
        type: DataTypes.INTEGER,
        references: {
          model: "Users",
          key: "id",
        },
      },
      restaurantId: {
        type: DataTypes.INTEGER,
        references: {
          model: "Restaurants",
          key: "id",
        },
      },
    },
    {
      sequelize,
      modelName: "comment",
    }
  );
  return comment;
};
