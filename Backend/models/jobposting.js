
const { DataTypes } = require('sequelize');
const sequelize = require('../Config/db');
const User = require('./User');
const Application = require('./Application');

const jobposting = sequelize.define('jobposting', {
  title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    company: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    requirements: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    location: {
      type: DataTypes.STRING,
      allowNull: false
    },
    
    posted_by: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      }
    },

    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
})

 jobposting.associate = (models) => {
    jobposting.belongsTo(models.User, {
      foreignKey: 'posted_by',
      as: 'poster'
    });
    jobposting.hasMany(models.Application, {
      foreignKey: 'job_posting_id',
      as: 'applications'
    });
  };
module.exports = jobposting;

