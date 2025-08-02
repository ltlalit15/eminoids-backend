const express = require('express');
const { assignPermissions, getAllPermissions, getPermissionsByRoleId,updatePermissionById, deletePermissionsById   } = require('../controller/permission');
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

router.post('/assignPermissions', authMiddleware, assignPermissions);
router.get('/getAllPermissions', getAllPermissions);
router.get('/getPermissionsByRoleId/:roleId', getPermissionsByRoleId);
router.patch('/updatePermissionById/:id', authMiddleware, updatePermissionById);
router.delete('/deletePermissionsById/:id', authMiddleware, deletePermissionsById);


module.exports = router;    



