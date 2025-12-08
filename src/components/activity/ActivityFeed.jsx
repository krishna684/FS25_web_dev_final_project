const ActivityFeed = ({ items }) => {
  if (!items?.length) return <p>No recent activity.</p>;

  return (
    <ul className="activity-feed">
      {items.map((a) => (
        <li key={a._id}>
          <p>{a.message}</p>
          <small>{new Date(a.createdAt).toLocaleString()} by {a.actor?.name || 'Unknown'}</small>
        </li>
      ))}
    </ul>
  );
};

export default ActivityFeed;
