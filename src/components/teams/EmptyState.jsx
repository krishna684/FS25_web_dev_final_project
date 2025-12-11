import React from 'react';
import { Plus, LogIn } from 'lucide-react';
import './EmptyState.css';

/**
 * EmptyState - Reusable empty state component for teams page
 */
const EmptyState = ({ onCreateTeam, onJoinTeam }) => {
  return (
    <div className="empty-state">
      <div className="empty-state-content">
        {/* Icon */}
        <div className="empty-state-icon">
          <svg
            width="120"
            height="120"
            viewBox="0 0 120 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Empty teams illustration */}
            <circle cx="60" cy="60" r="55" fill="#F0F9FF" stroke="#DBEAFE" strokeWidth="2" />

            {/* User group silhouettes */}
            <circle cx="45" cy="35" r="12" fill="#2563EB" opacity="0.6" />
            <circle cx="75" cy="35" r="12" fill="#2563EB" opacity="0.6" />
            <circle cx="60" cy="50" r="12" fill="#2563EB" opacity="0.6" />

            {/* Team shape below */}
            <path
              d="M 30 65 L 30 85 L 40 85 L 40 70 L 50 70 L 50 85 L 70 85 L 70 70 L 80 70 L 80 85 L 90 85 L 90 65"
              fill="none"
              stroke="#2563EB"
              strokeWidth="2"
              opacity="0.4"
            />
          </svg>
        </div>

        {/* Title */}
        <h2 className="empty-state-title">No Teams Yet</h2>

        {/* Description */}
        <p className="empty-state-description">
          Join a team or create a new one to start collaborating with your team members.
          Teams help you organize tasks, manage projects, and stay in sync.
        </p>

        {/* Action Buttons */}
        <div className="empty-state-actions">
          <button
            className="btn btn-primary btn-lg"
            onClick={onCreateTeam}
            aria-label="Create a new team"
          >
            <Plus size={20} />
            <span>Create Team</span>
          </button>

          <button
            className="btn btn-secondary btn-lg"
            onClick={onJoinTeam}
            aria-label="Join an existing team"
          >
            <LogIn size={20} />
            <span>Join Team</span>
          </button>
        </div>

        {/* Additional Help Text */}
        <div className="empty-state-help">
          <p className="help-title">How Teams Work</p>
          <ul className="help-list">
            <li>Collaborate with team members on shared tasks</li>
            <li>Organize work by project or initiative</li>
            <li>Share team calendars and track progress</li>
            <li>Get team notifications and activity updates</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default EmptyState;
