from app import db, app
from models import User, Bus, Schedule, Seat, Booking, Payment
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
        User(name="Kenneth Ochieng", email="driver1@example.com", password_hash=generate_password_hash("driver123"), role="Driver", contact_info="+1987654321"),
        User(name="Jane Smith", email="driver2@example.com", password_hash=generate_password_hash("driver123"), role="Driver", contact_info="+1678901234"),
        User(name="Alice Nduta", email="customer1@example.com", password_hash=generate_password_hash("customer123"), role="Customer", contact_info="+1456789123"),
        User(name="Bob Green", email="customer2@example.com", password_hash=generate_password_hash("customer123"), role="Customer", contact_info="+1345678901"),
    ]
    db.session.add_all(users)
    db.session.commit()

    # Fetch driver users
    owner_kenneth = User.query.filter_by(email="driver1@example.com").first()
    owner_jane = User.query.filter_by(email="driver2@example.com").first()

    # Create Buses
    buses = [
        Bus(license_plate="KDN123", total_seats=40, bus_type="Standard", owner_id=2, status="Active", name="Bus 1", departure_area="Nakuru", price=50),
        Bus(license_plate="KDD789", total_seats=30, bus_type="Luxury", owner_id=3, status="Active", name="Bus 2", departure_area="Kisii", price=75),
        Bus(license_plate="KDE456", total_seats=50, bus_type="Standard", owner_id=2, status="Active", name="Bus 3", departure_area="Nairobi", price=60),
        Bus(license_plate="KDF789", total_seats=60, bus_type="Luxury", owner_id=3, status="Active", name="Bus 4", departure_area="Mombasa", price=90),
        Bus(license_plate="KDG321", total_seats=45, bus_type="Standard", owner_id=2, status="Active", name="Bus 5", departure_area="Kisumu", price=55),
    ]
    db.session.add_all(buses)
    db.session.commit()
    

    # Create Schedules
    # Create Schedules (Each schedule has its own route details)
    schedules = [
        Schedule(
            bus_id=buses[0].id,
            departure_time=datetime.now() + timedelta(days=1),
            arrival_time=datetime.now() + timedelta(days=1, hours=6),
            date=datetime.now().date() + timedelta(days=1),
            status="On Time",
            start_location="Nairobi",
            end_location="Mombasa",
            route_details="Nairobi - Mombasa via A104",
            destination="Mombasa",
            price=buses[0].price
        ),
        Schedule(
            bus_id=buses[1].id,
            departure_time=datetime.now() + timedelta(days=2),
            arrival_time=datetime.now() + timedelta(days=2, hours=6),
            date=datetime.now().date() + timedelta(days=2),
            status="On Time",
            start_location="Mombasa",
            end_location="Kisumu",
            route_details="Mombasa - Kisumu via A123",
            destination="Kisumu",
            price=buses[0].price
        ),
        Schedule(
            bus_id=buses[2].id,
            departure_time=datetime.now() + timedelta(days=3),
            arrival_time=datetime.now() + timedelta(days=3, hours=6),
            date=datetime.now().date() + timedelta(days=3),
            status="On Time",
            start_location="Kisumu",
            end_location="Nairobi",
            route_details="Kisumu - Nairobi via A456",
            destination="Nairobi",
            price=buses[0].price
        ),
        Schedule(
            bus_id=buses[2].id,
            departure_time=datetime.now() + timedelta(days=3),
            arrival_time=datetime.now() + timedelta(days=3, hours=6),
            date=datetime.now().date() + timedelta(days=3),
            status="On Time",
            start_location="Kisumu",
            end_location="Nairobi",
            route_details="Kisumu - Nairobi via A456",
            destination="Nairobi",
            price=buses[0].price
        ),
    ]
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
    seat_1 = Seat.query.filter_by(schedule_id=schedules[0].id, seat_number=1).first()
    seat_2 = Seat.query.filter_by(schedule_id=schedules[1].id, seat_number=2).first()

    if seat_1 and seat_2:
        seat_1.status = "Booked"
        seat_2.status = "Booked"
        bookings[0].seats.append(seat_1)
        bookings[1].seats.append(seat_2)
    else:
        print("Error: Could not find seats to book.")

    db.session.commit()

    # Create Payments
    payments = [
        Payment(booking_id=bookings[0].id, payment_method="Credit Card", payment_date=datetime.now(), amount=50, transaction_id="TXN12345"),
        Payment(booking_id=bookings[1].id, payment_method="Mobile Money", payment_date=datetime.now(), amount=75, transaction_id="TXN67890"),
    ]
    db.session.add_all(payments)
    db.session.commit()

    print("Database seeded successfully!")
