# GreenLands - Land Management Platform

A comprehensive MERN stack application for land management, connecting farmers, government, and stakeholders with robust data visualization, analytics, and real-time features.

---

## Table of Contents

1. [Project Description](#project-description)
2. [Setup Instructions](#setup-instructions)
3. [API Documentation](#api-documentation)
4. [User Guide](#user-guide)
5. [Technical Architecture Overview](#technical-architecture-overview)
6. [Deployment & Demo](#deployment--demo)
7. [Screenshots](#screenshots)

---

## Project Description

GreenLands is a full-stack platform that enables:
- **Farmers** to manage land, crops, equipment, and access subsidies.
- **Government** to monitor land use, manage subsidies, and communicate with stakeholders.
- **Analysts** to visualize and analyze agricultural data.
- **Admins** to oversee the platform and support users.

---

## Setup Instructions

### Prerequisites
- Node.js (v16+)
- MongoDB (local or cloud)
- pnpm (or npm/yarn)

### 1. Clone the Repository
```sh
git clonehttps://github.com/PLP-MERN-Stack-Development/week-8-capstone_-DOMOSH85.git
cd week-8-capstone_-DOMOSH85/GreenLands
```

### 2. Install Dependencies
```sh
pnpm install
cd client
pnpm install
cd ..
```

### 3. Environment Variables
- Copy `.env.example` to `.env` in the `GreenLands/` directory.
- Set your MongoDB URI, JWT secret, and any API keys.
- In `client/.env`, set:
  ```
  VITE_API_URL=https://week-8-capstone-domosh85.onrender.com/
  ```

### 4. Run Locally
**Backend:**
```sh
pnpm run server
```
**Frontend:**
```sh
cd client
pnpm run dev
```
- Visit: [http://localhost:3000](http://localhost:3000)

---

## API Documentation

### Authentication
- `POST /api/auth/register` — Register a new user
- `POST /api/auth/login` — Login and receive JWT
- `GET /api/auth/me` — Get current user info (auth required)

### Land Management
- `GET /api/land` — List all land records
- `POST /api/land` — Add new land (auth required)
- `PUT /api/land/:id` — Update land record (auth required)

### Farmers
- `GET /api/farmers/:id` — Get farmer profile
- `POST /api/farmers/:id/crops` — Add crop
- `DELETE /api/farmers/:id/crops/:crop` — Remove crop

### Government
- `GET /api/government` — Government dashboard data

### Subsidies
- `GET /api/subsidies` — List available subsidies
- `POST /api/subsidies/apply` — Apply for a subsidy

### Communication
- `GET /api/communication/notifications` — Get notifications
- `POST /api/communication/support` — Submit support request

> **Note:** All protected routes require `Authorization: Bearer <token>` header.

---

## User Guide

### Registration & Login
- Register as a farmer, government official, analyst, or admin.
- Login to access your personalized dashboard.

### Farmer Portal
- View and manage your land, crops, and equipment.
- Apply for government subsidies.
- Access weather data and resources.

### Government Portal
- Monitor land usage and compliance.
- Review and approve subsidy applications.
- Communicate with farmers and analysts.

### Analytics
- Visualize trends in land use, crop yield, and financials.
- Export reports as CSV.

### Support & Communication
- Send and receive messages.
- Submit support requests and view notifications.

---

## Technical Architecture Overview

### Stack
- **Frontend:** React 18, Vite, Tailwind CSS, Radix UI, Recharts, Socket.io-client
- **Backend:** Node.js, Express.js, MongoDB, Mongoose, Socket.io
- **Authentication:** JWT, role-based access
- **State Management:** React Context API

### Structure
```
GreenLands/
  client/         # React frontend (Vite)
    src/
      components/
      contexts/
      pages/
      api.js      # Centralized API helper
    index.html
    .env
  server/         # Express backend
    models/
    routes/
    middleware/
    app.js
    server.js
  .env
```

### Data Flow
- Frontend communicates with backend via REST API and WebSockets.
- All API calls use the base URL from `VITE_API_URL`.
- Real-time updates via Socket.io for notifications and support.

### Security
- Passwords hashed with bcrypt.
- JWT tokens for authentication.
- CORS configured for frontend-backend communication.

---

## Deployment & Demo

- **Frontend:** [https://greenlands-lyart.vercel.app/](https://your-frontend-url)
- **Backend:** [https://week-8-capstone-domosh85.onrender.com/](https://your-backend-url)
- **Screenshots:** See below

---


## Screenshots

### Dashboard Page
![Dashboard Page](/GreenLands/client/public/Screenshots/Dashboard.png)

### Register Page
![Register Page](/GreenLands/client/public/Screenshots/Register.png)

### Login Page
![Login Page](/GreenLands/client/public/Screenshots/Login.png)

### Backend Log
![Backend Logs](/GreenLands/client/public/Screenshots/Backend.png)

### Frontend Log
![Frontend Logs](/GreenLands/client/public/Screenshots/Frontend.png)