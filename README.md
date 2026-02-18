# Pet Adoption Management System

Full-stack application for browsing pets, applying to adopt, and admin management of pets and adoption requests.

## Features

- **Visitor:** Browse pets, search by name/breed, filter by species/breed/age, view pet details, pagination
- **User:** Register/Login, apply to adopt, view own adoption applications and status
- **Admin:** Add/Edit/Delete pets, view all applications, approve/reject applications, pet status (auto on approve/reject or manual)

## Tech Stack

- **Backend:** Node.js, Express, MongoDB (Mongoose), JWT auth, role-based access
- **Frontend:** React, React Router, Axios, responsive UI

## Setup

### Backend

1. Copy `.env.example` to `.env` and set:
   - `PORT` – server port (default 8000)
   - `DB_URL` – MongoDB connection string
   - `USER_KEY` – JWT secret

2. Install and run:
   ```bash
   npm install
   npm run dev
   ```
   API: `http://localhost:8000`

### Frontend

1. In `web/` folder:
   ```bash
   cd web
   npm install
   ```
2. Optional: create `web/.env` with `REACT_APP_API_URL=http://localhost:8000` if the API is on another host/port.
3. Start:
   ```bash
   npm start
   ```
   App: `http://localhost:3000`

### Creating an admin user

Admin
Username: admin@mailinator.com
Password: Testing12345$

User
Username: yogita@mailinator.com
Password: Testing12345$

Then log in with that user to access Admin → Manage Pets and Applications.

## API Overview

- `POST /api/auth/register` – register
- `POST /api/auth/login` – login
- `GET /api/auth/me` – current user (requires auth)
- `GET /api/pets` – list pets (query: page, limit, search, species, breed, ageMin, ageMax, status; admin can use status=all)
- `GET /api/pets/filters` – distinct species and breeds
- `GET /api/pets/:id` – pet by id
- `POST /api/pets` – create pet (admin)
- `PUT /api/pets/:id` – update pet (admin)
- `DELETE /api/pets/:id` – delete pet (admin)
- `POST /api/adoptions/apply` – apply to adopt (body: petId, message) (user)
- `GET /api/adoptions/my` – my applications (user)
- `GET /api/adoptions/all` – all applications (admin)
- `PUT /api/adoptions/:id/review` – approve/reject (body: status) (admin)

## Deliverables

- GitHub repo with this README
- `.env.example` in project root
- Responsive React UI
