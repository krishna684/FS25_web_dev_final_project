import { useState } from "react";
import notificationApi from "../../api/notifications";
import { Check, X, Bell, Clock, MessageSquare, Users, FileText } from "lucide-react";

const NotificationDropdown = ({ notifications, onClose, onRefresh }) => {
  const [filter, setFilter] = useState("all");

  const handleRead = async (n) => {
    if (!n.isRead) {
      try {
        await notificationApi.markRead(n._id);
        if (onRefresh) onRefresh();
      } catch (e) {
        console.error(e);
      }
    }
  };

  const handleClearAll = async () => {
    // Mock or implement clear all
    onClose();
  };

  const filtered = notifications.filter(n => {
    if (filter === "all") return true;
    // Assuming 'type' field exists or deriving from content
    // This is mock logic for now as 'type' isn't guaranteed
    const type = n.type || 'generic';
    return type === filter;
  });

  const getIcon = (type) => {
    switch (type) {
      case 'deadline': return <Clock size={16} className="text-yellow-600" />;
      case 'comment': return <MessageSquare size={16} className="text-green-600" />;
      case 'team': return <Users size={16} className="text-purple-600" />;
      case 'assignment': return <FileText size={16} className="text-blue-600" />;
      default: return <Bell size={16} className="text-gray-500" />;
    }
  };

  return (
    <div className="notification-dropdown w-80 shadow-xl border border-gray-200 rounded-lg overflow-hidden bg-white flex flex-col max-h-[500px]">

      {/* Header */}
      <div className="p-3 border-b flex justify-between items-center bg-gray-50">
        <h3 className="font-semibold text-sm">Notifications</h3>
        <div className="flex gap-2">
          <button className="text-xs text-blue-600 hover:underline" onClick={handleClearAll}>Clear all</button>
          <button onClick={onClose}><X size={16} className="text-gray-400 hover:text-gray-600" /></button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex bg-white text-xs border-b overflow-x-auto">
        {['all', 'assignment', 'deadline', 'comment', 'team'].map(f => (
          <button
            key={f}
            className={`px-3 py-2 border-b-2 whitespace-nowrap capitalize transition-colors ${filter === f ? 'border-blue-500 text-blue-600 font-medium' : 'border-transparent text-gray-500 hover:bg-gray-50'}`}
            onClick={() => setFilter(f)}
          >
            {f}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="notification-list flex-1 overflow-y-auto bg-white">
        {filtered.length === 0 ? (
          <div className="p-6 text-center text-gray-400 text-sm">
            No notifications found.
          </div>
        ) : (
          filtered.map((n) => (
            <div
              key={n._id}
              className={`p-3 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors flex gap-3 items-start ${!n.isRead ? 'bg-blue-50/50' : ''}`}
              onClick={() => handleRead(n)}
            >
              <div className="mt-0.5">
                {getIcon(n.type)}
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-800 leading-snug">{n.title || n.body}</p>
                <p className="text-xs text-gray-500 mt-1">{new Date(n.createdAt || Date.now()).toLocaleString()}</p>
              </div>
              {!n.isRead && <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5" title="Unread"></div>}
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      <div className="p-2 border-t bg-gray-50 text-center">
        <button className="text-xs text-blue-600 hover:text-blue-800" onClick={() => window.location.href = '/notifications'}>
          View all notifications
        </button>
      </div>
    </div>
  );
};

export default NotificationDropdown;
