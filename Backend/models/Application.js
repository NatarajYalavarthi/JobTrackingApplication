const { DataTypes } = require('sequelize');
const sequelize = require('../Config/db');
const User = require('./User');

const Application = sequelize.define('Application', {
  title: DataTypes.STRING,
  company: DataTypes.STRING,
  applied_date: DataTypes.DATE,
  status: DataTypes.STRING,
    resume: DataTypes.TEXT('long'),
    userName: DataTypes.STRING,  // Add this
  userEmail: DataTypes.STRING,
    jobpostingId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
});

User.hasMany(Application);
Application.belongsTo(User);

module.exports = Application;