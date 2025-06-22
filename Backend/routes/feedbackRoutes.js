const express = require('express');
const router = express.Router();
const auth = require('../middlewares/authMiddleware');
const role = require('../middlewares/roleMiddleware');
const { addFeedback, getAllFeedbacks } = require('../Controllers/feedbackController');

router.post('/:applicationId', auth, role('admin'), addFeedback);
router.get('/get', auth, role('admin'), getAllFeedbacks);



module.exports = router;