const Alert = require('../models/Alert');
const logger = require('../utils/logger');

/**
 * GET /api/alerts
 * Fetch paginated alert history for the authenticated user.
 * Query params: page, limit, unreadOnly
 */
const getAlerts = async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(50, parseInt(req.query.limit) || 20);
    const skip = (page - 1) * limit;
    const unreadOnly = req.query.unreadOnly === 'true';

    const filter = { userId: req.user.id };
    if (unreadOnly) filter.isRead = false;

    const [alerts, total] = await Promise.all([
      Alert.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate('deviceId', 'name deviceId location'),
      Alert.countDocuments(filter),
    ]);

    const unreadCount = await Alert.countDocuments({ userId: req.user.id, isRead: false });

    res.status(200).json({
      success: true,
      data: {
        alerts,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
          hasNext: page * limit < total,
        },
        unreadCount,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PATCH /api/alerts/:id/read
 * Mark a single alert as read.
 */
const markAlertRead = async (req, res, next) => {
  try {
    const alert = await Alert.findOne({ _id: req.params.id, userId: req.user.id });
    if (!alert) {
      return res.status(404).json({ success: false, message: 'Alert not found' });
    }

    alert.isRead = true;
    await alert.save();

    res.status(200).json({ success: true, message: 'Alert marked as read' });
  } catch (error) {
    next(error);
  }
};

/**
 * PATCH /api/alerts/read-all
 * Mark all alerts for the user as read.
 */
const markAllRead = async (req, res, next) => {
  try {
    const result = await Alert.updateMany(
      { userId: req.user.id, isRead: false },
      { isRead: true }
    );

    logger.info(`Marked ${result.modifiedCount} alerts as read for user ${req.user.id}`);
    res.status(200).json({
      success: true,
      message: `${result.modifiedCount} alerts marked as read`,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/alerts/:id
 * Delete a single alert.
 */
const deleteAlert = async (req, res, next) => {
  try {
    const alert = await Alert.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!alert) {
      return res.status(404).json({ success: false, message: 'Alert not found' });
    }

    res.status(200).json({ success: true, message: 'Alert deleted' });
  } catch (error) {
    next(error);
  }
};

module.exports = { getAlerts, markAlertRead, markAllRead, deleteAlert };
