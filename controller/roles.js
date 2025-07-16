const db = require('../config');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const multer = require('multer');
require('dotenv').config();
const path = require('path');
const nodemailer = require('nodemailer');
const fileUpload = require('express-fileupload');
//const cloudinary = require('cloudinary').v2;


const addRole = async (req, res) => {
  const { roleName, type, description } = req.body;

  try {
    const [result] = await db.query(
      `INSERT INTO roles (roleName, type, description) VALUES (?, ?, ?)`,
      [roleName, type, description]
    );

    const [row] = await db.query(`SELECT * FROM roles WHERE id = ?`, [result.insertId]);

    res.status(201).json({
      status: true,
      message: "Role added successfully",
      data: row[0]
    });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};



const getAllRoles = async (req, res) => {
  try {
    const [rows] = await db.query(`SELECT * FROM roles`);

    res.status(200).json({
      status: true,
      message: "All roles fetched successfully",
      data: rows
    });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

  const updateRole = async (req, res) => {
  const { id } = req.params;
  const { roleName, type, description } = req.body;

  try {
    await db.query( 
      `UPDATE roles SET roleName = ?, type = ?, description = ? WHERE id = ?`,
      [roleName, type, description, id]
    );

    const [row] = await db.query(`SELECT * FROM roles WHERE id = ?`, [id]);

    res.status(200).json({
      status: true,
      message: "Role updated successfully",
      data: row[0]
    });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};


const getFilteredRoles = async (req, res) => {
  const { type = 'All' } = req.query;

  try {
    let query = `SELECT * FROM roles`;
    const values = [];

    if (type !== 'All') {
      query += ` WHERE type = ?`;
      values.push(type);
    }

    const [rows] = await db.query(query, values);

    res.status(200).json({
      status: true,
      message: 'Roles fetched successfully',
      data: rows
    });

  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};


  

module.exports = { addRole, getAllRoles, updateRole, getFilteredRoles };
