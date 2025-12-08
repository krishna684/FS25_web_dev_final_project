const Notification = require('../models/Notification');

// Get user notifications
exports.getNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({ recipient: req.user.userId })
            .sort({ createdAt: -1 })
            .limit(20);
        res.json(notifications);
    } catch (err) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Mark as read
exports.markAsRead = async (req, res) => {
    try {
        await Notification.findByIdAndUpdate(req.params.id, { isRead: true, readAt: new Date() });
        res.json({ message: 'Marked as read' });
    } catch (err) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Internal Helper
exports.createNotification = async (recipientId, type, title, body, taskId = null, teamId = null) => {
    try {
        await Notification.create({
            recipient: recipientId,
            type,
            title,
            body,
            task: taskId,
            team: teamId,
        });
    } catch (err) {
        console.error('Notification Error:', err);
    }
};
