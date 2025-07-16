const express = require('express');
const { addService, getAllServices, getServiceById, updateService, deleteService } = require('../controller/service');
const authMiddleware = require('../middleware/authMiddleware');
const multer = require('multer');
const path = require('path');

const router = express.Router();

router.post('/addService', authMiddleware, addService);
router.get('/getAllServices', authMiddleware, getAllServices);
router.get('/getServiceById/:id', authMiddleware, getServiceById);
router.patch('/updateService/:id', authMiddleware, updateService);
router.delete('/deleteService/:id', authMiddleware, deleteService);


module.exports = router;    
