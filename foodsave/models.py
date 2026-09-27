from extensions import db
from flask_login import UserMixin
from datetime import datetime

class User(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)

class Food(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    food_name = db.Column(db.String(100), nullable=False)
    category = db.Column(db.String(50), nullable=False)
    quantity = db.Column(db.String(50), nullable=False)
    purchase_date = db.Column(db.Date, nullable=False)
    expiry_date = db.Column(db.Date, nullable=False)
    storage_location = db.Column(db.String(50), nullable=False)
    
class Leftover(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    food_name = db.Column(db.String(100), nullable=False)
    quantity = db.Column(db.String(50), nullable=False)
    date_added = db.Column(db.Date, nullable=False, default=datetime.utcnow)
    status = db.Column(db.String(20), nullable=False, default='Available') # Available, Consumed, Wasted
    reminder_date = db.Column(db.Date, nullable=True)

class Meal(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    day = db.Column(db.String(20), nullable=False) # Monday, Tuesday...
    meal_type = db.Column(db.String(20), nullable=False) # Breakfast, Lunch, Dinner
    meal_name = db.Column(db.String(100), nullable=False)
    ingredients = db.Column(db.Text, nullable=True)

class WasteRecord(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    food_name = db.Column(db.String(100), nullable=False)
    quantity = db.Column(db.String(50), nullable=False)
    date_recorded = db.Column(db.Date, nullable=False, default=datetime.utcnow)
    reason = db.Column(db.String(200), nullable=True)
