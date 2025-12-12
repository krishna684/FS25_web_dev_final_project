const express = require('express');
const router = express.Router({ mergeParams: true }); // Important for accessing :teamId
const teamTaskController = require('../controllers/teamTaskController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

// GET /api/teams/:teamId/tasks
router.get('/', teamTaskController.getTeamTasks);

// POST /api/teams/:teamId/tasks
router.post('/', teamTaskController.createTeamTask);

// PUT /api/teams/:teamId/tasks/:taskId
router.put('/:taskId', teamTaskController.updateTeamTask);

// DELETE /api/teams/:teamId/tasks/:taskId
router.delete('/:taskId', teamTaskController.deleteTeamTask);

module.exports = router;
