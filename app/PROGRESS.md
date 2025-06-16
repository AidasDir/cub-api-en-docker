# CUB API English Clone - Development Progress Tracker

This document tracks the progress of implementing the full backend and database for the CUB API English Clone, as outlined in `DOCUMENTATION.md`.

## Overall Progress

- [x] Backend Setup & Initial Configuration
- [x] Database Design & Setup
- [x] API Endpoint Implementation (Iterative)
- [x] Token-Based Authentication and Authorization
- [x] Frontend Integration
- [ ] Testing
- [ ] Deployment (Future)
- [ ] Monitoring & Maintenance (Future)

## I. Backend Development Plan

### A. Setup & Initial Configuration

- [x] Choose Backend Framework: Node.js with Express
- [x] Initialize Backend Project: Create `cub-api-backend` directory
- [x] Install Dependencies:
    - [x] `express`
    - [x] `pg`
    - [x] `dotenv`
    - [x] `cors`
    - [x] `bcrypt`
    - [x] `jsonwebtoken`
- [x] Configure Environment Variables: Create `.env` file
- [x] Create Basic Server: Set up `index.js` or `app.ts`

### B. Database Design & Setup

- [x] Schema Design (define tables, columns, relationships):
    - [x] `users` table (initial)
    - [x] `users` table (extended columns)
    - [x] `devices` table (initial)
    - [x] `devices` table (updated columns)
    - [x] `profiles` table
    - [x] `bookmarks` table (initial creation)
    - [x] `bookmarks` table (extended columns)
    - [x] `notifications` table
    - [x] `cards` table
    - [x] `reactions` table
    - [x] `notices` table
- [x] Database Initialization:
    - [x] Create PostgreSQL database instance
    - [x] Write SQL migration scripts (or use ORM tools)
    - [x] Implement initial seeding scripts

### C. API Endpoint Implementation (Iterative Approach)

- [x] Implement `bookmarks` endpoints:
    - [x] `/bookmarks/all` (GET)
    - [x] `/bookmarks/add` (POST)
    - [x] `/bookmarks/remove` (POST)
- [x] Implement `cards` endpoints:
    - [x] `/card/season` (POST)
    - [x] `/card/subscribed` (POST)
    - [x] `/card/translations` (POST)
    - [x] `/card/unsubscribe` (POST)
- [x] Implement `device` endpoints:
    - [x] `/device/add` (POST)
- [x] Implement `notice` endpoints:
    - [x] `/notice/all` (GET)
    - [x] `/notice/clear` (GET)
- [x] Implement `notifications` endpoints:
    - [x] `/notifications/all` (GET) - *Now uses authenticated user ID and profile ID and requires `authenticateToken`.*
    - [x] `/notifications/add` (POST) - *Now uses authenticated user ID and profile ID and requires `authenticateToken`.*
    - [x] `/notifications/remove` (POST) - *Now uses authenticated user ID and profile ID and requires `authenticateToken`.*
    - [x] `/notifications/status` (POST) - *Now uses authenticated user ID and profile ID and requires `authenticateToken`.*
- [x] Implement `profiles` endpoints:
    - [x] `/profiles/all` (GET) - *Now uses authenticated user ID and requires `authenticateToken`.*
    - [x] `/profiles/change` (POST) - *Now uses authenticated user ID and requires `authenticateToken`.*
    - [x] `/profiles/create` (POST) - *Now uses authenticated user ID and requires `authenticateToken`.*
    - [x] `/profiles/remove` (POST) - *Now uses authenticated user ID and requires `authenticateToken`.*
- [x] Implement `reactions` endpoints:
    - [x] `/reactions/add/{content_id}/{type}` (GET)
    - [x] `/reactions/get/{id}` (GET)
- [x] Implement `users` endpoints:
    - [x] `/users/find` (GET)
    - [x] `/users/get` (GET)
    - [x] `/users/give` (POST)
- [x] For each endpoint:
    - [x] Define Route
    - [x] Handle Request (parse body/query/path params, read headers)
    - [x] Perform Database Interaction (CRUD)
    - [x] Format Response
    - [x] Implement Error Handling

### D. Token-Based Authentication and Authorization

- [x] Implement Token Generation (for `/device/add`)
- [x] Implement Token Validation Middleware
- [x] Implement Profile Management Logic

### E. Access Code Management

- [x] Implement access code persistence in `localStorage` in `src/pages/AccessCodePage.tsx`.
- [x] Modify `src/pages/AccessCodePage.tsx` to generate new access code only if not found in `localStorage`.
- [x] Add "Refresh Code" button in `src/pages/AccessCodePage.tsx` to explicitly generate a new code.
- [x] Implement access code persistence in `localStorage` in `src/pages/AddDevicePage.tsx`.
- [x] Modify `src/pages/AddDevicePage.tsx` to generate new access code only if not found in `localStorage`.
- [x] Add "Refresh Code" button in `src/pages/AddDevicePage.tsx` to explicitly generate a new code.

## IV. Frontend Integration Plan

### A. Remove `api-proxy`

- [x] Identify and remove `api-proxy.js`
- [x] Remove explicit proxy configuration from Vite (e.g., `vite.config.js`)

### B. Update `src/api.ts`

- [x] Modify `callCubApi` to point to new backend API URL
- [x] Adjust `callCubApi` request structure for new backend
- [x] Remove or simplify `predefinedCalls` headers/body

### C. Update `src/components/ApiEndpointDoc.tsx`
- [x] Modify `ApiEndpointDoc.tsx` to use the new `callCubApi` function directly.

### D. Testing

- [ ] Thoroughly test each API endpoint from frontend
    - [ ] Requests sent correctly
    - [ ] Responses received and parsed correctly
    - [ ] Data displayed accurately
    - [ ] Error messages/status codes handled gracefully
    - [ ] Token/Profile inputs influence API calls correctly

## V. Deployment (Future Consideration)

- [ ] Backend Deployment Strategy
- [ ] Frontend Deployment Strategy

## VI. Monitoring & Maintenance (Future Consideration)

- [ ] Implement backend logging
- [ ] Set up error tracking
- [ ] Establish database backup/recovery

## Next Immediate Steps

Now that the frontend integration is complete, the immediate next step is to thoroughly test all API endpoints from the frontend to ensure proper communication with the new backend.

## Progress Updates

### Latest Fixes:
*   **Notifications Add Endpoint - Invalid Data Format:** Corrected the frontend to send the `data` parameter as a JSON object instead of a string to the `/api/notifications/add` endpoint.
*   **Notifications All Endpoint - Card Data Format:** Modified the backend to return the `card` field as a JSON string in the `/api/notifications/all` response.
*   **Reactions Add Endpoint - Missing Backend Implementation:** Implemented the missing GET endpoint for `/api/reactions/add/:content_id/:type` in the backend, including logic for adding reactions and handling existing ones.