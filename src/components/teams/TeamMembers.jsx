const TeamMembers = ({ members }) => {
  if (!members?.length) return null;

  return (
    <div className="team-members">
      <h3>Members</h3>
      <ul>
        {members.map((m) => {
          const user = m.user || m;
          return (
            <li key={user._id || m._id || m.id}>
              {user.name} ({user.email}) - {m.role}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default TeamMembers;
