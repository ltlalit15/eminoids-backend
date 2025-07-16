const db = require('../config');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const multer = require('multer');
require('dotenv').config();
const path = require('path');
const nodemailer = require('nodemailer');

const cloudinary = require('cloudinary').v2;

// // Cloudinary Configuration
// cloudinary.config({
//     cloud_name: 'dkqcqrrbp',
//     api_key: '418838712271323',
//     api_secret: 'p12EKWICdyHWx8LcihuWYqIruWQ'
// });

const addApplication = async (req, res) => {
  const { applicationName } = req.body;

  try {
    // Insert a new device
    const [insertResult] = await db.query(
      `INSERT INTO application (applicationName) VALUES (?)`,
      [applicationName]
    );

    // Fetch the inserted device by its ID
    const [applicationRow] = await db.query(
      `SELECT * FROM application WHERE id = ?`,
      [insertResult.insertId]
    );

    res.status(201).json({
      status: true,
      message: "Application added successfully",
      application: applicationRow[0]
    });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};



const getAllApplication = async (req, res) => {
  try {
    const [application] = await db.query('SELECT * FROM application');
    res.status(200).json({
      status: true,
      message: 'Application fetched successfully',
      application
    });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};


module.exports = { addApplication, getAllApplication };


