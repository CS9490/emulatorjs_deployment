import pytest
from app import app

def test_some_page_view():
    with app.test_client() as test_client:
        response = test_client.get('/somepage')
        assert response.status_code == 200
        assert b"This is some page!" in response.data