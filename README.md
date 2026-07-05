# Stavya Intelligence — Hospital IT Operations Platform

> **The Intelligent Digital Brain of Hospital IT Operations**  
> Built for **Stavya Spine Hospital** — Enterprise Edition

[![TypeScript](https://img.shields.io/badge/TypeScript-5.4-blue.svg)](https://www.typescriptlang.org/)
[![React 19](https://img.shields.io/badge/React-19.0-cyan.svg)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-5.2-purple.svg)](https://vitejs.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-20.x-green.svg)](https://nodejs.org/)
[![Prisma](https://img.shields.io/badge/Prisma-6.4-indigo.svg)](https://www.prisma.io/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38bdf8.svg)](https://tailwindcss.com/)

---

## 🏥 Overview

**Stavya Intelligence** is an enterprise-grade Hospital IT Operations Platform designed to streamline, automate, and monitor every IT asset, server, network switch, medical PC, and printer across Stavya Spine Hospital.

Instead of manual spreadsheets or fragmented tickets, Stavya Intelligence provides a unified, intelligent operational workspace combining capabilities of ServiceNow, Jira Service Management, Freshservice, and Datadog.

---

## ⚡ Key Features

### 1. Morning IT Infrastructure Inspection Engine
- **Line-by-Line Verification**: IT Executives perform daily morning inspections across 16 core hospital IT infrastructure categories (Server Room, OPD Printers, OT UPS, PACS DICOM Radiology, ICU Monitors, Biometric Security, etc.).
- **TET (Target Execution Time) Tracking**: Each checklist item features a Target Execution Time (TET) and Due Time (e.g. Due: 09:15 AM | TET: 15 mins).
- **Instant Fault Escalation**: Clicking **"⚠ Raise Fault"** automatically opens a ticket and dispatches a real-time high-priority alert to the Admin (**`vatsal_IT_Head`**).

### 2. Daily Executive Inspection Report Generator
- Upon completing morning checks, the system compiles the **Daily Executive Inspection Report** and delivers it directly to the IT Head's dashboard.

### 3. IT Head User Management & Account Generator
- **Create New Employee IDs**: IT Head (`vatsal_IT_Head`) can generate login credentials for new staff (Username, Password, Full Name, Email, Department, Role).
- **Checklist Item Management**: Add new custom IT assets, edit Due & TET times, or remove items from active daily routines.

### 4. Employee KPI & Performance Analytics
- Staff performance dashboard tracking checklist completion rates, average execution speed (TET vs actual time), faults identified, and SLA compliance scores.

### 5. Live Interactive Hospital Floor Layout Map
- Visual floor plan allowing single-click telemetry inspection per department (Devices, WiFi APs, Managed Switches, Printers, Assigned Staff).

### 6. Corporate White Theme Design System
- Crisp, high-contrast corporate white UI inspired by Stripe Dashboard & Apple Enterprise (`bg-slate-50`, `bg-white`, clinical cyan & emerald highlights).

---

## 🔐 Credentials Reference

| Role | Username | Password | Access Level |
| :--- | :--- | :--- | :--- |
| **IT Head (Admin)** | `vatsal_IT_Head` | `Stavya1234` | **Full Admin Access** • User Creation • KPI Reports • Checklist Editing |
| **IT Executive** | `Mohit_IT` | `Mohit1234` | **Operational Desk** • Inspection Checklist • Device Directory • Fault Reporting |

---

## 🛠️ Technology Stack

### Frontend
- **Framework**: React 19 + Vite + TypeScript
- **Styling**: Tailwind CSS + Custom Corporate Light Design System
- **Icons**: Lucide React
- **Routing & HTTP**: React Router DOM + Axios Interceptors

### Backend
- **Runtime**: Node.js + Express + TypeScript
- **Database & ORM**: Prisma ORM + PostgreSQL / SQLite fallback
- **Authentication**: JWT Access Tokens + Refresh Tokens + bcrypt password hashing
- **Security**: Helmet, CORS origin validation, Rate Limiting, Winston Logger

---

## 🚀 Quick Start (Local Setup)

### Prerequisites
- Node.js (v18+)
- npm (v9+)

### Installation

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/HB2810/IT_Check_List.git
   cd IT_Check_List
   ```

2. **Install Root & Sub-package Dependencies**:
   ```bash
   npm run setup
   ```
   *Or manually install in `backend/` and `frontend/`:*
   ```bash
   cd backend && npm install
   cd ../frontend && npm install --legacy-peer-deps
   ```

3. **Initialize & Seed the Database**:
   ```bash
   cd backend
   npx prisma db push
   npx ts-node src/prisma/seed.ts
   cd ..
   ```

4. **Launch Local Development Server**:
   ```bash
   npm run dev
   ```
   - **Frontend App**: `http://localhost:5173`
   - **Backend API**: `http://localhost:5000/api/v1`

---

## 🌐 Production Cloud Deployment Guide

### Step 1: Database Setup ([Neon.tech](https://neon.tech))
1. Create a free PostgreSQL database on [Neon.tech](https://neon.tech).
2. Copy your connection string: `postgres://user:password@ep-xyz.neon.tech/stavya-db?sslmode=require`.

### Step 2: Backend Deployment ([Render.com](https://render.com))
1. Connect your GitHub repository `https://github.com/HB2810/IT_Check_List.git`.
2. Select **Root Directory**: `backend`
3. **Build Command**: `npm install && npm run build`
4. **Start Command**: `npx prisma db push && node dist/index.js`
5. **Environment Variable**: `DATABASE_URL` = (Your Neon PostgreSQL URL).

### Step 3: Frontend Deployment ([Vercel.com](https://vercel.com))
1. Import `HB2810/IT_Check_List`.
2. Select **Root Directory**: `frontend`
3. **Build Command**: `npm run build`
4. **Output Directory**: `dist`

---

## 📁 Repository Structure

```
IT_Check_List/
├── backend/                  # Express + TypeScript + Prisma API
│   ├── prisma/
│   │   ├── schema.prisma     # Database models (User, Asset, Incident, Task, Audit)
│   │   └── dev.db            # Local SQLite database
│   ├── src/
│   │   ├── config/           # Database & Winston logger config
│   │   ├── controllers/      # Auth & User controllers
│   │   ├── middleware/       # JWT Auth & RBAC role guards
│   │   ├── routes/           # REST API routes (/api/v1/auth, /api/v1/users)
│   │   └── index.ts          # Express server entry
│   └── tsconfig.json
│
├── frontend/                 # React 19 + Vite + TypeScript Client
│   ├── src/
│   │   ├── components/       # AppLayout, Navbar, ProtectedRoute
│   │   ├── contexts/         # AuthContext & ThemeContext
│   │   ├── pages/            # DashboardPage, MapPage, AssetsPage, IncidentsPage, TasksPage, UsersPage, LoginPage
│   │   ├── services/         # Axios API interceptor
│   │   └── index.css         # Corporate White theme CSS
│   ├── index.html
│   ├── vite.config.ts
│   └── tailwind.config.js
│
├── package.json              # Monorepo launcher with concurrently
└── README.md
```

---

## 📄 License

Developed for **Stavya Spine Hospital IT Operations**. All rights reserved.
