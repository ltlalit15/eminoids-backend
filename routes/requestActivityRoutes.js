const express = require('express');
const { addActionRequest, getPendingRequests, updateRequestStatus } = require('../controller/requestActivity');
const authMiddleware = require('../middleware/authMiddleware');
const multer = require('multer');
const path = require('path');


const router = express.Router();


router.post('/addActionRequest', addActionRequest);
router.get('/getPendingRequests', getPendingRequests);
router.put('/updateRequestStatus/:id', updateRequestStatus);


module.exports = router;    
