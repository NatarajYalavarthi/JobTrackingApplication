require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { sequelize } = require('./models');
const app = express();

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/applications', require('./routes/applicationRoutes'));
app.use('/api/feedback', require('./routes/feedbackRoutes'));
app.use('/api/rounds', require('./routes/roundRoutes'));
app.use('/api/dashboard', require('./routes/dashboardRoutes'));
app.use('/api', require('./routes/userRoutes'));
app.use('/api', require('./routes/jobpostingRoutes'));

sequelize.sync().then(() => {
  app.listen(5000, () => console.log('Server running on http://localhost:5000'));
});