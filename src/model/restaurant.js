/*
"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Restaurant extends Model {
    static associate(models) {
      Restaurant.hasOne( models.Location, {
        foreignKey: "locationName",
        as: "location",
      });
    }
  }
  Restaurant.init(
    {
      restaurantName: DataTypes.STRING,
      adress: DataTypes.STRING,
      phoneNumber: DataTypes.STRING,
      district: DataTypes.STRING,
      locationName: {
        type: DataTypes.STRING,
        allowNull: false,
        references: {
          model: "Locations",
          key: "locationName",
        },
      },
    },
    {
      sequelize,
      modelName: "Restaurants",
    }
  );
  return Restaurant;
};
*/