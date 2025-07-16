const db = require('../config');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const multer = require('multer');
require('dotenv').config();
const path = require('path');
const nodemailer = require('nodemailer');




const addGroupMessage = async (req, res) => {
  const {
    groupId,
    groupName,
    memberId,
    memberName,
    role,
    message,
    replyTo,
    reaction
  } = req.body;

  try {
    // Save reaction as JSON
    const [result] = await db.query(
      `INSERT INTO groupchat 
      (groupId, groupName, memberId, memberName, role, message, replyTo, reaction) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        groupId,
        groupName,
        memberId,
        memberName,
        role,
        message,
        replyTo,
        reaction ? JSON.stringify(reaction) : null
      ]
    );

    const [row] = await db.query(`SELECT * FROM groupchat WHERE id = ?`, [result.insertId]);

    // 👇 Parse the reaction field back into object/array
    if (row[0].reaction) {
      try {
        row[0].reaction = JSON.parse(row[0].reaction);
      } catch (e) {
        row[0].reaction = null; // fallback if invalid
      }
    }

    // 🔥 Emit socket event
    const io = req.app.get('io');
    io.emit('new_group_message', row[0]);

    // ✅ Clean JSON response
    res.status(201).json({
      status: true,
      message: "Message sent successfully",
      data: row[0]
    });

  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};




const getAllGroupMessages = async (req, res) => {
  try {
    const [rows] = await db.query(`SELECT * FROM groupchat ORDER BY createdAt ASC`);

    // 👇 Parse reaction from string to JSON
    const parsedRows = rows.map(row => {
      if (row.reaction) {
        try {
          row.reaction = JSON.parse(row.reaction);
        } catch (e) {
          row.reaction = null;
        }
      }
      return row;
    });

    res.status(200).json({
      status: true,
      message: "All group messages fetched",
      data: parsedRows
    });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};




const getGroupMessageById = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.query(`SELECT * FROM groupchat WHERE id = ?`, [id]);
    if (rows.length === 0) {
      return res.status(404).json({ status: false, message: "Message not found" });
    }

    // 👇 Parse reaction if exists
    if (rows[0].reaction) {
      try {
        rows[0].reaction = JSON.parse(rows[0].reaction);
      } catch (e) {
        rows[0].reaction = null;
      }
    }

    res.status(200).json({
      status: true,
      message: "Message fetched successfully",
      data: rows[0]
    });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};




const updateGroupMessage = async (req, res) => {
  const { id } = req.params;
  const {
    message,
    reaction,
    replyTo,
    groupName,
    memberName
  } = req.body;

  try {
    const [result] = await db.query(
      `UPDATE groupchat SET 
        message = ?, 
        reaction = ?, 
        replyTo = ?, 
        groupName = ?, 
        memberName = ? 
      WHERE id = ?`,
      [message, JSON.stringify(reaction), replyTo, groupName, memberName, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ status: false, message: "Message not found or not updated" });
    }

    const [rows] = await db.query(`SELECT * FROM groupchat WHERE id = ?`, [id]);

    if (rows[0].reaction) {
      try {
        rows[0].reaction = JSON.parse(rows[0].reaction);
      } catch (e) {
        rows[0].reaction = null;
      }
    }

    const io = req.app.get('io');
    io.emit('update_group_message', rows[0]);

    res.status(200).json({
      status: true,
      message: "Message updated successfully",
      data: rows[0]
    });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};





const deleteGroupMessage = async (req, res) => {
  const { id } = req.params;

  try {
    await db.query(`DELETE FROM groupchat WHERE id = ?`, [id]);

    const io = req.app.get('io');
    io.emit('delete_group_message', { id }); // Notify clients to remove it

    res.status(200).json({
      status: true,
      message: "Message deleted successfully",
      id
    });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};




module.exports = {addGroupMessage, getAllGroupMessages, getGroupMessageById, updateGroupMessage, deleteGroupMessage}



