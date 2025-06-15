# CUB API English Clone - Full Backend Implementation Plan

## I. Introduction & Goals

This document outlines the comprehensive plan to transition the CUB API English Clone from using a simple proxy (`api-proxy`) to a full-fledged custom backend API with a PostgreSQL database. The primary goals are to:

*   **Replicate API Endpoints:** Implement all API endpoints found on `https://cub.red/api/` with equivalent functionality.
*   **Custom Backend:** Develop a robust backend service capable of handling API requests and managing data.
*   **PostgreSQL Database:** Utilize PostgreSQL as the primary data storage solution for all API-related information.
*   **Remove Proxy Dependency:** Eliminate the reliance on the `api-proxy` for forwarding requests, making the application self-contained.

## II. Architecture Overview

The revised architecture will consist of three main components:

*   **Frontend (Current):** The existing React application, built with Vite, responsible for the user interface and initiating API requests.
*   **Backend (New):** A new server-side application (e.g., Node.js with Express, Python with Flask/Django, etc.) that will handle all API logic, data processing, and interactions with the database.
*   **Database (New):** A PostgreSQL relational database, serving as the persistent storage for all application data.

**API Interactions:** The Frontend will communicate directly with the new Backend API endpoints.

## III. Backend Development Plan

### A. Setup & Initial Configuration

1.  **Choose Backend Framework:** Select a suitable backend technology (e.g., Node.js with Express, Python with Flask/Django, Go with Gin, etc.). For this plan, we'll assume **Node.js with Express**.
2.  **Initialize Backend Project:** Create a new project directory for the backend (e.g., `cub-api-backend`).
3.  **Install Dependencies:**
    *   `express` for building the web server and API routes.
    *   `pg` (or an ORM like `sequelize`, `prisma`, `typeorm`) for PostgreSQL database interaction.
    *   `dotenv` for managing environment variables.
    *   `cors` for handling Cross-Origin Resource Sharing.
    *   `bcrypt` for password hashing (if user authentication is implemented).
    *   `jsonwebtoken` for token-based authentication (JWT).
4.  **Configure Environment Variables:** Set up a `.env` file for sensitive information like database connection strings, JWT secrets, and server port.
5.  **Create Basic Server:** Set up an `index.js` or `app.ts` file to initialize the Express app and listen for incoming requests.

### B. Database Design & Setup

1.  **Schema Design:** Based on the existing API endpoints and the data they handle, design the PostgreSQL database schema. This includes defining tables, columns, data types, primary keys, foreign keys, and indexes.

    *   **Key Tables to Consider (Examples):**
        *   `users`: `id` (PK), `email`, `password_hash`, `created_at`, `updated_at`, `premium_days`
        *   `devices`: `id` (PK), `user_id` (FK to `users`), `device_code`, `access_token`, `created_at`
        *   `profiles`: `id` (PK), `user_id` (FK to `users`), `name`, `created_at`
        *   `bookmarks`: `id` (PK), `user_id` (FK to `users`), `card_id`, `type` (`book`, `history`, `like`, `wath`), `data` (JSONB for card details), `created_at`
        *   `notifications`: `id` (PK), `user_id` (FK to `users`), `card_id`, `voice`, `season`, `episode`, `status`, `created_at`
        *   `cards`: `id` (PK), `original_name`, `season_info` (JSONB), `translations` (JSONB), `subscribed_users` (array or separate table for many-to-many)
        *   `reactions`: `id` (PK), `user_id` (FK to `users`), `content_id`, `type` (`fire`, `nice`, etc.), `created_at`
        *   `notices`: `id` (PK), `user_id` (FK to `users`), `message`, `is_cleared`, `created_at`

