/*
"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) =>  {
    class Comment extends Model {
        static associate(models) {
          Comment.belongsTo(models.Users, {
            foreignKey: "userID",
            as: "user",
          });
    
          Comment.belongsTo(models.Posts, {
            foreignKey: "postID", 
            as: "post",
          });
        }
      }
  Comment.init(
    {
      commentID: {
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
      commentText: DataTypes.STRING,
      dateCommented: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "Comments",
    }
  );
  return Comment;
};
*/