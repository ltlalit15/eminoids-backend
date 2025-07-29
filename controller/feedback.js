const db = require('../config');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const multer = require('multer');
require('dotenv').config();
const path = require('path');
const nodemailer = require('nodemailer');


const addFeedback = async (req, res) => {
  try {
    const {
      projectId,
      month,
      year,
      feedbackDetails,
      memberId,
      userId,
      resolution
    } = req.body;

    // Insert into feedback table
    const [insertResult] = await db.query(
      `INSERT INTO feedback (projectId, month, year, feedbackDetails, memberId, userId, resolution) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [projectId, month, year, feedbackDetails, memberId, userId, resolution]
    );

    const insertedId = insertResult.insertId;

    // Select from feedback (raw)
    const [rawData] = await db.query( 
      `SELECT * FROM feedback WHERE id = ?`,
      [insertedId]
    );

    

    res.status(201).json({
      status: true,
      message: "Feedback added successfully",
      raw: rawData[0]
     
    });

  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};


const getAllFeedback = async (req, res) => {
  try {
    const [feedbacks] = await db.query(`
      SELECT f.*, 
             m.fullName AS memberName, 
             u.role AS managerRole
        FROM feedback f
        LEFT JOIN members m ON f.memberId = m.id
        LEFT JOIN users u ON f.userId = u.id
        
    `);

    res.status(200).json({ status: true, message: "Reterived Data", data: feedbacks });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};


const getFeedbackById = async (req, res) => {
  try {
    const { id } = req.params;

    const [feedback] = await db.query(`
      SELECT * FROM feedback WHERE id = ?
    `, [id]);

    if (feedback.length === 0) {
      return res.status(404).json({ status: false, message: "Feedback not found" });
    }

    res.status(200).json({ status: true, message: "Single Data", data: feedback[0] });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};


const updateFeedback = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      projectId,
      month,
      year,
      feedbackDetails,
      memberId,
      userId,
      resolution
    } = req.body;

    // Update feedback record
    await db.query(
      `UPDATE feedback 
       SET projectId = ?, month = ?, year = ?, feedbackDetails = ?, memberId = ?, userId = ?, resolution = ? 
       WHERE id = ?`,
      [projectId, month, year, feedbackDetails, memberId, userId, resolution, id]
    );

    // Raw data after update
    const [rawData] = await db.query(`SELECT * FROM feedback WHERE id = ?`, [id]);

   

    res.status(200).json({
      status: true,
      message: "Feedback updated successfully",
      raw: rawData[0]
      
    });

  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};


const deleteFeedback = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if feedback exists
    const [existing] = await db.query(`SELECT * FROM feedback WHERE id = ?`, [id]);
    if (existing.length === 0) {
      return res.status(404).json({ status: false, message: "Feedback not found" });
    }

    // Delete the feedback
    await db.query(`DELETE FROM feedback WHERE id = ?`, [id]);

    res.status(200).json({
      status: true,
      message: `Feedback deleted successfully.`,
    });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};


const getProjectStatusReport = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        p.id,
        p.projectTitle,
        m.fullName AS owner,
        p.status,
        p.priority,
        p.qcDueDate
      FROM projects p
      LEFT JOIN members m ON p.projectManagerId = m.id
      
    `);

    res.status(200).json({ status: true, message: "Reterived data", data: rows });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};



const getFeedbackLog = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        f.id,
        p.projectTitle AS project,
        DATE_FORMAT(f.createdAt, '%Y-%m-%d') AS date,
        f.feedbackDetails AS feedback,
        m.fullName AS accountable,
        u.fullName AS manager,
        f.resolution
      FROM feedback f
      LEFT JOIN projects p ON f.projectId = p.id
      LEFT JOIN members m ON f.memberId = m.id
      LEFT JOIN users u ON f.userId = u.id
     
    `);

    res.status(200).json({
      status: true,
      data: rows
    });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};




module.exports = {addFeedback, getAllFeedback, getFeedbackById, updateFeedback, deleteFeedback, getProjectStatusReport, getFeedbackLog}
