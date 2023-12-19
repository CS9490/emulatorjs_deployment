import pytest
from mci_modules.models import User, db

@pytest.fixture(scope='function')
def new_user():
    user = User(email="test@gmail.com", first_name="Test", last_name="User")
    return user

def test_new_user(new_user):
    assert new_user.email == "test@gmail.com"
    assert new_user.first_name == "Test"
    assert new_user.last_name == "User"

def test_set_password(new_user):
    new_user.set_password("my_password")
    assert new_user.password_hash is not None

def test_check_password(new_user):
    new_user.set_password("my_password")
    assert new_user.check_password("my_password") is True
    assert new_user.check_password("wrong_password") is False