const TaskFilters = ({ filters, onChange }) => {
    const handleStatusChange = (e) =>
      onChange({ ...filters, status: e.target.value });
  
    const handleSearchChange = (e) =>
      onChange({ ...filters, search: e.target.value });
  
    return (
      <div className="task-filters">
        <select value={filters.status} onChange={handleStatusChange}>
          <option value="all">All</option>
          <option value="todo">To do</option>
          <option value="in-progress">In progress</option>
          <option value="done">Done</option>
        </select>
        <input
          placeholder="Search tasks..."
          value={filters.search}
          onChange={handleSearchChange}
        />
      </div>
    );
  };
  
  export default TaskFilters;
  