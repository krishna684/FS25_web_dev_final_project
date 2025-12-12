const express = require('express');
const router = express.Router({ mergeParams: true });
const commentController = require('../controllers/commentController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

// GET /api/tasks/:taskId/comments
router.get('/', commentController.getTaskComments);

// POST /api/tasks/:taskId/comments
router.post('/', commentController.addComment);

module.exports = router;
