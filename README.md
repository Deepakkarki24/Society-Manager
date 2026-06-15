# SIMP — Society Issues Management Platform

AI-Powered Society Operations Platform that enables residents to create complaints, retrieve society information, track maintenance requests, and interact with community services using natural language and voice commands.

## Tech Stack

| Layer | Technologies |
|-------|----------------|
| Frontend | React, TypeScript, Tailwind CSS, Redux Toolkit, React Router, Axios, Socket.IO Client, Recharts |
| Backend | Node.js, Express, MongoDB, Mongoose, JWT, Socket.IO |
| Auth | JWT + Role-Based Access Control |
| AI inetgration (Gemini - 2.5 flash)

## User Roles

- **Super Admin** — Societies, admins, platform analytics
- **Society Admin** — Residents, staff, complaints, announcements, billing
- **Resident** — Complaints, payments, visitors, family, feedback
- **Maintenance Staff** — Assigned complaints, status updates, completion proof

## Project Structure

```
simp/
├── client/          # React frontend
└── server/          # Express API
```

## Quick Start

### Prerequisites

- Node.js 18+
- MongoDB running locally or Atlas URI

### Backend

```bash
cd server
cp .env
# Edit credentials like MONGODB_URI, JWT_SECRET, and GOOGLE_API_KEY. etc

npm install
npm run seed    # Optional: demo data
npm run dev
```

API: `http://localhost:3001`

### Frontend

```bash
cd client
cp .env

npm install
npm run dev
```

App: `http://localhost:5173`

### Demo Accounts (after seed)

| Role | Email | Password |
|------|-------|----------|
| Super Admin | deepak@superadmin.com | admin123 |
| Society Admin | admin@starktower.com | admin123 |
| Resident | deepak@simp.com | admin123 |
| Maintenance Staff | staff@simp.com | admin123 |

## API Overview

- `POST /api/auth/register` — Resident registration
- `POST /api/auth/login` — Login
- `/api/societies` — Society CRUD (Super Admin)
- `/api/complaints` — Complaint lifecycle
- `/api/announcements` — Society announcements
- `/api/notifications` — In-app notifications
- `/api/analytics` — Dashboard & platform stats
- `/api/audit-logs` — Activity audit trail

## Features

- Complaint categories, comments, images, and reopening
- Real-time notifications via Socket.IO
- Pagination, search, filtering on list endpoints
- Image uploads for now (falls back to base64 without credentials)

## Production Notes

- Set strong `JWT_SECRET` and Google api key
- Integrate payment gateway via `transactionId` on `PATCH /api/payments/:id/pay`
- Use `npm run build` in both folders for deployment
