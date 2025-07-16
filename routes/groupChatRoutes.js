const express = require('express');
const { addGroupMessage, getAllGroupMessages, getGroupMessageById, updateGroupMessage, deleteGroupMessage  } = require('../controller/groupChat');
const authMiddleware = require('../middleware/authMiddleware');
const multer = require('multer');
const path = require('path');


const router = express.Router();

router.post('/addGroupMessage', authMiddleware, addGroupMessage);
router.get('/getAllGroupMessages', authMiddleware, getAllGroupMessages);
router.get('/getGroupMessageById/:id', authMiddleware, getGroupMessageById);
router.patch('/updateGroupMessage/:id', authMiddleware, updateGroupMessage);
router.delete('/deleteGroupMessage/:id', authMiddleware, deleteGroupMessage);


module.exports = router;    




