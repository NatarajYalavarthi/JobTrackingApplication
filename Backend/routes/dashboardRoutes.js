const express = require('express');
const router = express.Router();
const auth = require('../middlewares/authMiddleware');
const { getStats } = require('../Controllers/dashboardController');

router.get('/stats', auth, getStats);

module.exports = router;