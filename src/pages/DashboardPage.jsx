// src/pages/DashboardPage.jsx
import { useEffect, useState } from "react";
import ActivityFeed from "../components/activity/ActivityFeed";

const DashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [recentTasks, setRecentTasks] = useState([]);
  const [activity, setActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // PURE MOCK DATA – no backend, no axios
    setLoading(true);

    const timer = setTimeout(() => {
      setStats({
        totalTasks: 12,
        completedTasks: 5,
        upcomingTasks: 4,
        teams: 3,
      });

      setRecentTasks([
        {
          id: 1,
          title: "Finish TaskFlow frontend",
          dueDate: "2025-11-30",
        },
        {
          id: 2,
          title: "Review team tasks",
          dueDate: "2025-11-28",
        },
        {
          id: 3,
          title: "Prepare project presentation slides",
          dueDate: "2025-12-02",
        },
      ]);

      setActivity([
        {
          id: 1,
          message: 'You created team "Web Dev Group".',
          createdAt: new Date().toISOString(),
        },
        {
          id: 2,
          message: 'You added task "Finish TaskFlow frontend".',
          createdAt: new Date().toISOString(),
        },
        {
          id: 3,
          message: 'You joined team "CS Project Team".',
          createdAt: new Date().toISOString(),
        },
      ]);

      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div>
        <h2 className="page-title">Dashboard</h2>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="page-title">Dashboard</h2>

      <div className="dashboard-grid">
        {/* CARD 1 – TaskFlow Overview */}
        <div className="card">
          <h3>TaskFlow Overview</h3>
          {stats ? (
            <ul>
              <li>
                Total tasks: <span>{stats.totalTasks}</span>
              </li>
              <li>
                Completed tasks: <span>{stats.completedTasks}</span>
              </li>
              <li>
                Upcoming tasks: <span>{stats.upcomingTasks}</span>
              </li>
              <li>
                Teams: <span>{stats.teams}</span>
              </li>
            </ul>
          ) : (
            <p>No stats available.</p>
          )}
        </div>

        {/* CARD 2 – My Upcoming Tasks */}
        <div className="card">
          <h3>My Upcoming Tasks</h3>
          {recentTasks && recentTasks.length > 0 ? (
            <ul>
              {recentTasks.map((t) => (
                <li key={t.id}>
                  {t.title}
                  {t.dueDate && (
                    <span className="small">
                      {" "}
                      · due {new Date(t.dueDate).toLocaleDateString()}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p>No upcoming tasks.</p>
          )}
        </div>

        {/* CARD 3 – Recent Activity */}
        <div className="card">
          <h3>Recent Activity</h3>
          <ActivityFeed items={activity || []} />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
