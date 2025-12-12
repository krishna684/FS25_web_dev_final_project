import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import teamApi from '../api/teams';
import TeamCard from '../components/teams/TeamCard';
import CreateTeamModal from '../components/teams/CreateTeamModal';
import JoinTeamModal from '../components/teams/JoinTeamModal';
import EmptyState from '../components/teams/EmptyState';
import { Search, Plus, LogIn, Loader } from 'lucide-react';
import './TeamsPage.css';

const TeamsPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // State for teams data
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // State for filters
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'owned', 'joined'
  const [searchQuery, setSearchQuery] = useState('');

  // State for modals
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [joinLoading, setJoinLoading] = useState(false);

  // Load teams
  const loadTeams = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const response = await teamApi.getAll();
      // Ensure we have the teams with proper member counts
      setTeams(response.data || []);
    } catch (err) {
      console.error('Error loading teams:', err);
      setError('Failed to load teams. Please try again.');
      setTeams([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    loadTeams();
  }, [loadTeams]);

  // Persist filter selection to localStorage
  useEffect(() => {
    localStorage.setItem('teamsPageTab', activeTab);
  }, [activeTab]);

  // Restore filter from localStorage on mount
  useEffect(() => {
    const savedTab = localStorage.getItem('teamsPageTab');
    if (savedTab && ['all', 'owned', 'joined'].includes(savedTab)) {
      setActiveTab(savedTab);
    }
  }, []);

  // Get user's role in team
  const getUserRoleInTeam = (team) => {
    const member = team.members?.find(
      (m) => m.user?._id === user?.id || m.user === user?.id
    );
    return member?.role || null;
  };

  // Filter teams based on active tab
  const filteredTeams = teams.filter((team) => {
    if (activeTab === 'owned') {
      return getUserRoleInTeam(team) === 'owner';
    }
    if (activeTab === 'joined') {
      return getUserRoleInTeam(team) !== null;
    }
    return true; // 'all' tab
  });

  // Search teams
  const searchedTeams = filteredTeams.filter((team) =>
    team.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle create team
  const handleCreateTeam = async (formData) => {
    try {
      setCreateLoading(true);
      await teamApi.create({
        name: formData.name,
        description: formData.description,
        colorTheme: formData.colorTheme,
      });

      // Show success message (would integrate with toast context)
      console.log('Team created successfully');

      // Reload teams
      await loadTeams();

      // Close modal
      setShowCreateModal(false);
    } catch (error) {
      console.error('Create team error:', error);
      throw error;
    } finally {
      setCreateLoading(false);
    }
  };

  // Fetch team preview for join modal
  const fetchTeamPreview = async (inviteCode) => {
    try {
      // First check if it's in our current teams list
      const localTeam = teams.find((t) => t.inviteCode === inviteCode);
      if (localTeam) {
        return {
          _id: localTeam._id,
          name: localTeam.name,
          description: localTeam.description,
          colorTheme: localTeam.colorTheme,
          memberCount: localTeam.members?.length || 0,
        };
      }
      
      // If not found locally, we would call an API endpoint
      // For now, simulate a team preview response
      // In a real app, you'd have an endpoint like: GET /api/teams/preview?code=XXXX
      throw new Error('Invalid invite code');
    } catch (error) {
      throw new Error('Invalid invite code');
    }
  };

  // Handle join team
  const handleJoinTeam = async (inviteCode) => {
    try {
      setJoinLoading(true);
      await teamApi.join(inviteCode);

      // Reload teams
      await loadTeams();

      // Close modal
      setShowJoinModal(false);
    } catch (error) {
      console.error('Join team error:', error);
      throw error;
    } finally {
      setJoinLoading(false);
    }
  };

  // Handle view board
  const handleViewBoard = (teamId) => {
    navigate(`/teams/${teamId}`);
  };

  // Handle settings
  const handleSettings = (teamId) => {
    navigate(`/teams/${teamId}/settings`);
  };

  // Loading state
  if (loading) {
    return (
      <div className="page">
        <div className="teams-page-loading">
          <Loader className="spinner-animate" size={48} />
          <p>Loading your teams...</p>
        </div>
      </div>
    );
  }

  // Empty state
  if (teams.length === 0) {
    return (
      <div className="page teams-page">
        <div className="teams-page-header">
          <div>
            <h1 className="page-title">Teams</h1>
            <p className="page-subtitle">
              Collaborate with your team members on shared tasks and projects
            </p>
          </div>
        </div>

        <EmptyState
          onCreateTeam={() => setShowCreateModal(true)}
          onJoinTeam={() => setShowJoinModal(true)}
        />

        {/* Modals */}
        <CreateTeamModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onCreate={handleCreateTeam}
          loading={createLoading}
        />

        <JoinTeamModal
          isOpen={showJoinModal}
          onClose={() => setShowJoinModal(false)}
          onJoin={handleJoinTeam}
          loading={joinLoading}
          fetchTeamPreview={fetchTeamPreview}
        />
      </div>
    );
  }

  return (
    <div className="page teams-page">
      {/* Page Header */}
      <div className="teams-page-header">
        <div>
          <h1 className="page-title">Teams</h1>
          <p className="page-subtitle">
            Manage your teams and collaborate with team members
          </p>
        </div>

        {/* Action Buttons */}
        <div className="teams-page-actions">
          <button
            className="btn btn-secondary"
            onClick={() => setShowJoinModal(true)}
          >
            <LogIn size={18} />
            <span>Join Team</span>
          </button>

          <button
            className="btn btn-primary"
            onClick={() => setShowCreateModal(true)}
          >
            <Plus size={18} />
            <span>Create Team</span>
          </button>
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div className="error-banner">
          <p>{error}</p>
          <button onClick={loadTeams} className="btn btn-sm btn-secondary">
            Try Again
          </button>
        </div>
      )}

      {/* Search and Filters */}
      <div className="teams-controls">
        {/* Search Bar */}
        <div className="search-container">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            className="form-input search-input"
            placeholder="Search teams by name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Tabs */}
        <div className="teams-tabs">
          <button
            className={`tab ${activeTab === 'all' ? 'active' : ''}`}
            onClick={() => setActiveTab('all')}
          >
            All Teams
            {teams.length > 0 && <span className="tab-count">{teams.length}</span>}
          </button>

          <button
            className={`tab ${activeTab === 'owned' ? 'active' : ''}`}
            onClick={() => setActiveTab('owned')}
          >
            Owned by Me
            {teams.filter((t) => getUserRoleInTeam(t) === 'owner').length > 0 && (
              <span className="tab-count">
                {teams.filter((t) => getUserRoleInTeam(t) === 'owner').length}
              </span>
            )}
          </button>

          <button
            className={`tab ${activeTab === 'joined' ? 'active' : ''}`}
            onClick={() => setActiveTab('joined')}
          >
            Joined Teams
            {teams.filter((t) => getUserRoleInTeam(t) !== null).length > 0 && (
              <span className="tab-count">
                {teams.filter((t) => getUserRoleInTeam(t) !== null).length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Teams Grid */}
      {searchedTeams.length === 0 ? (
        <div className="teams-empty-search">
          <p>
            {searchQuery
              ? `No teams found matching "${searchQuery}"`
              : 'No teams in this category'}
          </p>
        </div>
      ) : (
        <div className="teams-grid">
          {searchedTeams.map((team) => (
            <TeamCard
              key={team._id}
              team={team}
              userRole={getUserRoleInTeam(team)}
              onViewBoard={() => handleViewBoard(team._id)}
              onSettings={() => handleSettings(team._id)}
            />
          ))}
        </div>
      )}

      {/* Modals */}
      <CreateTeamModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreate={handleCreateTeam}
        loading={createLoading}
      />

      <JoinTeamModal
        isOpen={showJoinModal}
        onClose={() => setShowJoinModal(false)}
        onJoin={handleJoinTeam}
        loading={joinLoading}
        fetchTeamPreview={fetchTeamPreview}
      />
    </div>
  );
};

export default TeamsPage;
