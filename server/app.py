import os
from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_cors import CORS
from flask_restful import Api, Resource
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from datetime import datetime
from models import db, User, Bus, Route, Schedule, Seat, Booking, Payment

app = Flask(__name__)
CORS(app, origins=["http://localhost:3000"])

# Database Configuration
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URI')  # Change for production
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.json.compact = False
app.config['JWT_SECRET_KEY'] = '53d2d9fe8241bc0ba31d0009a7ebc2912520e582d4bbe944528377d55174f2fc'

migrate = Migrate(app, db)
db.init_app(app)

api = Api(app)
jwt = JWTManager(app)

@app.route('/')
def index():
    return "Bus Management API"

# ---- AUTHENTICATION ----
class UserRegister(Resource):
    def post(self):
        data = request.get_json()

        # Check if user already exists
        if User.query.filter_by(email=data['email']).first():
            return {"message": "User already exists"}, 400

        # Create new user with hashed password
        user = User(
            name=data['name'],
            email=data['email'],
            role=data['role'],
            contact_info=data.get('contact_info', '')
        )
        user.set_password(data['password'])  # Hash password before saving

        db.session.add(user)
        db.session.commit()
        return {"message": "User registered successfully"}, 201


class UserLogin(Resource):
    def post(self):
        data = request.get_json()
        user = User.query.filter_by(email=data['email']).first()

        # Check if user exists and password is correct
        if user and user.check_password(data['password']):
            access_token = create_access_token(identity=user.id)
            return {"access_token": access_token}, 200
        
        return {"message": "Invalid credentials"}, 401


# ---- BUS ENDPOINTS ----
class BusResource(Resource):
    @jwt_required()
    def get(self, bus_id=None):
        if bus_id:
            bus = Bus.query.get(bus_id)
            if not bus:
                return {"message": "Bus not found"}, 404
            return jsonify(bus.serialize())
        return jsonify([bus.serialize() for bus in Bus.query.all()])

    @jwt_required()
    def post(self):
        data = request.get_json()
        bus = Bus(**data)
        db.session.add(bus)
        db.session.commit()
        return {"message": "Bus added"}, 201

    @jwt_required()
    def put(self, bus_id):
        data = request.get_json()
        bus = Bus.query.get(bus_id)
        if not bus:
            return {"message": "Bus not found"}, 404
        for key, value in data.items():
            setattr(bus, key, value)
        db.session.commit()
        return {"message": "Bus updated"}, 200

    @jwt_required()
    def delete(self, bus_id):
        bus = Bus.query.get(bus_id)
        if not bus:
            return {"message": "Bus not found"}, 404
        db.session.delete(bus)
        db.session.commit()
        return {"message": "Bus deleted"}, 200

# ---- ROUTE ENDPOINTS ----
class RouteResource(Resource):
    def get(self):
        return jsonify([route.serialize() for route in Route.query.all()])

    def post(self):
        data = request.get_json()
        route = Route(**data)
        db.session.add(route)
        db.session.commit()
        return {"message": "Route added"}, 201

# ---- SCHEDULE ENDPOINTS ----
class ScheduleResource(Resource):
    def get(self):
        return jsonify([schedule.serialize() for schedule in Schedule.query.all()])

    def post(self):
        data = request.get_json()
        schedule = Schedule(
            bus_id=data['bus_id'],
            route_id=data['route_id'],
            departure_time=datetime.strptime(data['departure_time'], '%Y-%m-%d %H:%M:%S'),
            arrival_time=datetime.strptime(data['arrival_time'], '%Y-%m-%d %H:%M:%S'),
            date=datetime.strptime(data['date'], '%Y-%m-%d').date(),
            status=data.get('status', 'on time')
        )
        db.session.add(schedule)
        db.session.commit()
        return {"message": "Schedule added"}, 201

# ---- SEAT ENDPOINTS ----
class SeatResource(Resource):
    def get(self, schedule_id):
        return jsonify([seat.serialize() for seat in Seat.query.filter_by(schedule_id=schedule_id).all()])

    def post(self):
        data = request.get_json()
        seat = Seat(**data)
        db.session.add(seat)
        db.session.commit()
        return {"message": "Seat added"}, 201

# ---- BOOKING ENDPOINTS ----
class BookingResource(Resource):
    def get(self):
        return jsonify([booking.serialize() for booking in Booking.query.all()])

    @jwt_required()
    def post(self):
        data = request.get_json()
        user_id = get_jwt_identity()
        booking = Booking(
            customer_id=user_id,
            schedule_id=data['schedule_id'],
            total_amount=data['total_amount']
        )
        db.session.add(booking)
        db.session.commit()

        # Add selected seats to booking
        for seat_id in data['seats']:
            seat = Seat.query.get(seat_id)
            if seat and seat.status == "available":
                seat.status = "booked"
                booking.seats.append(seat)
            else:
                return {"message": f"Seat {seat_id} is not available"}, 400
        db.session.commit()
        return {"message": "Booking successful"}, 201

# ---- PAYMENT ENDPOINTS ----
class PaymentResource(Resource):
    def post(self):
        data = request.get_json()
        booking = Booking.query.get(data['booking_id'])
        if not booking:
            return {"message": "Booking not found"}, 404

        payment = Payment(
            booking_id=data['booking_id'],
            payment_method=data['payment_method'],
            amount=data['amount'],
            transaction_id=data['transaction_id']
        )
        booking.payment_status = "paid"
        db.session.add(payment)
        db.session.commit()
        return {"message": "Payment successful"}, 201

# ---- ADD ROUTES TO API ----
api.add_resource(UserRegister, '/register')
api.add_resource(UserLogin, '/login')
api.add_resource(BusResource, '/buses', '/buses/<int:bus_id>')
api.add_resource(RouteResource, '/routes')
api.add_resource(ScheduleResource, '/schedules')
api.add_resource(SeatResource, '/seats/<int:schedule_id>')
api.add_resource(BookingResource, '/bookings')
api.add_resource(PaymentResource, '/payments')

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)
