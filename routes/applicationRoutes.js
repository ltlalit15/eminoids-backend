const express = require('express');
const { addApplication, getAllApplication, updateApplicationById, deleteApplicationById } = require('../controller/application');
const authMiddleware = require('../middleware/authMiddleware');
const multer = require('multer');
const path = require('path');


const router = express.Router();

router.post('/addApplication', authMiddleware, addApplication);
router.get('/getAllApplication', authMiddleware, getAllApplication);
// router.get('/getAgreementById/:id', getAgreementById);
router.patch('/updateApplicationById/:id', updateApplicationById);
router.delete('/deleteApplicationById/:id', deleteApplicationById);



module.exports = router;    
