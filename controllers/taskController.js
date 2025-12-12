const Task = require('../models/Task');

// Get all personal tasks
exports.getPersonalTasks = async (req, res) => {
    try {
        const tasks = await Task.find({
            owner: req.user.userId,
            isTeamTask: false,
        }).sort({ createdAt: -1 });
        res.json(tasks);
    } catch (err) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Create a personal task
exports.createPersonalTask = async (req, res) => {
    try {
        const { title, description, priority, dueDate, category, labels } = req.body;

        if (!title) {
            return res.status(400).json({ error: 'Title is required' });
        }

        const newTask = new Task({
            title,
            description,
            priority,
            dueDate,
            category, // Saved but not strictly typed in schema unless added (Schema has labels)
            labels,
            isTeamTask: false,
            owner: req.user.userId,
            createdBy: req.user.userId,
        });

        const savedTask = await newTask.save();
        res.status(201).json(savedTask);
    } catch (err) {
        console.error('Create Task Error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Update a personal task
exports.updatePersonalTask = async (req, res) => {
    try {
        const { title, description, priority, status, dueDate, labels, completed } = req.body;

        const task = await Task.findOne({ _id: req.params.taskId, owner: req.user.userId });

        if (!task) {
            return res.status(404).json({ error: 'Task not found' });
        }

        // Update fields
        if (title) task.title = title;
        if (description !== undefined) task.description = description;
        if (priority) task.priority = priority;
        if (status) task.status = status;
        if (dueDate) task.dueDate = dueDate;
        if (labels) task.labels = labels;

        // Handle completion status
        if (completed !== undefined) {
            if (completed && !task.completedAt) {
                task.status = 'done';
                task.completedAt = new Date();
            } else if (!completed && task.status === 'done') {
                task.status = 'todo';
                task.completedAt = null;
            }
        }

        const updatedTask = await task.save();
        res.json(updatedTask);
    } catch (err) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Delete a personal task
exports.deletePersonalTask = async (req, res) => {
    try {
        const task = await Task.findOneAndDelete({
            _id: req.params.taskId,
            owner: req.user.userId,
        });

        if (!task) {
            return res.status(404).json({ error: 'Task not found' });
        }

        // Cascade delete comments
        const Comment = require('../models/Comment');
        await Comment.deleteMany({ task: req.params.taskId });

        res.json({ message: 'Task deleted' });
    } catch (err) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Get single task details
exports.getTaskDetails = async (req, res) => {
    try {
        const task = await Task.findOne({
            _id: req.params.taskId,
            owner: req.user.userId,
        });

        if (!task) {
            return res.status(404).json({ error: 'Task not found' });
        }

        res.json(task);
    } catch (err) {
        res.status(500).json({ error: 'Internal server error' });
    }
};
