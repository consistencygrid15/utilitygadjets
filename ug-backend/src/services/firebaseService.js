const admin = require('firebase-admin');
const logger = require('../utils/logger');

let initialized = false;

/**
 * Initialize Firebase Admin SDK.
 * Service account is stored as a base64-encoded JSON in FIREBASE_SERVICE_ACCOUNT_BASE64.
 */
const initializeFirebase = () => {
  if (initialized) return;

  try {
    const base64 = process.env.FIREBASE_SERVICE_ACCOUNT_BASE64;
    if (!base64) {
      throw new Error('FIREBASE_SERVICE_ACCOUNT_BASE64 is not set in environment variables');
    }

    const serviceAccount = JSON.parse(Buffer.from(base64, 'base64').toString('utf8'));

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });

    initialized = true;
    logger.info('Firebase Admin SDK initialized successfully');
  } catch (error) {
    logger.error('Failed to initialize Firebase Admin SDK', error);
    throw error;
  }
};

/**
 * Send a push notification to one or more FCM tokens.
 *
 * @param {string[]} fcmTokens - Array of FCM device tokens.
 * @param {{ title: string, body: string }} notification - Notification content.
 * @param {object} [data={}] - Extra key-value data payload.
 * @returns {Promise<{ successCount: number, failureCount: number, failedTokens: string[] }>}
 */
const sendPushNotification = async (fcmTokens, notification, data = {}) => {
  if (!initialized) initializeFirebase();

  if (!fcmTokens || fcmTokens.length === 0) {
    logger.warn('sendPushNotification called with no FCM tokens');
    return { successCount: 0, failureCount: 0, failedTokens: [] };
  }

  // Stringify all data values (FCM requires string values)
  const stringifiedData = Object.fromEntries(
    Object.entries(data).map(([k, v]) => [k, String(v)])
  );

  const message = {
    notification: {
      title: notification.title,
      body: notification.body,
    },
    data: stringifiedData,
    android: {
      priority: 'high',
      notification: {
        sound: 'alarm',
        channelId: 'ug_alerts',
        priority: 'max',
        defaultVibrateTimings: false,
        vibrateTimingsMillis: [0, 500, 200, 500],
      },
    },
    apns: {
      payload: {
        aps: {
          sound: 'alarm.wav',
          badge: 1,
        },
      },
    },
  };

  const failedTokens = [];
  let successCount = 0;
  let failureCount = 0;

  // Send to each token individually for granular error handling
  const sendPromises = fcmTokens.map(async (token) => {
    try {
      await admin.messaging().send({ ...message, token });
      successCount++;
    } catch (error) {
      failureCount++;
      failedTokens.push(token);
      // Log token-specific errors without crashing
      logger.warn(`FCM send failed for token ${token.slice(-8)}: ${error.message}`);
    }
  });

  await Promise.allSettled(sendPromises);

  logger.info(`Push notifications: ${successCount} sent, ${failureCount} failed`);
  return { successCount, failureCount, failedTokens };
};

module.exports = { initializeFirebase, sendPushNotification };
