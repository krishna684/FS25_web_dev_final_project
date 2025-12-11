const Activity = require('../models/Activity');
const User = require('../models/User');

// Get activity feed for a team
exports.getTeamActivity = async (req, res) => {
    try {
        const { teamId } = req.params;
        const activities = await Activity.find({ team: teamId })
            .populate('actor', 'name email avatarUrl')
            .sort({ createdAt: -1 })
            .limit(20);
        res.json(activities);
    } catch (err) {
        console.error('Get Activity Error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Get GLOBAL activity feed for the user (across all their teams)
exports.getUserActivity = async (req, res) => {
    try {
        // 1. Get user's teams
        const user = await User.findById(req.user.userId);
        if (!user) return res.status(404).json({ error: 'User not found' });

        // 2. Find activities where team is in user.teams
        const activities = await Activity.find({ team: { $in: user.teams } })
            .populate('actor', 'name email avatarUrl')
            .populate('team', 'name')
            .sort({ createdAt: -1 })
            .limit(20);

        res.json(activities);
    } catch (err) {
        console.error('Get User Activity Error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Helper to log activity (internal use)
exports.logActivity = async (actorId, teamId, type, message, taskId = null) => {
    try {
        await Activity.create({
            actor: actorId,
            team: teamId,
            task: taskId,
            type,
            message,
        });
    } catch (err) {
        console.error('Activity Log Error:', err);
    }
};
