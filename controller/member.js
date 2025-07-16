const db = require('../config');
const bcrypt = require('bcrypt');

const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const multer = require('multer');
require('dotenv').config();
const path = require('path');
const nodemailer = require('nodemailer');
const cloudinary = require('cloudinary').v2;

const logActivity = require('../utils/logActivity')

// // Cloudinary Configuration
// cloudinary.config({
//     cloud_name: 'dkqcqrrbp',
//     api_key: '418838712271323',
//     api_secret: 'p12EKWICdyHWx8LcihuWYqIruWQ'
// });



const saltRounds = 10;

const addMember = async (req, res) => {
  const {
    empId,
    fullName,
    doj,
    dob,
    team,
    role,
    appSkills,
    username,
    password
  } = req.body;

  try {
    console.log("📥 Received data:", req.body);
    // 🔐 Hash the password
    const hashedPassword = await bcrypt.hash(password, saltRounds);
     console.log("🔐 Password hashed successfully");

    const [result] = await db.query(
      `INSERT INTO members 
      (empId, fullName, doj, dob, team, role, appSkills, username, password) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [empId, fullName, doj, dob, team, role, appSkills, username, hashedPassword]
    );
     console.log("✅ Member inserted with ID:", result.insertId);

    const [row] = await db.query(`SELECT * FROM members WHERE id = ?`, [result.insertId]);
    console.log("📦 Member data fetched:", row[0]);

    // ✅ Log activity
    await logActivity(req, result.insertId, "Member Created", "Member Management");
    console.log("📝 Activity log added for member ID:", result.insertId);

    res.status(201).json({
      status: true,
      message: "Member added successfully",
      data: row[0]
    });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};


const getAllMembers = async (req, res) => {
  try {
    const [rows] = await db.query(`SELECT * FROM members`);
    res.json({ status: true, message: "Members fetched successfully", data: rows });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};


const getMemberById = async (req, res) => {
  const { id } = req.params;

  try {
    const [rows] = await db.query(`SELECT * FROM members WHERE id = ?`, [id]);

    if (rows.length === 0) {
      return res.status(404).json({ status: false, message: "Member not found" });
    }

    res.json({ status: true, message: "Single Members fetched successfully", data: rows[0] });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

const updateMember = async (req, res) => {
  const { id } = req.params;
  const {
    empId,
    fullName,
    doj,
    dob,
    team,
    role,
    appSkills,
    username,
    password
  } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const [result] = await db.query(
      `UPDATE members 
       SET empId = ?, fullName = ?, doj = ?, dob = ?, team = ?, role = ?, appSkills = ?, username = ?, password = ?
       WHERE id = ?`,
      [empId, fullName, doj, dob, team, role, appSkills, username, hashedPassword, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ status: false, message: "Member not found or no changes made" });
    }

    const [rows] = await db.query(`SELECT * FROM members WHERE id = ?`, [id]);

     // ✅ Log activity
    await logActivity(req, id, "Member Updated", "Member Management");

    res.json({ status: true, message: "Member updated successfully", data: rows[0] });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};



const deleteMember = async (req, res) => {
  const { id } = req.params;

  try {
    const [check] = await db.query(`SELECT * FROM members WHERE id = ?`, [id]);
    if (check.length === 0) {
      return res.status(404).json({ status: false, message: "Member not found" });
    }

    await db.query(`DELETE FROM members WHERE id = ?`, [id]);
    
    // ✅ Log activity
    await logActivity(req, id, "Member Deleted", "Member Management");

    res.json({ status: true, message: "Member deleted successfully" });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};



const getFilteredMembers = async (req, res) => {
  const { team = 'All' } = req.query;

  try {
    let query = `SELECT id, empId, fullName, team, role FROM members`;
    const values = [];

    if (team !== 'All') {
      query += ` WHERE team = ?`;
      values.push(team);
    }

    const [rows] = await db.query(query, values);

    res.status(200).json({
      status: true,
      message: 'Members fetched successfully',
      data: rows
    });

  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};



const updateMemberStatus = async (req, res) => {
  const { id } = req.params;
  const {
    empId,
    status
  } = req.body;

  try {
    // const hashedPassword = await bcrypt.hash(password, saltRounds);

    const [result] = await db.query(
      `UPDATE members 
       SET empId = ?, status = ?
       WHERE id = ?`,
      [empId, status, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ status: false, message: "Member not found or no changes made" });
    }

    const [rows] = await db.query(`SELECT * FROM members WHERE id = ?`, [id]);

     // ✅ Log activity
    await logActivity(req, id, "Member Status Updated", "Member Management");

    res.json({ status: true, message: "Member updated successfully", data: rows[0] });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};





module.exports = { addMember, getAllMembers, getMemberById, updateMember, deleteMember, getFilteredMembers, updateMemberStatus };