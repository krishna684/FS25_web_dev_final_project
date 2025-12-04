const TeamMembers = ({ members }) => {
    if (!members?.length) return null;
  
    return (
      <div className="team-members">
        <h3>Members</h3>
        <ul>
          {members.map((m) => (
            <li key={m.id}>
              {m.name} ({m.email})
            </li>
          ))}
        </ul>
      </div>
    );
  };
  
  export default TeamMembers;
  