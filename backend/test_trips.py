import requests

BASE_URL = "http://localhost:8000"

def test_api():
    login_resp = requests.post(f"{BASE_URL}/auth/login", json={
        "email": "testclient@example.com",
        "password": "testpassword123"
    })
    token = login_resp.json().get("access_token")
    headers = {"Authorization": f"Bearer {token}"}
    
    res = requests.get(f"{BASE_URL}/users/me/trips", headers=headers)
    print("Status:", res.status_code)
    try:
        print("Response:", res.json())
    except:
        print("Text:", res.text)

if __name__ == "__main__":
    test_api()
