import React from 'react';
import './styles/calendar.css';
import Calendar from './components/Calendar';
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import Navbar from './components/Navbar';
import Settings from './components/Settings';
import Weekly from './components/Weekly';


function AppContent() {
  const location = useLocation();

  const shouldShowNavbar = location.pathname !== '/';

  return (
    <>
      {shouldShowNavbar && <Navbar />}
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/" element={<Register />} />
        <Route path="/monthly" element={<Calendar />} />
        <Route path="/weekly" element={<Weekly />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </>
  );
}

function App() {

  
  
  return (
    <div className="app-container">
      <Router>
          <AppContent />
      </Router>
    </div>
  );
}

export default App;
