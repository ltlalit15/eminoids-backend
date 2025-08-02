const db = require('../config');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const multer = require('multer');
require('dotenv').config();
const path = require('path');
const nodemailer = require('nodemailer');
const cloudinary = require('cloudinary').v2;


const getManagerDashboardData = async (req, res) => {
  const { memberId } = req.params;

  try {
    // Total Projects
    const [totalProjectsCount] = await db.query(`
      SELECT COUNT(*) AS count 
      FROM projects 
      WHERE projectManagerId = ?
    `, [memberId]);

    // Active Projects
    const [activeProjectsCount] = await db.query(`
      SELECT COUNT(*) AS count 
      FROM projects 
      WHERE status = 'Active' 
      AND projectManagerId = ?
    `, [memberId]);

    const [activeProjects] = await db.query(`
      SELECT * 
      FROM projects 
      WHERE status = 'Active' 
      AND projectManagerId = ?
      ORDER BY id DESC
    `, [memberId]);

    // Near Due Projects (next 2 days)
    const [nearDueCount] = await db.query(`
      SELECT COUNT(*) AS count 
      FROM projects 
      WHERE status = 'Active' 
      AND projectManagerId = ? 
      AND DATEDIFF(deadline, CURDATE()) BETWEEN 0 AND 2
    `, [memberId]);

    const [nearDueProjects] = await db.query(`
      SELECT * 
      FROM projects 
      WHERE status = 'Active' 
      AND projectManagerId = ? 
      AND DATEDIFF(deadline, CURDATE()) BETWEEN 0 AND 2
      ORDER BY deadline ASC
    `, [memberId]);

    // Overdue Projects
    const [overdueCount] = await db.query(`
      SELECT COUNT(*) AS count 
      FROM projects 
      WHERE status = 'Active' 
      AND projectManagerId = ? 
      AND deadline < CURDATE()
    `, [memberId]);

    const [overdueProjects] = await db.query(`
      SELECT * 
      FROM projects 
      WHERE status = 'Active' 
      AND projectManagerId = ? 
      AND deadline < CURDATE()
      ORDER BY deadline ASC
    `, [memberId]);

    // Events created today by this member (correct usage)
    const [eventsTodayCount] = await db.query(`
      SELECT COUNT(*) AS count 
      FROM events 
      WHERE DATE(eventDate) = CURDATE() 
      AND createdAt = ?
    `, [memberId]);

    const [eventsToday] = await db.query(`
      SELECT * 
      FROM events 
      WHERE DATE(eventDate) = CURDATE() 
      AND createdAt = ?
      
    `, [memberId]);

    // Final response
    res.status(200).json({
      status: true,
      message: 'Manager dashboard data fetched successfully',
      data: {
        totalProjectsCount: totalProjectsCount[0].count,

        activeProjectsCount: activeProjectsCount[0].count,
        activeProjects: activeProjects,

        nearDueCount: nearDueCount[0].count,
        nearDueProjects: nearDueProjects,

        overdueCount: overdueCount[0].count,
        overdueProjects: overdueProjects,

        eventsTodayCount: eventsTodayCount[0].count,
        eventsToday: eventsToday
      }
    });

  } catch (error) {
    console.error('Manager Dashboard API Error:', error);
    res.status(500).json({ status: false, message: error.message });
  }
};




module.exports = {getManagerDashboardData}
