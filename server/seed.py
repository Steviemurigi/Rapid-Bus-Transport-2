from app import db, app
from models import User, Bus, Route, Schedule, Seat, Booking, Payment
from werkzeug.security import generate_password_hash
from datetime import datetime, timedelta
import random

# Initialize the application context
with app.app_context():
    # Drop and recreate all tables
    db.drop_all()
    db.create_all()

    # Create Users (Admins, Drivers, Customers)
    users = [
        User(name="Admin User", email="admin@example.com", password_hash=generate_password_hash("admin123"), role="Admin", contact_info="+1234567890"),
        User(name="John Doe", email="driver1@example.com", password_hash=generate_password_hash("driver123"), role="Driver", contact_info="+1987654321"),
        User(name="Jane Smith", email="driver2@example.com", password_hash=generate_password_hash("driver123"), role="Driver", contact_info="+1678901234"),
        User(name="Alice Brown", email="customer1@example.com", password_hash=generate_password_hash("customer123"), role="Customer", contact_info="+1456789123"),
        User(name="Bob Green", email="customer2@example.com", password_hash=generate_password_hash("customer123"), role="Customer", contact_info="+1345678901"),
    ]
    db.session.add_all(users)
    db.session.commit()

    # Create Buses
    buses = [
        Bus(license_plate="ABC123", total_seats=40, bus_type="Standard", owner_id=2, status="Active"),
        Bus(license_plate="XYZ789", total_seats=30, bus_type="Luxury", owner_id=3, status="Active"),
    ]
    db.session.add_all(buses)
    db.session.commit()

    # Create Routes
    routes = [
        Route(start_location="New York", end_location="Washington D.C.", route_details="NY - Philadelphia - Baltimore - D.C.", distance=230),
        Route(start_location="San Francisco", end_location="Los Angeles", route_details="SF - San Jose - Bakersfield - LA", distance=380),
    ]
    db.session.add_all(routes)
    db.session.commit()

    # Create Schedules
    schedules = []
    for i in range(2):
        schedules.append(
            Schedule(
                bus_id=buses[i].id,
                route_id=routes[i].id,
                departure_time=datetime.now() + timedelta(days=i),
                arrival_time=datetime.now() + timedelta(days=i, hours=6),
                date=datetime.now().date() + timedelta(days=i),
                status="On Time"
            )
        )
    db.session.add_all(schedules)
    db.session.commit()

    # Create Seats
    seats = []
    for schedule in schedules:
        for seat_num in range(1, schedule.bus.total_seats + 1):
            seats.append(
                Seat(schedule_id=schedule.id, seat_number=seat_num, price=random.randint(20, 100), status="Available")
            )
    db.session.add_all(seats)
    db.session.commit()

    # Create Bookings
    bookings = [
        Booking(customer_id=4, schedule_id=schedules[0].id, booking_date=datetime.now(), payment_status="Paid", total_amount=50),
        Booking(customer_id=5, schedule_id=schedules[1].id, booking_date=datetime.now(), payment_status="Paid", total_amount=75),
    ]
    db.session.add_all(bookings)
    db.session.commit()

    # Assign Seats to Bookings
    booked_seats = [
        Seat.query.filter_by(schedule_id=schedules[0].id, seat_number=1).first(),
        Seat.query.filter_by(schedule_id=schedules[1].id, seat_number=2).first(),
    ]
    booked_seats[0].status = "Booked"
    booked_seats[1].status = "Booked"
    bookings[0].seats.append(booked_seats[0])
    bookings[1].seats.append(booked_seats[1])
    db.session.commit()

    # Create Payments
    payments = [
        Payment(booking_id=bookings[0].id, payment_method="Credit Card", payment_date=datetime.now(), amount=50, transaction_id="TXN12345"),
        Payment(booking_id=bookings[1].id, payment_method="Mobile Money", payment_date=datetime.now(), amount=75, transaction_id="TXN67890"),
    ]
    db.session.add_all(payments)
    db.session.commit()

    print("Database seeded successfully!")
