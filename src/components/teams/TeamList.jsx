import { Link } from "react-router-dom";

const TeamList = ({ teams }) => {
  if (!teams.length) return <p>You are not in any teams yet.</p>;

  return (
    <ul className="team-list">
      {teams.map((t) => (
        <li key={t._id}>
          <Link to={`/teams/${t._id}`}>{t.name}</Link>
        </li>
      ))}
    </ul>
  );
};

export default TeamList;
