import { useEffect, useState } from "react";
import teamApi from "../api/teams";
import { Link } from "react-router-dom";

const TeamsPage = () => {
  const [teams, setTeams] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  // Create team form
  const [newTeamName, setNewTeamName] = useState("");
  const [inviteCode, setInviteCode] = useState("");

  const loadTeams = async () => {
    try {
      setLoading(true);
      const res = await teamApi.getAll();
      setTeams(res.data);
      setLoading(false);
    } catch (err) {
      setError("Failed to load teams.");
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTeams();
  }, []);

  const handleCreateTeam = async (e) => {
    e.preventDefault();
    try {
      await teamApi.create({ name: newTeamName });
      setNewTeamName("");
      loadTeams();
    } catch (err) {
      console.error(err);
      alert("Failed to create team");
    }
  };

  const handleJoinTeam = async (e) => {
    e.preventDefault();
    try {
      await teamApi.join(inviteCode);
      setInviteCode("");
      loadTeams();
    } catch (err) {
      console.error(err);
      alert("Failed to join team (check code)");
    }
  };

  if (loading) return <div>Loading teams...</div>;

  return (
    <div>
      <h2 className="page-title">My Teams</h2>
      {error && <p className="error">{error}</p>}

      <div className="teams-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>

        {/* List Teams */}
        <div>
          <h3>Your Teams</h3>
          {teams.length === 0 ? <p>You are not in any teams.</p> : (
            <ul className="team-list">
              {teams.map(team => (
                <li key={team._id} style={{ border: '1px solid #ccc', padding: '10px', margin: '10px 0' }}>
                  <Link to={`/teams/${team._id}`}><strong>{team.name}</strong></Link>
                  <p>{team.members?.length} members</p>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Actions */}
        <div>
          <div className="card">
            <h3>Create New Team</h3>
            <form onSubmit={handleCreateTeam}>
              <input
                type="text"
                placeholder="Team Name"
                value={newTeamName}
                onChange={e => setNewTeamName(e.target.value)}
                required
              />
              <button type="submit" className="btn-primary" style={{ marginTop: '0.5rem' }}>Create</button>
            </form>
          </div>

          <div className="card" style={{ marginTop: '1rem' }}>
            <h3>Join Team</h3>
            <form onSubmit={handleJoinTeam}>
              <input
                type="text"
                placeholder="Invite Code"
                value={inviteCode}
                onChange={e => setInviteCode(e.target.value)}
                required
              />
              <button type="submit" className="btn-secondary" style={{ marginTop: '0.5rem' }}>Join</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamsPage;
