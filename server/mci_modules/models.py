from flask_sqlalchemy import SQLAlchemy
from passlib.hash import pbkdf2_sha256 as sha256
from datetime import datetime
db = SQLAlchemy()

class User(db.Model):
    """User model for storing user related details"""
    id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String(50), nullable=False)
    last_name = db.Column(db.String(50), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(128))
    registration_date = db.Column(db.DateTime, default=datetime.utcnow) # to add in more information for the user

    favorites = db.relationship('Favorite', backref='user', lazy=True)

    def set_password(self, password):
        self.password_hash = sha256.hash(password)

    def check_password(self, password):
        return sha256.verify(password, self.password_hash)
    
    def get_user_id_by_email(email):
        user = User.query.filter_by(email=email).first()
        if user:
            return user.id
        else:
            return None

class Favorite(db.Model):
    """Favorite model for storing user's favorite games"""
    id = db.Column(db.Integer, primary_key=True)  # Primary key
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    game_id = db.Column(db.String, nullable=False)  # game_id is a string
    game_img = db.Column(db.String, default='')
    platform_id = db.Column(db.Integer, nullable=False)  # platform_id is an integer
    date_favorited = db.Column(db.DateTime, default=datetime.utcnow)


        