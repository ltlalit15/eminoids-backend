const db = require('../config');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const multer = require('multer');
require('dotenv').config();
const path = require('path');
const nodemailer = require('nodemailer');



const addClients = async (req, res) => {
  const { clientName } = req.body;

  try {
    // Insert the new club
    const [insertResult] = await db.query(
      `INSERT INTO clients (clientName) 
       VALUES (?)`,
      [clientName]
    );

    // Fetch the inserted club by its ID
    const [clubRow] = await db.query(
      `SELECT * FROM clients WHERE id = ?`,
      [insertResult.insertId]
    );

    res.status(201).json({
      status: true,
      message: "Client added successfully",
      club: clubRow[0]
    });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};


const getAllClients = async (req, res) => {
  try {
    const [clients] = await db.query(`SELECT * FROM clients`);
    res.status(200).json({
      status: true,
      message: "Reterived All clients data",
      clients: clients
    });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};






module.exports = { addClients, getAllClients };
