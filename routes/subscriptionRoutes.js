const express = require('express');
const { addSubscription, getAllSubscriptions, getSubscriptionById, updateSubscription, deleteSubscription } = require('../controller/subscription');
const authMiddleware = require('../middleware/authMiddleware');
const multer = require('multer');
const path = require('path');


const router = express.Router();

router.post('/addSubscription', authMiddleware, addSubscription);
router.get('/getAllSubscriptions', authMiddleware, getAllSubscriptions);
router.get('/getSubscriptionById/:id', authMiddleware, getSubscriptionById);
router.patch('/updateSubscription/:id', authMiddleware, updateSubscription);
router.delete('/deleteSubscription/:id', authMiddleware, deleteSubscription);


module.exports = router;    
