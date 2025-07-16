const express = require('express');
const { addSmsTemplate, getAllSmsTemplates, getSmsTemplateById, updateSmsTemplate, deleteSmsTemplate } = require('../controller/smsTemplate');
const authMiddleware = require('../middleware/authMiddleware');
const multer = require('multer');
const path = require('path');

const router = express.Router();

router.post('/addSmsTemplate', addSmsTemplate);
router.get('/getAllSmsTemplates', getAllSmsTemplates);
router.get('/getSmsTemplateById/:id', getSmsTemplateById);
router.patch('/updateSmsTemplate/:id', updateSmsTemplate);
router.delete('/deleteSmsTemplate/:id', deleteSmsTemplate);


module.exports = router;    
