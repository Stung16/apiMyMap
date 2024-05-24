"use strict";
const bcrypt = require("bcrypt");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const users = [
      {
        id: "abcxyz",
        name: "admin",
        email: "adminf8@gmail.com",
        password: bcrypt.hashSync("12345678", bcrypt.genSaltSync(10)),
        avatar:
          "https://res.cloudinary.com/dtht61558/image/upload/v1714926727/fallback-avatar.155cdb2376c5d99ea151_clwp1n.jpg",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: "abcxyzd",
        name: "tung",
        email: "kieuduytung3@gmail.com",
        password: bcrypt.hashSync("12345678", bcrypt.genSaltSync(10)),
        avatar:
          "https://res.cloudinary.com/dtht61558/image/upload/v1714926727/fallback-avatar.155cdb2376c5d99ea151_clwp1n.jpg",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: "abcxyza",
        name: "user1",
        email: "user1@gmail.com",
        password: bcrypt.hashSync("12345678", bcrypt.genSaltSync(10)),
        status: true,
        avatar:
          "https://res.cloudinary.com/dtht61558/image/upload/v1714926727/fallback-avatar.155cdb2376c5d99ea151_clwp1n.jpg",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: "abcxyzgf",
        name: "user2",
        email: "user2@gmail.com",
        password: bcrypt.hashSync("12345678", bcrypt.genSaltSync(10)),
        status: true,
        avatar:
          "https://res.cloudinary.com/dtht61558/image/upload/v1714926727/fallback-avatar.155cdb2376c5d99ea151_clwp1n.jpg",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: "abcxyzbdf",
        name: "user3",
        email: "user3@gmail.com",
        password: bcrypt.hashSync("12345678", bcrypt.genSaltSync(10)),
        status: true,
        avatar:
          "https://res.cloudinary.com/dtht61558/image/upload/v1714926727/fallback-avatar.155cdb2376c5d99ea151_clwp1n.jpg",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: "abcxyzdsa",
        name: "user4",
        email: "user4@gmail.com",
        password: bcrypt.hashSync("12345678", bcrypt.genSaltSync(10)),
        status: true,
        avatar:
          "https://res.cloudinary.com/dtht61558/image/upload/v1714926727/fallback-avatar.155cdb2376c5d99ea151_clwp1n.jpg",
        created_at: new Date(),
        updated_at: new Date(),
      },
    ];
    await queryInterface.bulkInsert("users", users, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("users", null, {});
  },
};
