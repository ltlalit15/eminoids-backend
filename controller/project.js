const db = require('../config');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const multer = require('multer');
require('dotenv').config();
const path = require('path');
const nodemailer = require('nodemailer');
const cloudinary = require('cloudinary').v2;
const logActivity = require('../utils/logActivity')

// Cloudinary Configuration
cloudinary.config({
    cloud_name: 'dkqcqrrbp',
    api_key: '418838712271323',
    api_secret: 'p12EKWICdyHWx8LcihuWYqIruWQ'
});


const addProject = async (req, res) => {
  const {
    projectTitle,
    clientId,
    country,
    projectManagerId,
    taskId,
    applicationId,
    languageId,
    totalPagesLang,
    totalProjectPages,
    receiveDate,
    serverPath,
    notes,
    estimatedHours,
    hourlyRate,
    perPageRate,
    currency,
    totalCost,
    deadline,
    readyQCDeadline,
    qcHrs,
    qcDueDate,
    priority,
    status
  } = req.body;

  try {
    // Insert project into the database
    const [insertResult] = await db.query(
      `INSERT INTO projects (
        projectTitle, clientId, country, projectManagerId, taskId, applicationId,
        languageId, totalPagesLang, totalProjectPages, receiveDate, serverPath,
        notes, estimatedHours, hourlyRate, perPageRate, currency, totalCost, deadline,
        readyQCDeadline, qcHrs, qcDueDate, priority, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        projectTitle, clientId, country, projectManagerId, taskId, applicationId,
        languageId, totalPagesLang, totalProjectPages, receiveDate, serverPath,
        notes, estimatedHours, hourlyRate, perPageRate, currency, totalCost, deadline,
        readyQCDeadline, qcHrs, qcDueDate,priority, status
      ]
    );

    // Fetch the inserted project row
    const [projectRow] = await db.query(
      `SELECT * FROM projects WHERE id = ?`,
      [insertResult.insertId]
    );

    await logActivity(req, insertResult.insertId, "Project Created", "Project Management");

    res.status(201).json({
      status: true,
      message: "Project added successfully",
      project: projectRow[0]
    });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

const getAllProjects = async (req, res) => {
  try {
    const [projects] = await db.query(`
      SELECT 
        p.*, 
        c.clientName,
        t.taskName AS task_name,
        l.languageName AS language_name,
        a.applicationName AS application_name,
        m.fullName AS full_name
      FROM projects p
      LEFT JOIN clients c ON p.clientId = c.id
      LEFT JOIN tasks t ON p.taskId = t.id
      LEFT JOIN language l ON p.languageId = l.id
      LEFT JOIN application a ON p.applicationId = a.id
      LEFT JOIN members m ON p.projectManagerId = m.id
     
    `);

    res.status(200).json({
      status: true,
      message: "Projects fetched successfully",
      projects
    });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};



const getProjectById = async (req, res) => {
  const { id } = req.params;

  try {
    const [project] = await db.query(
      `SELECT * FROM projects WHERE id = ?`,
      [id]
    );

    if (project.length === 0) {
      return res.status(404).json({
        status: false,
        message: "Project not found"
      });
    }

    res.status(200).json({
      status: true,
      message: "Project fetched successfully",
      project: project[0]
    });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};


const updateProject = async (req, res) => {
  const { id } = req.params;
  const data = req.body;

  try {
    await db.query(
      `UPDATE projects SET ? WHERE id = ?`,
      [data, id]
    );

    const [updatedProject] = await db.query(
      `SELECT * FROM projects WHERE id = ?`,
      [id]
    );
    // ✅ Log activity
    await logActivity(req, id, "Project Updated", "Project Management");

    res.status(200).json({
      status: true,
      message: "Project updated successfully",
      project: updatedProject[0]
    });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};


const deleteProject = async (req, res) => {
  const { id } = req.params;

  try {
    await db.query(
      `DELETE FROM projects WHERE id = ?`,
      [id]
    );

    res.status(200).json({
      status: true,
      message: "Project deleted successfully"
    });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};



const getProjectsByStatus = async (req, res) => {
  const { status } = req.query;

  try {
    let query = `
      SELECT 
        p.*, 
        c.clientName,
        t.taskName AS task_name,
        l.languageName AS language_name,
        a.applicationName AS application_name,
        m.fullName AS full_name
      FROM projects p
      LEFT JOIN clients c ON p.clientId = c.id
      LEFT JOIN tasks t ON p.taskId = t.id
      LEFT JOIN language l ON p.languageId = l.id
      LEFT JOIN application a ON p.applicationId = a.id
      LEFT JOIN members m ON p.projectManagerId = m.id
    `;

    const params = [];

    if (status && status !== 'All') {
      query += ` WHERE LOWER(p.status) = LOWER(?)`;
      params.push(status);
    }

    const [rows] = await db.query(query, params);

    res.status(200).json({
      status: true,
      message: `Projects fetched${status ? ' with status: ' + status : ''}`,
      data: rows
    });

  } catch (error) {
    console.error("Error fetching projects:", error.message);
    res.status(500).json({ status: false, message: error.message });
  }
};




const getFilteredProjects = async (req, res) => {
  const { status = 'All', application = 'All' } = req.query;

  try {
    let query = `
      SELECT 
        p.*, 
        c.clientName,
        t.taskName AS task_name,
        l.languageName AS language_name,
        a.applicationName AS application_name,
        m.fullName AS full_name
      FROM projects p
      LEFT JOIN clients c ON p.clientId = c.id
      LEFT JOIN tasks t ON p.taskId = t.id
      LEFT JOIN language l ON p.languageId = l.id
      LEFT JOIN application a ON p.applicationId = a.id
      LEFT JOIN members m ON p.projectManagerId = m.id
      WHERE 1 = 1
    `;

    const params = [];

    if (status !== 'All') {
      query += ` AND LOWER(p.status) = LOWER(?)`;
      params.push(status);
    }

    if (application !== 'All') {
      query += ` AND LOWER(a.applicationName) = LOWER(?)`;
      params.push(application);
    }

    const [rows] = await db.query(query, params);

    res.status(200).json({
      status: true,
      message: 'Projects fetched successfully',
      data: rows
    });

  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

const getProjectsByManagerId = async (req, res) => {
  const { projectManagerId } = req.params;

  try {
    const [projects] = await db.query(
      `SELECT * FROM projects WHERE projectManagerId = ?`,
      [projectManagerId]
    );

    res.status(200).json({
      status: true,
      message: "Projects fetched successfully",
      total: projects.length,
      projects: projects
    });
  } catch (error) {
    console.error('Error fetching projects by managerId:', error);
    res.status(500).json({ status: false, message: error.message });
  }
};




module.exports = { addProject, getAllProjects, getProjectById, updateProject, deleteProject, getProjectsByStatus, getFilteredProjects, getProjectsByManagerId };
