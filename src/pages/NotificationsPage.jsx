// src/pages/NotificationsPage.jsx
import { useEffect, useState } from "react";
import axiosClient from "../api/axiosClient";

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  // 👇 THIS is the block we were talking about
  useEffect(() => {
    (async () => {
      try {
        const res = await axiosClient.get("/notifications");
        // assume backend returns an array
        setNotifications(res.data);
      } catch (err) {
        console.error("Failed to load notifications, showing none", err);
        // fallback: empty list (or you could put mock items here)
        setNotifications([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []); // run once when page loads

  if (loading) {
    return <div className="center">Loading notifications...</div>;
  }

  return (
    <div>
      <h2>Notifications</h2>

      {notifications.length === 0 ? (
        <p>No notifications.</p>
      ) : (
        <ul className="activity-feed">
          {notifications.map((n) => (
            <li
              key={n.id}
              className={n.read ? "" : "notification-unread"}
              style={{ padding: "0.4rem 0" }}
            >
              <div>{n.message}</div>
              <div className="small">{n.time}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default NotificationsPage;
