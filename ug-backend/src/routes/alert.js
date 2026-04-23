const express = require('express');
const {
  getAlerts,
  markAlertRead,
  markAllRead,
  deleteAlert,
} = require('../controllers/alertController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);

router.get('/', getAlerts);
router.patch('/read-all', markAllRead);
router.patch('/:id/read', markAlertRead);
router.delete('/:id', deleteAlert);

module.exports = router;
