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
      case 'deadline': return <Clock size={16} className="text-yellow-600 dark:text-yellow-400" />;
      case 'comment': return <MessageSquare size={16} className="text-green-600 dark:text-green-400" />;
      case 'team': return <Users size={16} className="text-purple-600 dark:text-purple-400" />;
      case 'assignment': return <FileText size={16} className="text-blue-600 dark:text-blue-400" />;
      default: return <Bell size={16} className="text-gray-500 dark:text-gray-300" />;
    }
  };

  return (
    <div 
      className="notification-dropdown w-96 shadow-xl rounded-lg flex flex-col max-h-[500px]"
      style={{ backgroundColor: 'var(--bg-surface)' }}
    >
      {/* Header */}
      <div 
        className="p-4 border-b flex justify-between items-center rounded-t-lg"
        style={{
          borderBottomColor: 'var(--border)',
          backgroundColor: 'var(--bg-muted)',
        }}
      >
        <h3 className="font-semibold text-sm" style={{ color: 'var(--text-main)' }}>Notifications</h3>
        <div className="flex gap-3">
          <button 
            className="text-xs px-3 py-1.5 rounded-lg transition-colors border-0 outline-none" 
            style={{ color: 'var(--primary)' }}
            onClick={handleClearAll}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--primary-lighter)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            Clear all
          </button>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg transition-colors border-0 outline-none"
            style={{ color: 'var(--text-secondary)' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--bg-hover)';
              e.currentTarget.style.color = 'var(--text-main)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = 'var(--text-secondary)';
            }}
          >
            <X size={16} />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div 
        className="flex text-xs border-b overflow-x-auto px-3 pt-3 pb-2 gap-2"
        style={{
          borderBottomColor: 'var(--border)',
          backgroundColor: 'var(--bg-surface)',
        }}
      >
        {['all', 'assignment', 'deadline', 'comment', 'team'].map(f => (
          <button
            key={f}
            className="px-4 py-2 rounded-lg whitespace-nowrap capitalize transition-colors border-0 outline-none font-medium"
            style={{
              backgroundColor: filter === f ? 'var(--primary-lighter)' : 'transparent',
              color: filter === f ? 'var(--primary)' : 'var(--text-secondary)',
            }}
            onClick={() => setFilter(f)}
            onMouseEnter={(e) => {
              if (filter !== f) {
                e.currentTarget.style.backgroundColor = 'var(--bg-hover)';
              }
            }}
            onMouseLeave={(e) => {
              if (filter !== f) {
                e.currentTarget.style.backgroundColor = 'transparent';
              }
            }}
          >
            {f}
          </button>
        ))}
      </div>

      {/* List */}
      <div 
        className="notification-list flex-1 overflow-y-auto p-2"
        style={{ backgroundColor: 'var(--bg-surface)' }}
      >
        {filtered.length === 0 ? (
          <div className="p-6 text-center text-sm" style={{ color: 'var(--text-tertiary)' }}>
            No notifications found.
          </div>
        ) : (
          filtered.map((n) => (
            <div
              key={n._id}
              className="p-3 rounded-lg cursor-pointer transition-colors flex gap-3 items-start mb-2"
              style={{
                backgroundColor: !n.isRead ? 'var(--primary-lighter)' : 'transparent',
              }}
              onClick={() => handleRead(n)}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--bg-hover)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = !n.isRead ? 'var(--primary-lighter)' : 'transparent';
              }}
            >
              <div className="mt-0.5">
                {getIcon(n.type)}
              </div>
              <div className="flex-1">
                <p className="text-sm leading-snug" style={{ color: 'var(--text-main)' }}>{n.title || n.body}</p>
                <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>{new Date(n.createdAt || Date.now()).toLocaleString()}</p>
              </div>
              {!n.isRead && <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5" title="Unread"></div>}
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      <div 
        className="p-2 border-t text-center rounded-b-lg"
        style={{
          borderTopColor: 'var(--border)',
          backgroundColor: 'var(--bg-muted)',
        }}
      >
        <button 
          className="text-xs px-4 py-2 rounded-lg transition-colors border-0 outline-none" 
          style={{ color: 'var(--primary)' }}
          onClick={() => window.location.href = '/notifications'}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--primary-lighter)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
          }}
        >
          View all notifications
        </button>
      </div>
    </div>
  );
};

export default NotificationDropdown;
