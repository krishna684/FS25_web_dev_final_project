import React from 'react';
import { Users, Activity, ArrowRight, Settings } from 'lucide-react';
import TeamAvatar from './TeamAvatar';
import './TeamCard.css';

/**
 * TeamCard - Enhanced team card with avatar, members, tasks, and actions
 */
const TeamCard = ({
  team,
  userRole,
  onViewBoard,
  onSettings,
}) => {
  // Get first 3 members for display
  const displayMembers = team.members?.slice(0, 3) || [];

  // Calculate active task count (tasks with status not 'done')
  const activeTaskCount = team.tasks?.filter(
    (task) => task.status !== 'done'
  ).length || 0;

  // Format last activity timestamp
  const formatLastActivity = (timestamp) => {
    if (!timestamp) return 'Never';

    const now = new Date();
    const lastActivity = new Date(timestamp);
    const diffMs = now - lastActivity;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return lastActivity.toLocaleDateString();
  };

  // Get color theme for avatar (cycle through colors based on team ID)
  const colorThemes = [
    'blue',
    'purple',
    'green',
    'rose',
    'amber',
    'teal',
    'indigo',
  ];
  const colorIndex = team._id?.charCodeAt(0) % colorThemes.length || 0;
  const colorTheme = colorThemes[colorIndex];

  return (
    <div className="team-card">
      {/* Header with Avatar and Role Badge */}
      <div className="team-card-header">
        <TeamAvatar
          teamName={team.name}
          size="lg"
          colorTheme={colorTheme}
        />
        {userRole && (
          <span className={`team-role-badge team-role-${userRole.toLowerCase()}`}>
            {userRole}
          </span>
        )}
      </div>

      {/* Team Info */}
      <div className="team-card-content">
        <h3 className="team-card-title">{team.name}</h3>

        {team.description && (
          <p className="team-card-description">{team.description}</p>
        )}

        {/* Stats Row */}
        <div className="team-card-stats">
          <div className="stat-item">
            <Users size={16} />
            <span className="stat-label">
              {team.members?.length || 0} member{team.members?.length !== 1 ? 's' : ''}
            </span>
          </div>

          <div className="stat-item">
            <Activity size={16} />
            <span className="stat-label">
              {activeTaskCount} active task{activeTaskCount !== 1 ? 's' : ''}
            </span>
          </div>
        </div>

        {/* Member Avatars */}
        {displayMembers.length > 0 && (
          <div className="team-members-preview">
            <div className="members-avatars">
              {displayMembers.map((member, idx) => (
                <div
                  key={member.user?._id || idx}
                  className="member-avatar"
                  title={member.user?.name}
                >
                  {member.user?.name?.[0]?.toUpperCase() || '?'}
                </div>
              ))}
              {team.members?.length > 3 && (
                <div className="member-avatar-more">
                  +{team.members.length - 3}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Last Activity */}
        <div className="team-card-activity">
          <span className="activity-label">
            Last activity: {formatLastActivity(team.lastActivityAt)}
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="team-card-actions">
        <button
          className="action-btn action-btn-primary"
          onClick={onViewBoard}
          title="View Team Board"
        >
          <span>View Board</span>
          <ArrowRight size={16} />
        </button>

        <button
          className="action-btn action-btn-secondary"
          onClick={onSettings}
          title="Team Settings"
        >
          <Settings size={16} />
        </button>
      </div>

      {/* Hover effect indicator */}
      <div className="team-card-hover-effect" />
    </div>
  );
};

export default TeamCard;
