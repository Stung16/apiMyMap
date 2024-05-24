'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.addColumn("mindmaps", "image", {
      type: Sequelize.STRING,
      defaultValue: "https://cdn5.mindmeister.com/assets/library/general/mm-logout-illustration_220727-f35a7063c1cb3191481037c2e66edc4999ec2e6e83f4b4f15c3af6ca43753682.png",
    })
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.removeColumn("mindmaps", "image")

  }
};
