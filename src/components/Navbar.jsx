import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import close from "../assets/close.png";
import dashboard from "../assets/dashboard.png";
import settings from "../assets/setting.png";
import calendar from "../assets/calendar (4).png";
import day from "../assets/7-days.png";
import logout from "../assets/logout.png";

const Navbar = () => {
  const [activeNavbar, setActiveNavbar] = useState(false);
  const menuRef = useRef();
  const burgerRef = useRef(); // 🔹 dodajemo ref za burger dugme

  const handleLogout = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user?.email) {
      localStorage.removeItem(`tasks_${user.email}`);
      localStorage.removeItem(`categories`);
      localStorage.removeItem(`hasSeenModal_${user.email}`)
    }
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        burgerRef.current &&
        !burgerRef.current.contains(event.target)
      ) {
        setActiveNavbar(false);
      }
    };

    if (activeNavbar) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [activeNavbar]);

  return (
    <div className="navbar-container">
      {activeNavbar ? (
        <div
          className={`navbar-overlay ${activeNavbar ? "active" : ""}`}
          onClick={() => setActiveNavbar(false)}
        >
          <div
            className="navbar-links"
            ref={menuRef}
            onClick={(e) => e.stopPropagation()}
          >
            <button onClick={() => setActiveNavbar(!activeNavbar)}>
              <img src={close} alt="close" />
            </button>
            <Link className="navbar-link" to="/dashboard">
              <img
                className="navbar-icon"
                src={dashboard}
                alt="links to dashboard"
              />
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
              />
              Monthly Calendar
            </Link>
            <Link className="navbar-link" to="/settings">
              <img
                className="navbar-icon"
                src={settings}
                alt="links to settings"
              />
              Settings
            </Link>
            <button onClick={handleLogout} className="logout-btn">
              <img src={logout} alt="logoutbtn" />
            </button>
          </div>
        </div>
      ) : (
        <button ref={burgerRef} onClick={() => setActiveNavbar(true)}>
          <div className="burger-strip"></div>
          <div className="burger-strip"></div>
          <div className="burger-strip"></div>
        </button>
      )}
    </div>
  );
};

export default Navbar;
