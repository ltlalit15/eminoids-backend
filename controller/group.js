const db = require('../config');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const multer = require('multer');
require('dotenv').config();
const path = require('path');
const nodemailer = require('nodemailer');

const createGroup = async (req, res) => {
  const { name, description, createdBy } = req.body;

  try {
    const [result] = await db.query(
      `INSERT INTO groups (name, description, createdBy) VALUES (?, ?, ?)`,
      [name, description, createdBy]
    );

    const [rows] = await db.query(`SELECT * FROM groups WHERE id = ?`, [result.insertId]);

    const io = req.app.get('io');
    io.emit('group_created', rows[0]);

    res.status(201).json({
      status: true,
      message: 'Group created successfully',
      data: rows[0]
    });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};




  const getAllGroups = async (req, res) => {
  try {
    const [rows] = await db.query(`SELECT * FROM groups`);
    res.status(200).json({
      status: true,
      message: 'Groups fetched successfully',
      data: rows
    });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};



const getGroupById = async (req, res) => {
  const { id } = req.params;

  try {
    const [rows] = await db.query(`SELECT * FROM groups WHERE id = ?`, [id]);

    if (rows.length === 0) {
      return res.status(404).json({ status: false, message: "Group not found" });
    }

    res.status(200).json({
      status: true,
      message: 'Group fetched successfully',
      data: rows[0]
    });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};


const updateGroup = async (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;

  try {
    const [result] = await db.query(
      `UPDATE groups SET name = ?, description = ? WHERE id = ?`,
      [name, description, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ status: false, message: "Group not found or not updated" });
    }

    const [rows] = await db.query(`SELECT * FROM groups WHERE id = ?`, [id]);

    const io = req.app.get('io');
    io.emit('group_updated', rows[0]);

    res.status(200).json({
      status: true,
      message: 'Group updated successfully',
      data: rows[0]
    });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};
const deleteGroup = async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await db.query(`DELETE FROM groups WHERE id = ?`, [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ status: false, message: "Group not found or already deleted" });
    }

    const io = req.app.get('io');
    io.emit('group_deleted', { id });

    res.status(200).json({
      status: true,
      message: 'Group deleted successfully',
      deletedId: id
    });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};



module.exports = { createGroup, getAllGroups, getGroupById, updateGroup, deleteGroup };