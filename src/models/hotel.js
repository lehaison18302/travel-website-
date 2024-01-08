"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Hotel extends Model {
    static associate(models) {
      Hotel.belongsTo(models.Location, {
        foreignKey: "nameLocation",
        as: "location",
      });
    }
  }
  Hotel.init(
    {
      hotelName: DataTypes.STRING,
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
      modelName: "Hotels",
    }
  );
  return Hotel;
};
