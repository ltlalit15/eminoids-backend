const express = require('express');
const { addlanguage, getAlllanguage } = require('../controller/language');
const authMiddleware = require('../middleware/authMiddleware');
const multer = require('multer');
const path = require('path');


const router = express.Router();

router.post('/addlanguage', authMiddleware, addlanguage);
router.get('/getAlllanguage', authMiddleware, getAlllanguage);
// router.get('/getAlertById/:id', authMiddleware, getAlertById);
// router.patch('/updateAlert/:id', authMiddleware, updateAlert);
// router.delete('/deleteAlert/:id', authMiddleware, deleteAlert);


module.exports = router;    


