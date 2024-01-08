"use strict";
const { Model, DataTypes } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class Rating extends Model {
        static associate(models) {
          Rating.belongsTo(models.User, {
            foreignKey: "userID",
            as: "user",
          });
    
          Rating.belongsTo(models.Post, {
            foreignKey: "postID", 
            as: "post",
          });
        }
      }
  Rating.init(
    {
      ratingID: {
        type: DataTypes.INTEGER,
        primaryKey: true, 
        autoIncrement: true,
      },
      userID: { //khoa ngoai toi bang Users
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Users", // Tên bảng bạn đang tham chiếu
          key: "userID",
            },
        },
      postID: { // khoa ngoai toi bang Posts
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: "Posts",
            key: "postID",
        },
      },
      rating: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          min: {
            args: [1],
          },
          max: {
            args: [5],
          },
        },
      },
      daterated: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "Ratings",
    }
  );
  return Rating;
};
