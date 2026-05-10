from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_api():
    # Login
    login_resp = client.post("/auth/login", json={
        "email": "testclient@example.com",
        "password": "testpassword123"
    })
    token = login_resp.json().get("access_token")
    headers = {"Authorization": f"Bearer {token}"}
    
    try:
        res = client.get("/users/me/trips", headers=headers)
        print("Status:", res.status_code)
        print("Response:", res.json())
    except Exception as e:
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    test_api()
