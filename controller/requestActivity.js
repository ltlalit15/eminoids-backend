const db = require('../config');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const multer = require('multer');
require('dotenv').config();
const path = require('path');
const nodemailer = require('nodemailer');


const addActionRequest = async (req, res) => {
  try {
    const {
      requestType,
      fromRole,
      toRole,
      requesterName,
      message,
      status // ✅ now dynamic
    } = req.body;

    
    // Insert the new request
    const [insertResult] = await db.query(`
      INSERT INTO actionrequests 
      (requestType, fromRole, toRole, requesterName, message, status) 
      VALUES (?, ?, ?, ?, ?, ?)
    `, [requestType, fromRole, toRole, requesterName, message, status]);

    const insertedId = insertResult.insertId;

    // Fetch and return inserted row
    const [rows] = await db.query(`
      SELECT * FROM actionrequests WHERE id = ?
    `, [insertedId]);

    res.status(201).json({
      status: true,
      message: 'Request added successfully',
      request: rows[0]
    });

  } catch (error) {
    console.error('Add Action Request Error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};



const getPendingRequests = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT * FROM actionrequests
      WHERE LOWER(status) = 'pending'
      
    `);

    res.status(200).json({
      status: true,
      total: rows.length,
      pendingRequests: rows
    });

  } catch (error) {
    console.error('Error fetching pending requests:', error);
    res.status(500).json({ status: false, message: 'Internal Server Error' });
  }
};

const updateRequestStatus = async (req, res) => {
  try {
    const { id } = req.params;
    let { status } = req.body;

    // Convert to proper case (first letter capital)
    status = status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();

    const allowedStatuses = ['Approved', 'Rejected'];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status. Must be Approved or Rejected.' });
    }

    // Update request
    const [result] = await db.query(
      `UPDATE actionrequests SET status = ? WHERE id = ?`,
      [status, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Request not found.' });
    }

    // Get all grouped requests after update
    const [teamToManager] = await db.query(`
      SELECT * FROM actionrequests 
      WHERE fromRole = 'Team Member' AND toRole = 'Manager' AND LOWER(status) = ?
      
    `, [status.toLowerCase()]);

    const [managerToAdmin] = await db.query(`
      SELECT * FROM actionrequests 
      WHERE fromRole = 'Manager' AND toRole = 'Admin' AND LOWER(status) = ?
     
    `, [status.toLowerCase()]);

    res.status(200).json({
      status: true,
      message: `Request ${status.toLowerCase()} successfully`,
      data: {
        teamToManagerRequests: teamToManager,
        managerToAdminRequests: managerToAdmin
      }
    });

  } catch (error) {
    console.error('Error updating status:', error);
    res.status(500).json({ status: false, message: 'Internal Server Error' });
  }
};

const getAllReviewedRequests = async (req, res) => {
  try {
    const [approvedRequests] = await db.query(`
      SELECT * FROM actionrequests
      WHERE LOWER(status) = 'approved'
    `);

    const [rejectedRequests] = await db.query(`
      SELECT * FROM actionrequests
      WHERE LOWER(status) = 'rejected'
    `);

    res.status(200).json({
      status: true,
      message: "Approved and Rejected requests fetched successfully",
      totalApproved: approvedRequests.length,
      totalRejected: rejectedRequests.length,
      data: {
        approvedRequests,
        rejectedRequests
      }
    });
  } catch (error) {
    console.error("Error fetching approved/rejected requests:", error);
    res.status(500).json({ status: false, message: "Internal Server Error" });
  }
};




module.exports = {addActionRequest, getPendingRequests, updateRequestStatus, getAllReviewedRequests};
