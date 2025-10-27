import React, { useState, useEffect } from "react";
import { startOfWeek, addDays, format, addWeeks, subWeeks } from "date-fns";
import { useLocation } from "react-router-dom";

const hours = Array.from({ length: 17 }, (_, i) => i + 7); // 7 to 23

const Weekly = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const [currentWeekStart, setCurrentWeekStart] = useState(
    startOfWeek(new Date(), { weekStartsOn: 1 })
  );

  const [showModal, setShowModal] = useState(false);
  const [tasksByDate, setTasksByDate] = useState({});
  const [selectedDate, setSelectedDate] = useState(null);
  const [taskText, setTaskText] = useState("");
  const [taskTime, setTaskTime] = useState("");
  const [taskCategory, setTaskCategory] = useState("");
  const [userCategories, setUserCategories] = useState([]);

  const hours = Array.from({ length: 24 }, (_, i) => i);

  useEffect(() => {
    if (!user?.email) return;
    const savedTasks =
      JSON.parse(localStorage.getItem(`tasks_${user.email}`)) || {};
    setTasksByDate(savedTasks);
  }, []);

  useEffect(() => {
    const stored = localStorage.getItem("categories");
    if (stored) {
      const parsed = JSON.parse(stored);
      const activeCategories = parsed.filter((cat) => cat.name && cat.color);
      setUserCategories([...activeCategories]);
    }
  }, []);

  const handlePrevWeek = () => {
    setCurrentWeekStart((prev) => subWeeks(prev, 1));
  };

  const handleNextWeek = () => {
    setCurrentWeekStart((prev) => addWeeks(prev, 1));
  };

  const handleDayClick = (date, hour = null) => {
    const now = new Date();

    if (hour !== null) {
      const clickedDateTime = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
        hour
      );

      if (clickedDateTime < now) {
        alert("Ne možeš zakazati u prošlosti ⏰");
        return;
      }
    } else {
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const clickedDay = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate()
      );

      if (clickedDay < today) {
        alert("Ne možeš zakazati u prošlosti ⏰");
        return;
      }
    }

    const dateKey = format(date, "yyyy-MM-dd");
    setSelectedDate({ dateKey, hour });
    setShowModal(true);
  };

  const handleAddTask = () => {
    if (!taskText.trim()) return;

    let finalTime = "";

    if (selectedDate.hour !== null) {
      finalTime = `${selectedDate.hour}:00`;
    } else if (taskTime) {
      finalTime = taskTime;
    }

    const newTask = {
      text: taskText,
      time: finalTime,
    };

    setTasksByDate((prev) => {
      const updated = {
        ...prev,
        [selectedDate.dateKey]: [
          ...(prev[selectedDate.dateKey] || []),
          newTask,
        ],
      };
      localStorage.setItem(`tasks_${user.email}`, JSON.stringify(updated));
      return updated;
    });

    setTaskText("");
    setTaskTime("");
    setShowModal(false);
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
        <button className="weekly-change" onClick={handlePrevWeek}>
          ‹
        </button>
        <div>
          <h2>
            {format(weekDates[0], "dd.MM.yyyy")} -{" "}
            {format(weekDates[6], "dd.MM.yyyy")}
          </h2>
        </div>
        <button className="weekly-change" onClick={handleNextWeek}>
          ›
        </button>
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

          
          <div style={{ fontSize: 12, color: "#666", padding: "8px" }}>
            bez vremena
          </div>
          {weekDates.map((date) => (
            <div
              key={`notime-${date}`}
              style={{
                border: "1px solid lightgray",
                minHeight: "30px",
                padding: "2px",
                cursor: "pointer",
              }}
              onClick={() => handleDayClick(date, null)} 
            >
              {getTasksWithoutTime(date).map((task, idx) => (
                <div key={idx}>{task.text}</div>
              ))}
            </div>
          ))}

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
                    border: "1px solid lightgray",
                    minHeight: "40px",
                    padding: "2px",
                    cursor: "pointer",
                  }}
                  onClick={() => handleDayClick(date, hour)} 
                >
                  {getTasksForDayAndHour(date, hour).map((task, idx) => (
                    <div key={idx}>{task.text}</div>
                  ))}
                </div>
              ))}
            </React.Fragment>
          ))}
        </div>
      </div>
      {showModal && (
        <div
          style={{
            position: "fixed",
            top: "30%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            background: "white",
            padding: "20px",
            border: "1px solid black",
            zIndex: 1000,
          }}
        >
          <h3>Add Task</h3>
          <input
            type="text"
            placeholder="Task text"
            value={taskText}
            onChange={(e) => setTaskText(e.target.value)}
          />
          <select
            value={taskCategory}
            onChange={(e) => setTaskCategory(e.target.value)}
          >
            <option value="">-- Bez kategorije --</option>
            {userCategories.map((cat) => (
              <option key={cat.id} value={cat.name}>
                {cat.name}
              </option>
            ))}
          </select>
          <br />
          {selectedDate?.hour === null && (
            <input
              type="time"
              value={taskTime}
              onChange={(e) => setTaskTime(e.target.value)}
            />
          )}
          <br />
          <button onClick={handleAddTask}>Add</button>
          <button onClick={() => setShowModal(false)}>Cancel</button>
        </div>
      )}
      <div
        className="waves"
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          width: "100%",
          zIndex: -1,
        }}
      >
        <svg viewBox="0 0 2 1" preserveAspectRatio="none">
          <defs>
            <path
              id="w"
              d="
      m0 1v-.5 
      q.5.5 1 0
      t1 0 1 0 1 0
      v.5z"
            />
          </defs>
          <g>
            <use
              href="#w"
              y=".0"
              fill="none"
              stroke="black"
              stroke-width="0.005"
            />
            <use href="#w" y=".1" fill="#00000018" />
            <use
              href="#w"
              y=".2"
              fill="none"
              stroke="black"
              stroke-width="0.008"
            />
          </g>
        </svg>
      </div>
    </div>
  );
};

export default Weekly;
