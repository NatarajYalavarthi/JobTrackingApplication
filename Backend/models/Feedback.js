const { DataTypes } = require('sequelize');
const sequelize = require('../Config/db');
const Application = require('./Application');
const User = require('./User');

const Feedback = sequelize.define('Feedback', {
  comments: DataTypes.STRING,
  created_by: DataTypes.STRING
});

Application.hasMany(Feedback);
Feedback.belongsTo(Application);
User.hasMany(Feedback, { foreignKey: 'created_by', as: 'GivenFeedbacks' });
Feedback.belongsTo(User, { foreignKey: 'created_by', as: 'CreatedBy' });

module.exports = Feedback;