"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Location extends Model {
    static associate(models) {
      Location.hasMany(models.ErrorReportings, {
        foreignKey: "createdBy",
        as: "errorReports",
      });
    }
  }
  Location.init(
    {
      locationName: DataTypes.STRING,
      
    },
    {
      sequelize,
      modelName: "Locations",
    }
  );
  return Location;
};
