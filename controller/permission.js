const db = require('../config');
const bcrypt = require('bcrypt');

const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const multer = require('multer');
require('dotenv').config();
const path = require('path');
const nodemailer = require('nodemailer');
const cloudinary = require('cloudinary').v2;


const assignPermissions = async (req, res) => {
  const { roleId, permissions } = req.body;

  try {
    if (!roleId || !Array.isArray(permissions)) {
      return res.status(400).json({
        status: false,
        message: "roleId and permissions array are required"
      });
    }

    const insertedPermissions = [];

    for (const perm of permissions) {
      const {
        moduleName,
        featureName,
        permissions: {
          canView = false,
          canAdd = false,
          canEdit = false,
          canDelete = false
        } = {}
      } = perm;

      // Insert new permission
      const [insertResult] = await db.query(
        `INSERT INTO rolepermissions 
         (roleId, moduleName, featureName, canView, canAdd, canEdit, canDelete)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          roleId,
          moduleName,
          featureName,
          canView.toString(),
          canAdd.toString(),
          canEdit.toString(),
          canDelete.toString()
        ]
      );

      // Fetch inserted permission
      const [rows] = await db.query(
        `SELECT * FROM rolepermissions WHERE id = ?`,
        [insertResult.insertId]
      );

      if (rows.length > 0) {
        insertedPermissions.push(rows[0]);
      }
    }

    res.status(201).json({
      status: true,
      message: "Permissions assigned successfully",
      data: insertedPermissions
    });

  } catch (error) {
    console.error("Assign permission error:", error);
    res.status(500).json({ status: false, message: "Internal Server Error" });
  }
};




const getAllPermissions = async (req, res) => {
  try {
    const [rows] = await db.query(`SELECT * FROM rolepermissions`);
    res.status(200).json({
      status: true,
      message: "All permissions fetched successfully",
      data: rows
    });
  } catch (error) {
    console.error("Get all permissions error:", error);
    res.status(500).json({ status: false, message: "Internal Server Error" });
  }
};




const getPermissionsByRoleId = async (req, res) => {
  const { roleId } = req.params;

  try {
    if (!roleId) {
      return res.status(400).json({
        status: false,
        message: "roleId is required in URL parameters"
      });
    }

    const [rows] = await db.query(`SELECT * FROM rolepermissions WHERE roleId = ?`, [roleId]);

    if (rows.length === 0) {
      return res.status(200).json({
        status: true,
        message: `No permissions found for roleId ${roleId}`,
        data: []
      });
    }

    res.status(200).json({
      status: true,
      message: "Permissions fetched successfully",
      data: rows
    });

  } catch (error) {
    console.error("Fetch permission error:", error);
    res.status(500).json({ status: false, message: "Internal Server Error" });
  }
};


const updatePermissionById = async (req, res) => {
  const { id } = req.params;
  const { roleId, permissions } = req.body;

  try {
    // Validate
    if (!roleId || !Array.isArray(permissions) || permissions.length === 0) {
      return res.status(400).json({
        status: false,
        message: "roleId and at least one permission object are required"
      });
    }

    const {
      moduleName,
      featureName,
      permissions: {
        canView = false,
        canAdd = false,
        canEdit = false,
        canDelete = false
      } = {}
    } = permissions[0]; // take only the first item for update

    await db.query(
      `UPDATE rolepermissions 
       SET roleId = ?, moduleName = ?, featureName = ?, 
           canView = ?, canAdd = ?, canEdit = ?, canDelete = ?
       WHERE id = ?`,
      [
        roleId,
        moduleName,
        featureName,
        canView.toString(),
        canAdd.toString(),
        canEdit.toString(),
        canDelete.toString(),
        id
      ]
    );

    const [rows] = await db.query(`SELECT * FROM rolepermissions WHERE id = ?`, [id]);

    if (rows.length === 0) {
      return res.status(404).json({
        status: false,
        message: `No permission found with id ${id}`
      });
    }

    res.status(200).json({
      status: true,
      message: "Permission updated successfully",
      data: rows[0]
    });

  } catch (error) {
    console.error("Update permission error:", error);
    res.status(500).json({ status: false, message: "Internal Server Error" });
  }
};



const deletePermissionsById = async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await db.query(
      `DELETE FROM rolepermissions WHERE id = ?`,
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        status: false,
        message: `No permission found with id ${id}`
      });
    }

    res.status(200).json({
      status: true,
      message: `Permission with id ${id} deleted successfully`
    });

  } catch (error) {
    console.error("Delete permission error:", error);
    res.status(500).json({ status: false, message: "Internal Server Error" });
  }
};


module.exports = {
  assignPermissions,
  getAllPermissions,
  getPermissionsByRoleId,
  updatePermissionById,
  deletePermissionsById
};
