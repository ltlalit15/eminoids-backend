const db = require('../config');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const multer = require('multer');
require('dotenv').config();
const path = require('path');
const nodemailer = require('nodemailer');

const cloudinary = require('cloudinary').v2;

// Cloudinary Configuration
cloudinary.config({
    cloud_name: 'dkqcqrrbp',
    api_key: '418838712271323',
    api_secret: 'p12EKWICdyHWx8LcihuWYqIruWQ'
});


// ✅ Add Assigned Project
const addAssignedProject = async (req, res) => {
  const { projectName, status, dueDate, priority, description, memberId } = req.body;

  try {
    const [insert] = await db.query(
      `INSERT INTO assigned_projects (projectName, status, dueDate, priority, description, memberId)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [projectName, status, dueDate, priority, description, memberId]
    );

    const [project] = await db.query(
      `SELECT * FROM assigned_projects WHERE id = ?;`,
      [insert.insertId]
    );

    res.status(201).json({ status: true, message: "Assigned Projects added successfully", data: project[0] });
  } catch (error) {
    console.error("❌ Error adding project:", error);
    res.status(500).json({ status: false, message: "Failed to add project", error: error.message });
  }
};

// ✅ Get All Assigned Projects
const getAllAssignedProjects = async (req, res) => {
  try {
     const [rows] = await db.query(
      `SELECT ap.*, m.fullName 
       FROM assigned_projects ap
       JOIN members m ON ap.memberId = m.id`
    );

    res.status(200).json({ status: true, message: "Assigned Projects data",  data: rows });
  } catch (error) {
    console.error("❌ Error fetching projects:", error);
    res.status(500).json({ status: false, message: "Failed to get projects", error: error.message });
  }
};

const getAssignedProjectById = async (req, res) => {
  const { id } = req.params;

  try {
    const [rows] = await db.query(
      `SELECT * FROM assigned_projects WHERE id = ?;`,
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ status: false, message: "Project not found" });
    }

    res.status(200).json({ status: true, message: "Single data", data: rows[0] });
  } catch (error) {
    console.error("❌ Error fetching project by ID:", error);
    res.status(500).json({ status: false, message: "Failed to get project", error: error.message });
  }
};


// ✅ Update Assigned Project (PATCH)
const updateAssignedProject = async (req, res) => {
  const { id } = req.params;
  const { projectName, status, dueDate, priority, description, memberId } = req.body;

  try {
    const [updateResult] = await db.query(
      `UPDATE assigned_projects 
       SET projectName = ?, status = ?, dueDate = ?, priority = ?, description = ?, memberId = ?
       WHERE id = ?`,
      [projectName, status, dueDate, priority, description, memberId, id]
    );

    if (updateResult.affectedRows === 0) {
      return res.status(404).json({ status: false, message: "Project not found or no changes made" });
    }

    const [updated] = await db.query(
      `SELECT * FROM assigned_projects WHERE id = ?`,
      [id]
    );

    res.status(200).json({ status: true, message: "Project updated successfully", affectedRows: updateResult.affectedRows,  data: updated[0] });
  } catch (error) {
    console.error("❌ Error updating project:", error);
    res.status(500).json({ status: false, message: "Failed to update project", error: error.message });
  }
};

// ✅ Delete Assigned Project
const deleteAssignedProject = async (req, res) => {
  const { id } = req.params;

  try {
    const [deleteResult] = await db.query(`DELETE FROM assigned_projects WHERE id = ?`, [id]);

    if (deleteResult.affectedRows === 0) {
      return res.status(404).json({ status: false, message: "Project not found" });
    }

    res.status(200).json({ status: true, message: "Project deleted successfully" });
  } catch (error) {
    console.error("❌ Error deleting project:", error);
    res.status(500).json({ status: false, message: "Failed to delete project", error: error.message });
  }
};



module.exports = { addAssignedProject, getAllAssignedProjects, getAssignedProjectById, updateAssignedProject, deleteAssignedProject };
