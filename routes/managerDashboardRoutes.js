const express = require('express');
const { getManagerDashboardData } = require('../controller/managerDashboard');
const authMiddleware = require('../middleware/authMiddleware');
const multer = require('multer');
const path = require('path');


const router = express.Router();


router.get('/getManagerDashboardData/:memberId', getManagerDashboardData);



module.exports = router;  

