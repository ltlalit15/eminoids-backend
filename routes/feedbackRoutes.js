const express = require('express');
const { addFeedback, getAllFeedback, getFeedbackById, updateFeedback, deleteFeedback } = require('../controller/feedback');
const authMiddleware = require('../middleware/authMiddleware');
const multer = require('multer');
const path = require('path');


const router = express.Router();

router.post('/addFeedback', authMiddleware, addFeedback);
router.get('/getAllFeedback', getAllFeedback);
router.get('/getFeedbackById/:id', authMiddleware, getFeedbackById);
router.patch('/updateFeedback/:id', authMiddleware, updateFeedback);
router.delete('/deleteFeedback/:id', authMiddleware, deleteFeedback);


module.exports = router;    

