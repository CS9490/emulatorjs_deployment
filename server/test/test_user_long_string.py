def test_create_user_long_string(test_client):
    long_string_data = {
        "first_name": "a" * 1000,
        "last_name": "Doe",
        "email": "long@gmail.com",
        "password": "password"
    }
    response = test_client.post('/register', json=long_string_data)
    assert response.status_code == 201  # User is created successfully