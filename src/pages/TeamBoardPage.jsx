import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosClient from "../api/axiosClient";
import KanbanBoard from "../components/kanban/KanbanBoard";
import TeamMembers from "../components/teams/TeamMembers";
import CommentList from "../components/comments/CommentList";
import CommentForm from "../components/comments/CommentForm";

const TeamBoardPage = () => {
  const { teamId } = useParams();
  const [team, setTeam] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [members, setMembers] = useState([]);
  const [activeTask, setActiveTask] = useState(null);
  const [comments, setComments] = useState([]);
  const [error, setError] = useState("");

  const loadBoard = async () => {
    setError("");
    try {
      const [teamRes, tasksRes, membersRes] = await Promise.all([
        axiosClient.get(`/teams/${teamId}`),
        axiosClient.get(`/teams/${teamId}/tasks`),
        axiosClient.get(`/teams/${teamId}/members`),
      ]);

      setTeam(teamRes.data);
      setTasks(tasksRes.data);
      setMembers(membersRes.data);
    } catch (err) {
      console.error(err);
      setError("Failed to load team board.");
    }
  };

  const loadComments = async (taskId) => {
    try {
      const res = await axiosClient.get(`/tasks/${taskId}/comments`);
      setComments(res.data);
    } catch (err) {
      console.error(err);
      setComments([]);
    }
  };

  useEffect(() => {
    loadBoard();
  }, [teamId]);

  const handleCardClick = (task) => {
    setActiveTask(task);
    loadComments(task.id);
  };

  const handleAddComment = async ({ text }) => {
    if (!activeTask) return;
    try {
      await axiosClient.post(`/tasks/${activeTask.id}/comments`, { text });
      loadComments(activeTask.id);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h2>{team ? team.name : "Team Board"}</h2>
      {error && <p className="error">{error}</p>}

      <TeamMembers members={members} />

      <KanbanBoard tasks={tasks} onCardClick={handleCardClick} />

      {activeTask && (
        <div className="modal">
          <div className="modal-content">
            <button
              className="modal-close"
              onClick={() => setActiveTask(null)}
            >
              ✕
            </button>
            <h3>{activeTask.title}</h3>
            <p>{activeTask.description}</p>

            <h4>Comments</h4>
            <CommentList comments={comments} />
            <CommentForm onSubmit={handleAddComment} />
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamBoardPage;
