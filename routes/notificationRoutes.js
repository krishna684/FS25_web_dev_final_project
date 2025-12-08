const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const notificationController = require('../controllers/notificationController');

// GET /api/notifications
router.get('/', authMiddleware, notificationController.getNotifications);

// PUT /api/notifications/:id/read
router.put('/:id/read', authMiddleware, notificationController.markAsRead);

module.exports = router;
