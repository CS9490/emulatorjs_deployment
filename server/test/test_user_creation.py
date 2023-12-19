import pytest
from app import app, db
from mci_modules.models import User

@pytest.fixture(scope='module')
def test_client():
    app.config['TESTING'] = True
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///:memory:'

    with app.app_context():
        db.create_all()  # Create tables

        testing_client = app.test_client()

        yield testing_client

        db.session.remove()
        db.drop_all()

def test_users_route(test_client):
    """
    GIVEN a Flask application
    WHEN the '/users' page is requested (GET)
    THEN check the response is valid
    """
    response = test_client.get('/users')
    assert response.status_code == 200

def test_create_user(test_client):
    """
    Test POST to create a new user
    """
    user_data = {
        "first_name": "Alice",
        "last_name": "Doe",
        "email": "alice@gmail.com",
        "password": "secure_password"
    }
    response = test_client.post('/register', json=user_data)
    assert response.status_code == 201
    assert b"User registered successfully" in response.data