"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class KeyToken extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  KeyToken.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      user_id: DataTypes.INTEGER,
      refresh_token: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "KeyToken",
      tableName: "keyTokens",
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );
  return KeyToken;
};
