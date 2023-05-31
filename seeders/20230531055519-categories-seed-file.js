"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "Categories",
      [
        "中式料理",
        "日本料理",
        "義大利料理",
        "墨西哥料理",
        "素食料理",
        "美式料理",
        "複合式料理",
      ].map((item, index) => ({
        id: index * 10 + 1,
        name: item,
        createdAt: new Date(),
        updatedAt: new Date(),
      }))
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Categories", null);
  },
};
