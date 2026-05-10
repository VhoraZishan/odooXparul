from fastapi.testclient import TestClient
from app.main import app
from app.database import SessionLocal
from app.models.user import Profile

client = TestClient(app)

def test_api():
    print("--- Starting Local TestClient ---")
    
    # 1. Signup
    email = "testclient@example.com"
    password = "testpassword123"
    
    signup_resp = client.post("/auth/signup", json={
        "email": email,
        "password": password,
        "full_name": "Test Client User"
    })
    
    if signup_resp.status_code == 200:
        token = signup_resp.json().get("access_token")
    else:
        login_resp = client.post("/auth/login", json={"email": email, "password": password})
        token = login_resp.json().get("access_token")
        
    headers = {"Authorization": f"Bearer {token}"}
    
    # 2. Create trip
    trip_resp = client.post("/trips", headers=headers, json={"title": "TestClient Trip"})
    trip_id = trip_resp.json().get("id")
    
    # 3. Add expense
    expense_data = {
        "title": "Hotel Booking",
        "amount": 250.00,
        "currency": "USD",
        "category": "accommodation",
        "notes": "2 nights stay"
    }
    
    print("Adding expense...")
    try:
        expense_resp = client.post(f"/trips/{trip_id}/billing/expenses", headers=headers, json=expense_data)
        print("Status:", expense_resp.status_code)
        print("Response:", expense_resp.json())
    except Exception as e:
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    test_api()
