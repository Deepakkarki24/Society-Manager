# SIMP — Society Management Platform

Full-stack SaaS for managing residential societies: complaints, maintenance, announcements, visitors, billing, and real-time notifications.

## Tech Stack

| Layer | Technologies |
|-------|----------------|
| Frontend | React, TypeScript, Tailwind CSS, Redux Toolkit, React Router, Axios, Socket.IO Client, Recharts |
| Backend | Node.js, Express, MongoDB, Mongoose, JWT, Socket.IO, Cloudinary |
| Auth | JWT + Role-Based Access Control |

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
cp .env.example .env
# Edit MONGODB_URI and JWT_SECRET

npm install
npm run seed    # Optional: demo users
npm run dev
```

API: `http://localhost:5000`

### Frontend

```bash
cd client
cp .env.example .env

npm install
npm run dev
```

App: `http://localhost:5173`

### Demo Accounts (after seed)

| Role | Email | Password |
|------|-------|----------|
| Super Admin | superadmin@simp.com | admin123 |
| Society Admin | admin@greenvalley.com | admin123 |
| Resident | resident@simp.com | admin123 |
| Maintenance Staff | staff@simp.com | admin123 |

## API Overview

- `POST /api/auth/register` — Resident registration
- `POST /api/auth/login` — Login
- `/api/societies` — Society CRUD (Super Admin)
- `/api/complaints` — Complaint lifecycle
- `/api/announcements` — Society announcements
- `/api/visitors` — Pre-approval & security logs
- `/api/payments` — Maintenance billing
- `/api/notifications` — In-app notifications
- `/api/analytics` — Dashboard & platform stats
- `/api/audit-logs` — Activity audit trail

## Features

- Complaint categories, timeline, comments, images, reopening
- Real-time notifications via Socket.IO
- Maintenance invoice generation & payment tracking (gateway-ready)
- Dark/light theme in Settings
- Pagination, search, filtering on list endpoints
- Cloudinary image uploads (falls back to base64 without credentials)

## Production Notes

- Set strong `JWT_SECRET` and configure Cloudinary for file storage
- Integrate payment gateway via `transactionId` on `PATCH /api/payments/:id/pay`
- Use `npm run build` in both folders for deployment
