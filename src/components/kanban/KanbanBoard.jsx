import React, { useState, useMemo } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Filter, User, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import KanbanColumn from "./KanbanColumn";

const KanbanBoard = ({
  tasks,
  onCardClick,
  onTaskMove,
  onAddTask,
  teamMembers = []
}) => {
  const { user } = useAuth();
  const [columns, setColumns] = useState([
    { id: 'todo', title: 'To Do', status: 'todo', wipLimit: 5 },
    { id: 'in-progress', title: 'In Progress', status: 'in-progress', wipLimit: 3 },
    { id: 'done', title: 'Done', status: 'done', wipLimit: null }
  ]);
  const [filters, setFilters] = useState({
    myTasks: false,
    assignee: '',
    priority: ''
  });

  // Filter tasks based on current filters
  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      if (filters.myTasks && task.assignedTo !== user._id) {
        return false;
      }
      if (filters.assignee && task.assignedTo !== filters.assignee) {
        return false;
      }
      if (filters.priority && task.priority !== filters.priority) {
        return false;
      }
      return true;
    });
  }, [tasks, filters, user._id]);

  // Group filtered tasks by status
  const tasksByStatus = useMemo(() => {
    const grouped = {};
    columns.forEach(col => {
      grouped[col.status] = filteredTasks.filter(task => task.status === col.status);
    });
    return grouped;
  }, [filteredTasks, columns]);

  const handleDragEnd = (result) => {
    const { destination, source, draggableId } = result;

    // Dropped outside any droppable
    if (!destination) return;

    // Dropped in the same position
    if (destination.droppableId === source.droppableId && destination.index === source.index) {
      return;
    }

    // Find the task being moved
    const sourceColumn = columns.find(col => col.status === source.droppableId);
    const destinationColumn = columns.find(col => col.status === destination.droppableId);

    if (!sourceColumn || !destinationColumn) return;

    const sourceTasks = [...tasksByStatus[source.droppableId]];
    const destinationTasks = [...tasksByStatus[destination.droppableId]];

    // Remove task from source
    const [movedTask] = sourceTasks.splice(source.index, 1);

    // Add task to destination
    destinationTasks.splice(destination.index, 0, movedTask);

    // Update task status if moved to different column
    if (source.droppableId !== destination.droppableId) {
      movedTask.status = destination.droppableId;
      if (onTaskMove) {
        onTaskMove(movedTask._id, destination.droppableId);
      }
    }
  };

  const handleColumnReorder = (result) => {
    if (!result.destination) return;

    const reorderedColumns = [...columns];
    const [removed] = reorderedColumns.splice(result.source.index, 1);
    reorderedColumns.splice(result.destination.index, 0, removed);

    setColumns(reorderedColumns);
  };

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  return (
    <div className="kanban-board-container">
      {/* Filters */}
      <div className="kanban-filters">
        <div className="kanban-filter-group">
          <Filter size={16} />
          <span className="filter-label">Filters:</span>

          <label className="kanban-filter-item">
            <input
              type="checkbox"
              checked={filters.myTasks}
              onChange={(e) => handleFilterChange('myTasks', e.target.checked)}
            />
            <span>My Tasks</span>
          </label>

          <select
            value={filters.assignee}
            onChange={(e) => handleFilterChange('assignee', e.target.value)}
            className="kanban-filter-select"
          >
            <option value="">All Assignees</option>
            <option value={user._id}>Me</option>
            {teamMembers.map(member => (
              <option key={member.user._id} value={member.user._id}>
                {member.user.name}
              </option>
            ))}
          </select>

          <select
            value={filters.priority}
            onChange={(e) => handleFilterChange('priority', e.target.value)}
            className="kanban-filter-select"
          >
            <option value="">All Priorities</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
      </div>

      {/* Kanban Board */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="board" direction="horizontal" type="column">
          {(provided) => (
            <div
              className="kanban-board"
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              {columns.map((column, index) => (
                <Draggable key={column.id} draggableId={column.id} index={index}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className={`kanban-column-wrapper ${snapshot.isDragging ? 'dragging' : ''}`}
                    >
                      <div
                        className="kanban-column-drag-handle"
                        {...provided.dragHandleProps}
                      >
                        ⋮⋮
                      </div>

                      <KanbanColumn
                        title={column.title}
                        tasks={tasksByStatus[column.status] || []}
                        onCardClick={onCardClick}
                        onAddTask={onAddTask}
                        wipLimit={column.wipLimit}
                        status={column.status}
                      />
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};

export default KanbanBoard;
