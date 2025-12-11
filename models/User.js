// models/user.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    },

    passwordHash: {
      // bcrypt hash stored here (Krishna handles hashing)
      type: String,
      required: true,
      minlength: 60, // typical bcrypt length
    },
    role: {
      type: String,
      enum: ['student', 'admin'],
      default: 'student',
    },
    avatarUrl: {
      type: String,
      default: null,
    },
    // Teams this user belongs to
    teams: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Team',
      },
    ],
    settings: {
      // Notification and UI preferences
      timezone: { type: String, default: 'America/Chicago' },
      notificationsEnabled: { type: Boolean, default: true },
      emailNotifications: { type: Boolean, default: false },
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    lastLoginAt: {
      type: Date,
    },
    passwordChangedAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

userSchema.index({ email: 1 }, { unique: true });

module.exports = mongoose.model('User', userSchema);
