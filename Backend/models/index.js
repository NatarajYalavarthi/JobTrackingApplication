const sequelize = require('../Config/db');
const User = require('./User');
const Application = require('./Application');
const Feedback = require('./Feedback');
const Round = require('./Round');
const JobPosting = require('./jobposting')

module.exports = { sequelize, User, Application, Feedback, Round, JobPosting };