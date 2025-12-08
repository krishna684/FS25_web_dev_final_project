import KanbanCard from "./KanbanCard";

const KanbanColumn = ({ title, tasks, onCardClick }) => {
  return (
    <div className="kanban-column">
      <h3>{title}</h3>
      <div className="kanban-column-body">
        {tasks.map((t) => (
          <KanbanCard key={t._id} task={t} onClick={onCardClick} />
        ))}
      </div>
    </div>
  );
};

export default KanbanColumn;
