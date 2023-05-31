"use strict";
const { faker } = require("@faker-js/faker");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "Restaurants",
      Array.from({ length: 50 }).map((d, i) => ({
        id: i * 10 + 1,
        name: faker.company.name(),
        tel: faker.phone.number("+886-###-###-###"),
        address: faker.location.streetAddress(),
        opening_hours: "08:00",
        image: `https://loremflickr.com/320/240/restaurant,food/?random=${
          Math.random() * 100
        }`,
        description: faker.lorem.text(),
        createdAt: new Date(),
        updatedAt: new Date(),
        CategoryId: Math.floor(Math.random() * 7) * 10 + 1,
        viewCounts: 0,
      }))
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Restaurants", null);
  },
};
