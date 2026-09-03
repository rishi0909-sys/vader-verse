# Postman Testing Guide

This guide explains how to manually test the Vaderverse backend APIs using Postman.

## Authentication Flow

The application uses standard JSON Web Tokens (JWT) for authentication. The token must be passed in the `Authorization` header as a Bearer token.

### 1. Register a Test User

The frontend uses `/api/register`. An unused duplicate exists at `/api/auth/register`. We will use `/api/register`.

**POST /api/register**
- **Method:** `POST`
- **URL:** `http://localhost:3000/api/register`
- **Headers:** `Content-Type: application/json`
- **Body (raw JSON):**
  ```json
  {
    "username": "testuser1",
    "email": "test1@example.com",
    "password": "password123"
  }
  ```

### 2. Login

The frontend uses `/api/login`. An unused duplicate exists at `/api/auth/login`. We will use `/api/login`.

**POST /api/login**
- **Method:** `POST`
- **URL:** `http://localhost:3000/api/login`
- **Headers:** `Content-Type: application/json`
- **Body (raw JSON):**
  ```json
  {
    "email": "test1@example.com",
    "password": "password123"
  }
  ```
- **Response:**
  You will receive a JSON response containing the token:
  ```json
  {
    "success": true,
    "message": "Login successful",
    "data": {
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "user": { ... }
    }
  }
  ```

### 3. Setting Up Authentication for Other Requests

Copy the `token` string from the login response.
For all subsequent requests that require authentication, add the following header:
- **Key:** `Authorization`
- **Value:** `Bearer <your_token_here>`

*(In Postman, you can also go to the "Authorization" tab, select "Bearer Token", and paste the token there.)*

## Core Endpoints Testing Sequence

Follow this exact sequence to test the end-to-end personalization flow for a seeded user.

### 1. Authenticate (Login)
**POST /api/login**
- **Method:** `POST`
- **URL:** `http://localhost:3000/api/login`
- **Headers:** `Content-Type: application/json`
- **Body:** Use one of the seeded user's emails and the password `123`. Check the seed script or your local MongoDB for the exact generated email (e.g., `user_a_rpg_<timestamp>@test.com`).
- **Action:** Copy the returned JWT token.

### 2. Set Postman Authorization
Go to the **Authorization** tab for the following requests, select **Bearer Token**, and paste your token.

### 3. Check Initial Preferences
**GET /api/preferences**
- **Method:** `GET`
- **URL:** `http://localhost:3000/api/preferences`
- **Action:** Note the user's current AI-generated preferences.

### 4. Check Game Recommendations
**GET /api/recommendations/games**
- **Method:** `GET`
- **URL:** `http://localhost:3000/api/recommendations/games`
- **Action:** Verify the recommended games match the user's stated interests.

### 5. Check News Recommendations
**GET /api/recommendations/news**
- **Method:** `GET`
- **URL:** `http://localhost:3000/api/recommendations/news`

### 6. Check Tournament Recommendations
**GET /api/recommendations/tournaments**
- **Method:** `GET`
- **URL:** `http://localhost:3000/api/recommendations/tournaments`

### 7. Track an Interaction
**POST /api/interactions**
- **Method:** `POST`
- **URL:** `http://localhost:3000/api/interactions`
- **Headers:** `Content-Type: application/json`
- **Body:**
  ```json
  {
    "itemId": "<A Game ObjectId>",
    "itemType": "game",
    "action": "like"
  }
  ```

### 8. Start a Game Session
**POST /api/game-sessions**
- **Method:** `POST`
- **URL:** `http://localhost:3000/api/game-sessions`
- **Headers:** `Content-Type: application/json`
- **Body:**
  ```json
  {
    "game": "<A Game ObjectId>"
  }
  ```
- **Action:** Copy the returned `_id` of the created session.

### 9. End a Game Session (Update Duration)
**PATCH /api/game-sessions/[id]**
- **Method:** `PATCH`
- **URL:** `http://localhost:3000/api/game-sessions/<session_id>`
- **Headers:** `Content-Type: application/json`
- **Body:**
  ```json
  {
    "sessionDuration": 3600,
    "endedAt": "2026-08-28T18:00:00.000Z"
  }
  ```

### 10. Trigger Personalization
**POST /api/ai/personalize**
- **Method:** `POST`
- **URL:** `http://localhost:3000/api/ai/personalize`
- **Headers:** `Content-Type: application/json`
- **Body:** `{}`
- **Action:** This manually triggers the AI to update your preferences based on the interaction and game session you just submitted. Wait for the `200 OK` response.

### 11. Verify Updated Preferences
**GET /api/preferences**
- **Method:** `GET`
- **URL:** `http://localhost:3000/api/preferences`
- **Action:** Compare this to step 3. The `genreScores` or `tagScores` should reflect the new interaction!

### 12. Verify Updated Recommendations
**GET /api/recommendations/games**
- **Method:** `GET`
- **URL:** `http://localhost:3000/api/recommendations/games`
- **Action:** Verify recommendations changed or reflect the updated preference profile.

### 13. Repeat for Other Users
Once you've tested User A (RPG Fan), you can repeat this exact sequence for User B (FPS Fan) and User C (Sports Fan). 
Simply log in with their email to get a new JWT, and watch how the personalization engine outputs completely different results for them!

---

## Health Checks

These are public endpoints to verify the backend services are running.

**GET /api/health**
- **URL:** `http://localhost:3000/api/health`

**GET /api/health/ai**
- **URL:** `http://localhost:3000/api/health/ai`

**GET /api/health/personalization**
- **URL:** `http://localhost:3000/api/health/personalization`

**GET /api/health/full**
- **URL:** `http://localhost:3000/api/health/full`
