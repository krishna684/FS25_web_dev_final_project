import { useState } from "react";

const TeamJoinForm = ({ onJoin }) => {
  const [code, setCode] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!code.trim()) return;
    onJoin({ code });
    setCode("");
  };

  return (
    <form className="team-form" onSubmit={handleSubmit}>
      <h3>Join team</h3>
      <input
        placeholder="Invite code..."
        value={code}
        onChange={(e) => setCode(e.target.value)}
      />
      <button className="btn-secondary" type="submit">
        Join
      </button>
    </form>
  );
};

export default TeamJoinForm;
