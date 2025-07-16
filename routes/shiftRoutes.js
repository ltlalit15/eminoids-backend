const express = require('express');
const { createShift, getAllShifts, getShiftById, updateShift, deleteShift } = require('../controller/shift');
const authMiddleware = require('../middleware/authMiddleware');
const multer = require('multer');
const path = require('path');


const router = express.Router();

router.post('/createShift', authMiddleware, createShift);
router.get('/getAllShifts', authMiddleware, getAllShifts);
router.get('/getShiftById/:id', authMiddleware, getShiftById);
router.patch('/updateShift/:id', authMiddleware, updateShift);
router.delete('/deleteShift/:id', authMiddleware, deleteShift);


module.exports = router;




