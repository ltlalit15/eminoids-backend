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


const updateTaskById = async (req, res) => {
  const { id } = req.params;
  const { taskName } = req.body;

  try {
    await db.query(
      `UPDATE tasks SET taskName = ? WHERE id = ?`,
      [taskName, id]
    );

    const [rows] = await db.query(`SELECT * FROM tasks WHERE id = ?`, [id]);

    if (rows.length === 0) {
      return res.status(404).json({ status: false, message: "Task not found" });
    }

    res.status(200).json({
      status: true,
      message: "Task updated successfully",
      task: rows[0]
    });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

const deleteTaskById = async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await db.query(
      `DELETE FROM tasks WHERE id = ?`,
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ status: false, message: "Task not found or already deleted" });
    }

    res.status(200).json({
      status: true,
      message: "Task deleted successfully"
    });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};





module.exports = { addTasks, getAllTasks, updateTaskById, deleteTaskById };
