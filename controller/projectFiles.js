const db = require('../config');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const multer = require('multer');
require('dotenv').config();
const path = require('path');
const nodemailer = require('nodemailer');


const addProjectFile = async (req, res) => {
  const {
    projectId,
    fileName,
    pages,
    languageId,
    applicationId,
    status,
    deadline
  } = req.body;

  try {
    const [result] = await db.query(
      `INSERT INTO projectfiles (projectId, fileName, pages, languageId, applicationId, status, deadline) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [projectId, fileName, pages, languageId, applicationId, status, deadline]
    );

    const insertId = result.insertId;

    const [rows] = await db.query(`SELECT * FROM projectfiles WHERE id = ?`, [insertId]);

    res.status(201).json({
      status: true,
      message: "Project file added successfully",
      data: rows[0]
    });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};



    
const getAllProjectFiles = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        pf.id,
        pf.projectId,
        p.projectTitle,
        pf.fileName,
        pf.pages,
        pf.languageId,
        l.languageName,
        pf.applicationId,
        a.applicationName,
        pf.status,
        pf.deadline,
        pf.createdAt
      FROM projectfiles pf
      LEFT JOIN projects p ON pf.projectId = p.id
      LEFT JOIN language l ON pf.languageId = l.id
      LEFT JOIN application a ON pf.applicationId = a.id
    `);

    res.status(200).json({
      status: true,
      message: "Retrieved all project files with titles, languages and applications",
      data: rows
    });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};


  

  const getProjectFileById = async (req, res) => {
  const { id } = req.params;

  try {
    const [rows] = await db.query(`SELECT * FROM projectfiles WHERE id = ?`, [id]);

    if (rows.length === 0) {
      return res.status(404).json({ status: false, message: "Project file not found" });
    }

    res.status(200).json({ status: true, message: "Reterived Single data", data: rows[0] });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};


 const updateProjectFile = async (req, res) => {
  const { id } = req.params;
  const {
    projectId,
    fileName,
    pages,
    languageId,
    applicationId,
    status,
    deadline
  } = req.body;

  try {
    await db.query(
      `UPDATE projectfiles SET projectId = ?, fileName = ?, pages = ?, languageId = ?, applicationId = ?, status = ?, deadline = ? 
       WHERE id = ?`,
      [projectId, fileName, pages, languageId, applicationId, status, deadline, id]
    );

    res.status(200).json({ status: true, message: "Project file updated successfully" });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};


const deleteProjectFile = async (req, res) => {
  const { id } = req.params;

  try {
    await db.query(`DELETE FROM projectfiles WHERE id = ?`, [id]);
    res.status(200).json({ status: true, message: "Project file deleted successfully" });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};



module.exports = { addProjectFile, getAllProjectFiles, getProjectFileById, updateProjectFile, deleteProjectFile };
