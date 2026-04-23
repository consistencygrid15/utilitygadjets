const express = require('express');
const { body } = require('express-validator');
const {
  addDevice,
  listDevices,
  getDevice,
  deleteDevice,
  sendCommand,
} = require('../controllers/deviceController');
const { protect } = require('../middleware/authMiddleware');
const { commandLimiter } = require('../middleware/rateLimiter');

const router = express.Router();

const addDeviceValidation = [
  body('name').trim().notEmpty().withMessage('Device name is required'),
  body('phoneNumber')
    .trim()
    .notEmpty()
    .withMessage('Device phone number is required')
    .matches(/^\+?[0-9]{10,15}$/)
    .withMessage('Invalid phone number format'),
  body('deviceId').trim().notEmpty().withMessage('Device ID is required'),
];

// All device routes require authentication
router.use(protect);

router.post('/add', addDeviceValidation, addDevice);
router.get('/list', listDevices);
router.get('/:id', getDevice);
router.delete('/:id', deleteDevice);
router.post('/:id/command', commandLimiter, sendCommand);

module.exports = router;
