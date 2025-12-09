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

// PUT /api/teams/:teamId/members/:memberId/role
router.put('/:teamId/members/:memberId/role', teamController.updateMemberRole);

// DELETE /api/teams/:teamId/members/:memberId
router.delete('/:teamId/members/:memberId', teamController.removeMember);

// POST /api/teams/:teamId/regenerate-invite
router.post('/:teamId/regenerate-invite', teamController.regenerateInviteCode);

module.exports = router;
