const Task = require('../models/Task');
const Team = require('../models/Team');
const User = require('../models/User');

exports.globalSearch = async (req, res) => {
    try {
        const { q } = req.query;
        if (!q || q.trim().length === 0) {
            return res.json({ tasks: [], teams: [], users: [] });
        }

        const regex = new RegExp(q, 'i'); // Case-insensitive regex

        const [tasks, teams, users] = await Promise.all([
            // Search Tasks (title or description) - Only user's own tasks or team tasks they are part of
            Task.find({
                $or: [
                    { title: regex },
                    { description: regex }
                ],
                $and: [
                    // Simplified for MVP: Search all tasks user has access to (owner or team member)
                    // For now, let's just search tasks user owns OR is assigned to OR created
                    {
                        $or: [
                            { owner: req.user.userId },
                            { assignedTo: req.user.userId },
                            { createdBy: req.user.userId }
                        ]
                    }
                ]
            }).limit(5).select('title status _id'),

            // Search Teams (name or description) - Only teams user is member of
            Team.find({
                name: regex,
                members: { $elemMatch: { user: req.user.userId } }
            }).limit(5).select('name _id'),

            // Search Users (name or email) - Global search for now is fine, or restricted to team members
            User.find({
                $or: [
                    { name: regex },
                    { email: regex }
                ]
            }).limit(5).select('name email avatarUrl _id')
        ]);

        res.json({
            tasks,
            teams,
            users
        });
    } catch (err) {
        console.error('Search Error:', err);
        res.status(500).json({ error: 'Search failed' });
    }
};
