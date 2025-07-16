const db = require('../config');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const multer = require('multer');
require('dotenv').config();
const path = require('path');
const nodemailer = require('nodemailer');


const addSmsTemplate = async (req, res) => {
  const {
    userId, name, categoryId, subscriptionType, clubId,
    smsSubject, fieldCategory, insertField, smsBody
  } = req.body;

  try {
    const [result] = await db.query(
      `INSERT INTO smstemplate (
        userId, name, categoryId, subscriptionType, clubId,
        smsSubject, fieldCategory, insertField, smsBody
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        userId, name, categoryId, subscriptionType, clubId,
        smsSubject, fieldCategory, insertField, smsBody
      ]
    );

    const [inserted] = await db.query(`SELECT * FROM smstemplate WHERE id = ?`, [result.insertId]);

    res.status(201).json({
      status: true,
      message: "SMS template added successfully",
      sms_template: inserted[0]
    });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};


const getAllSmsTemplates = async (req, res) => {
  try {
    const [templates] = await db.query("SELECT * FROM smstemplate ORDER BY id DESC");
    res.status(200).json({ status: true, message: "All sms template data", smstemplate: templates });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};


const getSmsTemplateById = async (req, res) => {
  const { id } = req.params;

  try {
    const [rows] = await db.query("SELECT * FROM smstemplate WHERE id = ?", [id]);

    if (rows.length > 0) {
      res.status(200).json({ status: true, message: "Single sms template data", smstemplate: rows[0] });
    } else {
      res.status(404).json({ status: false, message: "SMS template not found" });
    }
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};


const updateSmsTemplate = async (req, res) => {
  const { id } = req.params;
  const {
    userId, name, categoryId, subscriptionType, clubId,
    smsSubject, fieldCategory, insertField, smsBody
  } = req.body;

  try {
    const [update] = await db.query(
      `UPDATE smstemplate SET
        userId = ?, name = ?, categoryId = ?, subscriptionType = ?, clubId = ?,
        smsSubject = ?, fieldCategory = ?, insertField = ?, smsBody = ?
       WHERE id = ?`,
      [
        userId, name, categoryId, subscriptionType, clubId,
        smsSubject, fieldCategory, insertField, smsBody,
        id
      ]
    );

    if (update.affectedRows > 0) {
      const [updated] = await db.query("SELECT * FROM smstemplate WHERE id = ?", [id]);
      res.status(200).json({
        status: true,
        message: "SMS template updated successfully",
        sms_template: updated[0]
      });
    } else {
      res.status(404).json({ status: false, message: "SMS template not found" });
    }
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};


const deleteSmsTemplate = async (req, res) => {
  const { id } = req.params;

  try {
    const [deleted] = await db.query("DELETE FROM smstemplate WHERE id = ?", [id]);

    if (deleted.affectedRows > 0) {
      res.status(200).json({ status: true, message: "SMS template deleted successfully" });
    } else {
      res.status(404).json({ status: false, message: "SMS template not found" });
    }
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};





module.exports = { addSmsTemplate, getAllSmsTemplates, getSmsTemplateById, updateSmsTemplate, deleteSmsTemplate };