const express = require('express');
const { addTaskAutomation, getAllTaskAutomations, getTaskAutomationById, updateTaskAutomation, deleteTaskAutomation } = require('../controller/taskAutomation');
const authMiddleware = require('../middleware/authMiddleware');
const multer = require('multer');
const path = require('path');


const router = express.Router();

router.post('/addTaskAutomation', addTaskAutomation);
router.get('/getAllTaskAutomations', getAllTaskAutomations);
router.get('/getTaskAutomationById/:id', getTaskAutomationById);
router.patch('/updateTaskAutomation/:id', updateTaskAutomation);
router.delete('/deleteTaskAutomation/:id', deleteTaskAutomation);



module.exports = router;    
