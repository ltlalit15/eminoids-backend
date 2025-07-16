const express = require('express');
const { addEvent, getAllEvents, getEventById, updateEvent, deleteEvent, getEventSummary } = require('../controller/event');
const authMiddleware = require('../middleware/authMiddleware');
const multer = require('multer');
const path = require('path');


const router = express.Router();

router.post('/addEvent', authMiddleware, addEvent);
router.get('/getAllEvents', authMiddleware, getAllEvents);
router.get('/getEventById/:id', authMiddleware, getEventById);
router.get('/getEventSummary', authMiddleware, getEventSummary);

router.patch('/updateEvent/:id', authMiddleware, updateEvent);
router.delete('/deleteEvent/:id', authMiddleware, deleteEvent);


module.exports = router;






