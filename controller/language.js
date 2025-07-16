const db = require('../config');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const multer = require('multer');
require('dotenv').config();
const path = require('path');
const nodemailer = require('nodemailer');


const addlanguage = async (req, res) => {
  const { languageName } = req.body;

  try {
    // Insert a new alert
    const [insertResult] = await db.query(
      `INSERT INTO language (languageName) VALUES (?)`,
      [languageName]
    );

    // Fetch the inserted alert by its ID
    const [languageRow] = await db.query(
      `SELECT * FROM language WHERE id = ?`,
      [insertResult.insertId]
    );

    res.status(201).json({
      status: true,
      message: "language added successfully",
      language: languageRow[0]
    });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};



const getAlllanguage = async (req, res) => {
  try {
    const [languages] = await db.query('SELECT * FROM language');
    res.status(200).json({
      status: true,
      message: 'Language fetched successfully',
      languages
    });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};



// const getAlertById = async (req, res) => {
//   const { id } = req.params;

//   try {
//     const [alert] = await db.query('SELECT * FROM alerts WHERE id = ?', [id]);

//     if (alert.length === 0) {
//       return res.status(404).json({ status: false, message: 'Alert not found' });
//     }

//     res.status(200).json({
//       status: true,
//       message: 'Alert fetched successfully',
//       alert: alert[0]
//     });
//   } catch (error) {
//     res.status(500).json({ status: false, message: error.message });
//   }
// };




// const updateAlert = async (req, res) => {
//   const { id } = req.params;
//   const { message, severity } = req.body;

//   try {
//     // Check if alert exists
//     const [alert] = await db.query('SELECT * FROM alerts WHERE id = ?', [id]);
//     if (alert.length === 0) {
//       return res.status(404).json({ status: false, message: 'Alert not found' });
//     }

//     // Update the alert
//     await db.query(
//       'UPDATE alerts SET message = ?, severity = ? WHERE id = ?',
//       [message, severity, id]
//     );

//     // Fetch the updated alert
//     const [updatedAlert] = await db.query('SELECT * FROM alerts WHERE id = ?', [id]);

//     res.status(200).json({
//       status: true,
//       message: 'Alert updated successfully',
//       alert: updatedAlert[0]
//     });
//   } catch (error) {
//     res.status(500).json({ status: false, message: error.message });
//   }
// };


// const deleteAlert = async (req, res) => {
//   const { id } = req.params;

//   try {
//     // Check if alert exists
//     const [alert] = await db.query('SELECT * FROM alerts WHERE id = ?', [id]);
//     if (alert.length === 0) {
//       return res.status(404).json({ status: false, message: 'Alert not found' });
//     }

//     // Delete the alert
//     await db.query('DELETE FROM alerts WHERE id = ?', [id]);

//     res.status(200).json({
//       status: true,
//       message: 'Alert deleted successfully'
//     });
//   } catch (error) {
//     res.status(500).json({ status: false, message: error.message });
//   }
// };


module.exports = {addlanguage, getAlllanguage}