const db = require('../config');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const multer = require('multer');
require('dotenv').config();
const path = require('path');
const nodemailer = require('nodemailer');

const addGymTask = async (req, res) => {
    const {
      memberId,
      dueDate,
      taskTypeId,
      description,
      instruction,
         
      userId,
       status,
    } = req.body;
  
    try {
      const [result] = await db.query(
        `INSERT INTO taskgym 
          (memberId, dueDate, taskTypeId, description, instruction, userId, status)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          memberId,
          dueDate,
          taskTypeId,
          description,
          instruction,
           userId,
           status
        ]
      );

      const [insertedGymTask] = await db.query(
        `SELECT * FROM taskgym WHERE id = ?`,
        [result.insertId]
      );
  
      res.status(201).json({
        status: true,
        message: "Task added successfully",
        task: insertedGymTask[0]
      });
  
    } catch (error) {
      console.error("Add Task Error:", error);
      res.status(500).json({ status: false, message: "Failed to add task" });
    }
  };


const getAllGymTask = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        taskgym.*, 
        member.firstName AS member_firstName, 
        member.lastName AS member_lastName, 
        tasktype.name AS tasktype_name,
        user.fullName AS user_fullName
      FROM taskgym
      LEFT JOIN member ON taskgym.memberId = member.id
      LEFT JOIN tasktype ON taskgym.taskTypeId = tasktype.id
      LEFT JOIN user ON taskgym.userId = user.id
    `);

    res.status(200).json({ 
      status: true, 
      message: "retrieved all data", 
      taskgym: rows 
    });
  } catch (error) {
    res.status(500).json({ 
      status: false, 
      message: error.message 
    });
  }
};


  const getGymTaskById = async (req, res) => {
    const { id } = req.params;
  
    try {
      const [rows] = await db.query(`SELECT * FROM taskgym WHERE id = ?`, [id]);
  
      if (rows.length === 0) {
        return res.status(404).json({ status: false, message: "Task not found" });
      }
  
      res.status(200).json({
        status: true,
        message: "Task retrieved successfully",
        task: rows[0],
      });
    } catch (error) {
      res.status(500).json({ status: false, message: error.message });
    }
  };


  const updateGymTask = async (req, res) => {
  const { id } = req.params;  // id URL parameter se milega
  const {
    memberId,
    dueDate,
    taskTypeId,
    description,
    instruction,
    userId,
    status,
  } = req.body;

  if (!id) {
    return res.status(400).json({ status: false, message: "Task ID is required in URL params" });
  }

  try {
    // Update query
    await db.query(
      `UPDATE taskgym SET 
        memberId = ?, 
        dueDate = ?, 
        taskTypeId = ?, 
        description = ?, 
        instruction = ?, 
        userId = ?, 
        status = ?
      WHERE id = ?`,
      [
        memberId,
        dueDate,
        taskTypeId,
        description,
        instruction,
        userId,
        status,
        id
      ]
    );

    // Updated record fetch karo
    const [updatedTask] = await db.query(
      `SELECT * FROM taskgym WHERE id = ?`,
      [id]
    );

    if (updatedTask.length === 0) {
      return res.status(404).json({ status: false, message: "Task not found" });
    }

    res.status(200).json({
      status: true,
      message: "Task updated successfully",
      task: updatedTask[0]
    });

  } catch (error) {
    console.error("Update Task Error:", error);
    res.status(500).json({ status: false, message: "Failed to update task" });
  }
};

  
  


module.exports = { addGymTask, getAllGymTask, getGymTaskById, updateGymTask };