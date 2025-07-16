const db = require('../config');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const multer = require('multer');
require('dotenv').config();
const path = require('path');
const nodemailer = require('nodemailer');
const cloudinary = require('cloudinary').v2;

// Cloudinary Configuration
cloudinary.config({
    cloud_name: 'dkqcqrrbp',
    api_key: '418838712271323',
    api_secret: 'p12EKWICdyHWx8LcihuWYqIruWQ'
});


const getActivityLogs = async (req, res) => {
  try {
    console.log("📥 Fetching all activity logs...");

    const [logs] = await db.query(`
      SELECT 
        logs.id,
        logs.createdAt AS timestamp,
        m.fullName AS user,
        m.role AS role,
        logs.activity,
        logs.module,
        logs.ipAddress,
        logs.deviceBrowser
      FROM activitylogs logs
      JOIN members m ON logs.memberId = m.id
      LIMIT 10
      
    `);

    console.log(`✅ ${logs.length} activity logs fetched`);
    res.status(200).json({
      status: true,
      message: "Logs fetched successfully",
      data: logs
    });

  } catch (err) {
    console.error("❌ Error fetching activity logs:", err.message);
    res.status(500).json({ status: false, message: err.message });
  }
};

  



module.exports = { getActivityLogs };