def test_create_user_incomplete_data(test_client):
    """
    Test POST with incomplete user data
    """
    incomplete_data = {
        "first_name": "Bob"
    }
    response = test_client.post('/register', json=incomplete_data)
    assert response.status_code == 400
    assert b"Missing input" in response.data