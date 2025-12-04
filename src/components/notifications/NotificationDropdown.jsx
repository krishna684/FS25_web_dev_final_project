import { Link } from "react-router-dom";

const NotificationDropdown = ({ notifications }) => {
  return (
    <div className="notification-dropdown">
      <div className="notification-list">
        {notifications.length === 0 && <p>No notifications</p>}
        {notifications.map((n) => (
          <div
            key={n.id}
            className={
              "notification-item" + (n.unread ? " notification-unread" : "")
            }
          >
            {n.text}
          </div>
        ))}
      </div>
      <div className="notification-footer">
        <Link to="/notifications">View all</Link>
      </div>
    </div>
  );
};

export default NotificationDropdown;
