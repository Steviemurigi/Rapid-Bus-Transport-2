from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class SerializerMixin:
    def to_dict(self):
        """Convert model instance to dictionary."""
        return {column.name: getattr(self, column.name) for column in self.__table__.columns}

class User(db.Model, SerializerMixin):
    __tablename__ = "users"  

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)
    contact = db.Column(db.String, nullable=True)  
    email = db.Column(db.String, unique=True, nullable=False)
    #_password_hash = db.Column(db.String(128), nullable=False)
    role = db.Column(db.String, nullable=False)
    