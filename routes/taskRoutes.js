const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const authMiddleware = require('../middleware/authMiddleware');

// Apply auth middleware to all routes
router.use(authMiddleware);

// GET /api/tasks
router.get('/', taskController.getPersonalTasks);

// POST /api/tasks
router.post('/', taskController.createPersonalTask);

// GET /api/tasks/:taskId
router.get('/:taskId', taskController.getTaskDetails);

// PUT /api/tasks/:taskId
router.put('/:taskId', taskController.updatePersonalTask);

// DELETE /api/tasks/:taskId
router.delete('/:taskId', taskController.deletePersonalTask);

module.exports = router;
