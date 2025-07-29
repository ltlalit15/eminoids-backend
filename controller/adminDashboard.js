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
    const [activeProjectsList] = await db.query(`
      SELECT * 
      FROM projects 
      WHERE status = 'Active'
    `);
    const activeProjectsCount = activeProjectsList.length;

    // Near Due Projects (due in next 2 days)
    const [nearDueList] = await db.query(`
      SELECT * 
      FROM projects 
      WHERE status = 'Active' 
      AND DATEDIFF(deadline, CURDATE()) BETWEEN 0 AND 2
    `);
    const nearDueCount = nearDueList.length;

    // Overdue Projects
    const [overdueList] = await db.query(`
      SELECT * 
      FROM projects 
      WHERE status = 'Active' 
      AND deadline < CURDATE()
    `);
    const overdueCount = overdueList.length;

    // Team On-Duty (assuming all members are on duty)
    const [onDutyList] = await db.query(`
      SELECT id, fullName, role, team 
      FROM members
    `);
    const onDutyCount = onDutyList.length;

    // Events Today
    const [eventsTodayList] = await db.query(`
      SELECT * 
      FROM events 
      WHERE DATE(eventDate) = CURDATE()
    `);
    const eventsTodayCount = eventsTodayList.length;

    res.status(200).json({
      status: true,
      message: 'Admin dashboard data fetched successfully',
      data: {
        activeProjects: {
          count: activeProjectsCount,
          list: activeProjectsList
        },
        nearDue: {
          count: nearDueCount,
          list: nearDueList
        },
        overdue: {
          count: overdueCount,
          list: overdueList
        },
        onDuty: {
          count: onDutyCount,
          list: onDutyList
        },
        eventsToday: {
          count: eventsTodayCount,
          list: eventsTodayList
        }
      }
    });

  } catch (error) {
    console.error('Dashboard API Error:', error);
    res.status(500).json({ status: false, message: error.message });
  }
};


module.exports = { getAdminDashboardData };




  

