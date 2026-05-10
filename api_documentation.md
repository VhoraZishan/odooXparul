# Traveloop API Documentation

This document outlines the REST API endpoints that the FastAPI backend will expose for the React frontend. 

**Base URL:** `http://localhost:8000`
**Authentication:** Most routes require a Bearer token in the `Authorization` header. The token is the JWT provided by Supabase Auth.

---

## 1. Authentication (`/auth`)
*Note: Depending on your setup, the React frontend can also call Supabase directly to get the JWT. If the frontend calls Supabase directly, you only need to pass the token to the other endpoints.*

### `POST /auth/signup`
Creates a new user account and their profile.
- **Body:**
  ```json
  {
    "email": "user@example.com",
    "password": "securepassword",
    "full_name": "John Doe",
    "phone": "+1234567890",
    "city": "New York",
    "country": "USA"
  }
  ```
- **Response (200 OK):** Returns Supabase session data and token.

### `POST /auth/login`
Authenticates a user.
- **Body:**
  ```json
  {
    "email": "user@example.com",
    "password": "securepassword"
  }
  ```
- **Response (200 OK):** Returns Supabase session data and token.

---

## 2. Users & Profiles (`/users`)

### `GET /users/me`
Fetches the currently authenticated user's profile and preferences.
- **Headers:** `Authorization: Bearer <token>`
- **Response (200 OK):** 
  ```json
  {
    "id": "uuid",
    "full_name": "John Doe",
    "avatar_url": null,
    "phone": "+1234567890",
    "date_of_birth": "1990-01-01",
    "bio": "Avid traveler",
    "preferences": {
      "default_currency": "USD",
      "default_country": "USA"
    }
  }
  ```

### `PUT /users/me`
Updates the user's profile.
- **Headers:** `Authorization: Bearer <token>`
- **Body:** (Any subset of profile fields)

### `GET /users/me/trips`
Fetches all trips associated with the user, grouped by status.
- **Response (200 OK):**
  ```json
  {
    "ongoing": [{...}],
    "upcoming": [{...}],
    "completed": [{...}]
  }
  ```

---

## 3. Trips & Itinerary (`/trips`)

### `POST /trips`
Creates a new trip.
- **Body:**
  ```json
  {
    "title": "Summer in Europe",
    "description": "Backpacking across France and Italy",
    "start_date": "2025-06-01",
    "end_date": "2025-06-15"
  }
  ```

### `GET /trips/{trip_id}/itinerary`
Fetches the complete day-by-day itinerary for a trip.
- **Response (200 OK):**
  ```json
  {
    "days": [
      {
        "date": "2025-06-01",
        "accommodations": [],
        "activities": [],
        "transportation": []
      }
    ]
  }
  ```

### `POST /trips/{trip_id}/stops`
Adds a city/destination stop to the trip.

### `POST /trips/{trip_id}/activities`
Adds an activity to the trip itinerary.

---

## 4. Explore & Search (`/explore`)

### `GET /explore/destinations`
Searches for cities or popular destinations.
- **Query Params:** `?query=Paris`

### `GET /explore/activities`
Searches for activities in a specific destination.
- **Query Params:** `?destination_id=uuid&category=adventure`

---

## 5. Budgeting & Expenses (`/trips/{trip_id}/billing`)

### `GET /expenses`
Returns all logged expenses for a trip.

### `POST /expenses`
Logs a new expense.
- **Body:**
  ```json
  {
    "title": "Eiffel Tower Tickets",
    "amount": 50.00,
    "currency": "EUR",
    "category": "activity"
  }
  ```

### `GET /budget-insights`
Returns total budget, total spent, and remaining balance.

---

## 6. Packing Checklist (`/trips/{trip_id}/checklist`)

### `GET /`
Returns the checklist grouped by category (Documents, Clothing, etc.).

### `POST /items`
Adds an item to the checklist.

### `PATCH /items/{item_id}`
Toggles the `is_packed` status of an item.

---

## 7. Notes & Journal (`/trips/{trip_id}/notes`)

### `GET /`
Returns trip notes.

### `POST /`
Creates a new note.

---

## 8. Community (`/community`)

### `GET /posts`
Returns a feed of public trip experiences.

### `POST /posts`
Shares a trip to the community.
