import { Link } from "react-router-dom";

const TeamList = ({ teams }) => {
  if (!teams.length) return <p>You are not in any teams yet.</p>;

  return (
    <ul className="team-list">
      {teams.map((t) => (
        <li key={t.id}>
          <Link to={`/teams/${t.id}`}>{t.name}</Link>
        </li>
      ))}
    </ul>
  );
};

export default TeamList;
