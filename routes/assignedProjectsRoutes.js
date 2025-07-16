const express = require('express');
const { addAssignedProject, getAllAssignedProjects, getAssignedProjectById, updateAssignedProject, deleteAssignedProject } = require('../controller/assignedProjects');
const authMiddleware = require('../middleware/authMiddleware');
const multer = require('multer');
const path = require('path');


const router = express.Router();

router.post('/addAssignedProject', addAssignedProject);
router.get('/getAllAssignedProjects', getAllAssignedProjects);
router.get('/getAssignedProjectById/:id', getAssignedProjectById);
router.patch('/updateAssignedProject/:id', updateAssignedProject);
router.delete('/deleteAssignedProject/:id', deleteAssignedProject);



module.exports = router;    
