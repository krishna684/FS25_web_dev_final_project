import { useMemo, useState } from "react";
import CalendarView from "../components/calendar/CalendarView";
import { useTasks } from "../context/TaskContext";

const CalendarPage = () => {
  const { tasks } = useTasks();

  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [events, setEvents] = useState([]); // calendar-only events
  const [viewMode, setViewMode] = useState("month");
  const [timeZone, setTimeZone] = useState("America/Chicago");

  const goToToday = () => setCurrentMonth(new Date());
  const goToPrevMonth = () =>
    setCurrentMonth(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1)
    );
  const goToNextMonth = () =>
    setCurrentMonth(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1)
    );

  const handleChangeView = (mode) => setViewMode(mode);
  const handleChangeTimeZone = (tz) => setTimeZone(tz);

  const handleNewEvent = (date) => {
    const title = window.prompt("Event title");
    if (!title) return;
    const time = window.prompt('Time (e.g. "14:00")', "");
    const dateStr = date.toISOString().slice(0, 10);
    setEvents((prev) => [
      ...prev,
      { id: Date.now(), title, time: time || "", date: dateStr },
    ]);
    // later you can POST to /events here if backend supports it
  };

  const taskEvents = useMemo(
    () =>
      tasks
        .filter((t) => t.dueDate)
        .map((t) => ({
          id: `task-${t.id}`,
          title: t.title,
          date: t.dueDate,
          time: "",
        })),
    [tasks]
  );

  const combinedEvents = useMemo(
    () => [...events, ...taskEvents],
    [events, taskEvents]
  );

  const viewLabel =
    viewMode === "day"
      ? "Day View"
      : viewMode === "three-day"
        ? "Three Day View"
        : viewMode === "work-week"
          ? "Work Week View"
          : viewMode === "week"
            ? "Week View"
            : viewMode === "list"
              ? "List"
              : viewMode === "time-zones"
                ? "Manage Additional Time Zones"
                : "Month View";

  return (
    <div>
      <div className="calendar-page-header">
        <h2 className="page-title">Calendar</h2>
        <div className="calendar-header-controls flex items-center gap-2">
          <button className="btn-secondary rounded-lg" onClick={goToToday}>
            Today
          </button>
          <button className="btn-secondary rounded-lg" onClick={goToPrevMonth}>
            ‹
          </button>
          <button className="btn-secondary rounded-lg" onClick={goToNextMonth}>
            ›
          </button>
        </div>
      </div>

      <div className="calendar-view-switch flex items-center gap-2">
        <span className="small">View:</span>
        <select
          className="calendar-view-select rounded-lg"
          value={viewMode}
          onChange={(e) => handleChangeView(e.target.value)}
        >
          <option value="day">Day View</option>
          <option value="three-day">Three Day View</option>
          <option value="work-week">Work Week View</option>
          <option value="week">Week View</option>
          <option value="month">Month View</option>
          <option value="list">List</option>
          <option value="time-zones">Manage Additional Time Zones</option>
        </select>
        <span className="small current-view-label">{viewLabel}</span>
      </div>

      <CalendarView
        currentMonth={currentMonth}
        tasks={tasks}
        events={combinedEvents}
        viewMode={viewMode}
        timeZone={timeZone}
        onNewEvent={handleNewEvent}
        onChangeView={handleChangeView}
        onChangeTimeZone={handleChangeTimeZone}
      />
    </div>
  );
};

export default CalendarPage;
