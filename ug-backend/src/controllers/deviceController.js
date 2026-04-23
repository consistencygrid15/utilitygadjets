const { validationResult } = require('express-validator');
const Device = require('../models/Device');
const { sendDeviceCommand } = require('../services/smsService');
const logger = require('../utils/logger');

/**
 * POST /api/device/add
 * Add a new GSM device and link it to the authenticated user.
 */
const addDevice = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { name, phoneNumber, deviceId, location } = req.body;

    // Check if device already exists (phoneNumber or deviceId must be unique globally)
    const existing = await Device.findOne({
      $or: [{ phoneNumber }, { deviceId: deviceId.toUpperCase() }],
    });

    if (existing) {
      return res.status(409).json({
        success: false,
        message: 'A device with this phone number or device ID already exists',
      });
    }

    const device = await Device.create({
      userId: req.user.id,
      name,
      phoneNumber,
      deviceId: deviceId.toUpperCase(),
      location: location || '',
    });

    logger.info(`Device added: ${deviceId} by user ${req.user.id}`);

    res.status(201).json({
      success: true,
      message: 'Device added successfully',
      data: { device },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/device/list
 * List all devices belonging to the authenticated user.
 */
const listDevices = async (req, res, next) => {
  try {
    const devices = await Device.find({ userId: req.user.id, isActive: true }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      data: { devices, count: devices.length },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/device/:id
 * Get a single device by MongoDB ID.
 */
const getDevice = async (req, res, next) => {
  try {
    const device = await Device.findOne({ _id: req.params.id, userId: req.user.id });
    if (!device) {
      return res.status(404).json({ success: false, message: 'Device not found' });
    }

    res.status(200).json({ success: true, data: { device } });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/device/:id
 * Soft-delete a device (sets isActive = false).
 */
const deleteDevice = async (req, res, next) => {
  try {
    const device = await Device.findOne({ _id: req.params.id, userId: req.user.id });
    if (!device) {
      return res.status(404).json({ success: false, message: 'Device not found' });
    }

    device.isActive = false;
    await device.save();

    logger.info(`Device soft-deleted: ${device.deviceId}`);
    res.status(200).json({ success: true, message: 'Device removed' });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/device/:id/command
 * Send ARM / DISARM / PANIC command to the GSM device via MSG91.
 */
const sendCommand = async (req, res, next) => {
  try {
    const { command } = req.body;
    const validCommands = ['ARM', 'DISARM', 'PANIC'];

    if (!command || !validCommands.includes(command.toUpperCase())) {
      return res.status(400).json({
        success: false,
        message: `Command must be one of: ${validCommands.join(', ')}`,
      });
    }

    const device = await Device.findOne({ _id: req.params.id, userId: req.user.id });
    if (!device) {
      return res.status(404).json({ success: false, message: 'Device not found' });
    }

    const result = await sendDeviceCommand(device.phoneNumber, command.toUpperCase());

    if (!result.success) {
      return res.status(502).json({
        success: false,
        message: `Failed to send command: ${result.error}`,
      });
    }

    // Optimistically update device status
    if (command === 'ARM') device.status = 'armed';
    else if (command === 'DISARM') device.status = 'disarmed';
    await device.save();

    logger.info(`Command [${command}] sent to device ${device.deviceId}`);

    res.status(200).json({
      success: true,
      message: `Command ${command} sent successfully`,
      data: { device },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { addDevice, listDevices, getDevice, deleteDevice, sendCommand };
