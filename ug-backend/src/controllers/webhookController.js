const crypto = require('crypto');
const Device = require('../models/Device');
const User = require('../models/User');
const Alert = require('../models/Alert');
const { parseSms } = require('../utils/smsParser');
const { sendPushNotification } = require('../services/firebaseService');
const logger = require('../utils/logger');

/**
 * Validate webhook shared secret.
 * SMS gateways should send X-Webhook-Secret header.
 */
const validateWebhookSecret = (req) => {
  const secret = req.headers['x-webhook-secret'] || req.query.secret;
  const expected = process.env.WEBHOOK_SECRET;

  if (!expected) {
    logger.warn('WEBHOOK_SECRET not configured — skipping validation');
    return true; // Allow in dev if not configured
  }

  return crypto.timingSafeEqual(
    Buffer.from(secret || ''),
    Buffer.from(expected)
  );
};

/**
 * POST /api/sms-webhook
 *
 * Receives incoming SMS from MSG91 / Exotel webhook.
 * Expected body (MSG91 format):
 * {
 *   "from": "919876543210",
 *   "message": "ALERT|DEVICE123|MAIN_DOOR|10:30PM",
 *   "to": "918888888888",
 *   "date": "2024-01-01 22:30:00"
 * }
 *
 * Flow:
 * 1. Validate secret
 * 2. Parse SMS
 * 3. Find device by sender number or deviceId
 * 4. Find user
 * 5. Save alert
 * 6. Update device status
 * 7. Send push notification
 */
const handleSmsWebhook = async (req, res, next) => {
  try {
    // Always respond 200 quickly to prevent gateway retry storms
    // Process asynchronously after sending response
    res.status(200).json({ success: true, message: 'Webhook received' });

    // Validate secret
    if (!validateWebhookSecret(req)) {
      logger.warn('Webhook received with invalid secret — ignoring');
      return;
    }

    const body = req.body;
    logger.info(`SMS Webhook received from: ${body.from || 'unknown'}`);
    logger.debug(`Webhook body: ${JSON.stringify(body)}`);

    // Support MSG91 and Exotel payload formats
    const senderNumber = body.from || body.From || body.sender || '';
    const rawMessage = body.message || body.Message || body.Body || '';

    if (!rawMessage) {
      logger.warn('Webhook received with empty message body');
      return;
    }

    // Parse SMS
    const parsed = parseSms(rawMessage);
    if (!parsed.isValid) {
      logger.warn(`SMS parse failed: ${parsed.error}. Raw: "${rawMessage}"`);
      return;
    }

    const { deviceId, zone, type, alertTime } = parsed;

    // Find device by deviceId first, fall back to sender phone number
    const device = await Device.findOne({
      $or: [
        { deviceId },
        { phoneNumber: senderNumber },
        { phoneNumber: `+${senderNumber}` },
      ],
      isActive: true,
    });

    if (!device) {
      logger.warn(`No device found for deviceId "${deviceId}" or number "${senderNumber}"`);
      return;
    }

    // Find the device owner
    const user = await User.findById(device.userId);
    if (!user) {
      logger.error(`No user found for device ${device.deviceId}`);
      return;
    }

    // Save alert to database
    const alert = await Alert.create({
      deviceId: device._id,
      userId: user._id,
      zone,
      type,
      rawMessage,
      senderNumber,
      alertTime,
    });

    // Update device status and last seen
    device.lastSeenAt = new Date();
    if (type === 'arm') device.status = 'armed';
    else if (type === 'disarm') device.status = 'disarmed';
    else if (type === 'intrusion' || type === 'panic') device.status = 'alert';
    await device.save();

    logger.info(`Alert saved: ${alert._id} | Zone: ${zone} | Type: ${type}`);

    // Send push notification if user has tokens and notifications enabled
    if (user.notificationsEnabled && user.fcmTokens.length > 0) {
      const zoneLabel = zone.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
      const typeLabel = type.replace(/_/g, ' ').toUpperCase();

      const notifResult = await sendPushNotification(
        user.fcmTokens,
        {
          title: `🚨 ${typeLabel} — ${device.name}`,
          body: `Zone: ${zoneLabel} at ${alertTime || 'now'}`,
        },
        {
          alertId: alert._id.toString(),
          deviceId: device._id.toString(),
          deviceName: device.name,
          zone,
          type,
          alertTime: alertTime || '',
          screen: 'AlertHistory', // deep-link target
        }
      );

      // Mark push as sent
      alert.pushSent = notifResult.successCount > 0;
      await alert.save();

      // Remove invalid FCM tokens
      if (notifResult.failedTokens.length > 0) {
        user.fcmTokens = user.fcmTokens.filter(
          (t) => !notifResult.failedTokens.includes(t)
        );
        await user.save();
      }
    } else {
      logger.info(`Push skipped for user ${user._id}: notifications disabled or no tokens`);
    }
  } catch (error) {
    logger.error(`Webhook processing error: ${error.message}`, error);
    // Do not call next(error) — response already sent
  }
};

module.exports = { handleSmsWebhook };
