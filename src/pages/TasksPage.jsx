import { useEffect, useMemo, useState } from "react";
import TaskCard from "../components/tasks/TaskCard";
import TaskDetailModal from "../components/tasks/TaskDetailModal";
import NewTaskModal from "../components/tasks/NewTaskModal";
import EmptyState from "../components/common/EmptyState";
import { useTasks } from "../context/TaskContext";
import { Filter, Calendar, List as ListIcon, Plus, X, CheckCircle } from "lucide-react";
import CalendarView from "../components/calendar/CalendarView";
import { useLocation, useNavigate } from "react-router-dom";

const TasksPage = () => {
  const { tasks, addTask, toggleTask, deleteTask } = useTasks();
  const location = useLocation();
  const navigate = useNavigate();

  // View State
  const [viewMode, setViewMode] = useState("list"); // list | calendar
  const [showFilters, setShowFilters] = useState(false);

  // Filter State
  const [filters, setFilters] = useState({
    status: "all",
    priority: [], // Array for multi-select checkboxes
    search: "",
    category: [],
    dateRange: "all", // all | today | this-week
    sortBy: "dueDate" // dueDate | priority | created | title
  });

  // Task Detail Modal State
  const [selectedTask, setSelectedTask] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New Task Modal State
  const [showNewTaskModal, setShowNewTaskModal] = useState(false);

  // Bulk Actions State
  const [selectedTaskIds, setSelectedTaskIds] = useState([]);
  const [bulkMode, setBulkMode] = useState(false);

  const handleCreate = async (formData) => {
    try {
      await addTask(formData);
      setShowNewTaskModal(false);
    } catch (error) {
      console.error("Failed to create task", error);
    }
  };

  const handleTaskClick = (task) => {
    if (bulkMode) {
      // Toggle selection in bulk mode
      setSelectedTaskIds(prev =>
        prev.includes(task._id)
          ? prev.filter(id => id !== task._id)
          : [...prev, task._id]
      );
    } else {
      setSelectedTask(task);
      setIsModalOpen(true);
    }
  };

  const toggleSelectAll = () => {
    if (selectedTaskIds.length === filteredTasks.length) {
      setSelectedTaskIds([]);
    } else {
      setSelectedTaskIds(filteredTasks.map(t => t._id));
    }
  };

  const handleBulkComplete = async () => {
    for (const taskId of selectedTaskIds) {
      await toggleTask(taskId);
    }
    setSelectedTaskIds([]);
    setBulkMode(false);
  };

  const handleBulkDelete = async () => {
    if (window.confirm(`Delete ${selectedTaskIds.length} selected tasks?`)) {
      for (const taskId of selectedTaskIds) {
        await deleteTask(taskId);
      }
      setSelectedTaskIds([]);
      setBulkMode(false);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedTask(null);
  };

  const handleUpdateTask = async (updatedTask) => {
    // Update task logic would go here
    console.log("Update task:", updatedTask);
    handleCloseModal();
  };

  const handleDeleteTask = async (taskId) => {
    await deleteTask(taskId);
    handleCloseModal();
  };

  const filteredTasks = useMemo(() => {
    return tasks.filter((t) => {
      // 1. Search
      if (filters.search && !t.title.toLowerCase().includes(filters.search.toLowerCase())) return false;

      // 2. Status
      if (filters.status !== "all" && t.status !== filters.status) return false;
      if (filters.status === "active" && t.status === "done") return false;
      if (filters.status === "completed" && t.status !== "done") return false;

      // 3. Priority (Mocking if not in DB yet)
      // if (filters.priority !== "all" && t.priority !== filters.priority) return false;

      // 4. Date Range
      if (filters.dateRange !== 'all') {
        if (!t.dueDate) return false;
        const due = new Date(t.dueDate);
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

        if (filters.dateRange === 'today') {
          const isToday = due.getDate() === today.getDate() &&
            due.getMonth() === today.getMonth() &&
            due.getFullYear() === today.getFullYear();
          if (!isToday) return false;
        }

        if (filters.dateRange === 'this-week') {
          // simple check for next 7 days
          const diffTime = due - today;
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          if (diffDays < 0 || diffDays > 7) return false;
        }
      }

      return true;
    });
  }, [tasks, filters]);

  // Open task detail if navigated from dashboard with a taskId
  useEffect(() => {
    const taskId = location.state?.taskId;
    if (!taskId || !tasks.length) return;

    const match = tasks.find((t) => t._id === taskId);
    if (match) {
      setSelectedTask(match);
      setIsModalOpen(true);
      navigate(location.pathname, { replace: true });
    }
  }, [location.state, tasks, navigate, location.pathname]);

  // Calendar Events Mapper
  const calendarEvents = useMemo(() =>
    filteredTasks
      .filter(t => t.dueDate)
      .map(t => ({
        id: t._id,
        title: t.title,
        date: t.dueDate.split('T')[0],
        time: ''
      }))
    , [filteredTasks]);

  return (
    <div className="page page--fill">
      <div
        className="flex flex-1 rounded-lg shadow-sm overflow-hidden"
        style={{
          backgroundColor: 'var(--bg-surface)',
          border: '1px solid var(--border)',
        }}
      >

      {/* Filters Sidebar (Collapsible) */}
      <div
        className={`border-r transition-all duration-300 ${showFilters ? 'w-64' : 'w-0 overflow-hidden'}`}
        style={{
          display: showFilters ? 'block' : 'none',
          backgroundColor: 'var(--bg-muted)',
          borderColor: 'var(--border)',
        }}
      >
        <div className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h3
              className="font-bold text-sm uppercase"
              style={{ color: 'var(--text-secondary)' }}
            >
              Filters
            </h3>
            <button
              onClick={() => setShowFilters(false)}
              style={{ color: 'var(--text-tertiary)' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = 'var(--text-secondary)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = 'var(--text-tertiary)';
              }}
            >
              <X size={16} />
            </button>
          </div>

          {/* Search inside filters */}
          <div className="mb-6">
            <label
              className="text-xs font-semibold mb-2 block"
              style={{ color: 'var(--text-secondary)' }}
            >
              Search
            </label>
            <input
              type="text"
              placeholder="Filter tasks..."
              value={filters.search}
              onChange={(e) => setFilters(f => ({ ...f, search: e.target.value }))}
              className="w-full px-3 py-1.5 text-sm rounded-md outline-none transition-all"
              style={{
                backgroundColor: 'var(--bg-surface)',
                border: '1px solid var(--border)',
                color: 'var(--text-main)',
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = 'var(--primary)';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = 'var(--border)';
              }}
            />
          </div>

          <div className="mb-6">
            <label
              className="text-xs font-semibold mb-2 block"
              style={{ color: 'var(--text-secondary)' }}
            >
              Status
            </label>
            <div className="flex flex-col gap-1">
              {['all', 'active', 'completed'].map(s => (
                <button
                  key={s}
                  onClick={() => setFilters(f => ({ ...f, status: s }))}
                  className="text-left px-3 py-1.5 rounded text-sm transition-colors"
                  style={{
                    backgroundColor: filters.status === s ? 'var(--primary-lighter)' : 'transparent',
                    color: filters.status === s ? 'var(--primary)' : 'var(--text-main)',
                    fontWeight: filters.status === s ? '600' : '400',
                  }}
                  onMouseEnter={(e) => {
                    if (filters.status !== s) {
                      e.currentTarget.style.backgroundColor = 'var(--bg-hover)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (filters.status !== s) {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }
                  }}
                >
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <label
              className="text-xs font-semibold mb-2 block"
              style={{ color: 'var(--text-secondary)' }}
            >
              Date
            </label>
            <div className="flex flex-col gap-1">
              {[
                { id: 'all', label: 'All Time' },
                { id: 'today', label: 'Today' },
                { id: 'this-week', label: 'This Week' }
              ].map(d => (
                <button
                  key={d.id}
                  onClick={() => setFilters(f => ({ ...f, dateRange: d.id }))}
                  className="text-left px-3 py-1.5 rounded text-sm transition-colors"
                  style={{
                    backgroundColor: filters.dateRange === d.id ? 'var(--primary-lighter)' : 'transparent',
                    color: filters.dateRange === d.id ? 'var(--primary)' : 'var(--text-main)',
                    fontWeight: filters.dateRange === d.id ? '600' : '400',
                  }}
                  onMouseEnter={(e) => {
                    if (filters.dateRange !== d.id) {
                      e.currentTarget.style.backgroundColor = 'var(--bg-hover)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (filters.dateRange !== d.id) {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }
                  }}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>

          {/* Priority Filter */}
          <div className="mb-6">
            <label
              className="text-xs font-semibold mb-2 block"
              style={{ color: 'var(--text-secondary)' }}
            >
              Priority
            </label>
            <div className="flex flex-col gap-2">
              {[
                { id: 'high', label: 'High', color: 'var(--danger)' },
                { id: 'medium', label: 'Medium', color: 'var(--warning)' },
                { id: 'low', label: 'Low', color: 'var(--success)' }
              ].map(p => (
                <label
                  key={p.id}
                  className="flex items-center gap-2 cursor-pointer px-2 py-1 rounded transition-colors"
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--bg-hover)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  <input
                    type="checkbox"
                    checked={filters.priority.includes(p.id)}
                    onChange={() => {
                      setFilters(f => ({
                        ...f,
                        priority: f.priority.includes(p.id)
                          ? f.priority.filter(pr => pr !== p.id)
                          : [...f.priority, p.id]
                      }));
                    }}
                    className="w-4 h-4"
                    style={{ accentColor: 'var(--primary)' }}
                  />
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: p.color }}
                  />
                  <span className="text-sm" style={{ color: 'var(--text-main)' }}>
                    {p.label}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">

        {/* Header Toolbar */}
        <div
          className="p-4 border-b flex items-center justify-between"
          style={{
            backgroundColor: 'var(--bg-surface)',
            borderColor: 'var(--border)',
          }}
        >
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="p-2 rounded transition-colors"
              style={{
                color: showFilters ? 'var(--primary)' : 'var(--text-secondary)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--bg-hover)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
              title="Toggle Filters"
            >
              <Filter size={18} />
            </button>
            <h2
              className="text-xl font-bold"
              style={{ color: 'var(--text-main)' }}
            >
              My Tasks
            </h2>
            <span
              className="px-2 py-0.5 rounded-full text-xs font-medium"
              style={{
                backgroundColor: 'var(--bg-muted)',
                color: 'var(--text-secondary)',
              }}
            >
              {filteredTasks.length}
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* New Task Button */}
            <button
              onClick={() => setShowNewTaskModal(true)}
              className="btn btn-primary gap-2"
              title="Create New Task"
            >
              <Plus size={18} />
              New Task
            </button>

            {/* View Toggles */}
            <div
              className="flex p-1 rounded-md gap-1"
              style={{ backgroundColor: 'var(--bg-muted)' }}
            >
              <button
                onClick={() => setViewMode("list")}
                className="p-1.5 rounded transition-colors"
                style={{
                  backgroundColor: viewMode === 'list' ? 'var(--bg-surface)' : 'transparent',
                  color: viewMode === 'list' ? 'var(--primary)' : 'var(--text-secondary)',
                  boxShadow: viewMode === 'list' ? 'var(--shadow-sm)' : 'none',
                }}
                onMouseEnter={(e) => {
                  if (viewMode !== 'list') {
                    e.currentTarget.style.color = 'var(--text-main)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (viewMode !== 'list') {
                    e.currentTarget.style.color = 'var(--text-secondary)';
                  }
                }}
              >
                <ListIcon size={16} />
              </button>
              <button
                onClick={() => setViewMode("calendar")}
                className="p-1.5 rounded transition-colors"
                style={{
                  backgroundColor: viewMode === 'calendar' ? 'var(--bg-surface)' : 'transparent',
                  color: viewMode === 'calendar' ? 'var(--primary)' : 'var(--text-secondary)',
                  boxShadow: viewMode === 'calendar' ? 'var(--shadow-sm)' : 'none',
                }}
                onMouseEnter={(e) => {
                  if (viewMode !== 'calendar') {
                    e.currentTarget.style.color = 'var(--text-main)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (viewMode !== 'calendar') {
                    e.currentTarget.style.color = 'var(--text-secondary)';
                  }
                }}
              >
                <Calendar size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Filters Quick Tabs (Horizontal) for commonly used views */}
        <div
          className="px-4 py-4 border-b flex gap-2 text-sm"
          style={{
            borderColor: 'var(--border)',
            backgroundColor: 'var(--bg-muted)',
          }}
        >
          {['All Tasks', 'Today', 'This Week'].map(tab => {
            const key = tab.toLowerCase().replace(' ', '-');
            const isActive = (key === 'all-tasks' && filters.dateRange === 'all') ||
              (key === filters.dateRange);
            return (
              <button
                key={tab}
                className="px-4 py-2 rounded-lg font-medium transition-colors border-0 outline-none"
                style={{
                  backgroundColor: isActive ? 'var(--primary-lighter)' : 'transparent',
                  color: isActive ? 'var(--primary)' : 'var(--text-secondary)',
                }}
                onClick={() => setFilters(f => ({ ...f, dateRange: key === 'all-tasks' ? 'all' : key }))}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor = 'var(--bg-hover)';
                    e.currentTarget.style.color = 'var(--text-main)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = 'var(--text-secondary)';
                  }
                }}
              >
                {tab}
              </button>
            )
          })}
        </div>

        {/* Content Area */}
        <div
          className="flex-1 overflow-y-auto p-4 relative"
          style={{ backgroundColor: 'var(--bg-body)' }}
        >

          {viewMode === 'list' && (
            <>
              {/* Task Cards Grid */}
              {filteredTasks.length > 0 ? (
                <div className="flex flex-col" style={{ gap: '22px' }}>
                  {filteredTasks.map(task => (
                    <TaskCard
                      key={task._id}
                      task={task}
                      onToggle={toggleTask}
                      onClick={handleTaskClick}
                      onDelete={deleteTask}
                      bulkMode={bulkMode}
                      isSelected={selectedTaskIds.includes(task._id)}
                    />
                  ))}
                </div>
              ) : (
                <EmptyState
                  icon={CheckCircle}
                  title="No tasks found"
                  description={
                    filters.status !== 'all' || filters.search || filters.dateRange !== 'all'
                      ? "Try adjusting your filters to see more tasks"
                      : "Create your first task to get started!"
                  }
                  actionLabel="Create Task"
                  onAction={() => setShowNewTaskModal(true)}
                  variant="info"
                />
              )}
            </>
          )}

          {viewMode === 'calendar' && (
            <div
              className="rounded-lg shadow-sm p-4 h-full overflow-auto"
              style={{
                backgroundColor: 'var(--bg-surface)',
                border: '1px solid var(--border)',
              }}
            >
              <CalendarView
                currentMonth={new Date()}
                tasks={filteredTasks}
                events={calendarEvents}
                viewMode="month"
                onTaskClick={handleTaskClick}
              />
            </div>
          )}
        </div>
      </div>

      {/* Bulk Action Bar */}
      {bulkMode && selectedTaskIds.length > 0 && (
        <div
          className="fixed bottom-6 left-1/2 -translate-x-1/2 px-6 py-4 rounded-lg shadow-2xl z-50 flex items-center gap-6 animate-slide-in-up"
          style={{
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--border)',
            color: 'var(--text-main)',
          }}
        >
          <span className="font-semibold">
            {selectedTaskIds.length} task{selectedTaskIds.length !== 1 ? 's' : ''} selected
          </span>

          <div className="flex gap-2">
            <button
              onClick={handleBulkComplete}
              className="px-4 py-2 rounded-md text-sm font-medium transition-colors"
              style={{
                backgroundColor: 'var(--success)',
                color: 'white',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--success-hover)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--success)';
              }}
            >
              Complete All
            </button>
            <button
              onClick={handleBulkDelete}
              className="px-4 py-2 rounded-md text-sm font-medium transition-colors"
              style={{
                backgroundColor: 'var(--danger)',
                color: 'white',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--danger-hover)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--danger)';
              }}
            >
              Delete All
            </button>
            <button
              onClick={() => {
                setSelectedTaskIds([]);
                setBulkMode(false);
              }}
              className="px-4 py-2 rounded-md text-sm font-medium transition-colors"
              style={{
                backgroundColor: 'var(--bg-muted)',
                color: 'var(--text-main)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--bg-hover)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--bg-muted)';
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

        {/* New Task Modal */}
        {showNewTaskModal && (
          <NewTaskModal
            onClose={() => setShowNewTaskModal(false)}
            onCreate={handleCreate}
          />
        )}

        {/* Task Detail Modal */}
        <TaskDetailModal
          task={selectedTask}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onUpdate={handleUpdateTask}
          onDelete={handleDeleteTask}
        />
      </div>
    </div>
  );
};

export default TasksPage;
