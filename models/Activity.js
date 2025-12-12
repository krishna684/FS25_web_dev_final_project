// models/activity.js
const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema(
  {
    actor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    team: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Team',
    },
    task: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Task',
    },
    type: {
      type: String,
      required: true,
      enum: [
        'task.created',
        'task.updated',
        'task.status.changed',
        'task.assigned',
        'task.comment.added',
        'team.member.joined',
        'team.member.left',
        'team.created',
        'notification.sent',
      ],
    },
    message: {
      type: String,
      required: true,
      trim: true,
      maxlength: 300,
    },
    meta: {
      type: Object, // flexible JSON for additional props
      default: {},
    },
  },
  { timestamps: true }
);

// For team activity feed
activitySchema.index({ team: 1, createdAt: -1 });
// Per-task activity
activitySchema.index({ task: 1, createdAt: -1 });
// For "my recent actions"
activitySchema.index({ actor: 1, createdAt: -1 });

module.exports = mongoose.model('Activity', activitySchema);
