const express = require('express');
const router = express.Router();
const auth = require('../middlewares/authMiddleware');
const { createjobPosting, getAllJobPostings,updateJobPosting } = require('../Controllers/jobpostingController');

router.post('/createjob', auth, createjobPosting);
router.get('/getjobs', auth, getAllJobPostings);
router.put('/updatejob/:id', auth, updateJobPosting);


module.exports = router;