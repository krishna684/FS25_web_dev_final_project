import { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import teamApi from "../api/teams";
import teamTaskApi from "../api/teamTasks";
import activityApi from "../api/activity";
import KanbanBoard from "../components/kanban/KanbanBoard";
import TeamMembers from "../components/teams/TeamMembers";
import InviteMemberModal from "../components/teams/InviteMemberModal";
import ActivityFeed from "../components/activity/ActivityFeed";
import CommentList from "../components/comments/CommentList";
import CommentForm from "../components/comments/CommentForm";
import { Layout, Users, Activity, Settings, Plus, X } from "lucide-react";

const TeamBoardPage = () => {
  const { teamId } = useParams();
  const [team, setTeam] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [activities, setActivities] = useState([]);
  const [members, setMembers] = useState([]);
  const [activeTask, setActiveTask] = useState(null);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [comments, setComments] = useState([]);
  const [error, setError] = useState("");

  // Tab State
  const [activeTab, setActiveTab] = useState("kanban"); // kanban | members | activity | settings
  const [showNewTaskModal, setShowNewTaskModal] = useState(false);

  const loadBoard = useCallback(async () => {
    setError("");
    try {
      const [teamRes, tasksRes, activityRes] = await Promise.all([
        teamApi.getDetails(teamId),
        teamTaskApi.getAll(teamId),
        activityApi.getTeamActivity(teamId),
      ]);

      setTeam(teamRes.data);
      setTasks(tasksRes.data);
      setMembers(teamRes.data.members || []);
      setActivities(activityRes.data);
    } catch (err) {
      console.error(err);
      setError("Failed to load team board.");
    }
  }, [teamId]);

  const loadComments = useCallback(async (taskId) => {
    try {
      const res = await teamTaskApi.getComments(taskId);
      setComments(res.data);
    } catch (err) {
      console.error(err);
      setComments([]);
    }
  }, []);

  useEffect(() => {
    loadBoard();
  }, [loadBoard]);

  const handleCardClick = (task) => {
    setActiveTask(task);
    loadComments(task._id);
  };

  const handleAddComment = async ({ text }) => {
    if (!activeTask) return;
    try {
      await teamTaskApi.addComment(activeTask._id, text);
      loadComments(activeTask._id);
      const actRes = await activityApi.getTeamActivity(teamId);
      setActivities(actRes.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteTask = async () => {
    if (!activeTask) return;
    if (!window.confirm("Are you sure you want to delete this task?")) return;
    try {
      await teamTaskApi.delete(teamId, activeTask._id);
      setActiveTask(null);
      loadBoard(); // Refresh board
    } catch (err) {
      console.error("Failed to delete task", err);
      // Optional: Set error state
    }
  };

  const handleCreateTask = async (taskData) => {
    try {
      await teamTaskApi.create(teamId, taskData);
      setShowNewTaskModal(false);
      loadBoard(); // Refresh board
    } catch (err) {
      console.error("Failed to create task", err);
    }
  };

  if (!team) return <div className="p-8">Loading team board...</div>;

  return (
    <div className="flex flex-col h-full">
      {/* Header with Team Info and Tabs */}
      <div className="bg-white border-b border-gray-200 px-6 pt-6 sticky top-0 z-10">
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-indigo-600 rounded-lg flex items-center justify-center text-white text-xl font-bold">
              {team.name.substring(0, 2).toUpperCase()}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{team.name}</h1>
              <p className="text-sm text-gray-500">{members.length} members · Created {new Date(team.createdAt || Date.now()).toLocaleDateString()}</p>
            </div>
          </div>

          <button
            className="btn btn-primary gap-2"
            onClick={() => setShowInviteModal(true)}
          >
            <Plus size={18} /> Invite Member
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-8">
          {[
            { id: 'kanban', label: 'Kanban Board', icon: Layout },
            { id: 'members', label: 'Members', icon: Users },
            { id: 'activity', label: 'Activity Log', icon: Activity },
            { id: 'settings', label: 'Settings', icon: Settings },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 pb-3 border-b-2 font-medium transition-colors ${activeTab === tab.id
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-800 hover:border-gray-300'
                }`}
            >
              <tab.icon size={18} />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
        {error && <p className="bg-red-50 text-red-600 p-3 rounded mb-4 border border-red-200">{error}</p>}

        {activeTab === 'kanban' && (
          <div className="h-full flex flex-col">
            {/* New Task Button */}
            <div className="mb-4 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-700">Board</h2>
              <button
                onClick={() => setShowNewTaskModal(true)}
                className="btn btn-primary gap-2"
              >
                <Plus size={18} /> New Task
              </button>
            </div>
            <div className="flex-1">
              <KanbanBoard tasks={tasks} onCardClick={handleCardClick} />
            </div>
          </div>
        )}

        {activeTab === 'members' && (
          <div className="max-w-4xl mx-auto">
            <div className="card">
              <h3 className="card-title mb-4">Team Members</h3>
              <TeamMembers members={members} />
            </div>
          </div>
        )}

        {activeTab === 'activity' && (
          <div className="max-w-3xl mx-auto">
            <div className="card">
              <h3 className="card-title mb-4">Activity Log</h3>
              <ActivityFeed items={activities} />
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="max-w-2xl mx-auto">
            <div className="card">
              <h3 className="card-title mb-4">Team Settings</h3>
              <p className="text-gray-500 italic">Settings are currently read-only in this demo.</p>

              <div className="mt-6 space-y-4">
                <div className="form-group">
                  <label className="form-label">Team Name</label>
                  <input type="text" className="form-input" value={team.name} readOnly />
                </div>

                <div className="border-t pt-4">
                  <button className="btn btn-danger">Delete Team</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Task Detail Modal */}
      {activeTask && (
        <div className="modal fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="modal-content bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl shadow-2xl p-0">
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-100 flex justify-between items-start sticky top-0 bg-white z-10">
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-1">{activeTask.title}</h3>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <span className="px-2 py-0.5 bg-gray-100 rounded">in {activeTask.status}</span>
                </div>
              </div>
              <button
                className="text-gray-400 hover:text-gray-600 p-1"
                onClick={() => setActiveTask(null)}
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 space-y-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Description</h4>
                  <p className="text-gray-600 leading-relaxed min-h-[4rem]">
                    {activeTask.description || "No description provided."}
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-4">Comments</h4>
                  <div className="bg-gray-50 rounded-lg p-4 mb-4">
                    <CommentList comments={comments} />
                  </div>
                  <CommentForm onSubmit={handleAddComment} />
                </div>
              </div>

              <div className="space-y-6">
                {/* Sidebar checks */}
                <div className="card bg-gray-50 border-none shadow-none">
                  <h5 className="text-xs font-bold text-gray-500 uppercase mb-3">Details</h5>
                  <div className="space-y-3 text-sm">
                    <div>
                      <span className="text-gray-500 block text-xs">Due Date</span>
                      <span className="font-medium">{activeTask.dueDate ? new Date(activeTask.dueDate).toLocaleDateString() : 'No date'}</span>
                    </div>
                    <div>
                      <span className="text-gray-500 block text-xs">Assignee</span>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="w-6 h-6 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-xs font-bold">U</div>
                        <span>Unassigned</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="card bg-gray-50 border-none shadow-none">
                  <h5 className="text-xs font-bold text-gray-500 uppercase mb-3">Actions</h5>
                  <button
                    onClick={handleDeleteTask}
                    className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded transition-colors flex items-center gap-2"
                  >
                    <X size={16} /> Delete Task
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Invite Modal */}
      {team && (
        <InviteMemberModal
          isOpen={showInviteModal}
          onClose={() => setShowInviteModal(false)}
          teamName={team.name}
          inviteCode={team.inviteCode}
        />
      )}

      {/* New Task Modal */}
      {showNewTaskModal && (
        <NewTaskModal
          teamId={teamId}
          onClose={() => setShowNewTaskModal(false)}
          onCreate={handleCreateTask}
        />
      )}
    </div>
  );
};

// New Task Modal Component
const NewTaskModal = ({ teamId, onClose, onCreate }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'todo',
    priority: 'medium',
    dueDate: ''
  });
  const [creating, setCreating] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    setCreating(true);
    try {
      await onCreate(formData);
    } catch (error) {
      console.error('Failed to create task:', error);
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="modal fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="modal-content bg-white dark:bg-[var(--bg-surface)] w-full max-w-lg rounded-xl shadow-2xl">
        {/* Header */}
        <div className="p-6 border-b border-[var(--border)]">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold text-[var(--text-main)]">Create New Task</h3>
            <button
              onClick={onClose}
              className="text-[var(--text-secondary)] hover:text-[var(--text-main)] p-1"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="form-group">
            <label className="form-label">Task Title *</label>
            <input
              type="text"
              className="form-input"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Enter task title"
              required
              autoFocus
            />
          </div>

          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea
              className="form-input min-h-[100px]"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Add task description..."
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="form-group">
              <label className="form-label">Status</label>
              <select
                className="form-input"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              >
                <option value="todo">To Do</option>
                <option value="in-progress">In Progress</option>
                <option value="done">Done</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Priority</label>
              <select
                className="form-input"
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Due Date</label>
            <input
              type="date"
              className="form-input"
              value={formData.dueDate}
              onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-ghost"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={creating || !formData.title.trim()}
              className="btn btn-primary"
            >
              {creating ? 'Creating...' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TeamBoardPage;
