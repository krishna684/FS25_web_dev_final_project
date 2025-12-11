// src/components/calendar/CalendarView.jsx
import { useState } from "react";

const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const formatMonthTitle = (date) =>
  date.toLocaleDateString(undefined, { month: "long", year: "numeric" });

const dateKey = (d) => d.toISOString().slice(0, 10); // YYYY-MM-DD

// US time zones we support
const US_TIMEZONES = [
  { tz: "America/Los_Angeles", label: "Pacific (PT)" },
  { tz: "America/Denver", label: "Mountain (MT)" },
  { tz: "America/Chicago", label: "Central (CT)" },
  { tz: "America/New_York", label: "Eastern (ET)" },
  { tz: "America/Anchorage", label: "Alaska (AKT)" },
  { tz: "Pacific/Honolulu", label: "Hawaii (HST)" },
];

const CalendarView = ({
  currentMonth,
  events = [],
  tasks = [], // NEW: Accept tasks array
  viewMode = "month",
  timeZone = "America/Chicago",
  onNewEvent,
  onChangeView,
  onChangeTimeZone,
  onTaskClick, // NEW: Handle task clicks
}) => {
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();

  const firstOfMonth = new Date(year, month, 1);
  const startDay = firstOfMonth.getDay();
  const firstDateToShow = new Date(year, month, 1 - startDay);

  // 6 x 7 month view dates
  const daysForMonthView = [];
  for (let i = 0; i < 42; i++) {
    const date = new Date(
      firstDateToShow.getFullYear(),
      firstDateToShow.getMonth(),
      firstDateToShow.getDate() + i
    );
    daysForMonthView.push(date);
  }

  const todayKey = dateKey(new Date());

  // Map tasks by due date (NEW)
  const tasksByDate = tasks.reduce((acc, task) => {
    if (!task.dueDate) return acc;
    const key = task.dueDate.split('T')[0]; // YYYY-MM-DD
    if (!acc[key]) acc[key] = [];
    acc[key].push(task);
    return acc;
  }, {});

  // Keep existing events mapping
  const eventsByDate = events.reduce((acc, ev) => {
    const key = ev.date;
    if (!acc[key]) acc[key] = [];
    acc[key].push(ev);
    return acc;
  }, {});

  // Context menu + anchor day
  const [menu, setMenu] = useState({
    open: false,
    x: 0,
    y: 0,
    date: null,
  });
  const [anchorDate, setAnchorDate] = useState(new Date());

  const closeMenu = () =>
    setMenu((m) => ({
      ...m,
      open: false,
    }));

  const handleDayContextMenu = (event, date) => {
    event.preventDefault();
    setAnchorDate(date);
    setMenu({
      open: true,
      x: event.clientX,
      y: event.clientY,
      date,
    });
  };

  const handleDayClick = (date) => {
    // Handle date click - could navigate to day view or show tasks for that date
    setAnchorDate(date);
    // For now, just switch to day view
    onChangeView && onChangeView("day");
  };

  // ===== LIST VIEW =====
  if (viewMode === "list") {
    const sortedEvents = [...events].sort((a, b) => {
      const da = a.date.localeCompare(b.date);
      if (da !== 0) return da;
      return (a.time || "").localeCompare(b.time || "");
    });

    return (
      <div className="calendar" onClick={closeMenu}>
        <div className="calendar-month-title">TaskFlow Events (List)</div>
        <div className="calendar-list-view">
          {sortedEvents.length === 0 ? (
            <p className="calendar-empty">
              No events yet. Right-click any day in Month/Week view and choose
              “New Event” to add one.
            </p>
          ) : (
            <ul className="calendar-list">
              {sortedEvents.map((ev) => {
                const d = new Date(ev.date);
                const label = d.toLocaleDateString(undefined, {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                });
                return (
                  <li key={ev.id} className="calendar-list-item">
                    <div className="calendar-list-date">{label}</div>
                    <div className="calendar-list-title">{ev.title}</div>
                    {ev.time && (
                      <div className="calendar-list-time">{ev.time}</div>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    );
  }

  // ===== non-list views =====

  const buildRangeForView = () => {
    const base = anchorDate;
    const d = base.getDate();
    const m = base.getMonth();
    const y = base.getFullYear();

    if (viewMode === "day") {
      return [new Date(y, m, d)];
    }

    if (viewMode === "three-day") {
      return [new Date(y, m, d - 1), new Date(y, m, d), new Date(y, m, d + 1)];
    }

    if (viewMode === "week" || viewMode === "work-week") {
      const dayOfWeek = base.getDay(); // 0 (Sun) - 6 (Sat)
      const startOfWeek = new Date(y, m, d - dayOfWeek); // Sunday
      if (viewMode === "week") {
        const arr = [];
        for (let i = 0; i < 7; i++) {
          arr.push(
            new Date(
              startOfWeek.getFullYear(),
              startOfWeek.getMonth(),
              startOfWeek.getDate() + i
            )
          );
        }
        return arr;
      } else {
        // work-week: Monday–Friday
        const monday = new Date(
          startOfWeek.getFullYear(),
          startOfWeek.getMonth(),
          startOfWeek.getDate() + 1
        );
        const arr = [];
        for (let i = 0; i < 5; i++) {
          arr.push(
            new Date(
              monday.getFullYear(),
              monday.getMonth(),
              monday.getDate() + i
            )
          );
        }
        return arr;
      }
    }

    // default fallback
    return [base];
  };

  const isMonthLike = viewMode === "month" || viewMode === "time-zones";
  const rangeDays = isMonthLike ? [] : buildRangeForView();
  const baseLabelDate = isMonthLike ? currentMonth : anchorDate;

  // selected TZ info + current time
  const tzInfo =
    US_TIMEZONES.find((z) => z.tz === timeZone) ||
    US_TIMEZONES.find((z) => z.tz === "America/Chicago");

  let currentTimeInSelected = "";
  try {
    currentTimeInSelected = new Date().toLocaleTimeString("en-US", {
      timeZone: timeZone,
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    currentTimeInSelected = "";
  }

  return (
    <div className="calendar" onClick={closeMenu}>
      {/* label like "November 2025" or anchor's month */}
      <div className="calendar-month-title">{formatMonthTitle(baseLabelDate)}</div>

      {/* TIME ZONES PANEL */}
      {viewMode === "time-zones" && (
        <div className="calendar-timezones">
          <div className="calendar-timezone-current">
            Selected time zone:{" "}
            <strong>{tzInfo ? tzInfo.label : "Unknown"}</strong>
            {currentTimeInSelected && (
              <> · Current time: {currentTimeInSelected}</>
            )}
          </div>
          <div className="calendar-timezone-list">
            {US_TIMEZONES.map((tz) => (
              <button
                key={tz.tz}
                className={`calendar-timezone-chip ${tz.tz === timeZone ? "active" : ""
                  }`}
                onClick={(e) => {
                  e.stopPropagation();
                  onChangeTimeZone && onChangeTimeZone(tz.tz);
                }}
              >
                {tz.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {isMonthLike ? (
        <>
          {/* Day-name header row */}
          <div className="calendar-grid calendar-grid-header">
            {dayNames.map((name) => (
              <div key={name} className="calendar-day-header">
                {name}
              </div>
            ))}
          </div>

          {/* 6x7 month grid */}
          <div className="calendar-grid">
            {daysForMonthView.map((date) => {
              const key = dateKey(date);
              const inCurrentMonth = date.getMonth() === month;
              const isToday = key === todayKey;
              const dayEvents = eventsByDate[key] || [];
              const dayTasks = tasksByDate[key] || [];

              return (
                <div
                  key={key}
                  className={`calendar-day ${inCurrentMonth ? "" : "calendar-day-outside"
                    } ${isToday ? "calendar-day-today" : ""}`}
                  onContextMenu={(e) => handleDayContextMenu(e, date)}
                  onClick={() => onTaskClick && onTaskClick(date)}
                >
                  <div className="calendar-day-number">{date.getDate()}</div>

                  <div className="calendar-day-events">
                    {dayEvents.map((ev) => (
                      <div key={ev.id} className="calendar-event">
                        {ev.time && (
                          <span className="calendar-event-time">
                            {ev.time}
                          </span>
                        )}
                        <span className="calendar-event-title">
                          {ev.title}
                        </span>
                      </div>
                    ))}
                    {dayTasks.map((task) => (
                      <div
                        key={`task-${task.id}`}
                        className={`calendar-task calendar-task-${task.priority}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          onTaskClick && onTaskClick(task);
                        }}
                      >
                        <span className="calendar-task-title">
                          {task.title}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      ) : (
        <>
          {/* header row: show day names for the selected range */}
          <div
            className="calendar-grid calendar-grid-header"
            style={{
              gridTemplateColumns: `repeat(${rangeDays.length}, minmax(0, 1fr))`,
            }}
          >
            {rangeDays.map((date) => (
              <div key={dateKey(date)} className="calendar-day-header">
                {dayNames[date.getDay()]}
              </div>
            ))}
          </div>

          {/* one-row grid with N columns (1 / 3 / 5 / 7) */}
          <div
            className="calendar-grid"
            style={{
              gridTemplateColumns: `repeat(${rangeDays.length}, minmax(0, 1fr))`,
            }}
          >
            {rangeDays.map((date) => {
              const key = dateKey(date);
              const isToday = key === todayKey;
              const dayEvents = eventsByDate[key] || [];
              const dayTasks = tasksByDate[key] || [];

              return (
                <div
                  key={key}
                  className={`calendar-day ${isToday ? "calendar-day-today" : ""
                    }`}
                  onContextMenu={(e) => handleDayContextMenu(e, date)}
                  onClick={() => handleDayClick(date)}
                >
                  <div className="calendar-day-number">{date.getDate()}</div>
                  <div className="calendar-day-events">
                    {dayEvents.map((ev) => (
                      <div key={ev.id} className="calendar-event">
                        {ev.time && (
                          <span className="calendar-event-time">
                            {ev.time}
                          </span>
                        )}
                        <span className="calendar-event-title">
                          {ev.title}
                        </span>
                      </div>
                    ))}
                    {dayTasks.map((task) => (
                      <div
                        key={`task-${task.id}`}
                        className={`calendar-task calendar-task-${task.priority}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          onTaskClick && onTaskClick(task);
                        }}
                      >
                        <span className="calendar-task-title">
                          {task.title}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* Context menu */}
      {menu.open && menu.date && (
        <div
          className="calendar-context-menu"
          style={{ top: menu.y, left: menu.x }}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={() => {
              onNewEvent && onNewEvent(menu.date);
              closeMenu();
            }}
          >
            New Event
          </button>

          <div className="calendar-context-separator" />

          <button
            onClick={() => {
              onChangeView && onChangeView("day");
              closeMenu();
            }}
          >
            Day View
          </button>
          <button
            onClick={() => {
              onChangeView && onChangeView("three-day");
              closeMenu();
            }}
          >
            Three Day View
          </button>
          <button
            onClick={() => {
              onChangeView && onChangeView("work-week");
              closeMenu();
            }}
          >
            Work Week View
          </button>
          <button
            onClick={() => {
              onChangeView && onChangeView("week");
              closeMenu();
            }}
          >
            Week View
          </button>
          <button
            onClick={() => {
              onChangeView && onChangeView("month");
              closeMenu();
            }}
          >
            Month View
          </button>

          <div className="calendar-context-separator" />

          <button
            onClick={() => {
              onChangeView && onChangeView("list");
              closeMenu();
            }}
          >
            List
          </button>
          <button
            onClick={() => {
              onChangeView && onChangeView("time-zones");
              closeMenu();
            }}
          >
            Manage Additional Time Zones
          </button>
        </div>
      )}
    </div>
  );
};

export default CalendarView;
