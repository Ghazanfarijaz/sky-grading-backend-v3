const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Card = sequelize.define("Card", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  set: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  releaseYear: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  cardNumber: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true, // Ensure card number is unique
  },
  language: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  label: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  certificationNumber: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  address: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  termsAgreed: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  rarity: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "N/A",
  },
  image: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "N/A",
  },
  grade: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  subgrade: {
    type: DataTypes.JSON, // { surface, edging, centering, corners }
    allowNull: true,
    defaultValue: 0,
    
  },
  trackingStatus: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: "N/A",
  },
  rating: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 0,
  },
  trackingID: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: "N/A",
  },
  userId: {
    type: DataTypes.INTEGER,
    references: {
      model: "Users",
      key: "id",
    },
    allowNull: true,
    
  },
});

module.exports = Card;
