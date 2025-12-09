import { useMemo, useState } from "react";
import TaskCard from "../components/tasks/TaskCard";
import TaskDetailModal from "../components/tasks/TaskDetailModal";
import NewTaskModal from "../components/tasks/NewTaskModal";
import EmptyState from "../components/common/EmptyState";
import { useTasks } from "../context/TaskContext";
import { Filter, Calendar, List as ListIcon, Search, Plus, X, CheckCircle } from "lucide-react";
import CalendarView from "../components/calendar/CalendarView";

const TasksPage = () => {
  const { tasks, addTask, toggleTask, deleteTask } = useTasks();

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
    <div className="flex h-[calc(100vh-theme(spacing.32))] bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">

      {/* Filters Sidebar (Collapsible) */}
      <div
        className={`bg-gray-50 border-r border-gray-200 transition-all duration-300 ${showFilters ? 'w-64' : 'w-0 overflow-hidden'}`}
        style={{ display: showFilters ? 'block' : 'none' }}
      >
        <div className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-sm uppercase text-gray-500">Filters</h3>
            <button onClick={() => setShowFilters(false)} className="text-gray-400 hover:text-gray-600">
              <X size={16} />
            </button>
          </div>

          <div className="mb-6">
            <label className="text-xs font-semibold text-gray-500 mb-2 block">Status</label>
            <div className="flex flex-col gap-1">
              {['all', 'active', 'completed'].map(s => (
                <button
                  key={s}
                  onClick={() => setFilters(f => ({ ...f, status: s }))}
                  className={`text-left px-3 py-1.5 rounded text-sm ${filters.status === s ? 'bg-blue-100 text-blue-700 font-medium' : 'hover:bg-gray-200'}`}
                >
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <label className="text-xs font-semibold text-gray-500 mb-2 block">Date</label>
            <div className="flex flex-col gap-1">
              {[
                { id: 'all', label: 'All Time' },
                { id: 'today', label: 'Today' },
                { id: 'this-week', label: 'This Week' }
              ].map(d => (
                <button
                  key={d.id}
                  onClick={() => setFilters(f => ({ ...f, dateRange: d.id }))}
                  className={`text-left px-3 py-1.5 rounded text-sm ${filters.dateRange === d.id ? 'bg-blue-100 text-blue-700 font-medium' : 'hover:bg-gray-200'}`}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>

          {/* Priority Filter */}
          <div className="mb-6">
            <label className="text-xs font-semibold text-gray-500 mb-2 block">Priority</label>
            <div className="flex flex-col gap-2">
              {[
                { id: 'high', label: 'High', color: 'bg-red-500' },
                { id: 'medium', label: 'Medium', color: 'bg-yellow-500' },
                { id: 'low', label: 'Low', color: 'bg-green-500' }
              ].map(p => (
                <label key={p.id} className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 px-2 py-1 rounded transition-colors">
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
                  />
                  <div className={`w-3 h-3 rounded-full ${p.color}`} />
                  <span className="text-sm">{p.label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">

        {/* Header Toolbar */}
        <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-white">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`p-2 rounded hover:bg-gray-100 ${showFilters ? 'text-primary' : 'text-gray-500'}`}
              title="Toggle Filters"
            >
              <Filter size={18} />
            </button>
            <h2 className="text-xl font-bold">My Tasks</h2>
            <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-xs font-medium">
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

            {/* Search */}
            <div className="relative">
              <Search size={16} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Filter tasks..."
                value={filters.search}
                onChange={(e) => setFilters(f => ({ ...f, search: e.target.value }))}
                className="pl-8 pr-3 py-1.5 text-sm border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent outline-none w-48 transition-all"
              />
            </div>

            {/* View Toggles */}
            <div className="flex bg-gray-100 p-1 rounded-md">
              <button
                onClick={() => setViewMode("list")}
                className={`p-1.5 rounded ${viewMode === 'list' ? 'bg-white shadow-sm text-primary' : 'text-gray-500 hover:text-gray-700'}`}
              >
                <ListIcon size={16} />
              </button>
              <button
                onClick={() => setViewMode("calendar")}
                className={`p-1.5 rounded ${viewMode === 'calendar' ? 'bg-white shadow-sm text-primary' : 'text-gray-500 hover:text-gray-700'}`}
              >
                <Calendar size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Filters Quick Tabs (Horizontal) for commonly used views */}
        <div className="px-4 pt-2 border-b border-gray-100 flex gap-6 text-sm">
          {['All Tasks', 'Today', 'This Week'].map(tab => {
            const key = tab.toLowerCase().replace(' ', '-');
            const isActive = (key === 'all-tasks' && filters.dateRange === 'all') ||
              (key === filters.dateRange);
            return (
              <button
                key={tab}
                className={`pb-2 border-b-2 font-medium transition-colors ${isActive ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-800'}`}
                onClick={() => setFilters(f => ({ ...f, dateRange: key === 'all-tasks' ? 'all' : key }))}
              >
                {tab}
              </button>
            )
          })}
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4 bg-gray-50 relative">

          {viewMode === 'list' && (
            <>
              {/* Task Cards Grid */}
              {filteredTasks.length > 0 ? (
                <div className="space-y-3">
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
            <div className="bg-white rounded-lg shadow-sm p-4 h-full overflow-auto">
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
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-6 py-4 rounded-lg shadow-2xl z-50 flex items-center gap-6 animate-slide-in-up">
          <span className="font-semibold">{selectedTaskIds.length} task{selectedTaskIds.length !== 1 ? 's' : ''} selected</span>

          <div className="flex gap-2">
            <button
              onClick={handleBulkComplete}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-md text-sm font-medium transition-colors"
            >
              Complete All
            </button>
            <button
              onClick={handleBulkDelete}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-md text-sm font-medium transition-colors"
            >
              Delete All
            </button>
            <button
              onClick={() => {
                setSelectedTaskIds([]);
                setBulkMode(false);
              }}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-md text-sm font-medium transition-colors"
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
  );
};

export default TasksPage;
