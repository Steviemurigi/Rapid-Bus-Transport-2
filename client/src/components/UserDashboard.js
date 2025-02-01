import React, { useState, useEffect } from "react";
import { Clock, MapPin, Wallet, Calendar, Truck } from "lucide-react";

const UserDashboard = () => {
  const [activeTab, setActiveTab] = useState("BOOK_TICKET");
  const [currentPage, setCurrentPage] = useState(1);
  const [bookingData, setBookingData] = useState({
    terminal: "",
    destination: "",
    time: "",
    date: "",
    schedule_id: ""  // Added schedule_id for booking
  });

  // State for schedules fetched from the backend
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);

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

  // Fetch schedules from the backend on mount
  useEffect(() => {
    fetch(`${API_BASE_URL}/schedules`)  // Replace with actual backend URL
      .then(response => response.json())
      .then(data => {
        setSchedules(data);
        setLoading(false);
      })
      .catch(error => {
        console.error("Error fetching schedules:", error);
        setLoading(false);
      });
  }, []);

  // Handle booking submission
  const handleBooking = () => {
    if (!bookingData.schedule_id) {
      alert("Please select a schedule.");
      return;
    }

    const bookingPayload = {
      customer_id: localStorage.getItem("user_id"), // Ensure this is stored in localStorage at login
      schedule_id: bookingData.schedule_id,
      total_amount: 3500,  // Replace with actual price if available
      payment_status: "unpaid"
    };

    fetch(`${API_BASE_URL}/bookings`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(bookingPayload)
    })
    .then(response => response.json())
    .then(data => {
      alert("Booking successful!");
      console.log("Booking Response:", data);
    })
    .catch(error => {
      console.error("Error making booking:", error);
      alert("Booking failed. Try again.");
    });
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-amber-600 p-4 text-white">
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <div className="flex items-center gap-2">
            <Truck className="h-8 w-8" />
            <h1 className="text-2xl font-bold">SafiriLink</h1>
          </div>
          <div className="flex items-center gap-4">
            <Wallet className="h-6 w-6" />
            <span className="flex items-center gap-2">
              <span>Balance:</span>
              <span className="font-bold">Kshs 3,500</span>
            </span>
            <div className="h-8 w-px bg-white/50"></div>
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center">
                <span>JD</span>
              </div>
              <span>John Doe</span>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto flex gap-8 p-4">
          <button
            onClick={() => setActiveTab("BOOK_TICKET")}
            className={`pb-2 px-4 ${activeTab === "BOOK_TICKET" ? "border-b-2 border-amber-600 font-bold" : "text-gray-500"}`}
          >
            Book Ticket
          </button>
          <button
            onClick={() => setActiveTab("BOOKINGS")}
            className={`pb-2 px-4 ${activeTab === "BOOKINGS" ? "border-b-2 border-amber-600 font-bold" : "text-gray-500"}`}
          >
            My Bookings
          </button>
          <button
            onClick={() => setActiveTab("ACCOUNT")}
            className={`pb-2 px-4 ${activeTab === "ACCOUNT" ? "border-b-2 border-amber-600 font-bold" : "text-gray-500"}`}
          >
            Account Settings
          </button>
        </div>
      </nav>

      {/* Main Content */}
      {activeTab === "BOOK_TICKET" ? (
        <main className="max-w-6xl mx-auto p-4">
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h2 className="text-2xl font-bold mb-6">Choose Plan</h2>
           
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Bus Schedule</label>
                  <select
                    className="w-full p-3 border rounded-lg"
                    value={bookingData.schedule_id}
                    onChange={(e) => setBookingData({ ...bookingData, schedule_id: e.target.value })}
                  >
                    <option value="">Select Schedule</option>
                    {loading ? (
                      <option>Loading...</option>
                    ) : (
                      schedules.map(schedule => (
                        <option key={schedule.id} value={schedule.id}>
                          {schedule.terminal} → {schedule.destination} at {schedule.departure_time}
                        </option>
                      ))
                    )}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Travel Date</label>
                  <input
                    type="date"
                    className="w-full p-3 border rounded-lg"
                    value={bookingData.date}
                    onChange={(e) => setBookingData({ ...bookingData, date: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Travel Time</label>
                  <input
                    type="time"
                    className="w-full p-3 border rounded-lg"
                    value={bookingData.time}
                    onChange={(e) => setBookingData({ ...bookingData, time: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <div className="mt-8 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between mb-4">
                <span className="font-medium">Balance:</span>
                <span className="text-2xl font-bold">Kshs 3,500</span>
              </div>
              <button
                onClick={handleBooking}
                className="w-full bg-amber-600 text-white py-3 rounded-lg hover:bg-amber-700 transition-colors"
              >
                Book Now
              </button>
              <button className="mt-2 w-full border-2 border-amber-600 text-amber-600 py-3 rounded-lg hover:bg-amber-50 transition-colors">
                Top Up
              </button>
            </div>
          </div>
        </main>
      ) : activeTab === "BOOKINGS" ? (
        <main className="max-w-6xl mx-auto p-4">
          <div className="space-y-4">
            {bookings.map(booking => (
              <div key={booking.id} className="bg-white rounded-lg p-6 shadow-sm">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-amber-600">
                      <MapPin className="h-5 w-5" />
                      <span className="font-medium">
                        {booking.terminal} → {booking.destination}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-gray-600">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>{booking.date}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        <span>{booking.time}</span>
                      </div>
                      <span>Seat: {booking.seat}</span>
                      <span>Price: Kshs {booking.price.toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="text-right space-y-2">
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${
                        booking.status === "CONFIRMED"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {booking.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>
      ) : (
        <main className="max-w-6xl mx-auto p-4">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold mb-6">Account Settings</h2>
            {/* Account Settings Form Here */}
          </div>
        </main>
      )}
    </div>
  );
};

export default UserDashboard;
