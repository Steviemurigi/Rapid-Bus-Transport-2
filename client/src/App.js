import React from "react";
import { Route, Routes, Link, useNavigate } from "react-router-dom";
import { FaUser } from "react-icons/fa"; // Import person icon
import "./App.css"; 
import Home from "./components/Home";
import Dashboard from "./components/Dashboard";
import SignupForm from "./components/SignupForm";
import Login from "./components/Login";
import DriverDashboard from "./components/DriverDashboard";
import BusSchedule from "./components/BusSchedule";
import UserDashboard from "./components/UserDashboard";

function App() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const username = localStorage.getItem("username"); // Retrieve username

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("user_role");
    navigate("/"); // Redirect to home after logout
  };

  return (
    <div className="App">
      <header>
        <nav>
          <ul className="nav-left">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/busSchedules"> Bus Schedule</Link></li>
            {token && <li><Link to="/bookings">My Bookings</Link></li>}
          </ul>

          {token && (
            <ul className="nav-right">
              <li className="welcome-message">
                <FaUser className="user-icon" /> Welcome, {username}
              </li>
              <li><button onClick={handleLogout} className="logout-button">Logout</button></li>
            </ul>
          )}

          {!token && (
            <ul className="nav-right">
              <li><Link to="/login">Login</Link></li>
              <li><Link to="/signup">Register</Link></li>
            </ul>
          )}
       </nav>
      </header>

      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/busSchedules" element={<BusSchedule />} />
          <Route path="/bookings" element={<UserDashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignupForm />} />
          <Route path="/driver-dashboard" element={<DriverDashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </main>  

      <footer>
        <p>&copy; 2025 Bus Management System. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;