2.  **Database Initialization:**
    *   Create a new PostgreSQL database instance.
    *   Write SQL migration scripts (or use an ORM's migration tools) to create the defined tables.
    *   Implement initial seeding scripts for dummy data to aid in development and testing.

### C. API Endpoint Implementation (Iterative Approach)

For each API endpoint listed in `src/api.ts` (e.g., `/bookmarks/all`, `/device/add`, `/notifications/status`, etc.), implement the corresponding backend logic:

1.  **Route Definition:** Define the HTTP method and path for each endpoint in Express (e.g., `app.get('/api/bookmarks/all', ...)`, `app.post('/api/device/add', ...)`).
2.  **Request Handling:**
    *   Parse incoming `req.body` for `POST` requests.
    *   Extract `req.query` for `GET` requests (e.g., `full`, `type` for bookmarks).
    *   Read `Token` and `Profile` headers from `req.headers`.
    *   Handle path parameters (e.g., `content_id`, `type` for `/reactions/add/{content_id}/{type}`).
3.  **Authentication & Authorization Middleware:** Implement middleware to verify `Token` and `Profile` headers for protected routes. This middleware should extract user and profile IDs from the token and attach them to the `req` object for subsequent use.
4.  **Database Interaction:**
    *   Perform necessary CRUD operations (SELECT, INSERT, UPDATE, DELETE) on the PostgreSQL database using the `pg` client or an ORM.
    *   For example, for `bookmarks-all`, query the `bookmarks` table filtered by `user_id` and `type`. For `device-add`, insert a new record into the `devices` table and generate an `access_token`.
5.  **Response Formatting:** Construct JSON responses that mimic the structure and data types of the original `cub.red/api/` responses.
6.  **Error Handling:** Implement `try-catch` blocks and appropriate error responses for:
    *   Database connection failures.
    *   Invalid request parameters (e.g., missing required fields, incorrect data types).
    *   Authentication or authorization failures (e.g., invalid token, unauthorized access).
    *   Internal server errors (e.g., unhandled exceptions).
    *   Return relevant HTTP status codes (e.g., 200 OK, 201 Created, 400 Bad Request, 401 Unauthorized, 403 Forbidden, 404 Not Found, 500 Internal Server Error).

### D. Token-Based Authentication and Authorization

1.  **Token Generation:** Upon successful device authorization (`/device/add`), generate a JWT token containing `user_id` and `profile_id`.
2.  **Token Validation:** Create middleware to validate the JWT on every protected API request. Decode the token to retrieve `user_id` and `profile_id`.
3.  **Profile Management:** Implement logic to manage multiple user profiles, associating them with the user's account.

## IV. Frontend Integration Plan

### A. Remove `api-proxy`

1.  Identify and remove `api-proxy.js` or any explicit proxy configuration within the Vite setup (e.g., `vite.config.js`).

### B. Update `src/api.ts`

1.  **Modify `callCubApi`:** Change the `fetch` call within `callCubApi` to point directly to the new backend API URL (e.g., `http://localhost:3000/api/` or a relative path `/api/` if served from the same domain).
2.  **Adjust Request Structure:** Depending on how the new backend handles headers and body/payload, adjust the `body: JSON.stringify(...)` in `callCubApi` to match the backend's expected input format. The current structure is already flexible, sending `endpoint`, `method`, `headers`, and `payload`. This might need minimal changes if the backend directly processes these.
3.  **Remove `predefinedCalls` Headers/Body:** Since `ApiEndpointDoc.tsx` now handles custom `Token` and `Profile` inputs and dynamically constructs payloads, the hardcoded headers and bodies within `predefinedCalls` can be removed or simplified to only include the endpoint and method for clarity, as the dynamic inputs will override them.

### C. Testing

1.  Thoroughly test each API endpoint from the frontend to ensure that:
    *   Requests are correctly sent to the new backend.
    *   Responses are correctly received and parsed.
    *   Data is displayed accurately.
    *   Error messages and status codes are handled gracefully.
    *   The Token and Profile inputs correctly influence API calls.

## V. Deployment (Future Consideration)

Once the backend and frontend are developed and tested locally, consider deployment options:

*   **Backend Deployment:** Cloud platforms like Heroku, AWS EC2, Google Cloud Run, DigitalOcean Droplets, etc.
*   **Frontend Deployment:** Static hosting platforms like Netlify, Vercel, GitHub Pages, or serve it alongside the backend.

## VI. Monitoring & Maintenance (Future Consideration)

*   Implement logging for backend requests and errors.
*   Set up error tracking (e.g., Sentry, Bugsnag).
*   Establish database backup and recovery procedures.

## VII. Success Criteria

The project will be considered successful when:

*   All API endpoints (`bookmarks`, `cards`, `devices`, `notices`, `notifications`, `profiles`, `reactions`, `users`) function identically to the original `cub.red/api/`.
*   All persistent data is stored in and retrieved from the PostgreSQL database.
*   The `api-proxy` is completely removed from the project.
*   The frontend application seamlessly interacts with the newly implemented backend API.
*   Authentication and authorization mechanisms are robust and functional. 