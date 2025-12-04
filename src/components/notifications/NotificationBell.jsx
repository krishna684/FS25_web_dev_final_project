import { useState } from "react";
import NotificationDropdown from "./NotificationDropdown";

const NotificationBell = () => {
  const [open, setOpen] = useState(false);
  // Placeholder; later fetch from API
  const notifications = [
    { id: 1, text: "Task 'API integration' assigned to you.", unread: true },
    { id: 2, text: "Team 'CS Project' created.", unread: false },
  ];

  const unreadCount = notifications.filter((n) => n.unread).length;

  return (
    <div className="notification-bell">
      <button
        className="icon-button"
        type="button"
        onClick={() => setOpen((o) => !o)}
      >
        🔔
        {unreadCount > 0 && <span className="badge">{unreadCount}</span>}
      </button>
      {open && <NotificationDropdown notifications={notifications} />}
    </div>
  );
};

export default NotificationBell;
