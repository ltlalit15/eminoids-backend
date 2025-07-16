const express = require('express');
const { createGroup, getAllGroups, getGroupById, updateGroup, deleteGroup } = require('../controller/group');
const authMiddleware = require('../middleware/authMiddleware');
const multer = require('multer');
const path = require('path');


const router = express.Router();

router.post('/createGroup', authMiddleware, createGroup);
router.get('/getAllGroups', authMiddleware, getAllGroups);
router.get('/getGroupById/:id', authMiddleware, getGroupById);
router.patch('/updateGroup/:id', authMiddleware, updateGroup);
router.delete('/deleteGroup/:id', authMiddleware, deleteGroup);



module.exports = router;    

