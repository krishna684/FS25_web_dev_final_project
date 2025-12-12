import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import teamApi from '../api/teams';
import { CheckCircle, AlertCircle, Users, ArrowRight } from 'lucide-react';

const JoinTeamPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [teamInfo, setTeamInfo] = useState(null);
  
  const inviteCode = searchParams.get('code');

  useEffect(() => {
    if (!inviteCode) {
      setError('No invite code provided');
      setLoading(false);
      return;
    }

    // Auto-join if user is logged in
    if (user) {
      handleJoinTeam();
    } else {
      // Redirect to login with return URL
      navigate(`/login?redirect=${encodeURIComponent(window.location.pathname + window.location.search)}`);
    }
  }, [inviteCode, user]);

  const handleJoinTeam = async () => {
    try {
      setJoining(true);
      setError('');
      
      const response = await teamApi.join(inviteCode);
      setTeamInfo(response.data.team);
      setSuccess(true);
      
      // Redirect to team board after 2 seconds
      setTimeout(() => {
        navigate(`/teams/${response.data.team._id}`);
      }, 2000);
      
    } catch (err) {
      console.error('Join team error:', err);
      setError(err.response?.data?.error || 'Failed to join team');
    } finally {
      setJoining(false);
      setLoading(false);
    }
  };

  if (loading || joining) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full mx-4">
          <div className="text-center">
            <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              {loading ? 'Processing invite...' : 'Joining team...'}
            </h2>
            <p className="text-gray-600">Please wait while we process your invitation.</p>
          </div>
        </div>
      </div>
    );
  }

  if (success && teamInfo) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full mx-4">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle size={32} className="text-green-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Welcome to {teamInfo.name}!
            </h2>
            <p className="text-gray-600 mb-6">
              You've successfully joined the team. Redirecting to the team board...
            </p>
            <div className="flex items-center justify-center gap-2 text-blue-600">
              <span>Going to team board</span>
              <ArrowRight size={16} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full mx-4">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle size={32} className="text-red-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Unable to Join Team
            </h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <div className="space-y-3">
              <button
                onClick={() => navigate('/teams')}
                className="w-full btn btn-primary"
              >
                <Users size={16} />
                Go to Teams
              </button>
              <button
                onClick={() => navigate('/dashboard')}
                className="w-full btn btn-secondary"
              >
                Go to Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default JoinTeamPage;