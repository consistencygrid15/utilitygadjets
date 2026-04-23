const mongoose = require('mongoose');

const alertSchema = new mongoose.Schema(
  {
    deviceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Device',
      required: true,
      index: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    // Zone that triggered the alert (e.g. MAIN_DOOR, WINDOW_1)
    zone: {
      type: String,
      required: true,
      trim: true,
    },
    // Alert type derived from SMS
    type: {
      type: String,
      enum: ['intrusion', 'tamper', 'panic', 'low_battery', 'arm', 'disarm', 'unknown'],
      default: 'intrusion',
    },
    // Raw SMS message stored for debugging
    rawMessage: {
      type: String,
      default: '',
    },
    // SMS sender phone number
    senderNumber: {
      type: String,
      default: '',
    },
    // Time reported in the SMS
    alertTime: {
      type: String,
      default: '',
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    // Push notification delivery status
    pushSent: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Index for paginated alert history per user
alertSchema.index({ userId: 1, createdAt: -1 });
alertSchema.index({ userId: 1, isRead: 1 });

module.exports = mongoose.model('Alert', alertSchema);
