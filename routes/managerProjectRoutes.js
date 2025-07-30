const express = require('express');
const { createManagerProject, getAllManagerProjects, getManagerProjectById, updateManagerProject, deleteManagerProject  } = require('../controller/managerProject');
const authMiddleware = require('../middleware/authMiddleware');
const multer = require('multer');
const path = require('path');


const router = express.Router();

router.post('/createManagerProject', authMiddleware, createManagerProject);
router.get('/getAllManagerProjects', getAllManagerProjects);
router.get('/getManagerProjectById/:id', authMiddleware, getManagerProjectById);
router.patch('/updateManagerProject/:id', authMiddleware, updateManagerProject);
router.delete('/deleteManagerProject/:id', authMiddleware, deleteManagerProject);


module.exports = router;   



