const Comment = require('../models/Comment');
const Task = require('../models/Task');
const Team = require('../models/Team'); // If needed to verify team
const activityController = require('../controllers/activityController');
const notificationController = require('../controllers/notificationController');

exports.getTaskComments = async (req, res) => {
    try {
        const { taskId } = req.params;

        const task = await Task.findById(taskId);
        if (!task) return res.status(404).json({ error: 'Task not found' });

        // Check permissions (must be task owner or team member)
        if (task.isTeamTask) {
            const team = await Team.findOne({
                _id: task.team,
                $or: [
                    { owner: req.user.userId },
                    { 'members.user': req.user.userId },
                ],
            });
            if (!team) return res.status(403).json({ error: 'Access denied' });
        } else {
            if (task.owner.toString() !== req.user.userId) {
                return res.status(403).json({ error: 'Access denied' });
            }
        }

        const comments = await Comment.find({ task: taskId })
            .populate('author', 'name avatarUrl')
            .sort({ createdAt: 1 });

        res.json(comments);
    } catch (err) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Add a comment
exports.addComment = async (req, res) => {
    try {
        const { taskId } = req.params;
        const { text } = req.body;

        if (!text) return res.status(400).json({ error: 'Comment text is required' });

        const task = await Task.findById(taskId);
        if (!task) return res.status(404).json({ error: 'Task not found' });

        // Permission check
        if (task.isTeamTask) {
            const team = await Team.findOne({
                _id: task.team,
                $or: [
                    { owner: req.user.userId },
                    { 'members.user': req.user.userId },
                ],
            });
            if (!team) return res.status(403).json({ error: 'Access denied' });
        } else {
            // Allow comments on personal tasks? Maybe self-notes.
            if (task.owner.toString() !== req.user.userId) {
                return res.status(403).json({ error: 'Access denied' });
            }
        }

        const newComment = new Comment({
            task: taskId,
            author: req.user.userId,
            content: text, // Fixed: schema uses 'content' not 'text'
        });

        const savedComment = await newComment.save();

        if (task.isTeamTask && task.team) {
            await activityController.logActivity(
                req.user.userId,
                task.team,
                'task.comment.added',
                `Commented on task: ${task.title} `,
                taskId
            );

            // Notify assignee if not self
            if (task.assignedTo && task.assignedTo.toString() !== req.user.userId) {
                await notificationController.createNotification(
                    task.assignedTo,
                    'comment.added',
                    'New Comment',
                    `New comment on task: ${task.title} `,
                    taskId,
                    task.team
                );
            }
        }

        const populatedComment = await savedComment.populate('author', 'name email avatarUrl');

        res.status(201).json(populatedComment);
    } catch (err) {
        res.status(500).json({ error: 'Internal server error' });
    }
};
