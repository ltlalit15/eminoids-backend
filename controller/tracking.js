const db = require('../config');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const multer = require('multer');
require('dotenv').config();
const path = require('path');
const nodemailer = require('nodemailer');


const startTracking = async (req, res) => {
  const { taskId, memberId } = req.body;

  try {
    // check if any task is already running for this member
    const [existing] = await db.query(`
      SELECT * FROM tasktracking 
      WHERE memberId = ? AND status = 'Running' 
     `, [memberId]);

    if (existing.length > 0) {
      return res.status(400).json({ status: false, message: "You already have a running task." });
    }

    await db.query(`
      INSERT INTO tasktracking (taskId, memberId, startTime, status)
      VALUES (?, ?, NOW(), 'Running')`, 
      [taskId, memberId]);

    res.status(200).json({ status: true, message: "Tracking started." });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};




const pauseTracking = async (req, res) => {
  const { taskId, memberId } = req.body;

  try {
    const [rows] = await db.query(`
      SELECT * FROM tasktracking 
      WHERE taskId = ? AND memberId = ? AND status = 'Running' 
     `, [taskId, memberId]);

    if (rows.length === 0) {
      return res.status(404).json({ status: false, message: "No running task found to pause." });
    }

    const trackingId = rows[0].id;

    await db.query(`
      UPDATE tasktracking 
      SET endTime = NOW(), status = 'Paused', 
          totalTime = TIMESTAMPDIFF(SECOND, startTime, NOW()) / 3600
      WHERE id = ?`, [trackingId]);

    res.status(200).json({ status: true, message: "Tracking paused." });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};


const stopTracking = async (req, res) => {
  const { taskId, memberId } = req.body;

  try {
    const [rows] = await db.query(`
      SELECT * FROM tasktracking 
      WHERE taskId = ? AND memberId = ? AND status = 'Running' 
      `, [taskId, memberId]);

    if (rows.length === 0) {
      return res.status(404).json({ status: false, message: "No running task found to stop." });
    }

    const trackingId = rows[0].id;

    await db.query(`
      UPDATE tasktracking 
      SET endTime = NOW(), status = 'Stopped', 
          totalTime = TIMESTAMPDIFF(SECOND, startTime, NOW()) / 3600
      WHERE id = ?`, [trackingId]);

    res.status(200).json({ status: true, message: "Tracking stopped." });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};



const getActiveTracking = async (req, res) => {
  const { memberId } = req.params;

  try {
    const [rows] = await db.query(`
      SELECT * FROM tasktracking 
      WHERE memberId = ? AND status = 'Running' 
     `, [memberId]);

    res.status(200).json({ status: true, message: "Reterived data", data: rows[0] || null });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};


const getAllTracking = async (req, res) => {
  const { memberId } = req.params;

  try {
    const [rows] = await db.query(`
      SELECT * FROM tasktracking 
      WHERE memberId = ? 
      `, [memberId]);

    res.status(200).json({ status: true, message: "Reterived data", data: rows });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};


module.exports = {startTracking, pauseTracking, stopTracking, getActiveTracking, getAllTracking}
