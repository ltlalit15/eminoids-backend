const db = require('../config');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const multer = require('multer');
require('dotenv').config();
const path = require('path');
const nodemailer = require('nodemailer');


// CREATE Project
const createManagerProject = async (req, res) => {
  const {
    projectName,
    clientName,
    application,
    totalPages,
    actualDueDate,
    readyForQc,
    qcHoursAllocated,
    qcDueDate,
    status
  } = req.body;

  try {
    const [result] = await db.query(
      `INSERT INTO managerprojects 
        (projectName, clientName, application, totalPages, actualDueDate, readyForQc, qcHoursAllocated, qcDueDate, status) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        projectName,
        clientName,
        application,
        totalPages,
        actualDueDate,
        readyForQc,
        qcHoursAllocated,
        qcDueDate,
        status
      ]
    );

    const [row] = await db.query(`SELECT * FROM managerprojects WHERE id = ?`, [result.insertId]);

    res.status(201).json({
      status: true,
      message: "Project created successfully",
      data: row[0]
    });

  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

// READ All
const getAllManagerProjects = async (req, res) => {
  try {
    const [rows] = await db.query(`SELECT * FROM managerprojects`);
    res.status(200).json({
      status: true,
      message: "All projects fetched",
      data: rows
    });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

// READ One
const getManagerProjectById = async (req, res) => {
  const { id } = req.params;

  try {
    const [rows] = await db.query(`SELECT * FROM managerprojects WHERE id = ?`, [id]);

    if (rows.length === 0) {
      return res.status(404).json({ status: false, message: "Project not found" });
    }

    res.status(200).json({
      status: true,
      message: "Project fetched",
      data: rows[0]
    });

  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

// UPDATE
const updateManagerProject = async (req, res) => {
  const { id } = req.params;
  const {
    projectName,
    clientName,
    application,
    totalPages,
    actualDueDate,
    readyForQc,
    qcHoursAllocated,
    qcDueDate,
    status
  } = req.body;

  try {
    await db.query(
      `UPDATE managerprojects SET 
        projectName = ?, clientName = ?, application = ?, totalPages = ?, 
        actualDueDate = ?, readyForQc = ?, qcHoursAllocated = ?, qcDueDate = ?, 
        status = ? 
       WHERE id = ?`,
      [
        projectName,
        clientName,
        application,
        totalPages,
        actualDueDate,
        readyForQc,
        qcHoursAllocated,
        qcDueDate,
        status,
        id
      ]
    );

    const [rows] = await db.query(`SELECT * FROM managerprojects WHERE id = ?`, [id]);

    res.status(200).json({
      status: true,
      message: "Project updated",
      data: rows[0]
    });

  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

// DELETE
const deleteManagerProject = async (req, res) => {
  const { id } = req.params;

  try {
    const [rows] = await db.query(`SELECT * FROM managerprojects WHERE id = ?`, [id]);

    if (rows.length === 0) {
      return res.status(404).json({ status: false, message: "Project not found" });
    }

    await db.query(`DELETE FROM managerprojects WHERE id = ?`, [id]);

    res.status(200).json({
      status: true,
      message: "Project deleted"
     // data: rows[0]
    });

  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};


module.exports = {
  createManagerProject,
  getAllManagerProjects,
  getManagerProjectById,
  updateManagerProject,
  deleteManagerProject
};
