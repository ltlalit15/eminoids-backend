const express = require('express');
const { addlanguage, getAlllanguage, updateLanguageById, deleteLanguageById } = require('../controller/language');
const authMiddleware = require('../middleware/authMiddleware');
const multer = require('multer');
const path = require('path');


const router = express.Router();

router.post('/addlanguage', authMiddleware, addlanguage);
router.get('/getAlllanguage', authMiddleware, getAlllanguage);
// router.get('/getAlertById/:id', authMiddleware, getAlertById);
router.patch('/updateLanguageById/:id', authMiddleware, updateLanguageById);
router.delete('/deleteLanguageById/:id', authMiddleware, deleteLanguageById);


module.exports = router;    


