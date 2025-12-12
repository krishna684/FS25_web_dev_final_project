import { useState } from "react";

const TeamCreateForm = ({ onCreate }) => {
  const [name, setName] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    onCreate({ name });
    setName("");
  };

  return (
    <form className="team-form" onSubmit={handleSubmit}>
      <h3>Create team</h3>
      <input
        placeholder="Team name..."
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <button className="btn-primary" type="submit">
        Create
      </button>
    </form>
  );
};

export default TeamCreateForm;
