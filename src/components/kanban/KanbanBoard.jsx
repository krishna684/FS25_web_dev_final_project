import KanbanColumn from "./KanbanColumn";

const KanbanBoard = ({ tasks, onCardClick }) => {
  const byStatus = (status) =>
    tasks.filter((t) => (status ? t.status === status : true));

  return (
    <div className="kanban-board">
      <KanbanColumn
        title="To do"
        tasks={byStatus("todo")}
        onCardClick={onCardClick}
      />
      <KanbanColumn
        title="In progress"
        tasks={byStatus("in-progress")}
        onCardClick={onCardClick}
      />
      <KanbanColumn
        title="Done"
        tasks={byStatus("done")}
        onCardClick={onCardClick}
      />
    </div>
  );
};

export default KanbanBoard;
