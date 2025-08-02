const express = require('express');
const { addTasks, getAllTasks, updateTaskById, deleteTaskById } = require('../controller/tasks');
const authMiddleware = require('../middleware/authMiddleware');
const multer = require('multer');
const path = require('path');


const router = express.Router();

router.post('/addTasks', authMiddleware, addTasks);
router.get('/getAllTasks', authMiddleware, getAllTasks);
// router.get('/getClubById/:id', getClubById);
router.patch('/updateTaskById/:id', updateTaskById);
router.delete('/deleteTaskById/:id', deleteTaskById);



module.exports = router; 



