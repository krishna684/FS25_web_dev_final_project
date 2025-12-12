import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import teamApi from "../api/teams";
import teamTaskApi from "../api/teamTasks";
import activityApi from "../api/activity";
import KanbanBoard from "../components/kanban/KanbanBoard";
import TeamMembers from "../components/teams/TeamMembers";
import InviteMemberModal from "../components/teams/InviteMemberModal";
import NewTaskModal from "../components/tasks/NewTaskModal";
import ActivityFeed from "../components/activity/ActivityFeed";
import CommentList from "../components/comments/CommentList";
import CommentForm from "../components/comments/CommentForm";
import { Layout, Users, Activity, Settings, Plus, X, Edit3, Save } from "lucide-react";

const TeamBoardPage = () => {
  const { teamId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [team, setTeam] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [activities, setActivities] = useState([]);
  const [members, setMembers] = useState([]);
  const [activeTask, setActiveTask] = useState(null);
  const [isEditingTask, setIsEditingTask] = useState(false);
  const [editedTask, setEditedTask] = useState(null);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [comments, setComments] = useState([]);
  const [error, setError] = useState("");

  // Tab State
  const [activeTab, setActiveTab] = useState("kanban"); // kanban | members | activity | settings
  const [showNewTaskModal, setShowNewTaskModal] = useState(false);
  const [newTaskInitialStatus, setNewTaskInitialStatus] = useState("todo");

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
    setIsEditingTask(false);
    setEditedTask({
      title: task.title || "",
      description: task.description || "",
      status: task.status || "todo",
      priority: task.priority || "medium",
      dueDate: task.dueDate ? String(task.dueDate).slice(0, 10) : "",
      assignedTo:
        typeof task.assignedTo === "object" && task.assignedTo?._id
          ? task.assignedTo._id
          : typeof task.assignedTo === "string"
            ? task.assignedTo
            : "",
    });
    loadComments(task._id);
  };

  const handleSaveTaskEdits = async () => {
    if (!activeTask || !editedTask) return;

    try {
      const updates = {
        title: editedTask.title,
        description: editedTask.description,
        status: editedTask.status,
        priority: editedTask.priority,
        dueDate: editedTask.dueDate || null,
        assignedTo: editedTask.assignedTo || null,
      };

      const res = await teamTaskApi.update(teamId, activeTask._id, updates);

      // keep modal open, but refresh the task preview + board
      setActiveTask(res.data);
      setIsEditingTask(false);
      loadBoard();
    } catch (err) {
      console.error("Failed to update task", err);
      alert("Could not save changes. Please try again.");
    }
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

  const handleAddTaskFromColumn = (status) => {
    setNewTaskInitialStatus(status || "todo");
    setShowNewTaskModal(true);
  };

  const handleTaskMove = async (taskId, newStatus) => {
    try {
      // optimistic update for snappier UI
      setTasks((prev) =>
        prev.map((t) => (t._id === taskId ? { ...t, status: newStatus } : t))
      );

      await teamTaskApi.update(teamId, taskId, { status: newStatus });
    } catch (err) {
      console.error("Failed to move task", err);
      // fallback to server truth
      loadBoard();
    }
  };

  // 👇 NEW: Delete Team handler
  const handleDeleteTeam = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this team? This cannot be undone."
    );
    if (!confirmed) return;

    try {
      await teamApi.delete(teamId);   // <-- this calls your backend
      navigate("/teams");            // go back to teams list
    } catch (err) {
      console.error("Failed to delete team", err);
      alert("Could not delete the team. Please try again.");
    }
  };

  // Regenerate invite code handler
  const handleRegenerateInviteCode = async () => {
    try {
      const response = await teamApi.regenerateInviteCode(teamId);
      // Update the team state with new invite code
      setTeam(prev => ({ ...prev, inviteCode: response.data.inviteCode }));
    } catch (err) {
      console.error("Failed to regenerate invite code", err);
      throw err; // Re-throw to let the modal handle the error
    }
  };

  // If navigated with a taskId (e.g., from dashboard), open that task's details
  useEffect(() => {
    const targetId = location.state?.taskId;
    if (!targetId || !tasks.length) return;
    const found = tasks.find((t) => t._id === targetId);
    if (found) {
      handleCardClick(found);
      navigate(location.pathname, { replace: true });
    }
  }, [location.state, tasks, navigate, location.pathname]);

  if (!team) {
    return (
      <div className="page">
        <div className="p-8">Loading team board...</div>
      </div>
    );
  }

  return (
    <div className="page page--full">
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
                <p className="text-sm text-gray-500">
                  {members.length} members · Created{" "}
                  {new Date(team.createdAt || Date.now()).toLocaleDateString()}
                </p>
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
              { id: "kanban", label: "Kanban Board", icon: Layout },
              { id: "members", label: "Members", icon: Users },
              { id: "activity", label: "Activity Log", icon: Activity },
              { id: "settings", label: "Settings", icon: Settings },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 pb-3 border-b-2 font-medium transition-colors ${
                  activeTab === tab.id
                    ? "border-indigo-600 text-indigo-600"
                    : "border-transparent text-gray-500 hover:text-gray-800 hover:border-gray-300"
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
        {error && (
          <p className="bg-red-50 text-red-600 p-3 rounded mb-4 border border-red-200">
            {error}
          </p>
        )}

        {activeTab === "kanban" && (
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
              <KanbanBoard
                tasks={tasks}
                onCardClick={handleCardClick}
                onAddTask={handleAddTaskFromColumn}
                onTaskMove={handleTaskMove}
                teamMembers={members}
              />
            </div>
          </div>
        )}

        {activeTab === "members" && (
          <div className="max-w-4xl mx-auto">
            <div className="card">
              <h3 className="card-title mb-4">Team Members</h3>
              {/* 👇 use loadBoard instead of undefined loadTeam */}
              <TeamMembers team={team} onTeamUpdate={loadBoard} />
            </div>
          </div>
        )}

        {activeTab === "activity" && (
          <div className="max-w-3xl mx-auto">
            <div className="card">
              <h3 className="card-title mb-4">Activity Log</h3>
              <ActivityFeed items={activities} />
            </div>
          </div>
        )}

        {activeTab === "settings" && (
          <div className="max-w-2xl mx-auto">
            <div className="card">
              <h3 className="card-title mb-4">Team Settings</h3>
              <p className="text-gray-500 italic">
                Settings are currently read-only in this demo.
              </p>

              <div className="mt-6 space-y-4">
                <div className="form-group">
                  <label className="form-label">Team Name</label>
                  <input
                    type="text"
                    className="form-input"
                    value={team.name}
                    readOnly
                  />
                </div>

                <div className="border-t pt-4">
                  <button
                    className="btn btn-danger"
                    onClick={handleDeleteTeam}   // 👈 wired up here
                  >
                    Delete Team
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        </div>

      {/* Task Detail Modal */}
      {activeTask && (
        <div
          className="modal-backdrop"
          onClick={() => {
            setActiveTask(null);
            setIsEditingTask(false);
            setEditedTask(null);
          }}
        >
          <div
            className="modal p-0 max-w-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="p-6 border-b border-gray-100 flex justify-between items-start sticky top-0 bg-white z-10">
              <div className="flex-1">
                {isEditingTask ? (
                  <input
                    type="text"
                    className="form-input text-xl font-semibold w-full"
                    value={editedTask?.title || ""}
                    onChange={(e) =>
                      setEditedTask((p) => ({ ...p, title: e.target.value }))
                    }
                  />
                ) : (
                  <h3 className="text-xl font-bold text-gray-900 mb-1">
                    {activeTask.title}
                  </h3>
                )}

                <div className="flex items-center gap-2 text-sm text-gray-500 mt-2">
                  <span className="px-2 py-0.5 bg-gray-100 rounded capitalize">
                    {isEditingTask ? (
                      <select
                        className="bg-transparent outline-none"
                        value={editedTask?.status || "todo"}
                        onChange={(e) =>
                          setEditedTask((p) => ({ ...p, status: e.target.value }))
                        }
                      >
                        <option value="todo">To Do</option>
                        <option value="in-progress">In Progress</option>
                        <option value="done">Done</option>
                      </select>
                    ) : (
                      <>in {activeTask.status}</>
                    )}
                  </span>

                  <span className="px-2 py-0.5 bg-gray-100 rounded capitalize">
                    {isEditingTask ? (
                      <select
                        className="bg-transparent outline-none"
                        value={editedTask?.priority || "medium"}
                        onChange={(e) =>
                          setEditedTask((p) => ({ ...p, priority: e.target.value }))
                        }
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                      </select>
                    ) : (
                      <>priority: {activeTask.priority || "medium"}</>
                    )}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {isEditingTask ? (
                  <button
                    className="btn btn-primary gap-2"
                    onClick={handleSaveTaskEdits}
                  >
                    <Save size={16} /> Save
                  </button>
                ) : (
                  <button
                    className="btn btn-secondary gap-2"
                    onClick={() => setIsEditingTask(true)}
                  >
                    <Edit3 size={16} /> Edit
                  </button>
                )}
                <button
                  className="text-gray-400 hover:text-gray-600 p-2"
                  onClick={() => {
                    setActiveTask(null);
                    setIsEditingTask(false);
                    setEditedTask(null);
                  }}
                  aria-label="Close"
                >
                  <X size={22} />
                </button>
              </div>
            </div>

            {/* Body */}
            <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 space-y-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Description</h4>
                  {isEditingTask ? (
                    <textarea
                      className="form-input min-h-[120px]"
                      value={editedTask?.description || ""}
                      onChange={(e) =>
                        setEditedTask((p) => ({ ...p, description: e.target.value }))
                      }
                      placeholder="Add a description..."
                      rows={4}
                    />
                  ) : (
                    <p className="text-gray-600 leading-relaxed min-h-[4rem]">
                      {activeTask.description || "No description provided."}
                    </p>
                  )}
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
                <div className="card bg-gray-50 border-none shadow-none">
                  <h5 className="text-xs font-bold text-gray-500 uppercase mb-3">
                    Details
                  </h5>

                  <div className="space-y-3 text-sm">
                    <div>
                      <span className="text-gray-500 block text-xs">Due Date</span>
                      {isEditingTask ? (
                        <input
                          type="date"
                          className="form-input"
                          value={editedTask?.dueDate || ""}
                          onChange={(e) =>
                            setEditedTask((p) => ({ ...p, dueDate: e.target.value }))
                          }
                        />
                      ) : (
                        <span className="font-medium">
                          {activeTask.dueDate
                            ? new Date(activeTask.dueDate).toLocaleDateString()
                            : "No date"}
                        </span>
                      )}
                    </div>

                    <div>
                      <span className="text-gray-500 block text-xs">Assignee</span>
                      {isEditingTask ? (
                        <select
                          className="form-input"
                          value={editedTask?.assignedTo || ""}
                          onChange={(e) =>
                            setEditedTask((p) => ({ ...p, assignedTo: e.target.value }))
                          }
                        >
                          <option value="">Unassigned</option>
                          {members.map((m) => (
                            <option key={m.user?._id || m.user} value={m.user?._id || m.user}>
                              {m.user?.name || "Member"}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <span className="font-medium">
                          {typeof activeTask.assignedTo === "object"
                            ? activeTask.assignedTo?.name || "Unassigned"
                            : activeTask.assignedTo || "Unassigned"}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

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
          onRegenerateCode={handleRegenerateInviteCode}
        />
      )}

        {/* New Task Modal */}
        {showNewTaskModal && (
          <NewTaskModal
            teamId={teamId}
            onClose={() => setShowNewTaskModal(false)}
            onCreate={handleCreateTask}
            initialStatus={newTaskInitialStatus}
          />
        )}
      </div>
    </div>
  );
};

export default TeamBoardPage;
