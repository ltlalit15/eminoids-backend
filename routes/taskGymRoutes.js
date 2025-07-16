const express = require('express');
const { addGymTask, getAllGymTask, getGymTaskById, updateGymTask } = require('../controller/taskGym');
const authMiddleware = require('../middleware/authMiddleware');
const multer = require('multer');
const path = require('path');



const router = express.Router();

router.post('/addGymTask', addGymTask);
router.get('/getAllGymTask', getAllGymTask);
router.get('/getGymTaskById/:id', getGymTaskById);
router.patch('/updateGymTask/:id', updateGymTask);
// router.delete('/deleteMember/:id', deleteMember);



module.exports = router;    
