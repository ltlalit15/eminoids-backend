const db = require('../config');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const multer = require('multer');
require('dotenv').config();
const path = require('path');
const nodemailer = require('nodemailer');


const addService = async (req, res) => {
  const {
    currentMember,
    serviceName,
    serviceCategoryId,
    casual,
    servicePack,
    benefitType,
    basePrice,
    showFee,
    bookableOnline,
    groupBooking
  } = req.body;

  try {
    const [insertResult] = await db.query(
      `INSERT INTO services (
        currentMember,
        serviceName,
        serviceCategoryId,
        casual,
        servicePack,
        benefitType,
        basePrice,
        showFee,
        bookableOnline,
        groupBooking
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        currentMember,
        serviceName,
        serviceCategoryId,
        casual,
        servicePack,
        benefitType,
        basePrice,
        showFee,
        bookableOnline,
        groupBooking
      ]
    );

    const [newService] = await db.query(`SELECT * FROM services WHERE id = ?`, [insertResult.insertId]);

    res.status(201).json({
      status: true,
      message: "Service added successfully",
      service: newService[0]
    });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};


const getAllServices = async (req, res) => {
  try {
    const query = `
      SELECT services.*, servicecategories.categoryName
      FROM services
      JOIN servicecategories ON services.serviceCategoryId = servicecategories.id
    `;
    const [rows] = await db.query(query);
    res.json({
      status: true,
      message: "All services fetched successfully",
      services: rows
    });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};



const getServiceById = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.query(`SELECT * FROM services WHERE id = ?`, [id]);

    if (rows.length === 0) {
      return res.status(404).json({ status: false, message: "Service not found" });
    }

    res.json({
      status: true,
      message: "Service fetched successfully",
      service: rows[0]
    });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};


const updateService = async (req, res) => {
  const { id } = req.params;
  const {
    currentMember,
    serviceName,
    serviceCategoryId,
    casual,
    servicePack,
    benefitType,
    basePrice,
    showFee,
    bookableOnline,
    groupBooking
  } = req.body;

  try {
    await db.query(
      `UPDATE services SET 
        currentMember = ?, 
        serviceName = ?,
        serviceCategoryId = ?,
        casual = ?, 
        servicePack = ?, 
        benefitType = ?, 
        basePrice = ?, 
        showFee = ?, 
        bookableOnline = ?, 
        groupBooking = ?
      WHERE id = ?`,
      [
        currentMember,
        serviceName,
        serviceCategoryId,
        casual,
        servicePack,
        benefitType,
        basePrice,
        showFee,
        bookableOnline,
        groupBooking,
        id
      ]
    );

    const [updatedService] = await db.query(`SELECT * FROM services WHERE id = ?`, [id]);

    res.json({
      status: true,
      message: "Service updated successfully",
      service: updatedService[0]
    });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};



const deleteService = async (req, res) => {
  const { id } = req.params;

  try {
    await db.query(`DELETE FROM services WHERE id = ?`, [id]);
    res.json({ status: true, message: "Service deleted successfully" });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};



module.exports = {addService, getAllServices, getServiceById, updateService, deleteService}