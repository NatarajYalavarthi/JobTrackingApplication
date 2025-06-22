const express = require('express');
const router = express.Router();
const multer = require('multer');
const auth = require('../middlewares/authMiddleware');
const upload = multer();
const { createApp, GetUserApps, updateApp, getSingleApp } = require('../Controllers/applicationController');

router.post('/createapp', auth, createApp);
router.get('/getApplications', auth, GetUserApps);
router.put('/:id', auth, updateApp);
router.get('/getbyId/:id',auth, getSingleApp);

module.exports = router;



