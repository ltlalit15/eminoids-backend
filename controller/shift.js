const db = require('../config');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const multer = require('multer');
require('dotenv').config();
const path = require('path');
const nodemailer = require('nodemailer');



const createShift = async (req, res) => {
  const { memberId, shiftDate, startTime, endTime, shiftType, notes } = req.body;

  try {
    const [result] = await db.query(
      `INSERT INTO shifts (memberId, shiftDate, startTime, endTime, shiftType, notes)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [memberId, shiftDate, startTime, endTime, shiftType, notes]
    );

    const [shift] = await db.query(`SELECT * FROM shifts WHERE id = ?`, [result.insertId]);

    res.status(201).json({
      status: true,
      message: "Shift created successfully",
      data: shift[0]
    });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};


const getAllShifts = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        s.id,
        s.memberId,
        m.fullName,
        s.shiftDate,
        s.startTime,
        s.endTime,
        s.shiftType,
        s.notes,
        s.createdAt
      FROM shifts s
      JOIN members m ON s.memberId = m.id
      
    `);

    res.status(200).json({
      status: true,
      message: "All shift data retrieved successfully",
      data: rows
    });

  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};


const getShiftById = async (req, res) => {
  const { id } = req.params;

  try {
    const [rows] = await db.query(`SELECT * FROM shifts WHERE id = ?`, [id]);
    if (!rows.length) {
      return res.status(404).json({ status: false, message: "Shift not found" });
    }

    res.status(200).json({ status: true, message: "Single shift data reterived successfully", data: rows[0] });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};



const updateShift = async (req, res) => {
  const { id } = req.params;
  const { memberId, shiftDate, startTime, endTime, shiftType, notes } = req.body;

  try {
    const [result] = await db.query(
      `UPDATE shifts 
       SET memberId = ?, shiftDate = ?, startTime = ?, endTime = ?, shiftType = ?, notes = ? 
       WHERE id = ?`,
      [memberId, shiftDate, startTime, endTime, shiftType, notes, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ status: false, message: "Shift not found or unchanged" });
    }

    const [updated] = await db.query(`SELECT * FROM shifts WHERE id = ?`, [id]);

    res.json({ status: true, message: "Shift updated successfully", data: updated[0] });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};


const deleteShift = async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await db.query(`DELETE FROM shifts WHERE id = ?`, [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ status: false, message: "Shift not found" });
    }

    res.json({ status: true, message: "Shift deleted successfully" });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};


module.exports = { createShift, getAllShifts, getShiftById, updateShift, deleteShift };



