const express = require('express');
const router = express.Router();
const auth = require('../middlewares/authMiddleware');
const { getLoggedInUser} = require('../Controllers/userController');

router.get('/user', auth, getLoggedInUser);

module.exports = router;