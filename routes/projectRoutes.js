const express = require('express');
const { addProject, getAllProjects, getProjectById, updateProject, deleteProject, getProjectsByStatus, getFilteredProjects, getProjectsByManagerId } = require('../controller/project');
const authMiddleware = require('../middleware/authMiddleware');
const multer = require('multer');
const path = require('path');

const router = express.Router();

router.post('/addProject', authMiddleware, addProject);
router.get('/getAllProjects',  getAllProjects);
router.get('/getProjectById/:id', getProjectById);
router.get('/getProjectsByStatus', authMiddleware, getProjectsByStatus);
router.get('/getFilteredProjects', authMiddleware,  getFilteredProjects);
router.patch('/updateProject/:id', authMiddleware, updateProject);
router.delete('/deleteProject/:id', authMiddleware, deleteProject);
router.get('/getProjectsByManagerId/:projectManagerId', getProjectsByManagerId);


module.exports = router;









