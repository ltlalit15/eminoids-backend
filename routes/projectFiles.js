const express = require('express');
const { addProjectFile, getAllProjectFiles, getProjectFileById, updateProjectFile, deleteProjectFile } = require('../controller/projectFiles');
const authMiddleware = require('../middleware/authMiddleware');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './upload');  // Specify the folder where images will be stored
    },
    filename: (req, file, cb) => {
        const fileExtension = path.extname(file.originalname);  // Get file extension
        const fileName = Date.now() + fileExtension;  // Use a unique name
        cb(null, fileName);
    }
});

const upload = multer({ storage: storage });

const router = express.Router();

router.post('/addProjectFile', authMiddleware, addProjectFile);
router.get('/getAllProjectFiles', authMiddleware, getAllProjectFiles);
router.get('/getProjectFileById/:id', authMiddleware, getProjectFileById);
router.patch('/updateProjectFile/:id', authMiddleware, updateProjectFile);
router.delete('/deleteProjectFile/:id', authMiddleware, deleteProjectFile);


module.exports = router;   







