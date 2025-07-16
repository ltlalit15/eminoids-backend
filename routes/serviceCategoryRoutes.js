const express = require('express');
const { addServiceCategory, getAllServiceCategories, getServiceCategoryById, updateServiceCategory, deleteServiceCategory } = require('../controller/serviceCategory');
const authMiddleware = require('../middleware/authMiddleware');
const multer = require('multer');
const path = require('path');


const router = express.Router();

router.post('/addServiceCategory', authMiddleware, addServiceCategory);
router.get('/getAllServiceCategories', authMiddleware, getAllServiceCategories);
router.get('/getServiceCategoryById/:id', authMiddleware, getServiceCategoryById);
router.patch('/updateServiceCategory/:id', authMiddleware, updateServiceCategory);
router.delete('/deleteServiceCategory/:id', authMiddleware, deleteServiceCategory);


module.exports = router;    
