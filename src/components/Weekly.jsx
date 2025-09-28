import React, { useState, useEffect } from "react";
import { startOfWeek, addDays, format, addWeeks, subWeeks } from "date-fns";
import { useLocation } from "react-router-dom";

const hours = Array.from({ length: 17 }, (_, i) => i + 7); // 7 to 23

const Weekly = () => {

    const user = JSON.parse(localStorage.getItem("user"));
  const [currentWeekStart, setCurrentWeekStart] = useState(
    startOfWeek(new Date(), { weekStartsOn: 1 })
  );
  

  const [tasksByDate, setTasksByDate] = useState({});

  useEffect(() => {
    if (!user?.email) return;
    const savedTasks =
      JSON.parse(localStorage.getItem(`tasks_${user.email}`)) || {};
    setTasksByDate(savedTasks);
  }, []);

  const handlePrevWeek = () => {
    setCurrentWeekStart((prev) => subWeeks(prev, 1));
  };

  const handleNextWeek = () => {
    setCurrentWeekStart((prev) => addWeeks(prev, 1));
  };

  const getTasksForDayAndHour = (date, hour) => {
    const dateKey = format(date, "yyyy-MM-dd");
    const tasks = tasksByDate[dateKey] || [];
    return tasks.filter((task) => {
      if (!task.time) return false;
      const taskHour = parseInt(task.time.split(":")[0], 10);
      return taskHour === hour;
    });
  };

  const getTasksWithoutTime = (date) => {
    const dateKey = format(date, "yyyy-MM-dd");
    const tasks = tasksByDate[dateKey] || [];
    return tasks.filter((task) => !task.time);
  };

  const weekDates = Array.from({ length: 7 }, (_, i) =>
    addDays(currentWeekStart, i)
  );

  return (
    <div
      className="weekly-calendar"
      style={{
        padding: "20px",
        fontFamily: "Arial, sans-serif",
        overflowX: "auto",
      }}
    >
      {/* Navigacija */}
      <div
        className="navigation"
        style={{
          display: "flex",
          justifyContent: "space-between",
          margin: "100px 0",
        }}
      >
        <button className="weekly-change" onClick={handlePrevWeek}>‹</button>
        <div>
          <h2>{format(weekDates[0], "dd.MM.yyyy")} -{" "}
          {format(weekDates[6], "dd.MM.yyyy")}</h2>
        </div>
        <button className="weekly-change" onClick={handleNextWeek}>›</button>
      </div>

      {/* Kalendar grid */}
      <div style={{ height: "100vh", overflowY: "auto" }}>
        <div
          className="calendar-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "80px repeat(7, 1fr)",
            overflowY: "scroll",
            height: "2200px",
          }}
        >
          {/* Header: dani */}
          <div></div>
          {weekDates.map((date) => (
            <div
              key={date}
              style={{
                textAlign: "center",
                padding: "8px 0",
                borderBottom: "1px solid #ccc",
              }}
            >
              <div className="days-row-week">
                <div>{format(date, "EEEE").slice(0, 3)}</div>
                <div>{format(date, "dd.MM")}</div>
              </div>
            </div>
          ))}

          {/* Red za taskove bez vremena */}
          <div style={{ fontSize: 12, color: "#666", padding: "8px" }}>
            bez vremena
          </div>
          {weekDates.map((date) => (
            <div
              key={`notime-${date}`}
              style={{
                minHeight: "40px",
                borderBottom: "1px solid #eee",
                padding: "4px",
                background: "#f9f9f9",
              }}
            >
              {getTasksWithoutTime(date).map((task, i) => (
                <div
                  key={i}
                  style={{
                    background: "#fffae6",
                    padding: "4px 6px",
                    marginBottom: "4px",
                    borderRadius: "4px",
                    fontSize: "13px",
                  }}
                >
                  {task.text}
                </div>
              ))}
            </div>
          ))}

          {/* Vremenska osa + taskovi sa vremenom */}
          {hours.map((hour) => (
            <React.Fragment key={hour}>
              <div
                style={{
                  borderRight: "1px solid #ccc",
                  padding: "8px",
                  fontSize: "13px",
                  background: "#f0f0f0",
                }}
              >
                {`${hour}:00`}
              </div>
              {weekDates.map((date) => (
                <div
                  key={format(date, "yyyy-MM-dd") + hour}
                  style={{
                    border: "1px solid #eee",
                    minHeight: "50px",
                    padding: "4px",
                  }}
                >
                  {getTasksForDayAndHour(date, hour).map((task, i) => (
                    <div
                      key={i}
                      style={{
                        marginBottom: "4px",
                        background: "#e0f7fa",
                        padding: "4px 6px",
                        borderRadius: "4px",
                        fontSize: "13px",
                      }}
                    >
                      {task.text}
                    </div>
                  ))}
                </div>
              ))}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Weekly;
