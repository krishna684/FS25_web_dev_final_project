import { useState, useEffect } from "react";
import notificationApi from "../../api/notifications";
import NotificationDropdown from "./NotificationDropdown";
import { Bell } from "lucide-react";

const NotificationBell = () => {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);

  const loadNotifications = async () => {
    try {
      const res = await notificationApi.getAll();
      setNotifications(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadNotifications();
    const interval = setInterval(loadNotifications, 30000); // Poll every 30s
    return () => clearInterval(interval);
  }, []);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="notification-bell relative">
      <button
        className="p-2 rounded-full hover:bg-gray-100 transition-colors relative text-gray-600"
        type="button"
        onClick={() => setOpen((o) => !o)}
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white shadow-sm ring-2 ring-white">
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 z-50">
          <NotificationDropdown
            notifications={notifications}
            onClose={() => setOpen(false)}
            onRefresh={loadNotifications}
          />
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
