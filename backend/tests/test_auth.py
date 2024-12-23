def test_register_user(client):
    response = client.post(
        "/register/",
        json={"username":"test","email": "test@example.com", "password": "password123"}
    )
    assert response.status_code == 201
    assert response.json()["email"] == "test@example.com"

def test_login_user(client):
    # Register the user first
    client.post(
        "/register/",
        json={"username":"test","email": "test@example.com", "password": "password123"}
    )
    # Attempt login
    response = client.post(
        "/login/",
        data={"username": "test@example.com", "password": "password123"}
    )
    assert response.status_code == 200
    assert "access_token" in response.json()
