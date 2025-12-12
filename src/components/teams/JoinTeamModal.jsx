import React, { useState, useEffect } from 'react';
import { X, AlertCircle, CheckCircle, Lock } from 'lucide-react';
import TeamAvatar from './TeamAvatar';
import './JoinTeamModal.css';

/**
 * JoinTeamModal - Modal for joining a team via invite code
 */
const JoinTeamModal = ({
  isOpen,
  onClose,
  onJoin,
  loading = false,
  fetchTeamPreview,
}) => {
  const [inviteCode, setInviteCode] = useState('');
  const [teamPreview, setTeamPreview] = useState(null);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [previewError, setPreviewError] = useState('');
  const [submitError, setSubmitError] = useState('');
  const [joined, setJoined] = useState(false);

  if (!isOpen) return null;

  // Handle invite code change - fetch preview if valid
  const handleCodeChange = async (e) => {
    const code = e.target.value.toUpperCase();
    setInviteCode(code);
    setPreviewError('');
    setTeamPreview(null);

    // Only fetch if code looks valid (basic pattern check)
    if (code.length >= 4 && fetchTeamPreview) {
      setPreviewLoading(true);
      try {
        const preview = await fetchTeamPreview(code);
        setTeamPreview(preview);
      } catch (error) {
        setPreviewError(
          error.response?.data?.message || 'Invalid invite code'
        );
      } finally {
        setPreviewLoading(false);
      }
    }
  };

  const handleJoin = async (e) => {
    e.preventDefault();
    setSubmitError('');

    if (!inviteCode.trim()) {
      setSubmitError('Please enter an invite code');
      return;
    }

    try {
      await onJoin(inviteCode);
      setJoined(true);
      setTimeout(() => {
        setInviteCode('');
        setTeamPreview(null);
        setJoined(false);
        onClose();
      }, 1500);
    } catch (error) {
      setSubmitError(
        error.response?.data?.message ||
        error.message ||
        'Failed to join team'
      );
    }
  };

  // Reset form when modal closes
  const handleClose = () => {
    setInviteCode('');
    setTeamPreview(null);
    setPreviewError('');
    setSubmitError('');
    setJoined(false);
    onClose();
  };

  return (
    <div className="modal-backdrop">
      <div className="modal modal-md">
        {/* Header */}
        <div className="modal-header">
          <h2 className="modal-title">Join a Team</h2>
          <button
            className="modal-close"
            onClick={handleClose}
            disabled={loading || joined}
            aria-label="Close modal"
          >
            <X size={24} />
          </button>
        </div>

        {/* Body */}
        <div className="modal-body">
          {joined ? (
            // Success State
            <div className="join-success">
              <div className="success-icon">
                <CheckCircle size={64} />
              </div>
              <h3 className="success-title">Team Joined!</h3>
              <p className="success-message">
                Welcome to <strong>{teamPreview?.name}</strong>. You can now access the team board.
              </p>
            </div>
          ) : (
            // Form
            <form onSubmit={handleJoin} className="join-team-form">
              {/* Submit Error */}
              {submitError && (
                <div className="form-error-alert">
                  <AlertCircle size={18} />
                  <span>{submitError}</span>
                </div>
              )}

              {/* Invite Code Input */}
              <div className="form-group">
                <label htmlFor="inviteCode" className="form-label">
                  Invite Code <span className="required">*</span>
                </label>
                <input
                  id="inviteCode"
                  type="text"
                  value={inviteCode}
                  onChange={handleCodeChange}
                  placeholder="e.g., TEAM-1234"
                  className={`form-input invite-code-input ${
                    previewError ? 'form-input-error' : ''
                  } ${teamPreview ? 'form-input-success' : ''}`}
                  disabled={loading}
                  maxLength={20}
                  autoFocus
                />
                <span className="form-hint">
                  Enter the invite code shared by your team
                </span>
              </div>

              {/* Team Preview */}
              {previewLoading && (
                <div className="team-preview-loading">
                  <div className="spinner-small" />
                  <span>Verifying invite code...</span>
                </div>
              )}

              {previewError && (
                <div className="team-preview-error">
                  <AlertCircle size={20} />
                  <span>{previewError}</span>
                </div>
              )}

              {teamPreview && !previewError && (
                <div className="team-preview">
                  <div className="preview-header">
                    <TeamAvatar
                      teamName={teamPreview.name}
                      size="md"
                      colorTheme={teamPreview.colorTheme}
                    />
                    <div className="preview-info">
                      <h4 className="preview-name">{teamPreview.name}</h4>
                      <p className="preview-members">
                        {teamPreview.memberCount} member{teamPreview.memberCount !== 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>

                  {teamPreview.description && (
                    <p className="preview-description">
                      {teamPreview.description}
                    </p>
                  )}

                  <div className="preview-footer">
                    <Lock size={14} />
                    <span className="preview-lock-text">
                      Team members only
                    </span>
                  </div>
                </div>
              )}
            </form>
          )}
        </div>

        {/* Footer */}
        {!joined && (
          <div className="modal-footer">
            <button
              className="btn btn-secondary"
              onClick={handleClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              className="btn btn-primary"
              onClick={handleJoin}
              disabled={loading || !inviteCode.trim() || !teamPreview || previewError}
            >
              {loading ? (
                <>
                  <div className="spinner-small" />
                  Joining...
                </>
              ) : (
                'Join Team'
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default JoinTeamModal;
