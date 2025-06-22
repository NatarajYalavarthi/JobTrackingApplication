// routes/roundRoutes.js
const express = require('express');
const router = express.Router();
const auth = require('../middlewares/authMiddleware');
const { addRound, getRoundsByApplication } = require('../Controllers/roundController');

router.post('/:applicationId', auth, addRound);
router.get('/:applicationId', auth, getRoundsByApplication);

module.exports = router;
