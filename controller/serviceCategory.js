const db = require('../config');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const multer = require('multer');
require('dotenv').config();
const path = require('path');
const nodemailer = require('nodemailer');


const addServiceCategory = async (req, res) => {
  const { categoryName, clubId, allowedResources, tax, requireRoom, requireEquipment } = req.body;

  try {
    const [result] = await db.query(
      `INSERT INTO servicecategories 
        (categoryName, clubId, allowedResources, tax, requireRoom, requireEquipment)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [categoryName, clubId, allowedResources, tax, requireRoom, requireEquipment]
    );

    const [newData] = await db.query(`SELECT * FROM servicecategories WHERE id = ?`, [result.insertId]);

    res.status(201).json({
      status: true,
      message: "Service category added successfully",
      data: newData[0]
    });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};


const getAllServiceCategories = async (req, res) => {
  try {
    // Query to join service categories with club names
    const [rows] = await db.query(`
      SELECT 
        sc.id,
        sc.categoryName,
        sc.clubId,
        c.clubName,    -- Join with clubs table for club name
        sc.allowedResources,
        sc.tax,
        sc.requireRoom,
        sc.requireEquipment
      FROM 
        servicecategories sc
      LEFT JOIN 
        clubs c ON sc.clubId = c.id
    `);

    res.json({
      status: true,
      message: "Service categories with club names fetched successfully",
      data: rows
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Error fetching service categories: " + error.message
    });
  }
};


const getServiceCategoryById = async (req, res) => {
  const { id } = req.params;

  try {
    const [rows] = await db.query(`
      SELECT * FROM servicecategories WHERE id = ?`, [id]);

    if (rows.length === 0) {
      return res.status(404).json({ status: false, message: "Service category not found" });
    }

    res.json({
      status: true,
      message: "Service category fetched successfully",
      data: rows[0]
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Error fetching category: " + error.message
    });
  }
};



const updateServiceCategory = async (req, res) => {
  const { id } = req.params;
  const { categoryName, clubId, allowedResources, tax, requireRoom, requireEquipment } = req.body;

  try {
    await db.query(
      `UPDATE servicecategories SET 
        categoryName = ?, 
        clubId = ?, 
        allowedResources = ?, 
        tax = ?, 
        requireRoom = ?, 
        requireEquipment = ?
      WHERE id = ?`,
      [categoryName, clubId, allowedResources, tax, requireRoom, requireEquipment, id]
    );

    const [updated] = await db.query(`SELECT * FROM servicecategories WHERE id = ?`, [id]);

    res.json({
      status: true,
      message: "Service category updated successfully",
      data: updated[0]
    });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};



const deleteServiceCategory = async (req, res) => {
  const { id } = req.params;

  try {
    await db.query(`DELETE FROM servicecategories WHERE id = ?`, [id]);
    res.json({ status: true, message: "Service category deleted successfully" });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};


module.exports = {addServiceCategory, getAllServiceCategories, getServiceCategoryById, updateServiceCategory, deleteServiceCategory}