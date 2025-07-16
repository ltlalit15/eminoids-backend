const db = require('../config');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const multer = require('multer');
require('dotenv').config();
const path = require('path');
const nodemailer = require('nodemailer');



const addTasks = async (req, res) => {
  const { taskName } = req.body;

  try {
    // Insert the new club
    const [insertResult] = await db.query(
      `INSERT INTO tasks (taskName) 
       VALUES (?)`,
      [taskName]
    );

    // Fetch the inserted club by its ID
    const [clubRow] = await db.query(
      `SELECT * FROM tasks WHERE id = ?`,
      [insertResult.insertId]
    );

    res.status(201).json({
      status: true,
      message: "Task added successfully",
      club: clubRow[0]
    });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};


const getAllTasks = async (req, res) => {
  try {
    const [tasks] = await db.query(`SELECT * FROM tasks`);
    res.status(200).json({
      status: true,
      message: "Reterived All Tasks data",
      tasks: tasks
    });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};






module.exports = { addTasks, getAllTasks };