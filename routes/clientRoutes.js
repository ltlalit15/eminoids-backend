const express = require('express');
const { addClients, getAllClients } = require('../controller/client');
const authMiddleware = require('../middleware/authMiddleware');
const multer = require('multer');
const path = require('path');


const router = express.Router();

router.post('/addClients', authMiddleware, addClients);
router.get('/getAllClients', authMiddleware, getAllClients);
// router.get('/getClubById/:id', getClubById);
// router.patch('/updateClub/:id', updateClub);
// router.delete('/deleteClub/:id', deleteClub);



module.exports = router; 



