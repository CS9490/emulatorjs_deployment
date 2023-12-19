import pytest
from app import app, db

@pytest.fixture(scope='module')
def test_client():
    app.config['TESTING'] = True
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///:memory:'
    with app.app_context():
        db.create_all()
        testing_client = app.test_client()
        yield testing_client
        db.session.remove()
        db.drop_all()