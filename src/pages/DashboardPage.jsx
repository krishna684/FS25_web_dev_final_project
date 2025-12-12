import { useEffect, useState, useMemo, useCallback } from "react";
import ActivityFeed from "../components/activity/ActivityFeed";
import CalendarView from "../components/calendar/CalendarView";
import StatCard from "../components/common/StatCard";
import TodaysFocusWidget from "../components/dashboard/TodaysFocusWidget";
import WorkloadWidget from "../components/dashboard/WorkloadWidget";
import NewTaskModal from "../components/tasks/NewTaskModal";
import taskApi from "../api/tasks";
import teamApi from "../api/teams";
import { Link, useNavigate } from "react-router-dom";
import { CheckCircle2, AlertCircle, Users, ArrowRight, Circle } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useTasks } from "../context/TaskContext";
import { formatDueDate, getDueDateStatus, getDueDateColor, getPriorityConfig, getCommentCount } from "../utils/taskHelpers";

const DashboardPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { tasks, addTask, toggleTask, refresh: refreshTasks } = useTasks();
  const [stats, setStats] = useState(null);
  const [teamsCount, setTeamsCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activity, setActivity] = useState([]);
  const [showNewTaskModal, setShowNewTaskModal] = useState(false);

  // Get time-based greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  const computeStats = useCallback((allTasks, numTeams) => {
    const overdue = allTasks.filter((t) => {
      if (t.status === "done" || !t.dueDate) return false;
      return new Date(t.dueDate) < new Date();
    }).length;

    // trends
    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const thisWeekCompleted = allTasks.filter((t) => {
      if (t.status !== "done" || !t.updatedAt) return false;
      const completedDate = new Date(t.updatedAt);
      return completedDate >= oneWeekAgo;
    }).length;

    const completedTrend =
      thisWeekCompleted > 0 ? Math.min(thisWeekCompleted, 5) : null;

    return {
      completedTasks: allTasks.filter((t) => t.status === "done").length,
      completedTrend,
      overdueTasks: overdue,
      teams: numTeams,
      upcomingDeadlines: allTasks.filter((t) => t.status !== "done" && t.dueDate)
        .length,
    };
  }, []);

  // Fetch teams and activity (tasks come from TaskContext)
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const teamsRes = await teamApi.getAll();

      let recentActivity = [];
      try {
        const activityRes = await import("../api/activity").then((m) =>
          m.default.getUserActivity()
        );
        recentActivity = activityRes.data;
      } catch (e) {
        console.warn("Activity load failed", e);
      }

      setTeamsCount(teamsRes.data.length);
      setActivity(recentActivity);
      setLoading(false);
    } catch (err) {
      console.error("Dashboard load error", err);
      setError("Failed to load dashboard data.");
      setLoading(false);
    }
  }, []);

  // Compute stats whenever tasks change
  useEffect(() => {
    if (tasks.length > 0 || teamsCount > 0) {
      setStats(computeStats(tasks, teamsCount));
    }
  }, [tasks, teamsCount, computeStats]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Ctrl+K quick add shortcut (matches hint shown in Today's Focus widget)
  useEffect(() => {
    const onKeyDown = (e) => {
      const key = String(e.key || "").toLowerCase();
      const isHotkey = (e.ctrlKey || e.metaKey) && key === "k";
      if (!isHotkey) return;

      const target = e.target;
      const tag = String(target?.tagName || "").toLowerCase();
      const isTypingContext =
        tag === "input" || tag === "textarea" || target?.isContentEditable;

      if (isTypingContext) return;

      e.preventDefault();
      setShowNewTaskModal(true);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  // Use TaskContext's addTask - this updates both Dashboard and TasksPage
  const handleCreateTask = async (taskData) => {
    const created = await addTask(taskData);
    return created;
  };

  // Use TaskContext's toggleTask - this updates both Dashboard and TasksPage
  const handleToggleComplete = async (taskId) => {
    await toggleTask(taskId);
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

  const handleOpenTaskDetails = (task) => {
    if (!task) return;
    if (task.teamId) {
      navigate(`/teams/${task.teamId}`, { state: { taskId: task._id } });
    } else {
      navigate("/tasks", { state: { taskId: task._id } });
    }
  };

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
    <div className="page">
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
        <section className="grid grid-cols-1 gap-6 md:grid-cols-3">
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
          <TodaysFocusWidget
            tasks={tasks}
            onToggleComplete={handleToggleComplete}
            onTaskClick={handleOpenTaskDetails}
          />
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
              <div className="flex flex-col" style={{ gap: '22px' }}>
                {upcomingTasks.map((task) => {
                  const dueDateStatus = getDueDateStatus(task.dueDate);
                  const dueDateColor = getDueDateColor(dueDateStatus);
                  const priorityConfig = getPriorityConfig(task.priority);
                  const commentCount = getCommentCount(task.comments);

                  return (
                    <div
                      key={task._id}
                      className="dashboard-task-card group"
                      style={{
                        borderLeft: `3px solid ${priorityConfig.borderColor}`
                      }}
                      onClick={() => handleOpenTaskDetails(task)}
                      role="button"
                    >
                      <div className="flex items-center gap-3">
                        {/* Checkbox */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggleComplete(task._id);
                          }}
                          className="flex-shrink-0 text-[var(--text-secondary)] hover:text-[var(--primary)] transition-colors"
                          aria-label={`Mark "${task.title}" as complete`}
                        >
                          <Circle size={18} strokeWidth={2} />
                        </button>

                        {/* Task Content */}
                        <div className="flex-1 min-w-0">
                          {/* Title Row */}
                          <div className="flex items-center justify-between gap-2 mb-1">
                            <h4 className="task-card-title truncate">
                              {task.title}
                            </h4>
                            <span 
                              className="task-priority-badge flex-shrink-0"
                              style={{
                                backgroundColor: priorityConfig.bgColor,
                                color: priorityConfig.textColor
                              }}
                            >
                              {priorityConfig.label}
                            </span>
                          </div>

                          {/* Metadata Row */}
                          <div className="task-metadata">
                            <span 
                              className="metadata-item"
                              style={{ color: dueDateColor }}
                            >
                              📅 {formatDueDate(task.dueDate)}
                            </span>
                            {task.category && (
                              <>
                                <span className="metadata-separator">•</span>
                                <span className="metadata-item">
                                  {task.category}
                                </span>
                              </>
                            )}
                            <span className="metadata-separator">•</span>
                            <span className="metadata-item">
                              💬 {commentCount || 0}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
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

      {/* Ctrl+K Quick Add */}
      {showNewTaskModal && (
        <NewTaskModal
          onClose={() => setShowNewTaskModal(false)}
          onCreate={handleCreateTask}
        />
      )}
    </div>
  );
};

export default DashboardPage;
