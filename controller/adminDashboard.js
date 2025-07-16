const db = require('../config');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const multer = require('multer');
require('dotenv').config();
const path = require('path');
const nodemailer = require('nodemailer');
const cloudinary = require('cloudinary').v2;


const getAdminDashboardData = async (req, res) => {
  try {
    // Active Projects
    const [activeProjects] = await db.query(`
      SELECT COUNT(*) AS count 
      FROM projects 
      WHERE status = 'Active'
    `);

    // Near Due (projects due in next 2 days)
    const [nearDue] = await db.query(`
      SELECT COUNT(*) AS count 
      FROM projects 
      WHERE status = 'Active' 
      AND DATEDIFF(deadline, CURDATE()) BETWEEN 0 AND 2
    `);

    // Overdue Projects
    const [overdue] = await db.query(`
      SELECT COUNT(*) AS count 
      FROM projects 
      WHERE status = 'Active' 
      AND deadline < CURDATE()
    `);

    // Team On-Duty (assuming all members are on duty — adjust logic if needed)
    const [onDuty] = await db.query(`
      SELECT COUNT(*) AS count 
      FROM members
    `);

    // Events Today (correct table: `events`)
    const [eventsToday] = await db.query(`
      SELECT COUNT(*) AS count 
      FROM events 
      WHERE DATE(eventDate) = CURDATE()
    `);

    res.status(200).json({
      status: true,
      message: 'Admin dashboard data fetched successfully',
      data: {
        activeProjects: activeProjects[0].count,
        nearDue: nearDue[0].count,
        overdue: overdue[0].count,
        onDuty: onDuty[0].count,
        eventsToday: eventsToday[0].count,
        //pendingApproval: 0 // approval table not present, so 0 or remove as needed
      }
    });

  } catch (error) {
    console.error('Dashboard API Error:', error);
    res.status(500).json({ status: false, message: error.message });
  }
};

module.exports = { getAdminDashboardData };




  

