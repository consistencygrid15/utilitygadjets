const express = require('express');
const { handleSmsWebhook } = require('../controllers/webhookController');

const router = express.Router();

/**
 * POST /api/sms-webhook
 * Endpoint for SMS gateways (MSG91 / Exotel) to post incoming SMS.
 * No JWT required — secured via X-Webhook-Secret header.
 */
router.post('/sms-webhook', handleSmsWebhook);

// Exotel uses GET for webhook health checks
router.get('/sms-webhook', (_req, res) => {
  res.status(200).json({ success: true, message: 'UG SMS Webhook is live' });
});

module.exports = router;
