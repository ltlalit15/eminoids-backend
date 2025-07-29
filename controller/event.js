const db = require('../config');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const multer = require('multer');
require('dotenv').config();
const path = require('path');
const nodemailer = require('nodemailer');

const addEvent = async (req, res) => {
  const { eventDate, eventType, details } = req.body;

  try {
    const [insertResult] = await db.query(
      `INSERT INTO events (eventDate, eventType, details) VALUES (?, ?, ?)`,
      [eventDate, eventType, details]
    );

    const [eventRow] = await db.query(
      `SELECT * FROM events WHERE id = ?`,
      [insertResult.insertId]
    );

    res.status(201).json({
      status: true,
      message: "Event added successfully",
      event: eventRow[0],
    });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};



const getAllEvents = async (req, res) => {
  try {
    const [rows] = await db.query(`SELECT * FROM events`);
    res.status(200).json({ status: true,  message: "All event data", events: rows });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};



const getEventById = async (req, res) => {
  const { id } = req.params;

  try {
    const [rows] = await db.query(`SELECT * FROM events WHERE id = ?`, [id]);

    if (rows.length === 0) {
      return res.status(404).json({ status: false, message: "Event not found" });
    }

    res.status(200).json({ status: true, message: "Single event data", event: rows[0] });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};



const updateEvent = async (req, res) => {
  const { id } = req.params;
  const { eventDate, eventType, details } = req.body;

  try {
    const [result] = await db.query(
      `UPDATE events SET eventDate = ?, eventType = ?, details = ? WHERE id = ?`,
      [eventDate, eventType, details, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ status: false, message: "Event not found or no changes" });
    }

    const [updatedRow] = await db.query(`SELECT * FROM events WHERE id = ?`, [id]);

    res.json({ status: true, message: "Event updated", event: updatedRow[0] });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};



const deleteEvent = async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await db.query(`DELETE FROM events WHERE id = ?`, [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ status: false, message: "Event not found" });
    }

    res.json({ status: true, message: "Event deleted successfully" });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};




const getEventSummary = async (req, res) => {
  try {
    const month = parseInt(req.query.month); // expected 1-12
    const year = parseInt(req.query.year);   // expected YYYY

    if (!month || !year) {
      return res.status(400).json({
        status: false,
        message: "month and year query params are required",
      });
    }

    const [events] = await db.query(
      `SELECT * FROM events WHERE MONTH(eventDate) = ? AND YEAR(eventDate) = ?`,
      [month, year]
    );

    // Normalize both casing and spacing
    const normalizeType = (type = '') =>
      type.trim().toLowerCase().replace(/\s+/g, '');

    const birthdays = events
      .filter(e => normalizeType(e.eventType) === 'birthday')
      .map(e => ({ name: e.details, date: e.eventDate }));

    const companyHolidays = events
      .filter(e => normalizeType(e.eventType) === 'companyholiday')
      .map(e => ({ title: e.details, date: e.eventDate }));

    const joiningDates = events
      .filter(e => normalizeType(e.eventType) === 'joiningdate')
      .map(e => ({ name: e.details, date: e.eventDate }));

    const approvedLeaves = events
      .filter(e => normalizeType(e.eventType) === 'leave')
      .map(e => ({ name: e.details, date: e.eventDate }));

    const monthNames = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];

    res.json({
      status: true,
      month: monthNames[month - 1],
      year,
      summary: {
        birthdays,
        companyHolidays,
        joiningDates,
        approvedLeaves
      }
    });

  } catch (error) {
    console.error('getEventSummary Error:', error);
    res.status(500).json({ status: false, message: error.message });
  }
};






module.exports = {addEvent, getAllEvents, getEventById, updateEvent, deleteEvent, getEventSummary}
