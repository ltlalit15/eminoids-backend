const express = require('express');
const { startTracking, pauseTracking, stopTracking, getActiveTracking, getAllTracking } = require('../controller/tracking');
const authMiddleware = require('../middleware/authMiddleware');
const multer = require('multer');
const path = require('path');


const router = express.Router();

router.post('/startTracking', authMiddleware, startTracking);
router.post('/pauseTracking', authMiddleware, pauseTracking);
router.post('/stopTracking', authMiddleware, stopTracking);
router.get('/getActiveTracking/:memberId', getActiveTracking);
router.get('/getAllTracking/:memberId', getAllTracking);




module.exports = router; 



