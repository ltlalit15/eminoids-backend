const db = require('../config');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const multer = require('multer');
require('dotenv').config();
const path = require('path');
const nodemailer = require('nodemailer');


const addTaskAutomation = async (req, res) => {
  const {
    userId, taskName, staffRequired, abbreviation,
    sortOrder, description, followUp, triggerEvent,
    triggerDescription, triggerDays, performer, actionType,
    taskLifeExpectancy, emailTemplate, emailToMember,
    emailToPerformer, emailAutoSend, smsTemplate,
    smsAutoSend, appNotification, memberTag,
    associatedTag, prospectAction
  } = req.body;

  try {
    const [result] = await db.query(
      `INSERT INTO taskautomation (
        userId, taskName, staffRequired, abbreviation,
        sortOrder, description, followUp, triggerEvent,
        triggerDescription, triggerDays, performer, actionType,
        taskLifeExpectancy, emailTemplate, emailToMember,
        emailToPerformer, emailAutoSend, smsTemplate,
        smsAutoSend, appNotification, memberTag,
        associatedTag, prospectAction
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        userId, taskName, staffRequired, abbreviation,
        sortOrder, description, followUp, triggerEvent,
        triggerDescription, triggerDays, performer, actionType,
        taskLifeExpectancy, emailTemplate, emailToMember,
        emailToPerformer, emailAutoSend, smsTemplate,
        smsAutoSend, appNotification, memberTag,
        associatedTag, prospectAction
      ]
    );

    const [inserted] = await db.query("SELECT * FROM taskautomation WHERE id = ?", [result.insertId]);

    res.status(201).json({
      status: true,
      message: "Task automation added successfully",
      automation: inserted[0]
    });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};


const getAllTaskAutomations = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM taskautomation ORDER BY id DESC");
    res.status(200).json({ status: true, message: "All task automation data", task_automations: rows });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};


const getTaskAutomationById = async (req, res) => {
  const { id } = req.params;

  try {
    const [rows] = await db.query("SELECT * FROM taskautomation WHERE id = ?", [id]);

    if (rows.length > 0) {
      res.status(200).json({ status: true, message: "Single task automation data",  taskautomation: rows[0] });
    } else {
      res.status(404).json({ status: false, message: "Task automation not found" });
    }
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};


const updateTaskAutomation = async (req, res) => {
  const { id } = req.params;
  const {
    userId, taskName, staffRequired, abbreviation,
    sortOrder, description, followUp, triggerEvent,
    triggerDescription, triggerDays, performer, actionType,
    taskLifeExpectancy, emailTemplate, emailToMember,
    emailToPerformer, emailAutoSend, smsTemplate,
    smsAutoSend, appNotification, memberTag,
    associatedTag, prospectAction
  } = req.body;

  try {
    const [updateResult] = await db.query(
      `UPDATE taskautomation SET
        userId = ?, taskName = ?, staffRequired = ?, abbreviation = ?,
        sortOrder = ?, description = ?, followUp = ?, triggerEvent = ?,
        triggerDescription = ?, triggerDays = ?, performer = ?, actionType = ?,
        taskLifeExpectancy = ?, emailTemplate = ?, emailToMember = ?,
        emailToPerformer = ?, emailAutoSend = ?, smsTemplate = ?,
        smsAutoSend = ?, appNotification = ?, memberTag = ?,
        associatedTag = ?, prospectAction = ?
      WHERE id = ?`,
      [
        userId, taskName, staffRequired, abbreviation,
        sortOrder, description, followUp, triggerEvent,
        triggerDescription, triggerDays, performer, actionType,
        taskLifeExpectancy, emailTemplate, emailToMember,
        emailToPerformer, emailAutoSend, smsTemplate,
        smsAutoSend, appNotification, memberTag,
        associatedTag, prospectAction, id
      ]
    );

    if (updateResult.affectedRows > 0) {
      const [updated] = await db.query("SELECT * FROM taskautomation WHERE id = ?", [id]);
      res.status(200).json({
        status: true,
        message: "Task automation updated successfully",
        task_automation: updated[0]
      });
    } else {
      res.status(404).json({ status: false, message: "Task automation not found" });
    }
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};


const deleteTaskAutomation = async (req, res) => {
  const { id } = req.params;

  try {
    const [deleted] = await db.query("DELETE FROM taskautomation WHERE id = ?", [id]);

    if (deleted.affectedRows > 0) {
      res.status(200).json({ status: true, message: "Task automation deleted successfully" });
    } else {
      res.status(404).json({ status: false, message: "Task automation not found" });
    }
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};




module.exports = { addTaskAutomation, getAllTaskAutomations, getTaskAutomationById, updateTaskAutomation, deleteTaskAutomation };