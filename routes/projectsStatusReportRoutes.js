const express = require('express');
const { getProjectStatusReport } = require('../controller/projectsStatusReport');
const authMiddleware = require('../middleware/authMiddleware');
const multer = require('multer');
const path = require('path');


const router = express.Router();


router.get('/getProjectStatusReport', authMiddleware, getProjectStatusReport);



module.exports = router;    
