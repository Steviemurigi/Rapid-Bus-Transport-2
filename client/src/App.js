import React from "react";
import { Route, Routes, Link, useNavigate } from "react-router-dom";
import "./App.css"; 
import Home from "./components/Home";
import Dashboard from "./components/Dashboard";
import SignupForm from "./components/SignupForm";
import Login from "./components/Login";
import DriverDashboard from "./components/DriverDashboard";
import BusSchedule from "./components/BusSchedule";
import UserDashboard from "./components/UserDashboard";

const Register = () => (
  <section id="register">
    <h2>Register</h2>
    <p>Create a new account to start booking your travels.</p>
    <form>
      <input type="text" placeholder="Full Name" required />
      <input type="email" placeholder="Email" required />
      <input type="password" placeholder="Password" required />
      <button type="submit">Register</button>
    </form>
  </section>
);

function App() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token"); // Check if user is logged in

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user_role");
    navigate("/"); // Redirect to home after logout
  };

  return (
    <div className="App">
      <header>
        <nav>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/busSchedules"> Bus Schedule</Link></li>
            <li><Link to="/bookings">My Bookings</Link></li>

            {/* Show Login/Register if not logged in, otherwise show Logout */}
            {!token ? (
              <>
                <li><Link to="/login">Login</Link></li>
                <li><Link to="/signup">Register</Link></li>
              </>
            ) : (
              <li><button onClick={handleLogout} className="logout-button">Logout</button></li>
            )}
          </ul>
        </nav>
      </header>

      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/busSchedules" element={<BusSchedule />} />
          <Route path="/bookings" element={<UserDashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/driver-dashboard" element={<DriverDashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/signup" element={<SignupForm />} />
        </Routes>
      </main>  

      <footer>
        <p>&copy; 2025 Bus Management System. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;
