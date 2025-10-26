import React, { useState, useEffect } from "react";
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  addMonths,
  subMonths,
  format,
  isSameMonth,
  isSameDay,
} from "date-fns";

const Calendar = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [taskInput, setTaskInput] = useState("");
  const [tasks, setTasks] = useState({});
  const [taskCategory, setTaskCategory] = useState("");
  const [editingTaskIndex, setEditingTaskIndex] = useState(null);
  const [dayTasks, setDayTasks] = useState([]);
  const [showAllTasksModal, setShowAllTasksModal] = useState(false);
  const [selectedDayTasks, setSelectedDayTasks] = useState([]);
  const [skipAddModal, setSkipAddModal] = useState(false);
  const [taskTime, setTaskTime] = useState("");

  const user = JSON.parse(localStorage.getItem("user")) || {};
  const tasksKey = `tasks_${user.email || "guest"}`;
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem(tasksKey)) || {};
    setTasks(stored);
  }, [tasksKey]);

  const handleDayClick = (day) => {
    if (skipAddModal) {
      setSkipAddModal(false);

      return;
    }

    const today = new Date();
    const clickedDate = new Date(
      day.getFullYear(),
      day.getMonth(),
      day.getDate()
    );
    const currentDate = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );

    if (clickedDate < currentDate) {
      alert("Ne možeš dodavati task za prošle datume.");
      return;
    }

    const dateKey = format(clickedDate, "yyyy-MM-dd");
    setDayTasks(tasks[dateKey] || []);
    setSelectedDate(day);
    setTaskInput("");
    setTaskCategory("");
    setEditingTaskIndex(null);
    setShowModal(true);
    setTaskTime("");
  };

  const handleSaveTask = () => {
    if (!selectedDate || !taskInput.trim()) return;

    const dateKey = format(selectedDate, "yyyy-MM-dd");
    const newTask = {
      text: taskInput.trim(),
      category: taskCategory?.trim() || "Ostalo",
      time: taskTime || "",
    };

    let updatedDayTasks = [...(tasks[dateKey] || [])];

    if (editingTaskIndex !== null) {
      // edit
      updatedDayTasks[editingTaskIndex] = newTask;
    } else {
      // add
      updatedDayTasks.push(newTask);
    }

    const updatedTasks = {
      ...tasks,
      [dateKey]: updatedDayTasks,
    };

    setTasks(updatedTasks);
    localStorage.setItem(tasksKey, JSON.stringify(updatedTasks));
    setShowModal(false);
  };

  const [userCategories, setUserCategories] = useState([]);

  useEffect(() => {
    const stored = localStorage.getItem("categories");
    if (stored) {
      const parsed = JSON.parse(stored);
      const activeCategories = parsed.filter((cat) => cat.name && cat.color);
      setUserCategories([...activeCategories]);
    }
  }, []);

  const renderHeader = () => (
    <div className="calendar-header">
      <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}>
        ‹
      </button>
      <h2>{format(currentMonth, "MMMM yyyy")}</h2>
      <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}>
        ›
      </button>
    </div>
  );

  const renderDays = () => {
    const days = [];
    const date = new Date();
    for (let i = 0; i < 7; i++) {
      days.push(
        <div className="day-name" key={i}>
          {format(addDays(startOfWeek(date), i), "EEE")}
        </div>
      );
    }
    return <div className="days-row">{days}</div>;
  };

  const renderCells = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
    const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });

    const rows = [];
    let days = [];
    let day = startDate;

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        const formattedDate = format(day, "d");
        const cloneDay = day;
        const dateKey = format(cloneDay, "yyyy-MM-dd");
        const dayTasks = tasks[dateKey] || [];

        days.push(
          <div
            className={`cell ${
              !isSameMonth(day, monthStart) ? "disabled" : ""
            } ${isSameDay(day, selectedDate) ? "selected" : ""}`}
            key={day}
            onClick={(e) => {
              e.stopPropagation();
              handleDayClick(cloneDay);
            }}
          >
            <span className="number">{formattedDate}</span>
            <div className="tasks">
              {dayTasks.slice(0, 2).map((task, index) => {
                const categoryColor =
                  userCategories.find((cat) => cat.name === task.category)
                    ?.color || "black";

                return (
                  <div
                    key={index}
                    className="task-item"
                    style={{ color: categoryColor, cursor: "pointer" }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedDate(cloneDay);
                      setTaskInput(task.text);
                      setTaskCategory(task.category || "");
                      setEditingTaskIndex(index);
                      setShowModal(true);
                    }}
                  >
                    • {task.time ? `${task.time} - ` : ""}
                    {task.text}
                  </div>
                );
              })}
              {dayTasks.length > 2 && (
                <div
                  className="more-tasks"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSkipAddModal(true); // ← ovo sprečava otvaranje add modala
                    setSelectedDayTasks(dayTasks);
                    setSelectedDate(cloneDay);
                    setShowAllTasksModal(true);
                  }}
                >
                  +{dayTasks.length - 2} još
                </div>
              )}
            </div>
          </div>
        );

        day = addDays(day, 1);
      }

      rows.push(
        <div className="row" key={day}>
          {days}
        </div>
      );
      days = [];
    }

    return <div className="body">{rows}</div>;
  };

  return (
    <div className="calendar-container">
      {renderHeader()}
      {renderDays()}
      {renderCells()}

      {showModal && !showAllTasksModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div
            className="modal"
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <h3>Dodaj zadatak za {format(selectedDate, "dd.MM.yyyy")}</h3>
            <input
              type="text"
              value={taskInput}
              onChange={(e) => setTaskInput(e.target.value)}
              placeholder="Unesi task"
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
            <input
              type="time"
              value={taskTime}
              onChange={(e) => setTaskTime(e.target.value)}
              placeholder="Vreme"
            />

            <div className="modal-buttons">
              <button onClick={handleSaveTask}>
                {editingTaskIndex !== null ? "Izmeni" : "Sačuvaj"}
              </button>
              {editingTaskIndex !== null && (
                <button
                  onClick={() => {
                    setTaskInput("");
                    setTaskCategory("");
                    setTaskTime("");
                    setEditingTaskIndex(null);
                  }}
                >
                  Dodaj novi task
                </button>
              )}
              <button onClick={() => setShowModal(false)}>Otkaži</button>
            </div>
          </div>
        </div>
      )}
      {showAllTasksModal && !showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Svi taskovi za dan</h2>
            <ul>
              {selectedDayTasks.map((task, index) => (
                <li key={index}>
                  • {task.time ? `${task.time} - ` : ""}
                  {task.text}
                  {task.category}
                </li>
              ))}
            </ul>
            <button onClick={() => setShowAllTasksModal(false)}>Zatvori</button>
          </div>
        </div>
      )}
      <div className="waves" style={{position: "absolute", bottom:0, left:0, width:"100%", zIndex:-1}}>
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

export default Calendar;
