const ActivityFeed = ({ items }) => {
    if (!items?.length) return <p>No recent activity.</p>;
  
    return (
      <ul className="activity-feed">
        {items.map((a) => (
          <li key={a.id}>
            <p>{a.message}</p>
            <small>{new Date(a.createdAt).toLocaleString()}</small>
          </li>
        ))}
      </ul>
    );
  };
  
  export default ActivityFeed;
  