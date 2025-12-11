import { useEffect, useState, useMemo } from "react";
import ActivityFeed from "../components/activity/ActivityFeed";
import CalendarView from "../components/calendar/CalendarView";
import StatCard from "../components/common/StatCard";
import TodaysFocusWidget from "../components/dashboard/TodaysFocusWidget";
import WorkloadWidget from "../components/dashboard/WorkloadWidget";
import taskApi from "../api/tasks";
import teamApi from "../api/teams";
import { Link } from "react-router-dom";
import { CheckCircle2, AlertCircle, Users, ArrowRight } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const DashboardPage = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activity, setActivity] = useState([]);

  // Get time-based greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [tasksRes, teamsRes] = await Promise.all([
          taskApi.getAll(),
          teamApi.getAll(),
        ]);

        let recentActivity = [];
        try {
          const activityRes = await import("../api/activity").then((m) =>
            m.default.getUserActivity()
          );
          recentActivity = activityRes.data;
        } catch (e) {
          console.warn("Activity load failed", e);
        }

        const allTasks = tasksRes.data;
        const teams = teamsRes.data;
        setTasks(allTasks);

        const overdue = allTasks.filter((t) => {
          if (t.status === "done" || !t.dueDate) return false;
          return new Date(t.dueDate) < new Date();
        }).length;

        // trends
        const now = new Date();
        const oneWeekAgo = new Date(
          now.getTime() - 7 * 24 * 60 * 60 * 1000
        );

        const thisWeekCompleted = allTasks.filter((t) => {
          if (t.status !== "done" || !t.updatedAt) return false;
          const completedDate = new Date(t.updatedAt);
          return completedDate >= oneWeekAgo;
        }).length;

        const completedTrend =
          thisWeekCompleted > 0 ? Math.min(thisWeekCompleted, 5) : null;

        setStats({
          completedTasks: allTasks.filter((t) => t.status === "done").length,
          completedTrend,
          overdueTasks: overdue,
          teams: teams.length,
          upcomingDeadlines: allTasks.filter(
            (t) => t.status !== "done" && t.dueDate
          ).length,
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

  const handleToggleComplete = async (taskId) => {
    try {
      const task = tasks.find((t) => t._id === taskId);
      if (!task) return;

      const newStatus = task.status === "done" ? "in-progress" : "done";
      await taskApi.update(taskId, { status: newStatus });

      const updatedTasks = tasks.map((t) =>
        t._id === taskId ? { ...t, status: newStatus } : t
      );

      setTasks(updatedTasks);

      setStats((prev) =>
        prev
          ? {
              ...prev,
              completedTasks: updatedTasks.filter(
                (t) => t.status === "done"
              ).length,
            }
          : prev
      );
    } catch (err) {
      console.error("Failed to update task", err);
    }
  };

  const calendarEvents = useMemo(
    () =>
      tasks
        .filter((t) => t.dueDate && t.status !== "done")
        .map((t) => ({
          id: t._id,
          title: t.title,
          date: t.dueDate.split("T")[0],
          time: "",
        })),
    [tasks]
  );

  const upcomingTasks = useMemo(
    () =>
      tasks
        .filter((t) => t.status !== "done" && t.dueDate)
        .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
        .slice(0, 5),
    [tasks]
  );

  if (loading)
    return (
      <div className="p-8 text-center text-gray-500">
        Loading dashboard...
      </div>
    );
  if (error)
    return (
      <div className="p-8 text-center text-red-500">
        {error}
      </div>
    );

  return (
    <div className="space-y-8 px-4 sm:px-6 lg:px-8 py-6">
      {/* Header */}
      <header className="flex flex-col gap-1">
        <h2 className="text-3xl font-bold tracking-tight text-[var(--text-main)]">
          {getGreeting()},{" "}
          <span className="text-[var(--primary)]">
            {user?.name?.split(" ")[0] || "there"}
          </span>{" "}
          👋
        </h2>
        <p className="text-sm text-[var(--text-secondary)]">
          Here&apos;s what&apos;s happening with your tasks today.
        </p>
      </header>

      {/* Quick Stats */}
      {stats && (
        <section className="grid grid-cols-1 gap-6 md:grid-cols-3 mb-8">
          <StatCard
            icon={CheckCircle2}
            label="Tasks Completed"
            value={stats.completedTasks}
            color="green"
            trend={stats.completedTrend}
          />

          <StatCard
            icon={AlertCircle}
            label="Tasks Overdue"
            value={stats.overdueTasks}
            color="red"
          />

          <StatCard
            icon={Users}
            label="Active Teams"
            value={stats.teams}
            color="purple"
          />
        </section>
      )}

      {/* Main 3-column area */}
      <section className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Today's Focus */}
        <div className="lg:col-span-4">
          <div className="card h-full">
            <div className="card-header">
              <h3 className="card-title">Today&apos;s Focus</h3>
            </div>
            <TodaysFocusWidget
              tasks={tasks}
              onToggleComplete={handleToggleComplete}
            />
          </div>
        </div>

        {/* Upcoming Deadlines */}
        <div className="lg:col-span-4">
          <div className="card h-full">
            <div className="card-header">
              <h3 className="card-title">Upcoming Deadlines</h3>
              <Link
                to="/tasks"
                className="text-sm text-[var(--primary)] hover:underline"
              >
                View all
              </Link>
            </div>

            {upcomingTasks.length > 0 ? (
              <ul
                className="divide-y divide-[var(--border)]"
                style={{ listStyle: "none", padding: 0 }}
              >
                {upcomingTasks.map((task) => (
                  <li
                    key={task._id}
                    className="py-3 flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          new Date(task.dueDate) < new Date()
                            ? "bg-red-500"
                            : "bg-yellow-500"
                        }`}
                      />
                      <div>
                        <p className="font-medium text-sm text-[var(--text-main)] group-hover:text-[var(--primary)] transition-colors">
                          {task.title}
                        </p>
                        <p className="text-xs text-[var(--text-secondary)]">
                          Due{" "}
                          {new Date(task.dueDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <button className="text-[var(--text-tertiary)] hover:text-[var(--primary)] opacity-0 group-hover:opacity-100 transition-opacity">
                      <ArrowRight size={16} />
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-[var(--text-secondary)] text-sm py-4">
                No upcoming deadlines.
              </p>
            )}
          </div>
        </div>

        {/* Mini Calendar */}
        <div className="lg:col-span-4">
          <div className="card p-0 overflow-hidden h-full">
            <div className="p-4 border-b border-[var(--border)]">
              <h3 className="card-title text-center">Calendar</h3>
            </div>
            <div className="p-2 text-xs">
              <CalendarView
                currentMonth={new Date()}
                tasks={tasks}
                events={calendarEvents}
                viewMode="month"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Bottom area: workload + recent activity */}
      <section className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="lg:col-span-6">
          <div className="card h-full">
            <div className="card-header">
              <h3 className="card-title">This Week&apos;s Workload</h3>
            </div>
            <WorkloadWidget tasks={tasks} />
          </div>
        </div>

        <div className="lg:col-span-6">
          <div className="card h-full">
            <div className="card-header">
              <h3 className="card-title">Recent Activity</h3>
              <Link
                to="/teams"
                className="text-sm text-[var(--primary)] hover:underline"
              >
                View all
              </Link>
            </div>
            <ActivityFeed items={activity} />
          </div>
        </div>
      </section>
    </div>
  );
};

export default DashboardPage;
