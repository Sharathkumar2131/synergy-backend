// models/User.js
const { DataTypes } = require('sequelize');
const sequelize = require('../dbconfig');

const User = sequelize.define('User', {
  user_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  father_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  mobile_no: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  user_roll: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = User;
