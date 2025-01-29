from app import app, db  # Import your app and db objects
from models import User

def seed_users():
    users = [
        User(name="Alice Johnson", contact="123-456-7890", email="alice@example.com", role="admin"),
        User(name="Bob Smith", contact="987-654-3210", email="bob@example.com", role="user"),
        User(name="Charlie Brown", contact="555-666-7777", email="charlie@example.com", role="moderator"),
    ]
    
    db.session.bulk_save_objects(users)
    db.session.commit()
    print("Database seeded with user data.")

if __name__ == "__main__":
    # Ensure the application context is active before performing database operations
    with app.app_context():  # Add this to manage the application context
        with db.session.begin():  # Ensures the database connection is properly managed
            seed_users()
