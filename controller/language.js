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

const updateLanguageById = async (req, res) => {
  const { id } = req.params;
  const { languageName } = req.body;

  try {
    await db.query(
      `UPDATE language SET languageName = ? WHERE id = ?`,
      [languageName, id]
    );

    const [rows] = await db.query(`SELECT * FROM language WHERE id = ?`, [id]);

    if (rows.length === 0) {
      return res.status(404).json({ status: false, message: "Language not found" });
    }

    res.status(200).json({
      status: true,
      message: "Language updated successfully",
      language: rows[0]
    });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};


const deleteLanguageById = async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await db.query(
      `DELETE FROM language WHERE id = ?`,
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ status: false, message: "Language not found or already deleted" });
    }

    res.status(200).json({
      status: true,
      message: "Language deleted successfully"
    });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};





module.exports = {addlanguage, getAlllanguage, updateLanguageById, deleteLanguageById}
