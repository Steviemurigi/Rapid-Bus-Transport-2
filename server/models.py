from werkzeug.security import generate_password_hash, check_password_hash
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from sqlalchemy_serializer import SerializerMixin

db = SQLAlchemy()

# Many-to-Many Relationship Table for Bookings and Seats
booking_seat_association = db.Table(
    'booking_seat',
    db.Column('booking_id', db.Integer, db.ForeignKey('booking.id'), primary_key=True),
    db.Column('seat_id', db.Integer, db.ForeignKey('seat.id'), primary_key=True)
)

class User(db.Model, SerializerMixin):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(256), nullable=False)
    role = db.Column(db.String(20), nullable=False)  # Admin, Driver, Customer
    contact_info = db.Column(db.String(200), nullable=True)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)
    
    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "email": self.email,
            "role": self.role,
            "contact_info": self.contact_info
        }

    buses = db.relationship('Bus', backref='owner', lazy=True)
    bookings = db.relationship('Booking', backref='customer', lazy=True)

class Bus(db.Model, SerializerMixin):
    id = db.Column(db.Integer, primary_key=True)
    license_plate = db.Column(db.String(20), unique=True, nullable=False)
    total_seats = db.Column(db.Integer, nullable=False)
    bus_type = db.Column(db.String(50), nullable=False)  # Standard, Luxury
    owner_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    status = db.Column(db.String(20), default="active")  # Active, Inactive
    name = db.Column(db.String(100), nullable=False)
    departure_area = db.Column(db.String(100), nullable=False)
    price = db.Column(db.Float, nullable=False)

    def serialize(self):
        return {
            "id": self.id,
            "license_plate": self.license_plate,
            "total_seats": self.total_seats,
            "bus_type": self.bus_type,
            "owner_id": self.owner_id,
            "status": self.status,
            "name": self.name,
            "departure_area": self.departure_area
        }

class Schedule(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    bus_id = db.Column(db.Integer, db.ForeignKey('bus.id'))
    departure_time = db.Column(db.DateTime)
    arrival_time = db.Column(db.DateTime)
    date = db.Column(db.Date)
    status = db.Column(db.String(50))
    start_location = db.Column(db.String(100))
    end_location = db.Column(db.String(100))
    route_details = db.Column(db.String(255))
    destination = db.Column(db.String(100))
    price = db.Column(db.Float, nullable=False)  # Adjusted to Schedule level
    
    seats = db.relationship('Seat', backref='schedule', lazy=True)
    bookings = db.relationship('Booking', backref='schedule', lazy=True)
    bus = db.relationship('Bus', backref='schedules')

    def to_dict(self):
        return {
            'id': self.id,
            'bus_name': self.bus.name,
            'date': self.date,
            'route': self.route_details,
            'departure': self.departure_time.strftime('%I:%M %p'),
            'departure_area': self.start_location,
            'destination': self.destination,
            'available_seats': sum(1 for seat in self.seats if seat.status == "available"),
            'price': self.price
        }

class Seat(db.Model, SerializerMixin):
    id = db.Column(db.Integer, primary_key=True)
    schedule_id = db.Column(db.Integer, db.ForeignKey('schedule.id'), nullable=False)
    seat_number = db.Column(db.Integer, nullable=False)
    price = db.Column(db.Float, nullable=False)
    status = db.Column(db.String(20), default="available")

    bookings = db.relationship('Booking', secondary=booking_seat_association, backref='seats')

    def serialize(self):
        return {
            "id": self.id,
            "schedule_id": self.schedule_id,
            "seat_number": self.seat_number,
            "price": self.price,
            "status": self.status
        }

class Booking(db.Model, SerializerMixin):
    id = db.Column(db.Integer, primary_key=True)
    customer_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    schedule_id = db.Column(db.Integer, db.ForeignKey('schedule.id'), nullable=False)
    booking_date = db.Column(db.DateTime, default=datetime.utcnow)
    payment_status = db.Column(db.String(20), default="unpaid")
    total_amount = db.Column(db.Float, nullable=False)

    def serialize(self):
        return {
            "id": self.id,
            "customer_id": self.customer_id,
            "schedule_id": self.schedule_id,
            "booking_date": self.booking_date,
            "payment_status": self.payment_status,
            "total_amount": self.total_amount
        }

class Payment(db.Model, SerializerMixin):
    id = db.Column(db.Integer, primary_key=True)
    booking_id = db.Column(db.Integer, db.ForeignKey('booking.id'), nullable=False)
    payment_method = db.Column(db.String(50), nullable=False)
    payment_date = db.Column(db.DateTime, default=datetime.utcnow)
    amount = db.Column(db.Float, nullable=False)
    transaction_id = db.Column(db.String(100), unique=True, nullable=False)

    def serialize(self):
        return {
            "id": self.id,
            "booking_id": self.booking_id,
            "payment_method": self.payment_method,
            "payment_date": self.payment_date,
            "amount": self.amount,
            "transaction_id": self.transaction_id
        }

    booking = db.relationship('Booking', backref='payments')

class AdminLog(db.Model, SerializerMixin):
    id = db.Column(db.Integer, primary_key=True)
    admin_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    action = db.Column(db.Text, nullable=False)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)

    admin = db.relationship('User', backref='admin_logs')

    def serialize(self):
        return {
            "id": self.id,
            "admin_id": self.admin_id,
            "action": self.action,
            "timestamp": self.timestamp
        }
