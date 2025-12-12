import { useEffect, useMemo, useState } from "react";
import CalendarView from "../components/calendar/CalendarView";
import { useTasks } from "../context/TaskContext";
import teamApi from "../api/teams";
import teamTaskApi from "../api/teamTasks";

const CalendarPage = () => {
  const { tasks } = useTasks();

  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [events, setEvents] = useState([]); // calendar-only events
  const [viewMode, setViewMode] = useState("month");
  const [timeZone, setTimeZone] = useState("America/Chicago");
  const [teamTasks, setTeamTasks] = useState([]);

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

  // Load all team tasks for teams the user has access to
  useEffect(() => {
    let isMounted = true;
    const loadTeamTasks = async () => {
      try {
        const teamsRes = await teamApi.getAll();
        const teams = teamsRes.data || [];
        const taskArrays = await Promise.all(
          teams.map(async (team) => {
            const res = await teamTaskApi.getAll(team._id);
            return (res.data || []).map((t) => ({
              ...t,
              teamId: team._id,
              teamName: team.name,
            }));
          })
        );
        if (isMounted) {
          setTeamTasks(taskArrays.flat());
        }
      } catch (err) {
        console.error("Failed to load team tasks for calendar", err);
        if (isMounted) setTeamTasks([]);
      }
    };

    loadTeamTasks();
    return () => {
      isMounted = false;
    };
  }, []);

  const allTasks = useMemo(
    () => [...(tasks || []), ...(teamTasks || [])],
    [tasks, teamTasks]
  );

  const taskEvents = useMemo(
    () =>
      allTasks
        .filter((t) => t.dueDate)
        .map((t) => ({
          id: `task-${t._id || t.id}`,
          title: t.teamName ? `${t.title} (${t.teamName})` : t.title,
          date: typeof t.dueDate === "string" ? t.dueDate.split("T")[0] : "",
          time: "",
        })),
    [allTasks]
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
    <div className="page">
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
        tasks={allTasks}
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
