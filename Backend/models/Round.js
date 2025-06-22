const { DataTypes } = require('sequelize');
const sequelize = require('../Config/db');
const Application = require('./Application');
const jobposting = require('./jobposting');

const Round = sequelize.define('Round', {
  title: DataTypes.STRING,
  notes: DataTypes.STRING,
   isCompleted: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
});

Application.hasMany(Round);
Round.belongsTo(Application);

module.exports = Round;
