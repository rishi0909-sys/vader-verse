# VaderVerse

VaderVerse is a cutting-edge, personalized gaming and community platform built with Next.js. It features robust AI-driven personalization engines, dynamic 3D user interfaces, and an advanced telemetry tracking system to provide custom experiences, recommendations, and analytics for each user.

## 🚀 Tech Stack & Core Technologies

- **Frontend Framework:** Next.js 16.3.2 (App Router) & React 19.2
- **Styling:** Tailwind CSS, Shadcn UI, Base UI
- **Animations & 3D:** GSAP, Motion, Three.js, React Three Fiber (`@react-three/fiber`), OGL
- **Database:** MongoDB (via Mongoose)
- **AI & Personalization:** Google Gemini (via `@ai-sdk/google` & `ai` package)
- **Authentication:** JWT (JSON Web Tokens), NextAuth, bcryptjs

---

## 🛠️ How It Functions

VaderVerse acts as a central hub for gamers. It aggregates data based on user activity, interactions, and preferences, sending that data into a personalization pipeline. The core functions include:

1. **User Interactions Tracking:** Telemetry events and user actions (e.g., liking a game, viewing news) are captured and stored in the database.
2. **Game Sessions Tracking:** Playtimes, session durations, and in-game performance metrics are logged.
3. **AI Personalization Engine:** A background service fetches these interactions and game sessions and runs them through Google Gemini AI to analyze user intent and preference shifts.
4. **Dynamic Recommendations:** The calculated AI preferences inform recommendation endpoints for Games, News, and Tournaments, serving completely unique content to different users based on their archetypes (e.g., RPG fans vs. FPS enthusiasts).

---

## 🔒 Authentication Flow

Authentication is primarily managed using JSON Web Tokens (JWT).

1. **Registration (`/api/register`)**: Users sign up with an email, username, and password. The password is encrypted using `bcryptjs` before being saved to MongoDB.
2. **Login (`/api/login`)**: Upon successful credential verification, the server generates a JWT containing the user's ID and role.
3. **Bearer Tokens:** For all protected requests, the frontend must attach the token to the `Authorization` header as `Bearer <token>`.
4. **Middleware & Client Protection:** 
   - A client-side `<AuthGuard>` wrapper checks `localStorage` for the token.
   - Next.js `middleware.ts` enforces global security headers (X-Frame-Options, XSS Protection, Strict-Transport-Security, CORS policies).

---

## 📊 Aggregations & Pipelines

VaderVerse extensively uses MongoDB Aggregation Pipelines to process raw telemetry and interaction data efficiently before passing it to the AI Personalization Engine.

### 1. Personalization Aggregation (`aiPersonalizationService.ts`)
When calculating a user's preferences, the system executes pipelines to:
- **Filter** interactions (likes, shares, views) over a specific time window.
- **Group & Summarize** total time spent per game genre using `GameSession` documents.
- **Calculate Weights:** Apply mathematical weights to different actions (e.g., a "like" is weighted higher than a "view").

### 2. Admin Analytics (`/api/admin/analysis/route.ts`)
Admin dashboards use aggregations to visualize platform health and user engagement:
- **$match:** Filters telemetry events by date or type.
- **$group:** Groups events to calculate DAU (Daily Active Users), total session durations, and top-played genres.
- **$sort & $limit:** Returns the most interacted-with content to highlight trending games or news on the platform.

### 3. Health Monitoring (`/api/health/full/route.ts`)
Runs basic diagnostic aggregations across core collections to ensure database indexes are healthy and data integrity is maintained.

---

## 📂 Project Structure

```text
vader-verse/
├── app/                  # Next.js App Router pages and API routes
│   └── api/              # Backend API endpoints (auth, ai, interactions, etc.)
├── components/           # Reusable React components (UI, 3D Canvas)
├── config/               # Configuration files (Personalization weights, DB)
├── hooks/                # Custom React hooks
├── lib/                  # Utility libraries and DB connections
├── models/               # Mongoose schemas (User, Game, Report, Tournament, etc.)
├── public/               # Static assets
├── scripts/              # Helper scripts (Seed data, Admin promotion)
├── services/             # Core business logic (aiPersonalizationService)
└── types/                # TypeScript interface definitions
```

---

## 🏃 Getting Started

### Prerequisites
- Node.js v20+
- MongoDB instance (local or Atlas)
- Google Gemini API Key

### Installation

1. **Clone & Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Setup**
   Copy `.env.example` to `.env` and fill in your variables:
   ```env
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   GOOGLE_GENERATIVE_AI_API_KEY=your_gemini_api_key
   ```

3. **Run the Development Server**
   ```bash
   npm run dev
   ```

4. **Seed Test Data** (Optional)
   You can populate the database with mock AI test users and game data:
   ```bash
   npm run seed:ai-test
   ```

## 🧪 Testing APIs

See `README_POSTMAN.md` for a comprehensive step-by-step guide on how to test the authentication flow, personalization triggers, and recommendation algorithms using Postman.
