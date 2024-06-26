"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Mindmap extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Mindmap.init(
    {
      id: {
        type: DataTypes.STRING,
        primaryKey: true,
      },
      user_id: DataTypes.STRING,
      title: DataTypes.STRING,
      image: DataTypes.STRING,
      desc: DataTypes.TEXT,
      edge_type: DataTypes.TEXT,
      status: DataTypes.BOOLEAN,
      nodes: DataTypes.ARRAY(DataTypes.JSONB),
      edges: DataTypes.ARRAY(DataTypes.JSONB),
      favorite: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "Mindmap",
      tableName: "mindmaps",
      createdAt: "created_at",
      updatedAt: "updated_at",
      deletedAt: "deleted_at",
      timestamps: true,
      paranoid: true,
    }
  );
  return Mindmap;
};
