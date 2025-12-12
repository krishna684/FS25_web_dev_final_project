import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import MemberCard from './MemberCard';
import InviteMemberModal from './InviteMemberModal';
import teamApi from '../../api/teams';
import taskApi from '../../api/tasks';
import { Plus, RefreshCw, Mail, Copy, Check } from 'lucide-react';

const TeamMembers = ({ team, onTeamUpdate }) => {
  const { user } = useAuth();
  const [members, setMembers] = useState(team?.members || []);
  const [taskStats, setTaskStats] = useState({});
  const [loading, setLoading] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteCode, setInviteCode] = useState(team?.inviteCode || '');
  const [copySuccess, setCopySuccess] = useState(false);

  const currentUserRole = members.find(m => m.user._id === user._id)?.role || 'member';
  const isOwner = currentUserRole === 'owner';

  // Load task statistics for each member
  useEffect(() => {
    const loadTaskStats = async () => {
      if (!team?._id) return;

      try {
        const stats = {};
        for (const member of members) {
          const memberId = member.user._id;
          try {
            // Get tasks assigned to this member in this team
            const response = await taskApi.getTeamTasks(team._id);
            const memberTasks = response.data.filter(task => task.assignedTo === memberId);

            stats[memberId] = {
              assigned: memberTasks.length,
              completed: memberTasks.filter(task => task.status === 'completed').length
            };
          } catch (error) {
            console.error(`Error loading stats for member ${memberId}:`, error);
            stats[memberId] = { assigned: 0, completed: 0 };
          }
        }
        setTaskStats(stats);
      } catch (error) {
        console.error('Error loading task stats:', error);
      }
    };

    if (members.length > 0) {
      loadTaskStats();
    }
  }, [members, team?._id]);

  const handleRoleChange = async (memberId, newRole) => {
    try {
      setLoading(true);
      await teamApi.updateMemberRole(team._id, memberId, newRole);

      // Update local state
      setMembers(prevMembers =>
        prevMembers.map(member =>
          member._id === memberId ? { ...member, role: newRole } : member
        )
      );

      if (onTeamUpdate) {
        onTeamUpdate();
      }
    } catch (error) {
      console.error('Error updating member role:', error);
      alert('Failed to update member role. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveMember = async (memberId) => {
    try {
      setLoading(true);
      await teamApi.removeMember(team._id, memberId);

      // Update local state
      setMembers(prevMembers => prevMembers.filter(member => member._id !== memberId));

      if (onTeamUpdate) {
        onTeamUpdate();
      }
    } catch (error) {
      console.error('Error removing member:', error);
      alert('Failed to remove member. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegenerateInvite = async () => {
    try {
      setLoading(true);
      const response = await teamApi.regenerateInviteCode(team._id);
      setInviteCode(response.data.inviteCode);

      if (onTeamUpdate) {
        onTeamUpdate();
      }
    } catch (error) {
      console.error('Error regenerating invite code:', error);
      const errorMsg = error.response?.data?.error || 'Failed to regenerate invite code. Please try again.';
      alert(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyInviteLink = () => {
    const inviteUrl = `${window.location.origin}/join-team?code=${inviteCode}`;
    navigator.clipboard.writeText(inviteUrl);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  if (!members?.length) return null;

  return (
    <div className="team-members-section">
      {/* Team Invite Section */}
      <div className="team-invite-section">
        <div className="team-invite-header">
          <h3>Team Invitations</h3>
          {isOwner && (
            <button
              onClick={() => setShowInviteModal(true)}
              className="btn btn-primary btn-sm"
            >
              <Plus size={16} />
              Invite Members
            </button>
          )}
        </div>

        <div className="team-invite-content">
          <div className="invite-code-display">
            <div className="invite-code-label">
              <span>Invite Code:</span>
              <code className="invite-code">{inviteCode || 'No code generated'}</code>
            </div>

            <div className="invite-actions">
              <button
                onClick={handleCopyInviteLink}
                className="btn btn-secondary btn-sm"
                disabled={!inviteCode}
              >
                {copySuccess ? <Check size={16} /> : <Copy size={16} />}
                {copySuccess ? 'Copied!' : 'Copy Link'}
              </button>

              {isOwner && (
                <button
                  onClick={handleRegenerateInvite}
                  className="btn btn-ghost btn-sm"
                  disabled={loading}
                >
                  <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
                  Regenerate
                </button>
              )}
            </div>
          </div>

          <div className="invite-info">
            <p>Share this link with team members to invite them to join your team.</p>
          </div>
        </div>
      </div>

      {/* Team Members */}
      <div className="team-members">
        <div className="team-members-header">
          <h3>Team Members ({members.length})</h3>
        </div>

        <div className="members-grid">
          {members.map((member) => (
            <MemberCard
              key={member._id}
              member={member}
              currentUserId={user._id}
              currentUserRole={currentUserRole}
              teamId={team._id}
              onRoleChange={handleRoleChange}
              onRemoveMember={handleRemoveMember}
              taskStats={taskStats[member.user._id] || { assigned: 0, completed: 0 }}
            />
          ))}
        </div>
      </div>

      {/* Invite Modal */}
      {showInviteModal && (
        <InviteMemberModal
          isOpen={showInviteModal}
          onClose={() => setShowInviteModal(false)}
          teamName={team.name}
          inviteCode={inviteCode}
        />
      )}
    </div>
  );
};

export default TeamMembers;
