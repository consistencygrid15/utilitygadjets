const mongoose = require('mongoose');

const deviceSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    // Human-readable name the user gives the device
    name: {
      type: String,
      required: [true, 'Device name is required'],
      trim: true,
      maxlength: [50, 'Device name cannot exceed 50 characters'],
    },
    // SIM phone number of the GSM device (used to match incoming SMS)
    phoneNumber: {
      type: String,
      required: [true, 'Device phone number is required'],
      unique: true,
      trim: true,
    },
    // Unique device identifier embedded in SMS payload
    deviceId: {
      type: String,
      required: [true, 'Device ID is required'],
      unique: true,
      trim: true,
      uppercase: true,
    },
    status: {
      type: String,
      enum: ['armed', 'disarmed', 'alert', 'offline'],
      default: 'disarmed',
    },
    location: {
      type: String,
      trim: true,
      default: '',
    },
    lastSeenAt: {
      type: Date,
      default: null,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for faster lookup
deviceSchema.index({ userId: 1, isActive: 1 });

module.exports = mongoose.model('Device', deviceSchema);
