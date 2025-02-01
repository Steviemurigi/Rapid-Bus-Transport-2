import React, { useState, useEffect } from "react";
import axios from "axios";
import "./BusSchedule.css";

const BusSchedule = () => {
  // State variables for bus schedules, routes, and filters
  const [busSchedules, setBusSchedules] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedRoute, setSelectedRoute] = useState("");
  const API_BASE_URL = process.env.REACT_APP_API_URL;

  // Fetch the bus schedules and routes on component mount
  useEffect(() => {
    // Fetch routes first
    axios.get(`${API_BASE_URL}/routes`) // Assuming your backend has a route at /api/routes
      .then((response) => {
        setRoutes(response.data); // Assuming response contains an array of routes
      })
      .catch((error) => {
        console.error("Error fetching routes:", error);
      });

    // Fetch bus schedules
    axios.get(`${API_BASE_URL}/schedules`) // Assuming your backend has a route at /api/schedules
      .then((response) => {
        setBusSchedules(response.data); // Assuming response contains an array of bus schedules
      })
      .catch((error) => {
        console.error("Error fetching bus schedules:", error);
      });
  }, []);

  // Filter buses based on selected date and route
  const filteredBuses = busSchedules.filter(
    (bus) =>
      (selectedRoute === "" || bus.route === selectedRoute) && // Filter by route
      (selectedDate === "" || bus.date === selectedDate) // Filter by date
  );

  return (
    <div className="bus-schedule-container">
      <h2>View Available Schedules</h2>

      {/* Filters Section */}
      <div className="filters">
        <label>Select Travel Date:</label>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
        />

        <label>Select Route:</label>
        <select
          value={selectedRoute}
          onChange={(e) => setSelectedRoute(e.target.value)}
        >
          <option value="">All Routes</option>
          {routes.map((route) => (
            <option key={route.id} value={route.name}>{route.name}</option>
          ))}
        </select>
      </div>

      {/* Bus Schedule Table */}
      <table className="bus-schedule-table">
        <thead>
          <tr>
            <th>Bus Name</th>
            <th>Date</th>
            <th>Route</th>
            <th>Departure Time</th>
            <th>Departure Area</th>
            <th>Destination</th>
            <th>Available Seats</th>
            <th>Price (KES)</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredBuses.length > 0 ? (
            filteredBuses.map((bus) => (
              <tr key={bus.id}>
                <td>{bus.busName}</td>
                <td>{bus.date}</td>
                <td>{bus.route}</td>
                <td>{bus.departure}</td>
                <td>{bus.departureArea}</td>
                <td>{bus.destination}</td>
                <td>{bus.availableSeats}</td>
                <td>{bus.price}</td>
                <td>
                  <button className="book-btn" onClick={() => alert(`Booking ${bus.busName}`)}>
                    Book Now
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="9">No buses available for the selected date and route.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default BusSchedule;
