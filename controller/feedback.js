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
        ap.projectName,
        m.fullName AS owner,
        p.status,
        p.priority,
        p.qcDueDate
      FROM projects p
      LEFT JOIN assigned_projects ap ON ap.projectName = p.projectTitle
      LEFT JOIN members m ON p.projectManagerId = m.id
    `);

    res.status(200).json({ status: true, message: "Retrieved data", data: rows });
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
        u.role AS manager,
        f.resolution
      FROM feedback f
      LEFT JOIN projects p ON f.projectId = p.id
      LEFT JOIN members m ON f.memberId = m.id
      LEFT JOIN users u ON f.userId = u.id
     
    `);

    res.status(200).json({
      status: true,
      message: "Reterived Data",
      data: rows
    });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

const getTeamPerformance = async (req, res) => {
  try {
    const [members] = await db.query(`
      SELECT id, empId, fullName, role, team
      FROM members
      WHERE status = 'active'
    `);

    // Add mock performance data for now
    const performanceData = {
      "1": { completedTasks: 48, onTime: "92%", netHours: "160h", activeHours: "145h", qaFailed: 0 },
      "2": { completedTasks: 42, onTime: "88%", netHours: "155h", activeHours: "135h", qaFailed: 0 },
      "3": { completedTasks: 35, onTime: "85%", netHours: "140h", activeHours: "120h", qaFailed: 2 },
      "4": { completedTasks: 38, onTime: "90%", netHours: "150h", activeHours: "125h", qaFailed: null },
      "5": { completedTasks: 30, onTime: "78%", netHours: "135h", activeHours: "112h", qaFailed: null },
    };

    const result = members.map(member => {
      const perf = performanceData[member.empId] || {};
      const performanceTag =
        perf.qaFailed === 0 && parseInt(perf.onTime) >= 90
          ? "Top Performer"
          : perf.qaFailed === 0
          ? "High Performer"
          : perf.qaFailed > 1
          ? "Good Performer"
          : "Average Performer";

      return {
        ...member,
        completedTasks: perf.completedTasks || 0,
        onTimePercent: perf.onTime || "0%",
        netLoggedHours: perf.netHours || "0h",
        taskActiveHours: perf.activeHours || "0h",
        qaFailed: perf.qaFailed ?? "-",
        performanceTag,
      };
    });

    res.json(result);
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};





module.exports = {addFeedback, getAllFeedback, getFeedbackById, updateFeedback, deleteFeedback, getProjectStatusReport, getFeedbackLog, getTeamPerformance}
