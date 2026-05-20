# ITM Gwalior — Website Onboarding Guide

## Project Overview
This is the official website for **Institute of Technology and Management (ITM), Gwalior** — a full-stack app with a React/Vite frontend and a FastAPI backend.

---

## Running the Project

### Backend (FastAPI)
```bash
cd backend
uvicorn main:app --reload --port 8000
```
- Swagger UI: http://localhost:8000/api/docs
- Health check: http://localhost:8000

### Frontend (React + Vite)
```bash
cd client
npm install
npm run dev
```
- App: http://localhost:5173

---

## Tech Stack
| Layer | Tech |
|---|---|
| Frontend | React 18, Vite, Tailwind CSS, Framer Motion |
| Backend | FastAPI, SQLAlchemy, SQLite, Python 3.10 |
| Auth | JWT (python-jose), bcrypt |
| Icons | Lucide React |

---

## Key Pages & Routes

| Route | Description |
|---|---|
| `/` | Home — Hero, Stats, Director Vision, Departments |
| `/onboarding` | **New student onboarding checklist** |
| `/admissions` | Admissions overview with programme finder |
| `/tap` | Training & Placement cell |
| `/cs`, `/it`, `/ece`, `/me`, `/ce`, `/mba` | Department pages |
| `/research` | Research overview and sub-pages |
| `/library` | Central Library |
| `/admin` | Admin dashboard (protected, login at `/admin/login`) |

**Default admin credentials:** `admin` / `admin123` (change before production)

---

## Project Structure
```
ITMGOI-Sanidhya/
├── client/               # React frontend
│   └── src/
│       ├── components/   # Shared UI (Header, Footer, Hero, etc.)
│       ├── pages/        # Route-level pages
│       ├── data/         # Static data (itm_data.js, admissions_data.js)
│       └── context/      # AuthContext
└── backend/              # FastAPI backend
    ├── router/           # API route handlers
    ├── model/            # SQLAlchemy ORM models
    ├── schema/           # Pydantic schemas
    ├── control/          # Config, DB, security
    └── main.py           # App entry point
```

---

## Design System
- **Primary color:** `#800000` (maroon)
- **Dark accent:** `#3e0202`
- **Background tint:** `#fbf7f2`
- **Font:** Inter (Google Fonts)
- **Component pattern:** `bg-white rounded-2xl border border-gray-100 shadow-sm`
- **Buttons:** `bg-[#800000] text-white rounded-full font-black text-[11px] tracking-widest`

---

## Branches
- `main` — production
- `sanidhya-branch` — active development (current)
