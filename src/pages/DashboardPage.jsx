import { useEffect, useState, useMemo } from "react";
import ActivityFeed from "../components/activity/ActivityFeed";
import CalendarView from "../components/calendar/CalendarView";
import taskApi from "../api/tasks";
import teamApi from "../api/teams";
import activityApi from "../api/activity";
import { Link } from "react-router-dom";
import { CheckCircle2, AlertCircle, Users, ArrowRight } from "lucide-react";

const DashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activity, setActivity] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Include activityApi.getUserActivity() in the Promise.all
        const [tasksRes, teamsRes] = await Promise.all([
          taskApi.getAll(),
          teamApi.getAll()
        ]);

        // Attempt to fetch activity separately to not block dashboard if it fails or is empty
        let recentActivity = [];
        try {
          const activityRes = await import("../api/activity").then(m => m.default.getUserActivity());
          recentActivity = activityRes.data;
        } catch (e) { console.warn("Activity load failed", e); }

        const allTasks = tasksRes.data;
        const teams = teamsRes.data;
        setTasks(allTasks);

        // Calculate stats
        const now = new Date();
        const overdue = allTasks.filter(t => {
          if (t.status === 'done' || !t.dueDate) return false;
          return new Date(t.dueDate) < new Date();
        }).length;

        setStats({
          completedTasks: allTasks.filter(t => t.status === 'done').length,
          overdueTasks: overdue,
          teams: teams.length,
          upcomingDeadlines: allTasks.filter(t => t.status !== 'done' && t.dueDate).length
        });

        setActivity(recentActivity);
        setLoading(false);
      } catch (err) {
        console.error("Dashboard load error", err);
        setError("Failed to load dashboard data.");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Events for Calendar
  const calendarEvents = useMemo(() =>
    tasks
      .filter(t => t.dueDate && t.status !== 'done')
      .map(t => ({
        id: t._id,
        title: t.title,
        date: t.dueDate.split('T')[0], // YYYY-MM-DD
        time: ''
      }))
    , [tasks]);

  const upcomingTasks = useMemo(() =>
    tasks
      .filter(t => t.status !== 'done' && t.dueDate)
      .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
      .slice(0, 5)
    , [tasks]);

  if (loading) return <div className="p-8 text-center text-gray-500">Loading dashboard...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-2">Dashboard</h2>
        <p className="text-gray-500">Welcome back! Here's what's happening today.</p>
      </div>

      {/* Quick Stats */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
          <div className="card flex flex-row items-center gap-4 p-6">
            <div className="p-3 bg-green-100 text-green-600 rounded-full">
              <CheckCircle2 size={24} />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Tasks Completed</p>
              <h3 className="text-2xl font-bold m-0 text-left">{stats.completedTasks}</h3>
            </div>
          </div>

          <div className="card flex flex-row items-center gap-4 p-6">
            <div className="p-3 bg-red-100 text-red-600 rounded-full">
              <AlertCircle size={24} />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Tasks Overdue</p>
              <h3 className="text-2xl font-bold m-0 text-left">{stats.overdueTasks}</h3>
            </div>
          </div>

          <div className="card flex flex-row items-center gap-4 p-6">
            <div className="p-3 bg-blue-100 text-blue-600 rounded-full">
              <Users size={24} />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Active Teams</p>
              <h3 className="text-2xl font-bold m-0 text-left">{stats.teams}</h3>
            </div>
          </div>
        </div>
      )}

      {/* 3-Column Layout */}
      <div className="grid-cols-1 lg:grid-cols-12 gap-6" style={{ display: 'grid', gridTemplateColumns: '4fr 3fr 3fr', gap: '1.5rem' }}>

        {/* Column 1 (40%): Today's Tasks + Upcoming */}
        <div className="flex flex-col gap-6" style={{ gridColumn: 'span 1' }}>
          <div className="card h-full">
            <div className="card-header">
              <h3 className="card-title">Upcoming Deadlines</h3>
              <Link to="/tasks" className="text-sm text-primary hover:underline">View all</Link>
            </div>

            {upcomingTasks.length > 0 ? (
              <ul className="divide-y divide-gray-100" style={{ listStyle: 'none', padding: 0 }}>
                {upcomingTasks.map(task => (
                  <li key={task._id} className="py-3 flex items-center justify-between group">
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${new Date(task.dueDate) < new Date() ? 'bg-red-500' : 'bg-yellow-500'}`} />
                      <div>
                        <p className="font-medium text-sm text-gray-900 group-hover:text-primary transition-colors">{task.title}</p>
                        <p className="text-xs text-gray-500">Due {new Date(task.dueDate).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <button className="text-gray-400 hover:text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                      <ArrowRight size={16} />
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 text-sm py-4">No upcoming deadlines.</p>
            )}

            <button
              className="btn btn-secondary w-full mt-4 text-sm"
              onClick={() => window.location.href = '/tasks?filter=today'}
            >
              See Today's Tasks
            </button>
          </div>
        </div>

        {/* Column 2 (30%): Calendar Mini-View */}
        <div style={{ gridColumn: 'span 1' }}>
          <div className="card p-0 overflow-hidden h-full">
            <div className="p-4 border-b border-gray-100">
              <h3 className="card-title text-center">Calendar</h3>
            </div>
            <div className="p-2 text-xs">
              {/* Reusing CalendarView but forcing it to be compact via CSS if needed, or just standard */}
              <CalendarView
                currentMonth={new Date()}
                events={calendarEvents}
                viewMode="month"
              />
            </div>
          </div>
        </div>

        {/* Column 3 (30%): Recent Teams Activity */}
        <div style={{ gridColumn: 'span 1' }}>
          <div className="card h-full">
            <div className="card-header">
              <h3 className="card-title">Recent Activity</h3>
            </div>
            <ActivityFeed items={activity} />
            <Link to="/teams" className="btn btn-ghost btn-sm w-full mt-4 text-center block">
              View Team Updates
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};

export default DashboardPage;
