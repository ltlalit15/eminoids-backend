const db = require('../config');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const multer = require('multer');
require('dotenv').config();
const path = require('path');
const nodemailer = require('nodemailer');



const getProjectStatusReport = async (req, res) => {
  const { owner = 'All', status = 'All', month = 'Current' } = req.query;

  try {
    let query = `
      SELECT 
        p.id,
        p.projectTitle AS projectName,
        m.fullName AS owner,
        p.status,
        p.deadline,
        p.qcHrs
           
      FROM projects p
      JOIN members m ON p.projectManagerId = m.id
    `;

    const conditions = [];
    const params = [];

    // Filter by owner (member fullName)
    if (owner !== 'All') {
      conditions.push(`LOWER(m.fullName) = LOWER(?)`);
      params.push(owner);
    }

    // Filter by project status
    if (status !== 'All') {
      conditions.push(`p.status = ?`);
      params.push(status);
    }

    // Filter by deadline month
    if (month === 'Current') {
      const now = new Date();
      const firstDay = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`;
      const lastDay = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-31`;

      conditions.push(`p.deadline BETWEEN ? AND ?`);
      params.push(firstDay, lastDay);
    }

    // If any filters exist, add WHERE clause
    if (conditions.length > 0) {
      query += ` WHERE ` + conditions.join(' AND ');
    }

    // Debug: log final query and params
    console.log("📄 Final SQL:", query);
    console.log("📌 Parameters:", params);

    const [rows] = await db.query(query, params);

    res.status(200).json({
      status: true,
      message: 'Project Status Report fetched successfully',
      data: rows
    });

  } catch (error) {
    console.error("❌ Error fetching project report:", error.message);
    res.status(500).json({ status: false, message: error.message });
  }
};





module.exports = { getProjectStatusReport };