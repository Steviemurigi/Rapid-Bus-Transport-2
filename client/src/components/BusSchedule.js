import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./BusSchedule.css";

const BusSchedule = () => {
    const [busSchedules, setBusSchedules] = useState([]);
    const [selectedDate, setSelectedDate] = useState("");
    const [selectedRoute, setSelectedRoute] = useState("");
    const [loading, setLoading] = useState(true); // Loading state
    const [error, setError] = useState(null); // Error state
    const API_BASE_URL = process.env.REACT_APP_API_URL;

    useEffect(() => {
        const fetchSchedules = async () => {
            setLoading(true);
            setError(null); // Clear any previous errors
            try {
                const response = await axios.get(`${API_BASE_URL}/schedules`); // Your backend endpoint
                setBusSchedules(response.data);
            } catch (err) {
                console.error("Error fetching schedules:", err);
                setError("Error fetching schedules. Please try again later."); // Set error message
            } finally {
                setLoading(false);
            }
        };

        fetchSchedules();
    }, []); // Empty dependency array ensures this runs only once on mount

    const filteredBuses = busSchedules.filter(
        (bus) =>
            (selectedRoute === "" || bus.route === selectedRoute) &&
            (selectedDate === "" || bus.date === selectedDate)
    );

    // Dynamically generate route options
    const availableRoutes = [...new Set(busSchedules.map((bus) => bus.route))];

    const navigate = useNavigate(); // Initialize useNavigate

    const handleBookNow = (bus) => {
        const token = localStorage.getItem("token");

        if (token) { // Check if token exists (not just if it's "true")
            // User is logged in, proceed with booking
            alert(`Booking ${bus.bus_name}`); // Or your actual booking logic
            // ... your booking logic here (API call, etc.) ...
        } else {
            // User is not logged in, redirect to login/signup
            alert("You must be logged in to book a bus.");
            navigate("/login"); // Or navigate("/signup")
        }
    };

    return (
        <div className="bus-schedule-container">
            <h2>View Available Schedules</h2>

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
                    {availableRoutes.map((route) => (
                        <option key={route} value={route}>
                            {route}
                        </option>
                    ))}
                </select>
            </div>

            {loading && <div>Loading bus schedules...</div>}
            {error && <div style={{ color: "red" }}>{error}</div>} {/* Display error message */}

            {!loading && !error && ( // Only render the table if not loading and no error
                <table className="bus-schedule-table">
                    <thead>
                        <tr>
                            <th>Bus Name</th> {/* Header for bus_name */}
                            <th>Date</th> {/* Header for date */}
                            <th>Route</th> {/* Header for route */}
                            <th>Departure Time</th> {/* Header for departure */}
                            <th>Departure Area</th> {/* Header for departure_area */}
                            <th>Destination</th> {/* Header for destination */}
                            <th>Available Seats</th> {/* Header for available_seats */}
                            <th>Price (KES)</th> {/* Header for price */}
                            <th>Action</th> 
                        </tr>
                    </thead>
                    <tbody>
                        {filteredBuses.length > 0 ? (
                            filteredBuses.map((bus) => (
                                <tr key={bus.id}>
                                    <td>{bus.bus_name}</td> {/* Access data from backend */}
                                    <td>{bus.date}</td>
                                    <td>{bus.route}</td>
                                    <td>{bus.departure}</td>
                                    <td>{bus.departure_area}</td>
                                    <td>{bus.destination}</td>
                                    <td>{bus.available_seats}</td>
                                    <td>{bus.price}</td>
                                    <td>
                                        <button
                                            className="book-btn"
                                            onClick={() => handleBookNow(bus)}
                                        >
                                            Book Now
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="9">
                                    No buses available for the selected date and route.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default BusSchedule;