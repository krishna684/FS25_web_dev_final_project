const Task = require('../models/Task');
const Team = require('../models/Team');
const activityController = require('../controllers/activityController');
const notificationController = require('../controllers/notificationController');

// Get all tasks for a specific team
exports.getTeamTasks = async (req, res) => {
    try {
        const { teamId } = req.params;

        // Verify membership
        const team = await Team.findOne({ _id: teamId, 'members.user': req.user.userId });
        if (!team) {
            return res.status(403).json({ error: 'Access denied or team not found' });
        }

        const tasks = await Task.find({ team: teamId, isTeamTask: true })
            .populate('assignedTo', 'name email avatarUrl')
            .sort({ orderIndex: 1, createdAt: -1 });

        res.json(tasks);
    } catch (err) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Create a task in a team
exports.createTeamTask = async (req, res) => {
    try {
        const { teamId } = req.params;
        const { title, description, priority, dueDate, assignedTo, status } = req.body;

        if (!title) return res.status(400).json({ error: 'Title is required' });

        // Verify membership
        const team = await Team.findOne({ _id: teamId, 'members.user': req.user.userId });
        if (!team) {
            return res.status(403).json({ error: 'Access denied or team not found' });
        }

        // Verify assignee if provided
        if (assignedTo) {
            const isMember = team.members.some(m => m.user.toString() === assignedTo);
            if (!isMember) {
                return res.status(400).json({ error: 'Assigned user is not a member of this team' });
            }
        }

        const newTask = new Task({
            title,
            description,
            priority,
            dueDate,
            status: status || 'todo',
            assignedTo,
            team: teamId,
            isTeamTask: true,
            createdBy: req.user.userId,
        });

        const savedTask = await newTask.save();
        await savedTask.populate('assignedTo', 'name avatarUrl');

        // Log Activity
        await activityController.logActivity(
            req.user.userId,
            teamId,
            'task.created',
            `Created task: ${savedTask.title}`,
            savedTask._id
        );

        // Notify Assignee
        if (assignedTo && assignedTo !== req.user.userId) {
            await notificationController.createNotification(
                assignedTo,
                'task.assigned',
                'New Task Assignment',
                `You have been assigned to task: ${savedTask.title}`,
                savedTask._id,
                teamId
            );
        }

        res.status(201).json(savedTask);
    } catch (err) {
        console.error("Create Team Task Error:", err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Update team task (move column, assign, edit)
exports.updateTeamTask = async (req, res) => {
    try {
        const { teamId, taskId } = req.params;
        const updates = req.body;

        // Verify membership
        const team = await Team.findOne({ _id: teamId, 'members.user': req.user.userId });
        if (!team) return res.status(403).json({ error: 'Access denied' });

        const task = await Task.findOne({ _id: taskId, team: teamId });
        if (!task) return res.status(404).json({ error: 'Task not found' });

        const oldStatus = task.status;
        const oldAssignee = task.assignedTo ? task.assignedTo.toString() : null;

        // Update fields
        if (updates.title) task.title = updates.title;
        if (updates.description !== undefined) task.description = updates.description;
        if (updates.status) task.status = updates.status;
        if (updates.priority) task.priority = updates.priority;
        if (updates.dueDate) task.dueDate = updates.dueDate;
        if (updates.orderIndex !== undefined) task.orderIndex = updates.orderIndex;

        if (updates.assignedTo) {
            const isMember = team.members.some(m => m.user.toString() === updates.assignedTo);
            if (!isMember) {
                return res.status(400).json({ error: 'Assignee not in team' });
            }
            task.assignedTo = updates.assignedTo;
        } else if (updates.assignedTo === null) {
            task.assignedTo = null;
        }

        const updatedTask = await task.save();
        await updatedTask.populate('assignedTo', 'name avatarUrl');

        // Log status change
        if (updates.status && updates.status !== oldStatus) {
            await activityController.logActivity(
                req.user.userId,
                teamId,
                'task.status.changed',
                `Changed status of "${task.title}" to ${updates.status}`,
                task._id
            );
        }

        // Notify new assignee
        if (updates.assignedTo && updates.assignedTo !== oldAssignee && updates.assignedTo !== req.user.userId) {
            await notificationController.createNotification(
                updates.assignedTo,
                'task.assigned',
                'Task Assignment',
                `You have been assigned to task: ${task.title}`,
                task._id,
                teamId
            );
            await activityController.logActivity(
                req.user.userId,
                teamId,
                'task.assigned',
                `Assigned "${task.title}" to user`,
                task._id
            );
        }

        res.json(updatedTask);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Delete team task
exports.deleteTeamTask = async (req, res) => {
    try {
        const { teamId, taskId } = req.params;

        const team = await Team.findOne({ _id: teamId, 'members.user': req.user.userId });
        if (!team) return res.status(403).json({ error: 'Access denied' });

        await Task.findOneAndDelete({ _id: taskId, team: teamId });

        // Cascade delete comments
        const Comment = require('../models/Comment');
        await Comment.deleteMany({ task: taskId });

        res.json({ message: 'Task deleted' });
    } catch (err) {
        res.status(500).json({ error: 'Internal server error' });
    }
};
