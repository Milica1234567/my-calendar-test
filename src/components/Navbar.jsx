import React from "react";
import { Link } from "react-router-dom";
import { useState } from "react";
import close from "../assets/close.png";
import dashboard from "../assets/dashboard.png";
import settings from "../assets/setting.png";
import calendar from "../assets/calendar (4).png";
import day from "../assets/7-days.png";
import logout from "../assets/logout.png";

const Navbar = () => {
  const [activeNavbar, setActiveNavbar] = useState(false);

  const handleLogout = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user?.email) {
      localStorage.removeItem(`tasks_${user.email}`);
      localStorage.removeItem(`categories`);
    }
    localStorage.removeItem("user");
    window.location.href = "/"; //
  };

  return (
    <div className="navbar-container">
      {activeNavbar ? (
        <div className={`navbar-overlay ${activeNavbar ? "active" : ""}`}>
          <div className="navbar-links">
            <button onClick={() => setActiveNavbar(!activeNavbar)}>
              <img src={close} alt="close"></img>
            </button>
            <Link className="navbar-link" to="/dashboard">
              <img
                className="navbar-icon"
                src={dashboard}
                alt="links to dashboard"
              ></img>{" "}
              Dashboard
            </Link>
            <Link className="navbar-link" to="/weekly">
              <img
                className="navbar-icon"
                src={day}
                alt="link to week calendar"
              />
              Weekly calendar
            </Link>

            <Link className="navbar-link" to="/monthly">
              <img
                className="navbar-icon"
                src={calendar}
                alt="links to monthly calendar"
              ></img>{" "}
              Monthly Calendar
            </Link>
            <Link className="navbar-link" to="/settings">
              <img
                className="navbar-icon"
                src={settings}
                alt="links to settings"
              ></img>{" "}
              Settings
            </Link>
            <button onClick={handleLogout} className="logout-btn">
              <img src={logout} alt="logoutbtn" />
            </button>
          </div>
        </div>
      ) : (
        <button onClick={() => setActiveNavbar(true)}>
          <div className="burger-strip"></div>
          <div className="burger-strip"></div>
          <div className="burger-strip"></div>
        </button>
      )}
    </div>
  );
};

export default Navbar;
