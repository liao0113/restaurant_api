"use strict";
const bcrypt = require("bcrypt");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("Users", [
      {
        id: 1,
        mail: "root@example.com",
        password: bcrypt.hashSync("12345678", 10),
        isAdmin: true,
        name: "root",
        createdAt: new Date(),
        updatedAt: new Date(),
        image: "/image/default.png",
      },
      {
        id: 11,
        mail: "user1@example.com",
        password: bcrypt.hashSync("12345678", 10),
        isAdmin: false,
        name: "user1",
        createdAt: new Date(),
        updatedAt: new Date(),
        image: "/image/default.png",
      },
      {
        id: 21,
        mail: "user2@example.com",
        password: bcrypt.hashSync("12345678", 10),
        isAdmin: false,
        name: "user2",
        createdAt: new Date(),
        updatedAt: new Date(),
        image: "/image/default.png",
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Users", null);
  },
};
