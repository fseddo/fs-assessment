# fs-assessment

A TypeScript Express API with Swagger UI, paired with a React + Vite + Bootstrap frontend.

## About

A simple `POST /ping` echo service. The backend accepts a `message` parameter and returns it along with a Unix timestamp and the current runtime environment + version from a small config module. The frontend provides a UI to send messages, with client-side validation (≤ 20 chars, all lowercase), distinct loading / success / API-error / network-error states, and contextual retry + reset controls.

## Layout

- [backend/](backend/) — Express + TypeScript REST API with Swagger UI.
- [frontend/](frontend/) — Vite + React + TypeScript + Bootstrap UI.

## Prerequisites

- Node.js 20+ and npm.

---

## Backend

### Running

```bash
cd backend
npm install
npm run dev
```

This starts:

- the REST API at <http://localhost:8000> (POST `/ping`)
- Swagger UI at <http://localhost:8001> (raw spec at `/openapi.json`)

### Configuration

The config module lives in [backend/src/config.ts](backend/src/config.ts) and exposes:

| Variable  | Default       |
| --------- | ------------- |
| `env`     | `development` |
| `version` | `0.0.0`       |

### Scripts

[backend/package.json](backend/package.json):

| Script              | Purpose                                                            |
| ------------------- | ------------------------------------------------------------------ |
| `npm run dev`       | Start the dev server with hot reload (`NODE_ENV=development`).     |
| `npm run build`     | Compile TypeScript to `dist/`.                                     |
| `npm run start`     | Run the compiled build in production mode (`NODE_ENV=production`). |
| `npm run typecheck` | Run TypeScript in `--noEmit` mode.                                 |

---

## Frontend

### Running

```bash
cd frontend
npm install
npm run dev
```

Open <http://localhost:3000>. Make sure the backend is also running so the UI can reach the API.

### Validation rules

The frontend validates the message before issuing the request and disables the submit button until both rules pass:

- 20 characters or fewer
- all lowercase (no uppercase letters)

The UI surfaces every state: idle, validation error, loading, success, and API/network error. A contextual **Retry** button appears in the error alert to re-run the failed submission, and a **Reset** button next to Send returns the page to its initial state.

### Scripts

[frontend/package.json](frontend/package.json):

| Script              | Purpose                             |
| ------------------- | ----------------------------------- |
| `npm run dev`       | Vite dev server with hot reload.    |
| `npm run build`     | Type-check + Vite production build. |
| `npm run preview`   | Serve the production build locally. |
| `npm run typecheck` | Run TypeScript in `--noEmit` mode.  |
