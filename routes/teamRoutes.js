const express = require('express');
const router = express.Router();
const teamController = require('../controllers/teamController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

// POST /api/teams
router.post('/', teamController.createTeam);

// GET /api/teams
router.get('/', teamController.getUserTeams);

// POST /api/teams/join
router.post('/join', teamController.joinTeam);

// GET /api/teams/:teamId
router.get('/:teamId', teamController.getTeamDetails);

// DELETE /api/teams/:teamId/leave
router.delete('/:teamId/leave', teamController.leaveTeam);

module.exports = router;
