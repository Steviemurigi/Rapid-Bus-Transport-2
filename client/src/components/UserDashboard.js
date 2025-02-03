import React, { useState } from "react";
import { Clock, MapPin, Wallet, Calendar, Truck } from "lucide-react";
import "./UserDashboard.css";

const UserDashboard = () => {
  const [activeTab, setActiveTab] = useState("BOOK_TICKET");
  const [currentPage, setCurrentPage] = useState(1);
  const [bookingData, setBookingData] = useState({
    terminal: "",
    destination: "",
    time: "",
    date: ""
  });

  // Sample data
  const bookings = [
    {
      id: 1,
      terminal: "Nairobi",
      destination: "Mombasa",
      time: "08:00 AM",
      date: "2024-03-20",
      status: "CONFIRMED",
      seat: "A12",
      price: 3500
    },
    {
      id: 2,
      terminal: "Nakuru",
      destination: "Kisumu",
      time: "10:30 AM",
      date: "2024-03-21",
      status: "PENDING",
      seat: "B07",
      price: 2800
    }
  ];

  const paymentMethods = [
    { type: "M-Pesa", lastFour: "2547" },
    { type: "Visa", lastFour: "4321" }
  ];

  const terminals = ["Nairobi", "Mombasa", "Kisumu", "Nakuru", "Eldoret"];
  const destinations = ["Mombasa", "Nairobi", "Kisumu", "Nakuru", "Eldoret"];

  return (
    <div className="dashboard">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-content">
          <div className="logo-container">
            <Truck className="logo-icon" />
            <h1 className="logo-text">SafiriLink</h1>
          </div>
          <div className="user-info">
            <Wallet className="wallet-icon" />
            <span className="balance-container">
              <span>Balance:</span>
              <span className="balance-amount">Kshs 3,500</span>
            </span>
            <div className="divider"></div>
            <div className="user-profile">
              <div className="avatar">
                <span>JD</span>
              </div>
              <span>John Doe</span>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="dashboard-nav">
        <div className="nav-content">
          <button
            onClick={() => setActiveTab("BOOK_TICKET")}
            className={`nav-button ${activeTab === "BOOK_TICKET" ? "active" : ""}`}
          >
            Book Ticket
          </button>
          <button
            onClick={() => setActiveTab("BOOKINGS")}
            className={`nav-button ${activeTab === "BOOKINGS" ? "active" : ""}`}
          >
            My Bookings
          </button>
          <button
            onClick={() => setActiveTab("ACCOUNT")}
            className={`nav-button ${activeTab === "ACCOUNT" ? "active" : ""}`}
          >
            Account Settings
          </button>
        </div>
      </nav>

      {/* Main Content */}
      {activeTab === "BOOK_TICKET" ? (
        <main className="main-content">
          <div className="booking-form">
            <h2 className="section-title">Choose Plan</h2>
           
            <div className="form-grid">
              <div className="form-column">
                <div className="form-group">
                  <label className="form-label">Terminal</label>
                  <select
                    className="form-select"
                    value={bookingData.terminal}
                    onChange={(e) => setBookingData({...bookingData, terminal: e.target.value})}
                  >
                    <option value="">Select Terminal</option>
                    {terminals.map(terminal => (
                      <option key={terminal} value={terminal}>{terminal}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Destination</label>
                  <select
                    className="form-select"
                    value={bookingData.destination}
                    onChange={(e) => setBookingData({...bookingData, destination: e.target.value})}
                  >
                    <option value="">Select Destination</option>
                    {destinations.map(destination => (
                      <option key={destination} value={destination}>{destination}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-column">
                <div className="form-group">
                  <label className="form-label">Travel Date</label>
                  <input
                    type="date"
                    className="form-input"
                    value={bookingData.date}
                    onChange={(e) => setBookingData({...bookingData, date: e.target.value})}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Travel Time</label>
                  <input
                    type="time"
                    className="form-input"
                    value={bookingData.time}
                    onChange={(e) => setBookingData({...bookingData, time: e.target.value})}
                  />
                </div>
              </div>
            </div>

            <div className="balance-section">
              <div className="balance-info">
                <span>Balance:</span>
                <span className="balance-amount">Kshs 3,500</span>
              </div>
              <button className="book-button">Book Now</button>
              <button className="topup-button">Top Up</button>
            </div>
          </div>
        </main>
      ) : activeTab === "BOOKINGS" ? (
        <main className="main-content">
          <div className="bookings-list">
            {bookings.map(booking => (
              <div key={booking.id} className="booking-card">
                <div className="booking-content">
                  <div className="booking-details">
                    <div className="route-info">
                      <MapPin className="icon" />
                      <span className="route">
                        {booking.terminal} → {booking.destination}
                      </span>
                    </div>
                    <div className="trip-info">
                      <div className="info-item">
                        <Calendar className="icon-small" />
                        <span>{booking.date}</span>
                      </div>
                      <div className="info-item">
                        <Clock className="icon-small" />
                        <span>{booking.time}</span>
                      </div>
                      <span>Seat: {booking.seat}</span>
                      <span>Price: Kshs {booking.price.toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="booking-actions">
                    <span className={`status-badge ${booking.status.toLowerCase()}`}>
                      {booking.status}
                    </span>
                    <div className="action-buttons">
                      <button className="view-button">View Ticket</button>
                      <button className="cancel-button">Cancel Booking</button>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            <div className="pagination">
              {[1, 2, 3].map(page => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`page-button ${currentPage === page ? "active" : ""}`}
                >
                  {page}
                </button>
              ))}
            </div>
          </div>
        </main>
      ) : (
        <main className="main-content">
          <div className="account-grid">
            <div className="account-section">
              <h2 className="section-title">Payment Methods</h2>
              <div className="payment-methods">
                {paymentMethods.map((method, index) => (
                  <div key={index} className="payment-method-card">
                    <div className="method-info">
                      <p className="method-name">{method.type}</p>
                      <p className="method-details">•••• {method.lastFour}</p>
                    </div>
                    <button className="remove-button">Remove</button>
                  </div>
                ))}
                <button className="add-payment-button">Add New Payment Method</button>
              </div>
            </div>

            <div className="account-section">
              <h2 className="section-title">Account Information</h2>
              <div className="account-form">
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input
                    type="text"
                    defaultValue="John Doe"
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <input
                    type="email"
                    defaultValue="johndoe@example.com"
                    className="form-input"
                  />
                </div>
                <button className="update-button">Update Profile</button>
              </div>
            </div>
          </div>
        </main>
      )}
    </div>
  );
};

export default UserDashboard;