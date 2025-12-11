import React, { useState, useEffect } from 'react';
import { MoreVertical, User, Mail, Calendar, Clock, CheckCircle, AlertCircle, Crown, Shield } from 'lucide-react';
import { getRelativeTime } from '../activity/activityUtils';

const MemberCard = ({
  member,
  currentUserId,
  currentUserRole,
  teamId,
  onRoleChange,
  onRemoveMember,
  taskStats = { assigned: 0, completed: 0 }
}) => {
  const [showActions, setShowActions] = useState(false);
  const [isOnline, setIsOnline] = useState(false);

  const user = member.user || member;
  const role = member.role;
  const joinedAt = member.joinedAt || member.createdAt;
  const lastActive = user.lastLoginAt || user.updatedAt;

  // Simulate online status (in a real app, this would come from a WebSocket or API)
  useEffect(() => {
    // For demo purposes, randomly set online status
    const online = Math.random() > 0.7;
    setIsOnline(online);
  }, []);

  const isOwner = role === 'owner';
  const isCurrentUser = user._id === currentUserId;
  const canManageRoles = currentUserRole === 'owner' && !isCurrentUser;
  const canRemoveMember = currentUserRole === 'owner' && !isCurrentUser && !isOwner;

  const handleRoleChange = async (newRole) => {
    if (onRoleChange) {
      await onRoleChange(member._id || member.id, newRole);
    }
    setShowActions(false);
  };

  const handleRemoveMember = async () => {
    if (onRemoveMember && window.confirm(`Are you sure you want to remove ${user.name} from the team?`)) {
      await onRemoveMember(member._id || member.id);
    }
    setShowActions(false);
  };

  const getRoleIcon = () => {
    switch (role) {
      case 'owner':
        return <Crown size={16} className="text-yellow-500" />;
      case 'member':
        return <Shield size={16} className="text-blue-500" />;
      default:
        return <User size={16} className="text-gray-500" />;
    }
  };

  const getRoleBadgeColor = () => {
    switch (role) {
      case 'owner':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'member':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="member-card">
      <div className="member-card-header">
        <div className="member-avatar-container">
          {user.avatarUrl ? (
            <img
              src={user.avatarUrl}
              alt={user.name}
              className="member-avatar"
            />
          ) : (
            <div className="member-avatar-placeholder">
              <User size={24} />
            </div>
          )}
          <div className={`member-online-indicator ${isOnline ? 'online' : 'offline'}`} />
        </div>

        <div className="member-info">
          <div className="member-name-row">
            <h4 className="member-name">{user.name}</h4>
            {getRoleIcon()}
          </div>
          <div className="member-email">
            <Mail size={14} />
            <span>{user.email}</span>
          </div>
        </div>

        <div className="member-actions">
          {(canManageRoles || canRemoveMember) && (
            <div className="member-actions-dropdown">
              <button
                onClick={() => setShowActions(!showActions)}
                className="member-actions-btn"
              >
                <MoreVertical size={16} />
              </button>

              {showActions && (
                <div className="member-actions-menu">
                  {canManageRoles && (
                    <div className="member-actions-group">
                      <div className="member-actions-label">Change Role</div>
                      <button
                        onClick={() => handleRoleChange('member')}
                        className={`member-role-option ${role === 'member' ? 'active' : ''}`}
                        disabled={role === 'member'}
                      >
                        <Shield size={14} />
                        Member
                      </button>
                      <button
                        onClick={() => handleRoleChange('owner')}
                        className={`member-role-option ${role === 'owner' ? 'active' : ''}`}
                        disabled={role === 'owner'}
                      >
                        <Crown size={14} />
                        Owner
                      </button>
                    </div>
                  )}

                  {canRemoveMember && (
                    <>
                      <div className="member-actions-separator" />
                      <button
                        onClick={handleRemoveMember}
                        className="member-remove-btn"
                      >
                        <AlertCircle size={14} />
                        Remove from Team
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="member-card-body">
        <div className="member-role-badge">
          <span className={`role-badge ${getRoleBadgeColor()}`}>
            {role === 'owner' ? 'Owner' : 'Member'}
          </span>
        </div>

        <div className="member-stats">
          <div className="member-stat">
            <CheckCircle size={14} />
            <span>{taskStats.completed} completed</span>
          </div>
          <div className="member-stat">
            <AlertCircle size={14} />
            <span>{taskStats.assigned} assigned</span>
          </div>
        </div>
      </div>

      <div className="member-card-footer">
        <div className="member-join-date">
          <Calendar size={14} />
          <span>Joined {getRelativeTime(joinedAt)}</span>
        </div>
        <div className="member-last-active">
          <Clock size={14} />
          <span>Active {getRelativeTime(lastActive)}</span>
        </div>
      </div>
    </div>
  );
};

export default MemberCard;