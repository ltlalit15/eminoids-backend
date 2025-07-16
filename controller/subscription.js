const db = require('../config');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const multer = require('multer');
require('dotenv').config();
const path = require('path');
const nodemailer = require('nodemailer');


const addSubscription = async (req, res) => {
  const { userId, planId, startDate, endDate } = req.body;

  try {
    // Insert a new subscription
    const [insertResult] = await db.query(
      `INSERT INTO subscriptions (userId, planId, startDate, endDate) VALUES (?, ?, ?, ?)`,
      [userId, planId, startDate, endDate]
    );

    // Fetch the inserted subscription by its ID
    const [subscriptionRow] = await db.query(
      `SELECT * FROM subscriptions WHERE id = ?`,
      [insertResult.insertId]
    );

    res.status(201).json({
      status: true,
      message: "Subscription added successfully",
      subscription: subscriptionRow[0]
    });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};


const getAllSubscriptions = async (req, res) => {
  try {
    const [subscriptions] = await db.query('SELECT * FROM subscriptions');
    res.status(200).json({
      status: true,
      message: 'Subscriptions fetched successfully',
      subscriptions
    });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};


const getSubscriptionById = async (req, res) => {
  const { id } = req.params;

  try {
    const [subscription] = await db.query('SELECT * FROM subscriptions WHERE id = ?', [id]);

    if (subscription.length === 0) {
      return res.status(404).json({ status: false, message: 'Subscription not found' });
    }

    res.status(200).json({
      status: true,
      message: 'Subscription fetched successfully',
      subscription: subscription[0]
    });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};




const updateSubscription = async (req, res) => {
  const { id } = req.params;
  const { userId, planId, startDate, endDate } = req.body;

  try {
    // Check if subscription exists
    const [subscription] = await db.query('SELECT * FROM subscriptions WHERE id = ?', [id]);
    if (subscription.length === 0) {
      return res.status(404).json({ status: false, message: 'Subscription not found' });
    }

    // Update the subscription
    await db.query(
      'UPDATE subscriptions SET userId = ?, planId = ?, startDate = ?, endDate = ? WHERE id = ?',
      [userId, planId, startDate, endDate, id]
    );

    // Fetch the updated subscription
    const [updatedSubscription] = await db.query('SELECT * FROM subscriptions WHERE id = ?', [id]);

    res.status(200).json({
      status: true,
      message: 'Subscription updated successfully',
      subscription: updatedSubscription[0]
    });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};



const deleteSubscription = async (req, res) => {
  const { id } = req.params;

  try {
    // Check if subscription exists
    const [subscription] = await db.query('SELECT * FROM subscriptions WHERE id = ?', [id]);
    if (subscription.length === 0) {
      return res.status(404).json({ status: false, message: 'Subscription not found' });
    }

    // Delete the subscription
    await db.query('DELETE FROM subscriptions WHERE id = ?', [id]);

    res.status(200).json({
      status: true,
      message: 'Subscription deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};


module.exports = {addSubscription, getAllSubscriptions, getSubscriptionById, updateSubscription, deleteSubscription}