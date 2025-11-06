# ResumeBuilder — MERN Project Submission

This repository contains the frontend (React + Vite) and backend (Node + Express + MongoDB) parts of the ResumeBuilder project and is prepared for submission.

Required contents in this package
- `backend/` — Express server and source code (include `package.json`)
- `frontend/` — React app (Vite) source code (include `package.json`)
- `db-backup/` — place for a `mongodump` export or seed data
- `backend/.env.example` and `frontend/.env.example` — templates for required environment variables
- `.gitignore` — excludes node_modules, env files, and build outputs

Prerequisites
- Node.js (v16+ recommended)
- npm (or yarn)
- MongoDB tools for dump/restore (`mongodump` / `mongorestore`) if you plan to include/restore DB dumps

1) How to install

- Backend

  1. Open a terminal and change to the backend folder:

     cd backend

  2. Install dependencies:

     npm install

  Note: the backend's `package.json` may provide `start` or `dev` scripts. Use the script appropriate for your environment (see "How to run" below).

- Frontend

  1. Open a terminal and change to the frontend folder:

     cd frontend

  2. Install dependencies:

     npm install


2) How to create `.env` files

- Use the `.env.example` files as reference. Do NOT commit real secrets to the repository.

  Example steps:

  - For the backend:

    1. Copy file:

       cp backend/.env.example backend/.env

    2. Edit `backend/.env` and fill placeholders (for Windows PowerShell, use `copy`):

       copy .\\backend\\.env.example .\\backend\\.env

    3. Populate values such as `MONGODB_URI`, `JWT_SECRET`, and `PORT`.

  - For the frontend (Vite):

    1. Copy `frontend/.env.example` to `frontend/.env` or `frontend/.env.local` and update `VITE_API_URL`.

Notes:
- `.env.example` files should list variable names and example placeholders only. Never commit `.env` with real credentials.

3) Database setup (two options)

- Option A — Provide/restore a `mongodump` (recommended for reviewers who want your dataset)

  To create the dump (on your machine):

  ```powershell
  mongodump --db your_db_name --out ./db-backup
  ```

  This creates `./db-backup/your_db_name` with BSON files. Include that directory in your ZIP.

  To restore the dump on another machine:

  ```powershell
  mongorestore --db your_db_name ./db-backup/your_db_name
  ```

- Option B — Seed script (if you include one)

  If you include a small `backend/seed.js` (or an npm script like `npm run seed`) to populate sample data, instruct reviewers to:

  1. Ensure `backend/.env` has `MONGODB_URI` pointing to a test DB.
  2. From `backend/` run:

     ```powershell
     node seed.js
     # or if package.json has a script:
     npm run seed
     ```

  Note: This repo may or may not include a seed script. If it isn't present, use the `mongodump`/`mongorestore` method above.

If you use MongoDB Atlas:
- Provide only `backend/.env.example` with a placeholder connection string. Do NOT commit credentials. In your personal/local `.env` set `MONGODB_URI` to the Atlas connection string.

4) How to run the project (examples)

The submission instructions require documenting the following commands; include both versions if your package scripts differ.

- As requested:

  ```powershell
  cd backend && npm run dev
  cd frontend && npm run dev
  ```

- In this project the backend `package.json` may define `start` (nodemon) instead of `dev`. If so, run:

  ```powershell
  # Backend alternative
  cd backend
  npm run start
  
  # Frontend
  cd ..\\frontend
  npm run dev
  ```

5) Final packaging / ZIP for submission (PowerShell)

From the parent folder that contains `ResumeBuilder` run:

```powershell
# Create a zip archive of the project folder
Compress-Archive -Path .\\ResumeBuilder\\* -DestinationPath .\\ResumeBuilder.zip
```

Or, if you have a `zip` tool available:

```powershell
zip -r ResumeBuilder.zip ResumeBuilder/
```

