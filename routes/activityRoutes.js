const express = require('express');
const router = express.Router({ mergeParams: true });
const authMiddleware = require('../middleware/authMiddleware');
const activityController = require('../controllers/activityController');

// GET /api/activity (Global) OR /api/teams/:teamId/activity (Team Scoped)
router.get('/', authMiddleware, (req, res, next) => {
    if (req.params.teamId) {
        return activityController.getTeamActivity(req, res, next);
    } else {
        return activityController.getUserActivity(req, res, next);
    }
});

module.exports = router;
