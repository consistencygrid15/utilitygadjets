const axios = require('axios');
const logger = require('../utils/logger');

const MSG91_BASE_URL = 'https://api.msg91.com/api/v5';

/**
 * Send an SMS to a GSM device via MSG91.
 *
 * @param {string} phoneNumber - Destination phone number (with country code, e.g. 919876543210).
 * @param {string} message - SMS body to send.
 * @returns {Promise<{ success: boolean, messageId?: string, error?: string }>}
 */
const sendSms = async (phoneNumber, message) => {
  const authKey = process.env.MSG91_AUTH_KEY;
  const senderId = process.env.MSG91_SENDER_ID || 'UGALRM';

  if (!authKey) {
    logger.error('MSG91_AUTH_KEY is not set');
    return { success: false, error: 'SMS service not configured' };
  }

  try {
    // Normalize phone: strip leading + or 0
    const normalizedPhone = phoneNumber.replace(/^\+/, '').replace(/^0/, '');

    const payload = {
      sender: senderId,
      route: '4', // Transactional route
      country: process.env.MSG91_COUNTRY_CODE || '91',
      sms: [
        {
          message,
          to: [normalizedPhone],
        },
      ],
    };

    const response = await axios.post(`${MSG91_BASE_URL}/flow/`, payload, {
      headers: {
        authkey: authKey,
        'Content-Type': 'application/json',
      },
      timeout: 10000,
    });

    if (response.data && response.data.type === 'success') {
      logger.info(`SMS sent to ${normalizedPhone} via MSG91`);
      return { success: true, messageId: response.data.message };
    }

    logger.warn(`MSG91 responded with non-success: ${JSON.stringify(response.data)}`);
    return { success: false, error: response.data?.message || 'Unknown MSG91 error' };
  } catch (error) {
    logger.error(`Failed to send SMS via MSG91: ${error.message}`);
    return { success: false, error: error.message };
  }
};

/**
 * Build and send a device control command via SMS.
 *
 * Command format embedded in device firmware: #PWD123#ARM
 *
 * @param {string} phoneNumber - Device phone number.
 * @param {'ARM'|'DISARM'|'PANIC'} command - Command to send.
 * @returns {Promise<{ success: boolean, error?: string }>}
 */
const sendDeviceCommand = async (phoneNumber, command) => {
  const validCommands = ['ARM', 'DISARM', 'PANIC'];
  if (!validCommands.includes(command)) {
    return { success: false, error: `Invalid command: ${command}` };
  }

  const pwd = process.env.DEVICE_PASSWORD || 'PWD123';
  const smsBody = `#${pwd}#${command}`;

  logger.info(`Sending command [${command}] to device at ${phoneNumber}`);
  return sendSms(phoneNumber, smsBody);
};

module.exports = { sendSms, sendDeviceCommand };
