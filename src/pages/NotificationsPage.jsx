import { useState, useEffect } from "react";
import notificationApi from "../api/notifications";
import { Check, Bell, Clock, MessageSquare, Users, FileText, Filter } from "lucide-react";

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const res = await notificationApi.getAll();
      setNotifications(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleRead = async (id) => {
    try {
      await notificationApi.markRead(id);
      setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n));
    } catch (e) {
      console.error(e);
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case 'deadline': return <Clock size={20} className="text-yellow-600" />;
      case 'comment': return <MessageSquare size={20} className="text-green-600" />;
      case 'team': return <Users size={20} className="text-purple-600" />;
      case 'assignment': return <FileText size={20} className="text-blue-600" />;
      default: return <Bell size={20} className="text-gray-500" />;
    }
  };

  const filtered = notifications.filter(n => {
    if (filter === "all") return true;
    if (filter === "unread") return !n.isRead;
    return (n.type || 'generic') === filter;
  });

  return (
    <div className="page max-w-4xl mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-main)]">Notifications</h1>
          <p className="text-[var(--text-secondary)]">Stay updated with your team activity</p>
        </div>
        <button
          onClick={fetchNotifications}
          className="btn btn-secondary text-sm"
        >
          Refresh
        </button>
      </div>

      <div className="card">
        <div className="p-4 border-b border-[var(--border)] flex gap-4 overflow-x-auto">
          {['all', 'unread', 'assignment', 'deadline', 'comment', 'team'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${filter === f
                ? 'bg-blue-100 text-blue-700'
                : 'bg-[var(--bg-body)] text-[var(--text-secondary)] hover:bg-[var(--border)]'}`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        <div className="divide-y divide-[var(--border)]">
          {loading ? (
            <div
              className="p-8 text-center text-[var(--text-secondary)] flex items-center justify-center"
              style={{ minHeight: 260 }}
            >
              Loading...
            </div>
          ) : filtered.length === 0 ? (
            <div
              className="p-12 text-center text-[var(--text-secondary)] flex flex-col items-center justify-center gap-4"
              style={{ minHeight: 260 }}
            >
              <div className="w-16 h-16 bg-[var(--bg-body)] rounded-full flex items-center justify-center">
                <Bell size={32} className="opacity-20" />
              </div>
              <p>No notifications found.</p>
            </div>
          ) : (
            filtered.map(n => (
              <div
                key={n._id}
                className={`p-4 flex gap-4 hover:bg-[var(--bg-body)] transition-colors cursor-pointer ${!n.isRead ? 'bg-blue-50/10' : ''}`}
                onClick={() => handleRead(n._id)}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${!n.isRead ? 'bg-white shadow-sm' : 'bg-transparent'}`}>
                  {getIcon(n.type)}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h4 className={`text-sm mb-1 ${!n.isRead ? 'font-bold text-[var(--text-main)]' : 'font-medium text-[var(--text-secondary)]'}`}>
                      {n.title}
                    </h4>
                    <span className="text-xs text-[var(--text-secondary)] flex items-center gap-1">
                      {new Date(n.createdAt).toLocaleDateString()}
                      {!n.isRead && <span className="w-2 h-2 rounded-full bg-blue-500 block"></span>}
                    </span>
                  </div>
                  <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{n.body}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationsPage;
