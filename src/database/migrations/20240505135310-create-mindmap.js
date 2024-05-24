"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("mindmaps", {
      id: {
        type: Sequelize.STRING,
        primaryKey: true,
      },
      user_id: {
        type: Sequelize.STRING,
        references: {
          model: {
            tableName: "users",
          },
          key: "id",
        },
      },
      title: {
        type: Sequelize.STRING,
        defaultValue: "Tiêu đề mindmap không tên",
      },
      desc: {
        type: Sequelize.TEXT,
        defaultValue: "Chưa có mô tả",
      },
      favorite: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      status: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      nodes: {
        type: Sequelize.ARRAY(Sequelize.JSONB),
      },
      edges: {
        type: Sequelize.ARRAY(Sequelize.JSONB),
      },
      created_at: {
        type: Sequelize.DATE(), //progress auto convert timestamp with timezone
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updated_at: {
        type: Sequelize.DATE(), //progress auto convert timestamp with timezone
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      deleted_at: {
        type: Sequelize.DATE(), //progress auto convert timestamp with timezone
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("mindmaps");
  },
};
