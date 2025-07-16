const express = require('express');
const { addMember, getAllMembers, getMemberById, updateMember, deleteMember, getFilteredMembers, updateMemberStatus } = require('../controller/member');
const authMiddleware = require('../middleware/authMiddleware');
const multer = require('multer');
const path = require('path');


const router = express.Router();
router.post('/addMember', authMiddleware, addMember);
router.get('/getAllMembers', authMiddleware, getAllMembers);
router.get('/getMemberById/:id', authMiddleware, getMemberById);
router.patch('/updateMember/:id', authMiddleware, updateMember);

router.delete('/deleteMember/:id', authMiddleware, deleteMember);
router.get('/getFilteredMembers', authMiddleware, getFilteredMembers);

//ADDED UPDATE STATUS 
router.patch("/updateMemberStatus/:id", authMiddleware, updateMemberStatus)


module.exports = router;  











