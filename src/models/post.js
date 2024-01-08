"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Post extends Model {
    static associate(models) {
      Post.belongsTo(models.User, {
        foreignKey: "userID",
        as: "user",
      });
    }
  }
  Post.init(
    {
      postID: {
        type: DataTypes.INTEGER,
        primaryKey: true, 
        autoIncrement: true,
      },
      userID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Users", // Tên bảng bạn đang tham chiếu
          key: "userID",
            },
        },
      locationName: {
        type: DataTypes.STRING,
        allowNull: false,
        references: {
          model: "Locations",
          key: "locationName",
        },
      },
      title: DataTypes.STRING,
      content: DataTypes.STRING,
      dateCreated: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "Posts",
    }
  );
  return Post;
};
