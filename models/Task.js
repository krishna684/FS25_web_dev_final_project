// models/task.js
const mongoose = require('mongoose');

const STATUSES = ['todo', 'in-progress', 'done'];
const PRIORITIES = ['low', 'medium', 'high'];

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 2000,
    },
    // Personal vs Team task
    isTeamTask: {
      type: Boolean,
      default: false,
    },

    // PERSONAL tasks: owner is required
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: function () {
        return !this.isTeamTask;
      },
    },

    // TEAM tasks: team is required; assignedTo optional
    team: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Team',
      required: function () {
        return this.isTeamTask;
      },
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },

    status: {
      type: String,
      enum: STATUSES,
      default: 'todo',
    },
    priority: {
      type: String,
      enum: PRIORITIES,
      default: 'medium',
    },
    dueDate: {
      type: Date,
    },
    labels: [
      {
        type: String,
        trim: true,
        maxlength: 30,
      },
    ],
    // Kanban column ordering (for drag & drop)
    orderIndex: {
      type: Number,
      default: 0,
    },
    isArchived: {
      type: Boolean,
      default: false,
    },
    completedAt: {
      type: Date,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true, // whoever created the task
    },
  },
  { timestamps: true }
);

// For personal dashboard queries
taskSchema.index({ owner: 1, isTeamTask: 1, status: 1, dueDate: 1 });
// For team Kanban and filtering
taskSchema.index({ team: 1, status: 1, orderIndex: 1 });
// For "my assigned tasks"
taskSchema.index({ assignedTo: 1, status: 1, dueDate: 1 });
// For calendar view
taskSchema.index({ dueDate: 1 });

module.exports = mongoose.model('Task', taskSchema);
